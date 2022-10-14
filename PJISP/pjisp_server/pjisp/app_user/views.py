from .models import AppUser
from .serializers import UserSerializer, SuperUserSerializer
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from json import loads
from django.contrib.auth.hashers import check_password
from rest_framework.parsers import JSONParser
# Create your views here.


def user_count():
    return AppUser.objects.all().count()


@csrf_exempt
def check_user_initialization(request):
    if request.method == "GET":
        users = AppUser.objects.all()
        count = users.count()
        request.session['count'] = count
        return JsonResponse(data={"count": count}, status=200)

    return HttpResponse(status=400)


@csrf_exempt
def create_superuser(request):
    count = request.session.get('count')
    if count is None:
        request.session['count'] = user_count()
        count = request.session.get('count')

    if count != 0:
        return HttpResponse(status=403)

    if request.method == "POST":
        data = JSONParser().parse(request)
        serializer = SuperUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            request.session['count'] = request.session.get('count')+1
            return JsonResponse(serializer.data, status=200)

    return HttpResponse(status=400)


@csrf_exempt
def user_login(request):
    if request.method == "POST":
        body = request.body.decode('utf-8')
        body = loads(body)
        email = body['email']
        password = body['password']
        try:
            user = AppUser.objects.get(email=email)
        except AppUser.DoesNotExist:
            return HttpResponse(status=404)

        if check_password(password, user.password):
            print(user.email)
            if user.is_admin:
                serializer = SuperUserSerializer(user)
            else:
                serializer = UserSerializer(user)

            return JsonResponse(serializer.data, status=200)

    return HttpResponse(status=403)


@csrf_exempt
def create_user(request):
    count = request.session.get('count')
    if count is None:
        request.session['count'] = user_count()
        count = request.session.get('count')

    if request.method == "POST":
        body = request.body.decode('utf-8')
        body = loads(body)
        new_user = body[0]
        admin = body[1]

        try:
            admin_user = AppUser.objects.get(email=admin['email'])
        except AppUser.DoesNotExist:
            return HttpResponse(status=404)

        if not admin_user.is_admin:
            return HttpResponse(status=403)

        if check_password(admin['password'], admin_user.password):
            serializer = UserSerializer(data=new_user)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=201)
            else:
                return HttpResponse(status=400)

        return HttpResponse(status=403)


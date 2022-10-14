from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

@csrf_exempt
def test_connection(request):
    if request.method == "GET":
        content = "<html><body><h1>Connection works!</h1></body></hml>"
        return HttpResponse(content=content, status=200)
"""pjisp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app_user.views import check_user_initialization, create_superuser, create_user, user_login
from drive_module.views import get_logs, test_results, exam_results, get_statistics
from log.views import test_connection

urlpatterns = [
    path('admin/', admin.site.urls),
    path('check_users/', check_user_initialization),
    path('create_superuser/', create_superuser),
    path('add_user/', create_user),
    path('login/', user_login),
    path('test_results/', test_results),
    path('exam_results/', exam_results),
    path('log/', get_logs),
    path('statistics/', get_statistics),
    path('health/', test_connection)
]

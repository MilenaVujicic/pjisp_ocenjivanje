from django.db import models
from django.contrib.auth.models import  AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password, check_password
# Create your models here.


class AppUserManager(BaseUserManager):

    def create_user(self, email, first_name, last_name, password):
        if email is None or not email:
            raise TypeError("Email cannot be empty")
        if first_name is None or not first_name:
            raise TypeError("First name cannot be empty")
        if last_name is None or not last_name:
            raise TypeError("Last name cannot be empty")

        user = self.model(email=self.normalize_email(email), first_name=first_name, last_name=last_name)
        user.set_password(make_password(password))
        user.save(using=self._db)
        return user

    def create_superuser(self, user):
        user.is_superuser = True
        user.is_admin = True
        user.is_staff = True
        user.save(using=self._db)

        return user


class AppUser(AbstractBaseUser):
    email = models.EmailField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100, unique=False)
    last_name = models.CharField(max_length=100, unique=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = AppUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    def __str__(self):
        return self.email


from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token

from django.contrib import admin 
from django.urls import path, include 
# from django.conf.urls import url 
from imgApp.views import *
# from ..imgApp. import UserCreateAPIView


  
urlpatterns = [ 
    path('admin/', admin.site.urls), 
    path('wel/', ReactView.as_view(), name="something"), 
    path('login/', obtain_auth_token, name='login'),
    path('register/', UserCreateAPIView.as_view(), name='user_create'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
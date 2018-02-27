# coding=UTF-8
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'alert/manage$', views.AlertMange.as_view(), name='alert_manage'),
    url(r'alert/manage/api$', views.ManageAPI.as_view(), name='alert_manage_api'),
    url(r'alert/setting$', views.AlertCollect.as_view(), name='alert_collect'),
    url(r'alert/api$', views.AlertAPI.as_view(), name='alert_api'),
    url(r'alert/user/manage$', views.UserManage.as_view(), name='alert_user_manage'),
    url(r'alert/user/api$', views.UserAPI.as_view(), name='alert_user_api'),
    url(r'alert/classify$', views.AlertClassify.as_view(), name='alert_classify'),
]

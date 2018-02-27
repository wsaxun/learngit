# coding=UTF-8
from django.conf.urls import url
from upgrade import views


urlpatterns = [
    url(r'upgrade/homed/manage$', views.HomedUpgrade.as_view(),
        name='homed_upgrade'),
    url(r'upgrade/homed/manage/api', views.HomedUpgradeAPI.as_view())
]


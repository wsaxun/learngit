# -*- coding: utf-8 -*-

import json
from django.shortcuts import render_to_response
from handle import HomedAPI
from django.views.generic import View
from rest_framework.views import APIView
from rest_framework.response import Response


# 基础api
class BaseAPI(APIView):
    def get(self, request):
        return Response({'ret_msg': '请使用post提交数据', 'ret': 1})


# homed 升级
class HomedUpgrade(View):
    def get(self, request):
        return render_to_response('homed_upgrade.html')


class HomedUpgradeAPI(BaseAPI):
    def post(self, request):
        json_data = json.loads(request.body)
        handle_obj = HomedAPI()
        if json_data['type'] == 'offline':
            result = handle_obj.offline(json_data)
            return Response(result)
        elif json_data['type'] == 'online':
            result = handle_obj.online()
            return Response(result)


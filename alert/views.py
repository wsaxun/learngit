# coding=utf-8
import json
from django.shortcuts import render
from handle import MyDb, AlertAPIHandle, UserAPIHandle, ManageAPIHandle
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.generic import View

my_db = MyDb()


# 基础api
class BaseAPI(APIView):
    def get(self, request):
        return Response({'ret_msg': '请使用post提交数据及请求数据', 'ret': 1})


# 分类管理
class AlertClassify(View):
    def get(self, request):
        return render(request, 'alert_classify.html')


# 报警管理
class AlertMange(View):
    def get(self, request):
        return render(request, 'alert_manage.html')


# 报警管理API
class ManageAPI(BaseAPI):
    def post(self, request):
        json_data = json.loads(request.body)
        handle_obj = ManageAPIHandle()
        if json_data['type'] == 't_msg':
            if json_data['action'] == 'DISPLAY':
                result = handle_obj.msg_display()
                return Response(result)
            if json_data['action'] == 'DETAILS':
                result = handle_obj.msg_details(json_data)
                return Response(result)
        elif json_data['type'] == 't_classification':
            if json_data['action'] == 'APP_DISPLAY':
                result = handle_obj.application_display()
                return Response(result)
            elif json_data['action'] == 'HOST_DISPLAY':
                result = handle_obj.host_display()
                return Response(result)
            elif json_data['action'] == 'LOOK':
                result = handle_obj.application_look(json_data)
                return Response(result)


# 报警设置
class AlertCollect(View):
    def get(self, request):
        return render(request, 'alert_collect.html')


# 报警API
class AlertAPI(BaseAPI):
    def post(self, request):
        json_data = json.loads(request.body)
        handle_obj = AlertAPIHandle()
        if json_data['type'] == 't_media':
            result = handle_obj.user_action(json_data)
            return Response(result)
        elif json_data['type'] == 't_cront':
            result = handle_obj.cront_action(json_data)
            return Response(result)
        elif json_data['type'] == 't_interval':
            result = handle_obj.interval_action(json_data)
            return Response(result)
        elif json_data['type'] == 't_classification_sup':
            result = handle_obj.sup_action(json_data)
            return Response(result)
        elif json_data['type'] == 't_classification_sub':
            result = handle_obj.sub_action(json_data)
            return Response(result)
        elif json_data['type'] == 't_stragety':
            result = handle_obj.stragety_action(json_data)
            return Response(result)
        elif json_data['type'] == 't_rule':
            result = handle_obj.rule_action(json_data)
            return Response(result)
        elif json_data['type'] == 't_action':
            result = handle_obj.action_action(json_data)
            return Response(result)
        elif json_data['type'] == 'priority':
            result = handle_obj.priority(json_data)
            return Response(result)


# 用户管理
class UserManage(View):
    def get(self, request):
        return render(request, 'user_manage.html')


# 用户管理API
class UserAPI(BaseAPI):
    def post(self, request):
        json_data = json.loads(request.body)
        handle_obj = UserAPIHandle()
        if json_data['type'] == 't_user_group':
            if json_data['action'] == 'DISPLAY':
                result = handle_obj.user_group_display()
                return Response(result)
            elif json_data['action'] == 'ADD':
                result = handle_obj.user_group_add()
                return Response(result)
            elif json_data['action'] == 'ADD_OK':
                result = handle_obj.user_group_add_ok(json_data)
                return Response(result)
            elif json_data['action'] == 'UPDATE':
                result = handle_obj.user_group_update(json_data)
                return Response(result)
            elif json_data['action'] == 'UPDATE_OK':
                result = handle_obj.user_group_update_ok(json_data)
                return Response(result)
            elif json_data['action'] == 'DELETE':
                result = handle_obj.user_group_delete(json_data)
                return Response(result)
        if json_data['type'] == 't_user':
            if json_data['action'] == 'DISPLAY':
                result = handle_obj.user_display()
                return Response(result)
            elif json_data['action'] == 'RTX_ADD_OK':
                result = handle_obj.user_rtx_add_ok(json_data)
                return Response(result)
            elif json_data['action'] == 'ADD_OK':
                result = handle_obj.user_add_ok(json_data)
                return Response(result)
            elif json_data['action'] == 'MORE_DELETE':
                result = handle_obj.user_more_delete()
                return Response(result)
            elif json_data['action'] == 'MORE_DELETE_OK':
                result = handle_obj.user_more_delete_ok(json_data)
                return Response(result)
            elif json_data['action'] == 'UPDATE':
                result = handle_obj.user_update(json_data)
                return Response(result)
            elif json_data['action'] == 'UPDATE_OK':
                result = handle_obj.user_update_ok(json_data)
                return Response(result)
            elif json_data['action'] == 'DELETE':
                result = handle_obj.user_delete(json_data)
                return Response(result)

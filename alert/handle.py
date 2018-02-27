# -*- coding: utf-8 -*-

import sys
import json
import MySQLdb
import datetime
from django.conf import settings
from models import *
from django.db import connection
from django.db.models import Max, Q
from kafka import KafkaProducer
from public import conf

reload(sys)
sys.setdefaultencoding('utf8')


class MyDb(object):

    def __init__(self, user=settings.DATABASES['default']['USER'],
                 passwd=settings.DATABASES['default']['PASSWORD'],
                 host=settings.DATABASES['default']['HOST'],
                 db_name=settings.DATABASES['default']['NAME']):
        self.user = user
        self.passwd = passwd
        self.host = host
        self.db_name = db_name

    def __db_conect(self):
        try:
            conn = MySQLdb.connect(self.host, self.user, self.passwd,
                                   self.db_name, charset='utf8')
        except Exception:
            raise Exception('数据库连接错误')
        return conn

    def db_insert(self, sql, params):
        """
        批量插入
        sql: INSERT语句 'INSERT INTO 表名 VALUES(%s,%s,%s)'
        params: 二维列表或元祖 ((1, 1, 1), (2, 2, 2))
        """
        conn = self.__db_conect()
        if conn:
            cursor = conn.cursor()
            try:
                cursor.executemany(sql, params)
                conn.commit()
            except Exception:
                conn.rollback()
                raise Exception('数据库插入错误')
            finally:
                cursor.close()
                conn.close()

    def db_statement(self, sql):
        """
        执行SQL语句
        :param sql: UPDATE语句, DELETE语句, INSERT语句
        """
        conn = self.__db_conect()
        if conn:
            cursor = conn.cursor()
            try:
                cursor.execute(sql)
                conn.commit()
            except Exception:
                conn.rollback()
                raise Exception('数据库执行语句错误')
            finally:
                cursor.close()
                conn.close()

    def db_select(self, sql):
        """
        查询操作
        sql: SECLECT语句
        result: 二维元祖
        """
        conn = self.__db_conect()
        if conn:
            cursor = conn.cursor()
            try:
                cursor.execute(sql)
                result = cursor.fetchall()
                return result
            except Exception:
                raise Exception('数据库查询错误')
            finally:
                cursor.close()
                conn.close()


my_db = MyDb()


class CJsonEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, datetime.date):
            return obj.strftime('%Y-%m-%d')
        else:
            return json.JSONEncoder.default(self, obj)


class AlertAPIHandle(object):

    @staticmethod
    def send_conf(conflist):
        bootstrap_servers = conf.C_KAFKA_URL
        producer = KafkaProducer(bootstrap_servers=[bootstrap_servers],
                                 value_serializer=lambda m:
                                 json.dumps(m).encode('utf-8'))
        producer.send('collectAlerts_config', {'change': conflist})
        producer.flush()

    def interval_action(self, js_data):
        try:
            action = js_data['action']
            if action == 'UPD':
                interval = int(js_data['data']['f_interval'])
                TInterval.objects.filter().update(f_interval=interval)
                self.send_conf(['Interval'])
            else:
                result = TInterval.objects.values_list('f_interval').get()
                return {'ret': 0, 'ret_msg': 'success', 'data': result}
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success'}

    def cront_action(self, js_data):
        try:
            action = js_data['action']
            if action == 'UPD':
                cront_hour = int(js_data['data']['f_hour'])
                cront_minute = int(js_data['data']['f_minute'])
                TCront.objects.filter().update(f_hour=cront_hour,
                                               f_minute=cront_minute
                                               )
                self.send_conf(['Cronts'])
            else:
                result = TCront.objects.values_list('f_hour', 'f_minute').get()
                return {'ret': 0, 'ret_msg': 'success', 'data': result}
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success'}

    @staticmethod
    def action_action(js_data):
        try:
            ids = int(js_data['data']['f_rule_id'])
            result = TAction.objects.filter(f_rule=ids). \
                values_list('f_rule', 'f_user_group', 'f_user_group__f_name')
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': result}

    # 优先级
    def priority(self, js_data):
        height_rule_id = int(js_data['data']['height_rule_id'])
        low_rule_id = int(js_data['data']['low_rule_id'])
        try:
            height_priority_id = TRule.objects.filter(f_id=height_rule_id). \
                values_list('f_priority')[0][0]
            low_priority_id = TRule.objects.filter(f_id=low_rule_id). \
                values_list('f_priority')[0][0]
            TRule.objects.filter(f_id=low_rule_id). \
                update(f_priority=height_priority_id)
            TRule.objects.filter(f_id=height_rule_id). \
                update(f_priority=low_priority_id)
            self.send_conf(['Rule'])
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success'}

    @staticmethod
    def user_action(js_data):
        action = js_data['action']
        if action == 'QUE':
            try:
                result = TUserGroup.objects.filter().values_list()
            except Exception as e:
                return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            return {'ret': 0, 'ret_msg': 'success', 'data': result}

    def sup_action(self, js_data):
        action = js_data['action']
        if action == 'ADD':
            try:
                name = js_data['data']['f_name']
                decription = js_data['data']['f_decription']
                sql = TClassificationSup(f_name=name, f_decription=decription)
                sql.save()
                result = TClassificationSup.objects.aggregate(f_id=Max('f_id'))
                self.send_conf(['AllTrg'])
            except Exception as e:
                return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            return {'ret': 0, 'ret_msg': 'success', 'data': result}
        elif action == 'UPD':
            try:
                ids = int(js_data['data']['f_id'])
                name = js_data['data']['f_name']
                decription = js_data['data']['f_decription']
                TClassificationSup.objects.filter(f_id=ids). \
                    update(f_name=name, f_decription=decription)
                self.send_conf(['AllTrg'])
            except Exception as e:
                return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            return {'ret': 0, 'ret_msg': 'success'}
        elif action == 'QUE':
            try:
                result = TClassificationSup.objects.all().values()
            except Exception as e:
                return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            return {'ret': 0, 'ret_msg': 'success', 'data': result}

    def sub_action(self, js_data):
        action = js_data['action']
        if action == 'ADD':
            try:
                name = js_data['data']['f_name']
                sendnow = int(js_data['data']['f_sendnow'])
                decription = js_data['data']['f_decription']
                sql = TClassificationSub(f_name=name, f_sendnow=sendnow,
                                         f_decription=decription)
                sql.save()
                result = TClassificationSub.objects. \
                    aggregate(f_id=Max('f_id'))
            except Exception as e:
                return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            return {'ret': 0, 'ret_msg': 'success', 'data': result}
        elif action == 'UPD':
            try:
                if 'extend' in js_data:
                    if js_data['extend'] == 'sup_id':
                        ids = int(js_data['data']['f_id'])
                        sup_id = int(js_data['data']['f_sup_id'])
                        TClassificationSub.objects.filter(f_id=ids).update(
                            f_sup_id=sup_id)
                        self.send_conf(['AllTrg'])
                    else:
                        ids = int(js_data['data']['f_id'])
                        sendnow = int(js_data['data']['f_sendnow'])
                        TClassificationSub.objects.filter(f_id=ids).update(
                            f_sendnow=sendnow)
                        self.send_conf(['AllTrg'])
                else:
                    ids = int(js_data['data']['f_id'])
                    name = js_data['data']['f_name']
                    decription = js_data['data']['f_decription']
                    TClassificationSub.objects.filter(f_id=ids).update(
                        f_name=name, f_decription=decription)
                    self.send_conf(['AllTrg'])
            except Exception as e:
                print e
                return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            return {'ret': 0, 'ret_msg': 'success'}
        elif action == 'QUE':
            if 'data' in js_data:
                try:
                    result = TClassificationSub.objects.filter(
                        f_id=int(js_data['data']['f_id'])).values('f_id',
                                                                  'f_sup__f_name',
                                                                  'f_sup__f_id')
                except Exception as e:
                    return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            else:
                try:
                    result = TClassificationSub.objects.all().values()
                except Exception as e:
                    return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            return {'ret': 0, 'ret_msg': 'success', 'data': result}

    @staticmethod
    def stragety_action(js_data):
        action = js_data['action']
        if action == 'UPD':
            try:
                ids = int(js_data['data']['f_id'])
                if 'f_status' not in js_data['data']:
                    extends = js_data['data']['f_extend']
                    TStragety.objects.filter(f_id=ids).update(f_extend=extends)
                else:
                    status = int(js_data['data']['f_status'])
                    if status:
                        TStragety.objects.filter(f_id=ids).update(
                            f_status=status)
                        TStragety.objects.exclude(f_id=ids).update(f_status=0)
                    else:
                        return {'ret': 1,
                                'ret_msg': 'Exception: 禁用此策略将导致无策略可用'}
            except Exception as e:
                return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            return {'ret': 0, 'ret_msg': 'success'}
        elif action == 'QUE':
            try:
                result = TStragety.objects.all().values()
            except Exception as e:
                return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            return {'ret': 0, 'ret_msg': 'success', 'data': result}

    def rule_action(self, js_data):
        action = js_data['action']
        if action == 'ADD':
            try:
                name = js_data['data']['f_rule']
                status = int(js_data['data']['f_status'])
                decription = js_data['data']['f_decription']
                sql = "SELECT max(f_priority) FROM t_rule"
                priority = my_db.db_select(sql)
                sql = '''SELECT f_extend FROM t_stragety WHERE f_status = 1'''
                tmp = my_db.db_select(sql)[0][0]
                if 'sub_id' in tmp:
                    if '#host ' in name:
                        return {'ret': 1, 'ret_msg': 'Exception: %s' % (
                            '应用集聚合策略模式下触发器表达式不能带主机')}
                elif 'host' in tmp:
                    if '#app ' in name:
                        return {'ret': 1, 'ret_msg': 'Exception: %s' % (
                            '主机聚合策略模式下触发器表达式不能带应用集')}
                if not priority or priority[0][0] is None:
                    priority = 1
                else:
                    priority = priority[0][0] + 1
                sql = TRule(f_rule=name, f_status=status, f_priority=priority,
                            f_decription=decription)
                sql.save()
                result = TRule.objects.aggregate(f_id=Max('f_id'))
                self.send_conf(['Rule'])
            except Exception as e:
                return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            return {'ret': 0, 'ret_msg': 'success', 'data': result}
        elif action == 'DEL':
            try:
                ids = int(js_data['data']['f_id'])
                TAction.objects.filter(f_rule_id=ids).delete()
                TRule.objects.filter(f_id=ids).delete()
                self.send_conf(['Rule', 'User', 'CountMailUser'])
            except Exception as e:
                return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            return {'ret': 0, 'ret_msg': 'success'}
        elif action == 'UPD':
            try:
                ids = int(js_data['data']['f_id'])
                if 'f_status' in js_data['data']:
                    status = int(js_data['data']['f_status'])
                    TRule.objects.filter(f_id=ids).update(f_status=status)
                else:
                    if 'f_user_group_id' in js_data['data']:
                        users = int(js_data['data']['f_user_group_id'])
                        if js_data['data']['action'] == 'DEL':
                            if users:
                                TAction.objects.filter(Q(f_rule_id=ids) & Q(
                                    f_user_group_id=users)).delete()
                        else:
                            if users:
                                sql = TAction(f_user_group_id=users,
                                              f_rule_id=ids)
                                sql.save()
                    else:
                        rule = js_data['data']['f_rule']
                        decription = js_data['data']['f_decription']
                        tmp = TStragety.objects.filter(f_status=1).values_list(
                            'f_extend')[0][0]
                        if 'sub_id' in tmp:
                            if '#host ' in rule:
                                return {'ret': 1,
                                        'ret_msg': 'Exception: %s' % (
                                            '应用集聚合策略模式下触发器表达式不能带主机')}
                        elif 'host' in tmp:
                            if '#app ' in rule:
                                return {'ret': 1,
                                        'ret_msg': 'Exception: %s' % (
                                            '主机聚合策略模式下触发器表达式不能带应用集')}
                        TRule.objects.filter(f_id=ids).update(f_rule=rule,
                                                              f_decription=decription)
                self.send_conf(['Rule', 'User', 'CountMailUser'])
            except Exception as e:
                return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            return {'ret': 0, 'ret_msg': 'success'}
        elif action == 'QUE':
            try:
                tmp = TRule.objects.order_by('f_priority').values_list('f_id',
                                                                       'f_rule',
                                                                       'f_status',
                                                                       'f_decription')
            except Exception as e:
                return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            result = []
            for i in tmp:
                result.append(list(i))
            try:
                tmp = TAction.objects.all().values_list()
            except Exception as e:
                return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
            for i in result:
                for n in tmp:
                    if n[2] == i[0]:
                        if isinstance(i[-1], list):
                            i[-1].append(n[1])
                        else:
                            i.append([n[1]])
            return {'ret': 0, 'ret_msg': 'success', 'data': result}


class UserAPIHandle(object):

    @staticmethod
    def __id_to_user(f_mail_mobile):
        # 将用户id转化为用户名
        if f_mail_mobile:
            db = f_mail_mobile.strip(';')
            user_id = db.split(';')
            user = TUser.objects.filter(f_id__in=user_id).values_list('f_rtx')
            user_name = [i[0] for i in user]
            mail_mobile = ';'.join(user_name)
        else:
            mail_mobile = ''
            user_name = []

        return [mail_mobile, len(user_name)]

    @staticmethod
    def __user_to_id(f_mail_mobile):
        # 将用户名转化为id
        if f_mail_mobile:
            user_name = ["%s" % i for i in f_mail_mobile]
            user = TUser.objects.filter(f_rtx__in=user_name).values_list(
                'f_id')
            user_id = [str(i[0]) for i in user]
            mail_mobile = ';'.join(user_id)
        else:
            mail_mobile = ''

        return mail_mobile

    # 用户组 - 显示
    def user_group_display(self):
        user_group = []
        try:
            # 获取用户组
            db_user_group = TUserGroup.objects.all().values_list()
            for db_user in db_user_group:
                tmp = [db_user[0], db_user[1], db_user[2]]
                re3 = self.__id_to_user(db_user[3])
                # 获取全部绑定邮件用户
                tmp.append(re3[0].replace(';', '; '))
                # 邮件只显示30个字符
                if len(re3[0]) > 27:
                    re3[0] = re3[0][0:27].ljust(30, '.')
                tmp.extend(re3)
                re4 = self.__id_to_user(db_user[4])
                # 获取全部绑定短信用户
                tmp.append(re4[0].replace(';', '; '))
                # 短信只显示30个字符
                if len(re4[0]) > 27:
                    re4[0] = re4[0][0:27].ljust(30, '.')
                tmp.extend(re4)
                user_group.append(tmp)
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': user_group}

    # 用户组 - 新建
    @staticmethod
    def user_group_add():
        user_mail_name = []
        user_mobile_name = []
        try:
            # 获取所有邮箱用户
            user_mail = TUser.objects.exclude(f_mail='').values_list('f_rtx')
            if user_mail:
                user_mail_name = [i[0] for i in user_mail]

            # 获取所有短信用户
            user_mobile = TUser.objects.exclude(f_mobile='').values_list(
                'f_rtx')
            if user_mobile:
                user_mobile_name = [i[0] for i in user_mobile]

            result = [user_mail_name, user_mobile_name]
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': result}

    # 用户组 - 新建 - 确定
    @staticmethod
    def user_group_add_ok(js_data):
        try:
            f_name = js_data['data']['f_name']
            # 判断用户组已存在
            user_group = TUserGroup.objects.all().values_list('f_name')
            user_group = [i[0] for i in user_group]
            if f_name in user_group:
                return {'ret': 2, 'ret_msg': 'Exception: 用户组已存在'}

            f_description = js_data['data']['f_description']
            f_mail_member = js_data['data']['f_mail_member']
            f_mail_member_id = ""
            if f_mail_member:
                b = ["%s" % i for i in f_mail_member]
                id2 = TUser.objects.filter(f_rtx__in=b).values_list('f_id')
                user_id = [str(i[0]) for i in id2]
                f_mail_member_id = ';'.join(user_id)

            f_mobile_member = js_data['data']['f_mobile_member']
            f_mobile_member_id = ""
            if f_mobile_member:
                b = ["%s" % i for i in f_mobile_member]
                id2 = TUser.objects.filter(f_rtx__in=b).values_list('f_id')
                user_id = [str(i[0]) for i in id2]
                f_mobile_member_id = ';'.join(user_id)
            TUserGroup.objects.create(f_name=f_name,
                                      f_description=f_description,
                                      f_mail_member=f_mail_member_id,
                                      f_mobile_member=f_mobile_member_id)
            AlertAPIHandle.send_conf(['CountMailUser', 'User'])
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success'}

    # 用户组 - 修改
    def user_group_update(self, js_data):
        user_group_id = js_data['data']['user_group_id']
        user_mail_name = []
        user_mobile_name = []
        result = []
        try:
            # 获取所有邮箱用户
            user_mail = TUser.objects.exclude(f_mail='').values_list('f_rtx')
            if user_mail:
                user_mail_name = [i[0] for i in user_mail]

            # 获取所有短信用户
            user_mobile = TUser.objects.exclude(f_mobile='').values_list(
                'f_rtx')
            if user_mobile:
                user_mobile_name = [i[0] for i in user_mobile]

            # 获取已绑定的用户
            mail_mobile = TUserGroup.objects.filter(
                f_id=int(user_group_id)).values_list()
            if mail_mobile:
                user_group_name = mail_mobile[0][1]
                user_group_description = mail_mobile[0][2]
                re0 = self.__id_to_user(mail_mobile[0][3])
                user_mail = re0[0].split(';')
                re1 = self.__id_to_user(mail_mobile[0][4])
                user_mobile = re1[0].split(';')

                result = [user_group_name, user_group_description, user_mail,
                          user_mail_name, user_mobile, user_mobile_name]
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': result}

    # 用户组 - 修改 - 确定
    def user_group_update_ok(self, js_data):
        user_group_id = js_data['data']['user_group_id']
        user_group_name = js_data['data']['user_group_name']
        user_group_description = js_data['data']['user_group_description']
        user_group_mail = js_data['data']['user_group_mail']
        user_group_mail = self.__user_to_id(user_group_mail)
        user_group_mobile = js_data['data']['user_group_mobile']
        user_group_mobile = self.__user_to_id(user_group_mobile)
        try:
            TUserGroup.objects.filter(f_id=int(user_group_id)).update(
                f_name=user_group_name, f_description=user_group_description,
                f_mail_member=user_group_mail,
                f_mobile_member=user_group_mobile)
            AlertAPIHandle.send_conf(['CountMailUser', 'User'])
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success'}

    # 用户组 - 删除
    @staticmethod
    def user_group_delete(js_data):
        user_group_id = js_data['data']['user_group_id']
        try:
            # 判断该用户组id是否绑定规则
            result = TAction.objects.filter(
                f_user_group_id=int(user_group_id)).values_list('f_id')
            if not result:
                TUserGroup.objects.filter(f_id=int(user_group_id)).delete()
                AlertAPIHandle.send_conf(['CountMailUser', 'User'])
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': result}

    # 用户 - 显示
    @staticmethod
    def user_display():
        try:
            # 获取用户组
            user = TUser.objects.all().values_list()
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': user}

    # 用户 - RTX 添加 - 确定
    @staticmethod
    def user_rtx_add_ok(js_data):
        try:
            user = []
            user_rtx = js_data['data']['user_rtx']
            db = user_rtx.strip(';')
            user_rtx = db.split(';')

            # 判断用户是否已经存在
            db_user = TUser.objects.all().values_list('f_rtx')
            db_user = [i[0] for i in db_user]
            rtx_exist = []
            rtx_not_exist = []
            for rtx in user_rtx:
                if rtx in db_user:
                    rtx_exist.append(rtx)
                    continue
                else:
                    rtx_not_exist.append(rtx)
            # 批量插入RTX用户
            for rtx in rtx_not_exist:
                rtx_mail = rtx + '@ipanel.cn'
                tmp = TUser(f_rtx=rtx, f_mail=rtx_mail)
                user.append(tmp)
            TUser.objects.bulk_create(user)
            rtx_exist = ';'.join(rtx_exist)
            rtx_not_exist = ';'.join(rtx_not_exist)
            AlertAPIHandle.send_conf(['CountMailUser', 'User'])
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': [rtx_exist,
                                                         rtx_not_exist]}

    # 用户 - 添加 - 确定
    @staticmethod
    def user_add_ok(js_data):
        try:
            user_exist = ''
            user = js_data['data']['user']
            user_name = js_data['data']['user_name']
            user_mail = js_data['data']['user_mail']
            user_mobile = js_data['data']['user_mobile']

            # 判断用户名是否存在
            db_user = TUser.objects.filter(f_rtx=user).values_list('f_rtx')
            if db_user:
                user_exist = db_user[0][0]
            else:
                # 插入新用户
                TUser.objects.create(f_rtx=user, f_name=user_name,
                                     f_mail=user_mail, f_mobile=user_mobile)
            AlertAPIHandle.send_conf(['CountMailUser', 'User'])
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': user_exist}

    # 用户 - 批量删除
    @staticmethod
    def user_more_delete():
        try:
            user = []
            db_user = TUser.objects.all().values_list('f_rtx')
            if db_user:
                user = [i[0] for i in db_user]
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': user}

    # 用户 - 批量删除 - 确定
    @staticmethod
    def user_more_delete_ok(js_data):
        try:
            user_more_delete = js_data['data']['user_more_delete']
            user_more_delete = ["%s" % i for i in user_more_delete]

            # 删除用户
            user_id = TUser.objects.filter(
                f_rtx__in=user_more_delete).values_list('f_id')
            user_id = set([str(i[0]) for i in user_id])
            TUser.objects.filter(f_rtx__in=user_more_delete).delete()

            # 自动解绑用户所在用户组
            result = TUserGroup.objects.all().values_list()
            result = [list(i) for i in result]
            value = []
            for line in result:
                line[0] = int(line[0])
                if line[3]:
                    mail = set(line[3].split(';'))
                    mail = ';'.join(list(mail - user_id))
                    line[3] = mail
                if line[4]:
                    mobile = set(line[4].split(';'))
                    mobile = ';'.join(list(mobile - user_id))
                    line[3] = mobile
                line = tuple(line)
                value.append(line)
            for item in value:
                TUserGroup.objects.filter(f_id=item[0]).update(
                    f_mail_member=i[3], f_mobile_member=i[4])
            AlertAPIHandle.send_conf(['CountMailUser', 'User'])
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success'}

    # 用户 - 修改
    @staticmethod
    def user_update(js_data):
        try:
            user_id = js_data['data']['user_id']
            db_user = TUser.objects.filter(f_id=int(user_id)).values_list()
            user = db_user[0]
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': user}

    # 用户 - 修改 - 确定
    @staticmethod
    def user_update_ok(js_data):
        try:
            user_id = js_data['data']['user_id']
            user_rtx = js_data['data']['user_rtx']
            user_name = js_data['data']['user_name']
            user_mail = js_data['data']['user_mail']
            user_mobile = js_data['data']['user_mobile']
            user_mail_status = js_data['data']['user_mail_status']
            user_mobile_status = js_data['data']['user_mobile_status']
            print user_mail_status

            # 更新用户
            TUser.objects.filter(f_id=int(user_id)).update(f_rtx=user_rtx,
                                                           f_name=user_name,
                                                           f_mail=user_mail,
                                                           f_mobile=user_mobile)

            # 自动解绑邮箱用户所在用户组
            if user_mail_status == 1:
                mail_mobile = TUserGroup.objects.exclude(
                    f_mail_member='').values_list('f_id', 'f_mail_member')
                update_mail = []
                if mail_mobile:
                    for mail_mobile2 in mail_mobile:
                        tmp = list(mail_mobile2)
                        if mail_mobile2[1]:
                            mail_id = mail_mobile2[1].split(';')
                            if user_id in mail_id:
                                mail_id.remove(user_id)
                            mail = ';'.join(mail_id)
                            tmp[1] = mail
                            update_mail.append(tmp)
                    sql1 = "UPDATE t_user_group SET f_mail_member = CASE f_id "
                    mail_when_then = ["WHEN %d THEN '%s'" % (i[0], i[1])
                                      for i in update_mail]
                    mail_when_then = ' '.join(mail_when_then)
                    f_id = [str(i[0]) for i in update_mail]
                    sql2 = " END WHERE f_id IN (%s)" % (','.join(f_id))
                    sql = sql1 + mail_when_then + sql2
                    with connection.cursor() as c:
                        c.execute(sql)

            # 自动解绑短信用户所在用户组
            if user_mobile_status == 1:
                sql = ("SELECT f_id, f_mobile_member FROM t_user_group "
                       "WHERE f_mobile_member != ''")
                mail_mobile = my_db.db_select(sql)
                update_mobile = []
                if mail_mobile:
                    for mail_mobile2 in mail_mobile:
                        tmp = list(mail_mobile2)
                        if mail_mobile2[1]:
                            mobile_id = mail_mobile2[1].split(';')
                            if user_id in mobile_id:
                                mobile_id.remove(user_id)
                            mobile = ';'.join(mobile_id)
                            tmp[1] = mobile
                            update_mobile.append(tmp)
                    sql1 = ("UPDATE t_user_group "
                            "SET f_mobile_member = CASE f_id ")
                    mobile_when_then = ["WHEN %d THEN '%s'" % (i[0], i[1])
                                        for i in update_mobile]
                    mobile_when_then = ' '.join(mobile_when_then)
                    f_id = [str(i[0]) for i in update_mobile]
                    sql2 = " END WHERE f_id IN (%s)" % (','.join(f_id))
                    sql = sql1 + mobile_when_then + sql2
                    with connection.cursor() as c:
                        c.execute(sql)
            AlertAPIHandle.send_conf(['CountMailUser', 'User'])
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success'}

    # 用户 - 删除
    @staticmethod
    def user_delete(js_data):
        try:
            u_id = js_data['data']['user_id']
            # 删除用户
            TUser.objects.filter(f_id=int(u_id)).delete()

            user_id = TUser.objects.all().values_list('f_id')
            user_id = [str(i[0]) for i in user_id]

            # 自动解绑用户所在用户组
            mail_mobile = TUserGroup.objects.all().values_list('f_id',
                                                               'f_mail_member',
                                                               'f_mobile_member')
            update_mail_mobile = []
            if mail_mobile:
                for mail_mobile2 in mail_mobile:
                    tmp = list(mail_mobile2)
                    if mail_mobile2[1]:
                        mail_id = mail_mobile2[1].split(';')
                        # 求差集
                        retb = list(set(mail_id).difference(set(user_id)))
                        retd = list(set(mail_id).difference(set(retb)))
                        mail = ';'.join(retd)
                        tmp[1] = mail
                    if mail_mobile2[2]:
                        mobile_id = mail_mobile2[2].split(';')
                        # 求差集
                        rete = list(set(mobile_id).difference(set(user_id)))
                        retf = list(set(mobile_id).difference(set(rete)))
                        mobile = ';'.join(retf)
                        tmp[2] = mobile
                    update_mail_mobile.append(tmp)
            sql1 = "UPDATE t_user_group SET f_mail_member = CASE f_id "
            mail_when_then = ["WHEN %d THEN '%s'" % (i[0], i[1])
                              for i in update_mail_mobile]
            mail_when_then = ' '.join(mail_when_then)
            sql2 = " END, f_mobile_member = CASE f_id "
            mobile_when_then = ["WHEN %d THEN '%s'" % (i[0], i[2])
                                for i in update_mail_mobile]
            mobile_when_then = ' '.join(mobile_when_then)
            f_id = [str(i[0]) for i in update_mail_mobile]
            sql3 = " END WHERE f_id IN (%s)" % (','.join(f_id))
            sql = sql1 + mail_when_then + sql2 + mobile_when_then + sql3
            with connection.cursor() as c:
                c.execute(sql)
            AlertAPIHandle.send_conf(['CountMailUser', 'User'])
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success'}


class ManageAPIHandle(object):
    # 故障展示

    @staticmethod
    def msg_display():
        try:
            result = TMsg.objects.filter(
                f_id__in=TAlerts.objects.all().values_list(
                    'f_msg_id')).order_by('-f_id').values_list('f_id',
                                                               'f_host',
                                                               'f_trigger',
                                                               'f_time',
                                                               'tmsgaction__f_send_status')
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': result}

    # 按应用集分类 - 故障统计
    @staticmethod
    def application_display():
        try:
            # 统计故障应用集
            sql = ("SELECT d.f_id, d.f_name, count(*) FROM t_alerts c "
                   "LEFT JOIN t_classification_sup d ON  c.f_sup_id = d.f_id "
                   "GROUP BY c.f_sup_id ORDER BY count(*) DESC")
            with connection.cursor() as c:
                c.execute(sql)
                result = c.fetchall()
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': result}

    # 按主机分类 - 故障统计
    @staticmethod
    def host_display():
        try:
            result = []
            # 统计故障主机
            sql = ("SELECT group_concat(f_id), f_host, count(*) FROM t_msg "
                   "WHERE f_id IN (SELECT f_msg_id FROM t_alerts) "
                   "GROUP BY f_host")
            with connection.cursor() as c:
                c.execute(sql)
                db_host_result = c.fetchall()
            if db_host_result:
                for db_host in db_host_result:
                    tmp = list(db_host)
                    tmp[0] = tmp[0] + ','
                    result.append(tmp)
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': result}

    # 按应用集分类 - 查看
    @staticmethod
    def application_look(js_data):
        try:
            ids = js_data['data']['id']
            if ',' in ids:
                ids = ids.strip(',').split(',')
                # 根据msg_id获取信息
                result = TMsg.objects.filter(f_id__in=ids).values_list('f_id',
                                                                       'f_host',
                                                                       'f_trigger',
                                                                       'f_time',
                                                                       'tmsgaction__f_send_status')
            else:
                # 根据应用集id查看故障
                result = TMsg.objects.filter(f_id__in=TAlerts.objects.filter(
                    f_sup_id=int(ids)).values_list('f_msg_id')).values_list(
                    'f_id', 'f_host', 'f_trigger', 'f_time',
                    'tmsgaction__f_send_status')
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': result}

    # 故障 - 详情
    @staticmethod
    def msg_details(js_data):
        try:
            msg_id = js_data['data']['msg_id']
            result = TMsg.objects.filter(f_id=int(msg_id)).values_list('f_id',
                                                                       'f_host',
                                                                       'f_trigger',
                                                                       'f_time',
                                                                       'f_level',
                                                                       'f_value',
                                                                       'f_status',
                                                                       'f_eventid',
                                                                       'f_from',
                                                                       'tmsgaction__f_send_status')
        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success', 'data': result}

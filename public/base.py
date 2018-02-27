# -*- coding: utf-8 -*-

import MySQLdb
from django.conf import settings


class MyDb(object):

    def __init__(self, database_type):
        self.type = database_type
        self.user = settings.DATABASES[self.type]['USER']
        self.passwd = settings.DATABASES[self.type]['PASSWORD']
        self.host = settings.DATABASES[self.type]['HOST']
        self.db_name = settings.DATABASES[self.type]['NAME']

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
        sql: INSERT语句 'INSERT INTO 表名 (字段) VALUES(%s,%s,%s)'
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
                raise Exception('数据库批量插入错误')
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
            except Exception as e:
                conn.rollback()
                raise Exception('数据库执行语句错误 - %s' % e)
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

my_db = MyDb('default')


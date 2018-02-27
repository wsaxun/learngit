# -*- coding: utf-8 -*-
from django.conf import settings


class DatabaseRouter(object):
    """
     数据库路由 return None 默认路由
    """

    def db_for_read(self, model, **hints):
        if model._meta.app_label in settings.DATABASE_APPS_MAP:
            return settings.DATABASE_APPS_MAP[model._meta.app_label]
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label in settings.DATABASE_APPS_MAP:
            return settings.DATABASE_APPS_MAP[model._meta.app_label]
        return None

    def allow_migrate(self, db, app_label, model=None, **hints):
        """
        Make sure the auth app only appears in the 'auth_db'
        database.
        """
        if db in settings.DATABASE_APPS_MAP.values():
            return settings.DATABASE_APPS_MAP.get(app_label) == db
        elif app_label in settings.DATABASE_APPS_MAP:
            return False
        return None
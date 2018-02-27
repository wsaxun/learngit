# -*- coding: utf-8 -*-
from django.db import models


# t_msg
class TMsg(models.Model):
    f_id = models.AutoField(primary_key=True)
    f_host = models.CharField(max_length=20, null=True)
    f_trigger = models.CharField(max_length=200, null=True)
    f_time = models.DateTimeField(auto_now_add=True)
    f_level = models.CharField(max_length=10, null=True)
    f_value = models.TextField(null=True)
    f_status = models.CharField(max_length=10, null=True)
    f_eventid = models.CharField(max_length=20, null=True)
    f_from = models.CharField(max_length=20, null=True)

    class Meta:
        db_table = 't_msg'

    def __unicode__(self):
        return self.f_host


# t_user_group
class TUserGroup(models.Model):
    f_id = models.AutoField(primary_key=True)
    f_name = models.CharField(max_length=100)
    f_description = models.CharField(max_length=100, default='')
    f_mail_member = models.CharField(max_length=100, default='')
    f_mobile_member = models.CharField(max_length=100, default='')

    class Meta:
        db_table = 't_user_group'

    def __unicode__(self):
        return self.f_name


# t_user
class TUser(models.Model):
    f_id = models.AutoField(primary_key=True)
    f_rtx = models.CharField(max_length=50)
    f_name = models.CharField(max_length=100, default='')
    f_mail = models.CharField(max_length=100, default='')
    f_mobile = models.CharField(max_length=50, default='')

    class Meta:
        db_table = 't_user'

    def __unicode__(self):
        return self.f_name


# t_rule
class TRule(models.Model):
    f_id = models.AutoField(primary_key=True)
    f_rule = models.CharField(max_length=200, null=True)
    f_status = models.IntegerField(null=True)
    f_priority = models.IntegerField(null=True)
    f_decription = models.CharField(max_length=50, null=True)

    class Meta:
        db_table = 't_rule'

    def __unicode__(self):
        return self.f_rule


# t_classification_sup
class TClassificationSup(models.Model):
    f_id = models.AutoField(primary_key=True)
    f_name = models.CharField(max_length=50, null=True)
    f_decription = models.CharField(max_length=80, null=True)

    class Meta:
        db_table = 't_classification_sup'

    def __unicode__(self):
        return self.f_name


# t_action
class TAction(models.Model):
    f_id = models.AutoField(primary_key=True)
    f_user_group = models.ForeignKey(TUserGroup, null=True,
                                     on_delete=models.SET_NULL)
    f_rule = models.ForeignKey(TRule, null=True, on_delete=models.SET_NULL)
    f_decription = models.CharField(max_length=50, null=True)

    class Meta:
        db_table = 't_action'

    def __unicode__(self):
        return self.f_decription or u''


# t_alerts
class TAlerts(models.Model):
    f_id = models.AutoField(primary_key=True)
    f_msg = models.ForeignKey(TMsg, null=True, on_delete=models.SET_NULL)
    f_rule_id = models.CharField(max_length=100, null=True)
    f_sup = models.ForeignKey(TClassificationSup, null=True,
                              on_delete=models.SET_NULL)
    f_decription = models.CharField(max_length=50, null=True)

    class Meta:
        db_table = 't_alerts'

    def __unicode__(self):
        return self.f_decription or u''


# t_classification_sub
class TClassificationSub(models.Model):
    f_id = models.AutoField(primary_key=True)
    f_name = models.CharField(max_length=200, null=True)
    f_sup = models.ForeignKey(TClassificationSup, null=True,
                              on_delete=models.SET_NULL)
    f_sendnow = models.IntegerField(default=1)
    f_decription = models.CharField(max_length=200, null=True)

    class Meta:
        db_table = 't_classification_sub'

    def __unicode__(self):
        return self.f_name


# t_cront
class TCront(models.Model):
    f_id = models.AutoField(primary_key=True)
    f_hour = models.IntegerField()
    f_minute = models.IntegerField()

    class Meta:
        db_table = 't_cront'

    def __unicode__(self):
        return unicode(self.f_hour) or u''


# t_interval
class TInterval(models.Model):
    f_id = models.AutoField(primary_key=True)
    f_interval = models.IntegerField()

    class Meta:
        db_table = 't_interval'

    def __unicode__(self):
        return unicode(self.f_interval) or u''


# t_msg_action
class TMsgAction(models.Model):
    f_id = models.AutoField(primary_key=True)
    f_sub = models.ForeignKey(TClassificationSub, null=True,
                              on_delete=models.SET_NULL)
    f_msg = models.ForeignKey(TMsg, null=True, on_delete=models.SET_NULL)
    f_send_status = models.CharField(max_length=10, null=True)

    class Meta:
        db_table = 't_msg_action'

    def __unicode__(self):
        return unicode(self.f_sub) or u''


# t_stragety
class TStragety(models.Model):
    f_id = models.AutoField(primary_key=True)
    f_stragety = models.CharField(max_length=20)
    f_extend = models.CharField(max_length=60)
    f_status = models.IntegerField()
    f_decription = models.CharField(max_length=100, null=True)

    class Meta:
        db_table = 't_stragety'

    def __unicode__(self):
        return self.f_stragety

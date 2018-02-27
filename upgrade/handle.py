# -*- coding: utf-8 -*-

import sys
import subprocess

reload(sys)
sys.setdefaultencoding('utf8')


# homed 升级
class HomedAPI(object):
    def __init__(self):
        self.files = r'/etc/hosts'
        self.nginx = "'/usr/local/openresty/nginx/sbin/nginx -s reload'"
        self.offline_dir = "/usr/local/openresty/nginx/conf.d/"
        self.master = self._find_master()

    def _find_master(self):
        master = 'master'
        result = []
        with open(self.files, 'r') as f:
            for i in f:
                tmp = i.split()
                for n in tmp:
                    if n.startswith('master'):
                        result.append(n)
        if master in result or not result:
            return master
        else:
            return result[0]

    # 同步文件
    def _rsync_lua(self):
        # 同步lua文件到master
        cmd = "cd {0} && rsync -a offline.lua {1}:{0}".format(
            self.offline_dir, self.master)
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE, shell=True)
        out, err = proc.communicate()
        if err:
            raise Exception('同步lua文件到master - 失败 %s' % err)

        # master同步lua文件到slave机器
        cmd = 'ssh {} "cd /homed/ && sh ./updatefiletoslave.sh {}"'.format(
            self.master,
            self.offline_dir + 'offline.lua')
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE, shell=True)
        out, err = proc.communicate()
        if err:
            raise Exception('slave同步lua文件 - 失败 %s' % err)

        # master同步lua文件到iacs机器
        cmd = 'ssh {} "cd /homed/ && sh ./updatefiletoiacs.sh {}"'.format(
            self.master,
            self.offline_dir + 'offline.lua')
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE, shell=True)
        out, err = proc.communicate()
        if err:
            raise Exception('iacs同步lua文件 - 失败 %s' % err)

    # 重载slave iacs 的nginx
    def _nginx_reload(self):
        # reload slave机器
        cmd = 'ssh {} "cd /homed/ && sh ./docmdonslave.sh {}"'.format(
            self.master, self.nginx)
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE, shell=True)
        out, err = proc.communicate()
        if err:
            raise Exception('slave reload nginx - 失败 %s' % err)

        # reload iacs机器
        cmd = 'ssh {} "cd /homed/ && sh ./docmdoniacs.sh {}"'.format(
            self.master, self.nginx)
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE, shell=True)
        out, err = proc.communicate()
        if err:
            raise Exception('iacs reload nginx - 失败 %s' % err)

    # 系统维护 - 生成lua文件
    def offline(self, json_data):
        try:
            msgs = json_data['msgs'].replace("\n", "\\\\r\\\\n")
            start_time = json_data['start_time'].strip()
            end_time = json_data['end_time'].strip()
            slave = json_data['slave'].strip()
            iacs = json_data['iacs'].strip()
            title = json_data['title'].strip()

            # offline.example 模板文件生产 offline.lua文件
            cmd = ("cd {} && sed 's@#title#@{}@g;s@#start_time#@{}@g;"
                   "s@#end_time#@{}@g;s@#msgs#@{}@g;s@#slave#@{}@g;"
                   "s@#iacs#@{}@g' offline.example > offline.lua"
                   .format(self.offline_dir, title, start_time,
                           end_time, msgs, slave, iacs))
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                                    stderr=subprocess.PIPE, shell=True)
            out, err = proc.communicate()
            if err:
                raise Exception('生成lua文件失败 %s' % err)

            self._rsync_lua()

            self._nginx_reload()

        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success'}

    # 系统恢复 - 清空lua文件
    def online(self):
        try:
            # offline.example 模板文件生产 offline.lua文件
            cmd = ("cd {} && > offline.lua".format(self.offline_dir))
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                                    stderr=subprocess.PIPE, shell=True)
            out, err = proc.communicate()
            if err:
                raise Exception('清空lua文件失败 %s' % err)

            self._rsync_lua()

            self._nginx_reload()

        except Exception as e:
            return {'ret': 1, 'ret_msg': 'Exception: %s' % e.message}
        return {'ret': 0, 'ret_msg': 'success'}

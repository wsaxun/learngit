$(document).ready(function () {
    // 字符串格式化
    String.prototype.format = function (args) {
        var result = this;
        if (arguments.length > 0) {
            if (arguments.length == 1 && typeof (args) == "object") {
                for (var key in args) {
                    if (args[key] != undefined) {
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            } else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] != undefined) {
                        var reg1 = new RegExp("({)" + i + "(})", "g");
                        result = result.replace(reg1, arguments[i]);
                    }
                }
            }
        }
        return result;
    };

    // 判断变量是否未null
    function if_null(value) {
        if (value === null) {
            value = '';
        }
        return value;
    }

    // datetime转化字符串
    function timeFormatter(value) {
        if (value === '') {
            return value;
        }
        var dateee = new Date(value).toJSON();
        var date = new Date(+new Date(dateee)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
        return date;
    }

    // utc datetime转化字符串
    function utc_timeFormatter(value) {
        if (value === '') {
            return value;
        }
        var dateee = new Date(value).toJSON();
        var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
        return date;
    }

    // 给表格第一列增加复选框
    function initTableCheckbox() {
        var $thr = $('table thead tr');
        var $checkAllTh = $('<th><input type="checkbox" id="checkAll" name="checkAll" /></th>');
        /*将全选/反选复选框添加到表头最前，即增加一列*/
        // if ($('table thead tr').find('input[name="checkAll"]').length === 0) {
        //     $thr.prepend($checkAllTh);
        // }
        /*“全选/反选”复选框*/
        var $checkAll = $thr.find('input');
        $checkAll.click(function (event) {
            /*将所有行的选中状态设成全选框的选中状态*/
            $tbr.find('input').prop('checked', $(this).prop('checked'));
            /*并调整所有选中行的CSS样式*/
            if ($(this).prop('checked')) {
                $tbr.find('input').parent().parent().addClass('warning');
            } else {
                $tbr.find('input').parent().parent().removeClass('warning');
            }
            /*阻止向上冒泡，以防再次触发点击操作*/
            event.stopPropagation();
        });
        /*点击全选框所在单元格时也触发全选框的点击操作*/
        $checkAllTh.click(function () {
            $(this).find('input').click();
        });
        var $tbr = $('table tbody tr');
        // var $checkItemTd = $('<td><input type="checkbox" name="checkItem" /></td>');
        /*每一行都在最前面插入一个选中复选框的单元格*/
        // if ($('table tbody tr').find('input[name="checkItem"]').length === 0) {
        //     $tbr.prepend($checkItemTd);
        // }
        /*点击每一行的选中复选框时*/
        $tbr.find('input').click(function (event) {
            /*调整选中行的CSS样式*/
            $(this).parent().parent().toggleClass('warning');
            /*如果已经被选中行的行数等于表格的数据行数，将全选框设为选中状态，否则设为未选中状态*/
            $checkAll.prop('checked', $tbr.find('input:checked').length == $tbr.length ? true : false);
            /*阻止向上冒泡，以防再次触发点击操作*/
            event.stopPropagation();
        });
        /*点击每一行时也触发该行的选中操作*/
        $tbr.click(function () {
            $(this).find('input').click();
        });
    }

    // agent - 搜索
    top.agent_search = function () {
        // 声明变量
        var input, filter, table, tr, td, i, td2;
        input = document.getElementById("j_agent_search_input");
        filter = input.value.toUpperCase();
        table = document.getElementById("j_agent_search_table");
        tr = table.getElementsByTagName("tr");

        // 循环表格每一行，查找匹配项
        for (i = 0; i < tr.length; i++) {
            // 匹配第二列 - 主机
            td = tr[i].getElementsByTagName("td")[1];
            // 匹配第三列 - 触发器
            td2 = tr[i].getElementsByTagName("td")[2];

            if (td || td2) {
                if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else if (td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    };

    // task - 获取IP
    top.display_agent_ip = function () {
        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/elves/manage/api',
            data: JSON.stringify({
                'type': 't_agent_info',
                'action': 'DISPLAY'
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function (data, status) {
                if (data.ret === 0) {
                    var msg = "";
                    var result = data.data;
                    for (var i = 0; i < result.length; i++) {
                        msg += '<option>' + result[i][0] + ' - ' + result[i][1] + '</option>';
                    }
                    $('.j_ip_option').append(msg);

                    var option_default = '<option>None Selected IP</option>';
                    msg = option_default + msg;
                    $('.j_ip_option2').append(msg);

                    // 新建 - IP 列表
                    $('#j_ip_select').multiselect({
                        includeSelectAllOption: true,
                        enableFiltering: true,
                        buttonWidth: '250.55px',
                        maxHeight: 200
                    });

                    // 搜索 - IP 列表
                    $('#j_ip_select2').multiselect({
                        includeSelectAllOption: true,
                        enableFiltering: true,
                        buttonWidth: '220.55px',
                        maxHeight: 200
                    });
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function (data, status) {
                alert('display_agent_ip is failed');
            }
        });
    };

    // task - 执行
    $(".f_elves_manage .j_exec_task").click(function () {
        // 获取选中的IP
        var agent_ip = [];
        $("#j_ip_select :selected").each(function () {
            agent_ip.push($(this).val());
        });

        var cmd = $('.j_shell_cmd').val();

        var prefix = window.location.pathname.split('/')[1];
        $('.j_exec_result').empty();
        $.ajax({
            url: '/' + prefix + '/elves/manage/api',
            data: JSON.stringify({
                'type': 't_task',
                'action': 'EXEC',
                'data': {
                    'cmd': cmd,
                    'agent_ip': agent_ip
                }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function (data, status) {
                if (data.ret === 0) {
                    var result = data.data;
                    if (result.length === 0) {
                        alert('exec_cmd is failed');
                    } else {
                        $('.j_exec_result').append(result);
                        return true;
                    }
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function (data, status) {
                alert('exec_task is failed');
            }
        });
    });

    // cron - 显示
    top.display_cron = function () {
        var prefix = window.location.pathname.split('/')[1];
        $('.j_cron_context').find('tbody').empty();
        $('.j_cron_context').find('thead').empty();
        $.ajax({
            url: '/' + prefix + '/elves/manage/api',
            data: JSON.stringify({
                'type': 't_cron',
                'action': 'DISPLAY'
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function (data, status) {
                if (data.ret === 0) {
                    // thead
                    var vsg = document.getElementById("j_cron_thead").value;
                    $('.j_cron_context').find('thead').append(vsg);
                    // tbody
                    var msg = "";
                    var gsg, gsg0, gsg1, gsg2, gsg3, gsg4, gsg5, gsg6, gsg7, gsg8;
                    var result = data.data;
                    for (var i = 1; i <= result.length; i++) {
                        gsg0 = '<tr class="j_cron_line{0}"><td><input type="checkbox" name="checkItem" /></td>';
                        gsg1 = '<td>' + i + '</td>';
                        gsg_id = '<td hidden>' + result[i - 1][0] + '</td>';
                        gsg2 = '<td>' + result[i - 1][1] + '</td>';
                        gsg3 = '<td>' + result[i - 1][2] + '</td>';
                        if (result[i - 1][2].length > 55) {
                            gsg3 = '<td>' + result[i - 1][2].substring(0, 54) + '</td>';
                        }
                        gsg4 = '<td>' + result[i - 1][3] + '</td>';
                        gsg5 = '<td>未开启</td>';
                        if (result[i - 1][4] === 1) {
                            gsg5 = '<td>已开启</td>';
                        }
                        gsg6 = '<td></td>';
                        if (result[i - 1][5] !== null) {
                            gsg6 = '<td>' + timeFormatter(result[i - 1][5]) + '</td>';
                        }
                        if (result[i - 1][6] === 1) {
                            gsg7 = '<td>成功</td>';
                            gsg0 = gsg0.format('');
                        } else if (result[i - 1][6] === 0) {
                            gsg7 = '<td>失败</td>';
                            gsg0 = gsg0.format(' danger');
                        } else {
                            gsg7 = '<td>未执行</td>';
                            gsg0 = gsg0.format(' info');
                        }
                        gsg8 = '<td><button type="button" class="btn btn-warning btn-xs f_bt_bottom j_cron_detail">详情</button></td></tr>';

                        gsg = gsg0 + gsg1 + gsg_id + gsg2 + gsg3 + gsg4 + gsg5 + gsg6 + gsg7 + gsg8;
                        msg += gsg;
                    }
                    $('.j_cron_context').find('tbody').append(msg);
                    initTableCheckbox();
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function (data, status) {
                alert('get cron failed');
            }
        });
    };

    //cron - 新建 - 确定
    $(".f_elves_manage .j_cron_add_ok").click(function () {
        // 获取选中的IP
        var agent_ip = [];
        $("#j_ip_select :selected").each(function () {
            agent_ip.push($(this).val());
        });

        // 获取秒分时日月周
        var second = $(".j_cron_add_second").val();
        if (second.length == 0) {
            second = '*';
        }
        var minute = $(".j_cron_add_minute").val();
        if (minute.length == 0) {
            minute = '*';
        }
        var hour = $(".j_cron_add_hour").val();
        if (hour.length == 0) {
            hour = '*';
        }
        var day = $(".j_cron_add_day").val();
        if (day.length == 0) {
            day = '*';
        }
        var month = $(".j_cron_add_month").val();
        if (month.length == 0) {
            month = '*';
        }
        var week = $(".j_cron_add_week").val();
        if (week.length == 0) {
            week = '?';
        }
        var rule = [second, minute, hour, day, month, week];

        var cmd = $(".j_cron_add_cmd").val();
        if (cmd.length == 0) {
            alert('命令不能为空');
            return false;
        }

        var description = $(".j_cron_add_description").val();
        if (description.length == 0) {
            alert('功能描述不能为空');
            return false;
        }


        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/elves/manage/api',
            data: JSON.stringify({
                'type': 't_cron',
                'action': 'ADD',
                'data': {
                    'agent_ip': agent_ip,
                    'rule': rule,
                    'description': description,
                    'cmd': cmd
                }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function (data, status) {
                if (data.ret === 0) {
                    var result = data.data;
                    if (result.length !== 0) {
                        var msg = "";
                        for (var i = 0; i < result.length; i++) {
                            var gsg_ip = result[i][0] + ' 添加失败: ';
                            var gsg_err = result[i][1] + '\n';
                            msg = msg + gsg_ip + gsg_err;
                        }
                        alert(msg);
                    }
                    top.display_cron();
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function (data, status) {
                alert('cron add is failed');
            }
        });
    });

    // cron列表 - 首页
    $(".f_elves_manage").on('click', '.f_bt_index', function () {
        top.display_cron();
    });

    // cron列表 - 启动
    $(".f_elves_manage").on('click', '.j_cron_start', function () {
        var ok = true;
        var cron_ids = [];
        $(":checkbox:checked").closest("tr").find("input[name='checkItem']").each(function () {
            var num = $(this).parents('.j_cron_line').find('td:eq(1)').text();
            var status = $(this).parents('.j_cron_line').find('td:eq(6)').text();
            if(status === '已开启') {
                alert('序号{0} - 已开启,请先取消'.format(num));
                ok = false;
                return ok;
            }
            var id = $(this).parents('.j_cron_line').find('td:eq(2)').text();
            cron_ids.push(num + '=' + id);
        });

        if (!ok) return false;

        if (cron_ids.length === 0) {
            alert('至少选择一个任务');
            return false;
        }

        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/elves/manage/api',
            data: JSON.stringify({
                'type': 't_cron',
                'action': 'START',
                'data': {
                    'cron_ids': cron_ids
                }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function (data) {
                if (data.ret === 0) {
                    var result = data.data;
                    if (result.length !== 0) {
                        var msg = "";
                        for (var i = 0; i < result.length; i++) {
                            var gsg_num = '序号: ' + result[i][0] + ' 启动失败: ';
                            var gsg_err = result[i][1] + '\n';
                            msg = msg + gsg_num + gsg_err;
                        }
                        alert(msg);
                    }
                    top.display_cron();
                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function () {
                alert('start cron failed');
            }
        });
    });

    // cron列表 - 停止
    $(".f_elves_manage").on('click', '.j_cron_stop', function () {
        var ok = true;
        var cron_ids = [];
        $(":checkbox:checked").closest("tr").find("input[name='checkItem']").each(function () {
            var num = $(this).parents('.j_cron_line').find('td:eq(1)').text();
            var status = $(this).parents('.j_cron_line').find('td:eq(6)').text();
            if(status === '未开启') {
                alert('序号{0} - 未开启,不需要停止'.format(num));
                ok = false;
                return ok;
            }            
            var id = $(this).parents('.j_cron_line').find('td:eq(2)').text();
            cron_ids.push(num + '=' + id);
        });

        if (!ok) return false;

        if (cron_ids.length === 0) {
            alert('至少选择一个任务');
            return false;
        }

        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/elves/manage/api',
            data: JSON.stringify({
                'type': 't_cron',
                'action': 'STOP',
                'data': {
                    'cron_ids': cron_ids
                }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function (data) {
                if (data.ret === 0) {
                    var result = data.data;
                    if (result.length !== 0) {
                        var msg = "";
                        for (var i = 0; i < result.length; i++) {
                            var gsg_num = '序号: ' + result[i][0] + ' 停止失败: ';
                            var gsg_err = result[i][1] + '\n';
                            msg = msg + gsg_num + gsg_err;
                        }
                        alert(msg);
                    }
                    top.display_cron();
                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function () {
                alert('stop cron failed');
            }
        });
    });

    // cron列表 - 删除
    $(".f_elves_manage").on('click', '.j_cron_delete', function () {
        var cron_ids = [];
        $(":checkbox:checked").closest("tr").find("input[name='checkItem']").each(function () {
            var num = $(this).parents('.j_cron_line').find('td:eq(1)').text();
            var id = $(this).parents('.j_cron_line').find('td:eq(2)').text();
            cron_ids.push(num + '=' + id);
        });

        if (cron_ids.length === 0) {
            alert('至少选择一个任务');
            return false;
        }

        var gnl = confirm("你确定要删除这些任务吗?");
        if (gnl == false) {
            return false;
        }

        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/elves/manage/api',
            data: JSON.stringify({
                'type': 't_cron',
                'action': 'DELETE',
                'data': {
                    'cron_ids': cron_ids
                }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function (data) {
                if (data.ret === 0) {
                    var result = data.data;
                    if (result.length !== 0) {
                        var msg = "";
                        for (var i = 0; i < result.length; i++) {
                            var gsg_num = '序号: ' + result[i][0] + ' 删除失败: ';
                            var gsg_err = result[i][1] + '\n';
                            msg = msg + gsg_num + gsg_err;
                        }
                        alert(msg);
                    }
                    top.display_cron();
                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function () {
                alert('delete cron failed');
            }
        });
    });

    // cron列表 - 搜索
    $(".f_elves_manage").on('click', '.j_cron_search', function () {
        // 获取选中的IP
        var agent_ip = $("#j_ip_select2 :selected").val();
        if (agent_ip === 'None Selected IP') {
            agent_ip = '';
        }
        var search_context = $(".j_cron_search_context").val();

        if (agent_ip.length === 0 && search_context.length === 0) {
            alert('没有搜索条件');
            return false;
        }

        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/elves/manage/api',
            data: JSON.stringify({
                'type': 't_cron',
                'action': 'SEARCH',
                'data': {
                    'agent_ip': agent_ip,
                    'search_context': search_context
                }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function (data) {
                if (data.ret === 0) {
                    // tbody
                    var msg = "";
                    var gsg, gsg0, gsg1, gsg2, gsg3, gsg4, gsg5, gsg6, gsg7, gsg8;
                    var result = data.data;
                    for (var i = 1; i <= result.length; i++) {
                        gsg0 = '<tr class="j_cron_line{0}"><td><input type="checkbox" name="checkItem" /></td>';
                        gsg1 = '<td>' + i + '</td>';
                        gsg_id = '<td hidden>' + result[i - 1][0] + '</td>';
                        gsg2 = '<td>' + result[i - 1][1] + '</td>';
                        gsg3 = '<td>' + result[i - 1][2] + '</td>';
                        if (result[i - 1][2].length > 55) {
                            gsg3 = '<td>' + result[i - 1][2].substring(0, 54) + '</td>';
                        }
                        gsg4 = '<td>' + result[i - 1][3] + '</td>';
                        gsg5 = '<td>未开启</td>';
                        if (result[i - 1][4] === 1) {
                            gsg5 = '<td>已开启</td>';
                        }
                        gsg6 = '<td></td>';
                        if (result[i - 1][5] !== null) {
                            gsg6 = '<td>' + timeFormatter(result[i - 1][5]) + '</td>';
                        }
                        if (result[i - 1][6] === 1) {
                            gsg7 = '<td>成功</td>';
                            gsg0 = gsg0.format('');
                        } else if (result[i - 1][6] === 0) {
                            gsg7 = '<td>失败</td>';
                            gsg0 = gsg0.format(' danger');
                        } else {
                            gsg7 = '<td>未执行</td>';
                            gsg0 = gsg0.format(' info');
                        }
                        gsg8 = '<td><button type="button" class="btn btn-warning btn-xs f_bt_bottom j_cron_detail">详情</button></td></tr>';

                        gsg = gsg0 + gsg1 + gsg_id + gsg2 + gsg3 + gsg4 + gsg5 + gsg6 + gsg7 + gsg8;
                        msg += gsg;
                    }
                    $('.j_cron_context').find('tbody').empty();
                    $('.j_cron_context').find('tbody').append(msg);
                    initTableCheckbox();
                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function () {
                alert('search cron failed');
            }
        });
    });

    // cron列表 - 详情
    $(".f_elves_manage").on('click', '.j_cron_detail', function () {
        var cron_id = $(this).parents('.j_cron_line').find('td:eq(2)').text();

        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/elves/manage/api',
            data: JSON.stringify({
                'type': 't_cron',
                'action': 'DETAIL',
                'data': {
                    'cron_id': cron_id
                }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function (data) {
                if (data.ret === 0) {
                    var result = data.data[0];
                    var msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8,
                        msg, msg9, msg10, msg11, msg12, msg13;
                    $('.j_modal_context').find('tr').remove();
                    $('.j_modal_context').find('td').remove();
                    msg1 = '<tr class="success"><td>任务 I D</td><td>' + result[0] + '</td></tr>';
                    msg2 = '<tr class="success"><td>任务 I P</td><td>' + result[1] + '</td></tr>';
                    msg3 = '<tr class="success f_middle_font"><td>任务命令</td><td>' + result[2] + '</td></tr>';
                    msg4 = '<tr class="success f_middle_font"><td>任务描述</td><td>' + result[3] + '</td></tr>';
                    msg5 = '<tr class="warning"><td>计划规则</td><td>' + result[4] + '</td></tr>';
                    var cron_status = '未开启';
                    if (result[5] === 1) {
                        cron_status = '已开启';
                    }
                    msg6 = '<tr class="warning"><td>计划状态</td><td>' + cron_status + '</td></tr>';
                    msg7 = '<tr class="warning"><td>创建时间</td><td>' + timeFormatter(result[6]) + '</td></tr>';
                    msg8 = '<tr class="warning"><td>启动时间</td><td>' + utc_timeFormatter(if_null(result[7])) + '</td></tr>';
                    var cron_result;
                    if (result[8] === 1) {
                        cron_result = '成功';
                    } else if (result[8] === 0) {
                        cron_result = '失败';
                    } else {
                        cron_result = '未执行';
                    }
                    msg9 = '<tr class="danger"><td>执行结果</td><td>' + cron_result + '</td></tr>';
                    msg10 = '<tr class="danger f_middle_font"><td>执行错误</td><td>' + if_null(result[9]) + '</td></tr>';
                    msg11 = '<tr class="danger f_middle_font"><td>执行信息</td><td>' + if_null(result[10]) + '</td></tr>';
                    var cron_costtime = '';
                    if (result[11] !== null) {
                        cron_costtime = result[11] + 'ms';
                    }
                    msg12 = '<tr class="danger"><td>执行耗时</td><td>' + cron_costtime + '</td></tr>';
                    msg13 = '<tr class="danger"><td>执行时间</td><td>' + timeFormatter(if_null(result[12])) + '</td></tr>';

                    msg = msg1 + msg2 + msg3 + msg4 + msg5 + msg6 + msg7 + msg8 + msg9 + msg10 + msg11 + msg12 + msg13;

                    $('.j_modal_context').append(msg);
                    $('#j_myModalmsg').modal('show');

                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function () {
                alert('get cron detail failed');
            }
        });
    });

    // cron列表 - 修改
    var main_cron_ids = [];
    $(".f_elves_manage").on('click', '.j_cron_modify', function () {
        var cron_ids = [];
        $(":checkbox:checked").closest("tr").find("input[name='checkItem']").each(function () {
            var num = $(this).parents('.j_cron_line').find('td:eq(1)').text();
            var id = $(this).parents('.j_cron_line').find('td:eq(2)').text();
            cron_ids.push(num + '=' + id);
        });

        if (cron_ids.length === 0) {
            alert('请选择一个任务');
            return false;
        }

        if (cron_ids.length !== 1) {
            alert('只能选择一个任务');
            return false;
        }

        main_cron_ids = cron_ids;

        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/elves/manage/api',
            data: JSON.stringify({
                'type': 't_cron',
                'action': 'MODIFY',
                'data': {
                    'cron_ids': cron_ids
                }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function (data) {
                if (data.ret === 0) {
                    var result = data.data[0];
                    // input 赋值
                    document.getElementById("j_cron_modify_ip").value = result[0];
                    document.getElementById("j_cron_modify_cmd").value = result[1];
                    document.getElementById("j_cron_modify_description").value = result[2];
                    document.getElementById("j_cron_modify_rule").value = result[3];
                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function () {
                alert('get cron before data failed');
            }
        });
    });

    // cron列表 - 修改 - 确定
    $(".f_elves_manage").on('click', '.j_cron_modify_ok', function () {
        var ip = $(".j_cron_modify_ip").val();
        var cmd = $(".j_cron_modify_cmd").val();
        if (cmd.length == 0) {
            alert('命令不能为空');
            return false;
        }
        var description = $(".j_cron_modify_description").val();
        if (description.length == 0) {
            alert('描述不能为空');
            return false;
        }
        var rule = $(".j_cron_modify_rule").val();
        if (rule.length == 0) {
            rule = '* * * * * ?';
        }

        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/elves/manage/api',
            data: JSON.stringify({
                'type': 't_cron',
                'action': 'MODIFY_OK',
                'data': {
                    'main_cron_ids': main_cron_ids,
                    'ip': ip,
                    'cmd': cmd,
                    'description': description,
                    'rule': rule
                }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function (data) {
                if (data.ret === 0) {
                    top.display_cron();
                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function () {
                alert('cron modify failed');
            }
        });
    });
});
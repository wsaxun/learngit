$(document).ready(function() {
    // datetime转化字符串
    function timeFormatter(value) {
        var dateee = new Date(value).toJSON();
        var date = new Date(+new Date(dateee)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
        return date;
    }

    // 报警管理
    // 故障分类 - 显示 - 按应用集
    top.display_application = function() {
        var prefix = window.location.pathname.split('/')[1];
        $('.j_classification_context').find('tbody').empty();
        $('.j_classification_context').find('thead').empty();
        $.ajax({
            url: '/' + prefix + '/alert/manage/api',
            data: JSON.stringify({
                'type': 't_classification',
                'action': 'APP_DISPLAY'
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret === 0) {
                    // thead
                    var msg = "<tr><th>序号</th><th>应用集</th><th>未解决</th><th>功能</th></tr>";
                    $('.j_classification_context').find('thead').append(msg);

                    // tbody
                    var msg = "";
                    var gsg, gsg1, gsg2, gsg3, gsg4, gsg5;
                    var result = data.data;
                    for (var i = 1; i <= result.length; i++) {
                        gsg1 = '<tr class="j_application_line"><td>' + i + '</td>';
                        gsg2 = '<td class="f_hidden_td">' + result[i - 1][0] + '</td>';
                        gsg3 = '<td class="f_trigger_font">' + result[i - 1][1] + '</td>';
                        gsg4 = '<td><span class="badge f_badge_color">+' + result[i - 1][2] + '</span></td>';
                        gsg5 = '<td><button type="button" class="btn btn-success btn-xs f_bt_bottom j_classification_look">查看</button></td></tr>';

                        gsg = gsg1 + gsg2 + gsg3 + gsg4 + gsg5;
                        msg += gsg;
                    }
                    $('.j_classification_context').find('tbody').append(msg);
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('can not connect server...')
            }
        });
    };

    // 故障分类 - 显示 - 按主机
    top.display_host = function() {
        var prefix = window.location.pathname.split('/')[1];
        $('.j_classification_context').find('tbody').empty();
        $('.j_classification_context').find('thead').empty();
        $.ajax({
            url: '/' + prefix + '/alert/manage/api',
            data: JSON.stringify({
                'type': 't_classification',
                'action': 'HOST_DISPLAY'
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret === 0) {
                    // thead
                    var msg = "<tr><th>序号</th><th>主机</th><th>未解决</th><th>功能</th></tr>";
                    $('.j_classification_context').find('thead').append(msg);

                    // tbody
                    var msg = "";
                    var gsg, gsg1, gsg2, gsg3, gsg4, gsg5;
                    var result = data.data;
                    for (var i = 1; i <= result.length; i++) {
                        gsg1 = '<tr class="j_application_line f_middle_font"><td>' + i + '</td>';
                        gsg2 = '<td class="f_hidden_td">' + result[i - 1][0] + '</td>';
                        gsg3 = '<td class="f_trigger_font">' + result[i - 1][1] + '</td>';
                        gsg4 = '<td><span class="badge f_badge_color">+' + result[i - 1][2] + '</span></td>';
                        gsg5 = '<td><button type="button" class="btn btn-success btn-xs f_bt_bottom j_classification_look">查看</button></td></tr>';

                        gsg = gsg1 + gsg2 + gsg3 + gsg4 + gsg5;
                        msg += gsg;
                    }
                    $('.j_classification_context').find('tbody').append(msg);
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('can not connect server...')
            }
        });
    };


    // 故障分类 - 按钮 - 按主机
    $(".f_alert_manage .j_classification_by_host").click(function() {
        top.display_host();
    });

    // 故障分类 - 按钮 - 按应用集
    $(".f_alert_manage .j_classification_by_app").click(function() {
        top.display_application();
    });

    // 故障分类 - 查看
    $(".f_alert_manage").on('click', '.j_classification_look', function() {
        var id = $(this).parents('.j_application_line').find('td:eq(1)').text();
        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/manage/api',
            data: JSON.stringify({
                'type': 't_classification',
                'action': 'LOOK',
                'data': {
                    'id': id
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
            success: function(data) {
                if (data.ret === 0) {
                    $('.j_msg_context').find('tbody').empty();
                    var msg = "";
                    var gsg, gsg1, gsg2, gsg3, gsg4, gsg5, gsg6;
                    var result = data.data;
                    for (var i = 1; i <= result.length; i++) {
                        gsg1 = '<tr class="j_msg_line f_middle_font"><td>' + i + '</td>';
                        gsg2 = '<td class="f_hidden_td">' + result[i - 1][0] + '</td>';
                        gsg3 = '<td>' + result[i - 1][1] + '</td>';
                        gsg4 = '<td class="f_trigger_font">' + result[i - 1][2] + '</td>';
                        gsg5 = '<td>' + timeFormatter(result[i - 1][3]) + '</td>';

                        // 判断邮件状态
                        if (result[i - 1][4] !== '3') {
                            gsg6 = '<td><button type="button" class="btn btn-danger btn-xs f_bt_bottom j_msg_details">详情</button></td></tr>';
                        } else {
                            gsg6 = '<td><button type="button" class="btn btn-success btn-xs f_bt_bottom j_msg_details">详情</button></td></tr>';
                        }

                        gsg = gsg1 + gsg2 + gsg3 + gsg4 + gsg5 + gsg6;
                        msg += gsg;
                    }
                    $('.j_msg_context').find('tbody').append(msg);

                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function() {
                alert('查看故障失败');
            }
        });
        $('.j_application_line').removeClass('f_choice_color');
        $(this).parents('.j_application_line').addClass('f_choice_color');
    });

    // 故障 - 显示
    top.display_msg = function() {
        var prefix = window.location.pathname.split('/')[1];
        $('.j_msg_context').find('tbody').empty();
        $.ajax({
            url: '/' + prefix + '/alert/manage/api',
            data: JSON.stringify({ 'type': 't_msg', 'action': 'DISPLAY' }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret === 0) {
                    var msg = "";
                    var gsg, gsg1, gsg2, gsg3, gsg4, gsg5, gsg6;
                    var result = data.data;
                    for (var i = 1; i <= result.length; i++) {
                        gsg1 = '<tr class="j_msg_line f_middle_font"><td>' + i + '</td>';
                        gsg2 = '<td class="f_hidden_td">' + result[i - 1][0] + '</td>';
                        gsg3 = '<td>' + result[i - 1][1] + '</td>';
                        gsg4 = '<td class="f_trigger_font">' + result[i - 1][2] + '</td>';
                        gsg5 = '<td>' + timeFormatter(result[i - 1][3]) + '</td>';

                        // 判断邮件状态
                        if (result[i - 1][4] !== '3') {
                            gsg6 = '<td><button type="button" class="btn btn-danger btn-xs f_bt_bottom j_msg_details">详情</button></td></tr>';
                        } else {
                            gsg6 = '<td><button type="button" class="btn btn-success btn-xs f_bt_bottom j_msg_details">详情</button></td></tr>';
                        }

                        gsg = gsg1 + gsg2 + gsg3 + gsg4 + gsg5 + gsg6;
                        msg += gsg;
                    }
                    $('.j_msg_context').find('tbody').append(msg);
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('can not connect server...')
            }
        });
    };

    // 故障 - 详情
    $(".f_alert_manage").on('click', '.j_msg_details', function() {
        var msg_id = $(this).parents('.j_msg_line').find('td:eq(1)').text();
        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/manage/api',
            data: JSON.stringify({
                'type': 't_msg',
                'action': 'DETAILS',
                'data': {
                    'msg_id': msg_id
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
            success: function(data) {
                if (data.ret === 0) {
                    var result = data.data[0];
                    var msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8,
                        msg_log, msg9;
                    $('.j_msg_modal').find('tr').remove();
                    $('.j_msg_modal').find('td').remove();
                    msg1 = '<tr class="success"><td>告警设备</td><td>' + result[1] + '</td></tr>';
                    msg2 = '<tr class="success"><td>触发名称</td><td>' + result[2] + '</td></tr>';
                    msg3 = '<tr class="danger"><td>告警时间</td><td>' + timeFormatter(result[3]) + '</td></tr>';
                    msg4 = '<tr class="warning"><td>告警等级</td><td>' + result[4] + '</td></tr>';
                    msg5 = '<tr class="danger f_middle_font"><td>触发详情</td><td>' + result[5] + '</td></tr>';
                    msg6 = '<tr class="warning"><td>当前状态</td><td>' + result[6] + '</td></tr>';
                    msg7 = '<tr class="active"><td>事件 I D</td><td>' + result[7] + '</td></tr>';
                    msg8 = '<tr class="active"><td>数据来源</td><td>' + result[8] + '</td></tr>';

                    if (result[9] === '0') {
                        result[9] = '<span class="f_send_status">邮件发送失败</span><span>,&nbsp;</span><span class="f_send_status">短信发送失败</span>';
                    } else if (result[9] === '1') {
                        result[9] = '<span class="f_send_status">邮件发送失败</span><span>,&nbsp;</span><span>短信发送成功</span>';
                    } else if (result[9] === '2') {
                        result[9] = '<span>邮件发送成功</span><span>,&nbsp;</span><span class="f_send_status">短信发送失败</span>';
                    } else {
                        result[9] = '<span>邮件发送成功</span><span>,&nbsp;</span><span>短信发送成功</span>';
                    }
                    msg9 = '<tr class="success f_middle_font"><td>邮件状态</td><td>' + result[9] + '</td></tr>';
                    msg_log = msg1 + msg2 + msg3 + msg4 + msg5 + msg6 + msg7 + msg8 + msg9;

                    $('.j_msg_modal').append(msg_log);
                    $('#j_myModalmsg').modal('show');

                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function() {
                alert('获取详情失败');
            }
        });
    });

    // 故障 - 按钮 - 显示全部
    $(".f_alert_manage .j_msg_all").click(function() {
        top.display_msg();
    });

    // 故障 - 搜索
    top.msg_search = function() {
        // 声明变量
        var input, filter, table, tr, td, i, td2;
        input = document.getElementById("j_msg_search_input");
        filter = input.value.toUpperCase();
        table = document.getElementById("j_msg_search_table");
        tr = table.getElementsByTagName("tr");

        // 循环表格每一行，查找匹配项
        for (i = 0; i < tr.length; i++) {
            // 匹配第二列 - 主机
            td = tr[i].getElementsByTagName("td")[2];
            // 匹配第三列 - 触发器
            td2 = tr[i].getElementsByTagName("td")[3];

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


    // 报警设置
    // 邮件设置
    top.display_rule = function() {
        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({ 'type': 't_rule', 'action': 'QUE' }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    $('.table .table-rule').empty();
                    var msg = "";
                    for (i = 1; i <= data.data.length; i++) {
                        if (data.data[i - 1][2] == 1) {
                            var rule_status = "<button type='button' class='btn btn-xs f_bt_bottom rule_action_status' value='1'>启用</button>"
                        } else {
                            var rule_status = "<button type='button' class='btn btn-xs f_bt_bottom  rule_action_status' value='0'>禁用</button>"
                        }
                        var tmp = "<tr><td>" + i + "</td><td hidden>" + data.data[i - 1][0] + "</td><td>" + data.data[i - 1][1] + "</td><td><button type='button' class='btn btn-xs f_bt_bottom rule_action_user' value='user' data-toggle='modal' data-target='.rule_user_toggle'>详情</td><td>" + rule_status + "</td><td><button type='button' class='btn btn-xs f_bt_bottom rule_action_DEL' value='DEL'>DEL</button><button type='button' class='btn btn-xs f_bt_bottom rule_action_UPD' value='UPD' data-toggle='modal' data-target='.rule_rule_toggle'>UPD</button><button type='button' class='btn btn-xs f_bt_bottom rule_action_priority' value='PRI'><span class='glyphicon glyphicon-arrow-up' aria-hidden='true'></span></button></td><td>" + data.data[i - 1][3] + "</td></tr>"
                        msg += tmp
                    }
                    $('.table .table-rule').append(msg);
                } else {
                    alert(data.ret_msg)
                }
            },
            error: function(data, status) {
                alert("can not connect server...");
            }
        });
    };

    //显示定时计划任务
    top.display_cront_interval = function() {
        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({ 'type': 't_cront', 'action': 'QUE' }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    var hour = data.data[0]
                    var minute = data.data[1]
                    if (data.data[0] < 10) {
                        hour = '0' + data.data[0]
                    }
                    if (data.data[1] < 10) {
                        minute = '0' + data.data[1]
                    }
                    var mytime = hour + ':' + minute
                    $('#cront').find('input').eq(0).val(mytime);
                } else {
                    alert(data.ret_msg)
                }
            },
            error: function(data, status) {
                alert(data.ret_msg)
            }
        });
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({ 'type': 't_interval', 'action': 'QUE' }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    var interval = data.data[0]
                    interval = parseInt(interval / 3600)
                    $('#interval').find('select').val(interval)
                } else {
                    alert(data.ret_msg)
                }
            },
            error: function(data, status) {
                alert(data.ret_msg)
            }
        });
    };

    $('.cront_interval button').click(function() {
        var prefix = window.location.pathname.split('/')[1];
        var class_name = $(this).attr('name')
        if (class_name == 'cront') {
            var tmp = $(this).parent().parent().parent().find('input').eq(0).val().split(':')
            var f_hour = tmp[0];
            var f_minute = tmp[1];
            $.ajax({
                url: '/' + prefix + '/alert/api',
                data: JSON.stringify({
                    'type': 't_cront',
                    'action': 'UPD',
                    'data': { 'f_hour': f_hour, 'f_minute': f_minute }
                }),
                type: 'post',
                dataType: 'json',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                processData: false,
                cache: false,
                success: function(data, status) {
                    if (data.ret == 0) {
                        return
                    } else {
                        alert(data.ret_msg)
                    }
                },
                error: function(data, status) {
                    alert(data.ret_msg)
                }
            });
        } else {
            var f_interval = $('#interval select').val() * 3600;
            $.ajax({
                url: '/' + prefix + '/alert/api',
                data: JSON.stringify({
                    'type': 't_interval',
                    'action': 'UPD',
                    'data': { 'f_interval': f_interval }
                }),
                type: 'post',
                dataType: 'json',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                processData: false,
                cache: false,
                success: function(data, status) {
                    if (data.ret == 0) {
                        return
                    } else {
                        alert(data.ret_msg)
                    }
                },
                error: function(data, status) {
                    alert(data.ret_msg)
                }
            });
        }
    });


    // 策略模式显示 & 更新
    top.display_stragety = function() {
        var prefix = window.location.pathname.split('/')[1];
        $('#stragety_table').bootstrapTable({
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 20, 30, 'All'],
            search: true,
            searchText: '',
            showColumns: true,
            showToggle: true,
            method: 'post',
            sortName: 'f_id',
            sortOrder: 'desc',
            idField: 'f_id',
            showRefresh: true,
            url: '/' + prefix + '/alert/api',
            method: 'post',
            queryParams: function() {
                return { 'type': 't_stragety', 'action': 'QUE' }
            },
            uniqueId: 'f_id',
            columns: [{
                    field: 'index',
                    title: '编号',
                    formatter: function(value, row, index) {
                        return '<span class="badge">' + (index + 1) + '</span>'
                    }
                },
                {
                    field: 'f_id',
                    title: 'ID',
                    visible: false,
                    sortable: true
                }, {
                    field: 'f_stragety',
                    title: '名称'
                }, {
                    field: 'f_extend',
                    title: '扩展参数',
                    formatter: function(value, row, index) {
                        value = value.replace(/{/g, '').replace(/}/g, '')
                        return value
                    },
                    editable: {
                        validate: function(v) {
                            if (!v) return '不能为空';
                        }
                    },
                }, {
                    field: 'f_status',
                    title: '状态',
                    sortable: true,
                    editable: {
                        mode: 'popup',
                        type: 'select',
                        source: [{ value: "1", text: "Yes" }, {
                            value: "0",
                            text: "No"
                        }]
                    }
                }, {
                    field: 'f_decription',
                    title: '描述'
                }
            ],
            onEditableSave: function(field, row, oldValue, $el) {
                if (field === 'f_status') {
                    $.ajax({
                        url: '/' + prefix + '/alert/api',
                        data: JSON.stringify({
                            'type': 't_stragety',
                            'action': 'UPD',
                            'data': { 'f_id': row.f_id, 'f_status': row.f_status }
                        }),
                        type: 'post',
                        dataType: 'json',
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        },
                        success: function(data, status) {
                            if (data.ret == 0) {
                                console.log('success')
                            } else {
                                alert(data.ret_msg)
                            }
                        },
                        error: function(data, status) {
                            alert(data.ret_msg)
                        },
                        complete: function() {
                            $('#stragety_table').bootstrapTable('refresh')
                        }
                    });
                } else if (field === 'f_extend') {
                    $.ajax({
                        url: '/' + prefix + '/alert/api',
                        data: JSON.stringify({
                            'type': 't_stragety',
                            'action': 'UPD',
                            'data': { 'f_id': row.f_id, 'f_extend': '{' + row.f_extend + '}' }
                        }),
                        type: 'post',
                        dataType: 'json',
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        },
                        processData: false,
                        cache: false,
                        success: function(data, status) {
                            if (data.ret == 0) {
                                console.log('success')
                            } else {
                                alert(data.ret_msg)
                            }
                        },
                        error: function(data, status) {
                            alert(data.ret_msg)
                        },
                        complete: function() {
                            $('#stragety_table').bootstrapTable('refresh')
                        }
                    });
                }
            }
        })
    };


    // 子应用集显示 & 更新
    top.display_sup = function() {
        var prefix = window.location.pathname.split('/')[1];
        $('#sub_table').bootstrapTable({
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 20, 30, 'All'],
            search: true,
            searchText: '',
            showColumns: true,
            showToggle: true,
            method: 'post',
            sortName: 'f_id',
            sortOrder: 'desc',
            idField: 'f_id',
            showRefresh: true,
            url: '/' + prefix + '/alert/api',
            method: 'post',
            queryParams: function() {
                return { 'type': 't_classification_sub', 'action': 'QUE' }
            },
            toolbar: '#sub_toolbar',
            uniqueId: 'f_id',
            columns: [{
                    field: 'index',
                    title: '编号',
                    formatter: function(value, row, index) {
                        return '<span class="badge">' + (index + 1) + '</span>'
                    }
                },
                {
                    field: 'f_id',
                    title: 'ID',
                    visible: false,
                    sortable: true
                }, {
                    field: 'f_name',
                    title: '子应用集',
                    editable: {
                        mode: 'popup',
                        validate: function(v) {
                            if (!v) return '不能为空';
                        }
                    }
                }, {
                    field: 'f_sendnow',
                    title: '即时发送',
                    editable: {
                        type: 'select',
                        source: [{ value: "1", text: "Yes" }, {
                            value: "0",
                            text: "No"
                        }]
                    },
                    sortable: true
                }, {
                    field: 'f_sup_id',
                    title: '父应用集',
                    sortable: true,
                    editable: {
                        type: 'select',
                        source: function() {
                            var result = [];
                            $.ajax({
                                url: '/' + prefix + '/alert/api',
                                type: "post",
                                data: JSON.stringify({
                                    'type': 't_classification_sup',
                                    'action': 'QUE'
                                }),
                                async: false,
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json"
                                },
                                success: function(data) {
                                    for (var i = 1; i <= data.data.length; i++) {
                                        result.push({
                                            value: data.data[i - 1].f_id,
                                            text: data.data[i - 1].f_name
                                        });
                                    }
                                }
                            });
                            return result;
                        }
                    }
                }, {
                    field: 'f_decription',
                    title: '描述',
                    editable: {
                        mode: 'popup',
                        validate: function(v) {
                            if (!v) return '不能为空';
                        }
                    }
                }
            ],
            onEditableSave: function(field, row, oldValue, $el) {
                if (field === 'f_name' || field === 'f_decription') {
                    $.ajax({
                        url: '/' + prefix + '/alert/api',
                        data: JSON.stringify({
                            'type': 't_classification_sub',
                            'action': 'UPD',
                            'data': {
                                'f_id': row.f_id,
                                'f_name': row.f_name,
                                'f_decription': row.f_decription
                            }
                        }),
                        type: 'post',
                        dataType: 'json',
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": 'appliaction/json'
                        },
                        cache: false,
                        success: function(data, status) {
                            if (data.ret == 0) {
                                console.log('success')
                            } else {
                                alert(data.ret_msg);
                            }
                        },
                        error: function(data, status) {
                            alert('can not conncet server...')
                        },
                        complete: function() {
                            $('#sub_table').bootstrapTable('refresh')
                        }
                    });
                } else if (field === 'f_sendnow') {
                    $.ajax({
                        url: '/' + prefix + '/alert/api',
                        data: JSON.stringify({
                            'type': 't_classification_sub',
                            'action': 'UPD',
                            'extend': 'f_sendnow',
                            'data': {
                                'f_id': row.f_id,
                                'f_sendnow': row.f_sendnow
                            }
                        }),
                        type: 'post',
                        dataType: 'json',
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": 'appliaction/json'
                        },
                        cache: false,
                        success: function(data, status) {
                            if (data.ret == 0) {
                                console.log('success')
                            } else {
                                alert(data.ret_msg);
                            }
                        },
                        error: function(data, status) {
                            alert('can not conncet server...')
                        },
                        complete: function() {
                            $('#sub_table').bootstrapTable('refresh')
                        }
                    });
                } else if (field === 'f_sup_id') {
                    $.ajax({
                        url: '/' + prefix + '/alert/api',
                        data: JSON.stringify({
                            'type': 't_classification_sub',
                            'action': 'UPD',
                            'extend': 'sup_id',
                            'data': { 'f_id': row.f_id, 'f_sup_id': row.f_sup_id }
                        }),
                        type: 'post',
                        dataType: 'json',
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        },
                        processData: false,
                        cache: false,
                        success: function(data, status) {
                            if (data.ret == 0) {
                                console.log()
                            } else {
                                alert(data.ret_msg);
                            }
                        },
                        error: function(data, status) {
                            alert('cant not connect server...');
                        },
                        complete: function() {
                            $('#sub_table').bootstrapTable('refresh')
                        }
                    });
                }
            }
        })
    }
    //父应用集 - 增加
    $('#toolbar button').click(function() {
        $('.sup_toggle').modal('show')
    })

    // 父应用集 - 增加 - 确定
    $('#sup_add').click(function() {
        var prefix = window.location.pathname.split('/')[1];
        var sup_name = $('#sup_name').val();
        var sup_decription = $('#sup_decription').val();
        if (sup_name.length == 0 && sup_decription == 0) {
            return
        }
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({
                'type': 't_classification_sup',
                'action': 'ADD',
                'data': { 'f_name': sup_name, 'f_decription': sup_decription }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                "Accept": "application/json",
                "Content-Type": 'appliaction/json'
            },
            cache: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    $('.sup_toggle').modal('hide');
                    $('#sup_table').bootstrapTable('refresh')
                } else {
                    alert(data.ret_msg);
                }

            },
            error: function(data, status) {
                alert('can not conncet server...')
            }
        });
    });


    //父应用集 & 更新
    top.display_sub = function() {
        var prefix = window.location.pathname.split('/')[1];
        $('#sup_table').bootstrapTable({
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 20, 30, 'All'],
            search: true,
            searchText: '',
            showColumns: true,
            showToggle: true,
            method: 'post',
            sortName: 'f_id',
            sortOrder: 'desc',
            idField: 'f_id',
            showRefresh: true,
            url: '/' + prefix + '/alert/api',
            method: 'post',
            queryParams: function() {
                return { 'type': 't_classification_sup', 'action': 'QUE' }
            },
            toolbar: '#toolbar',
            uniqueId: 'f_id',
            columns: [{
                    field: 'index',
                    title: '编号',
                    formatter: function(value, row, index) {
                        return '<span class="badge">' + (index + 1) + '</span>'
                    }
                },
                {
                    field: 'f_id',
                    title: 'ID',
                    visible: false,
                    sortable: true
                }, {
                    field: 'f_name',
                    title: '父应用集',
                    sortable: true,
                    editable: {
                        mode: 'popup',
                        validate: function(v) {
                            if (!v) return '不能为空';
                        }
                    }
                }, {
                    field: 'f_decription',
                    title: '描述',
                    editable: {
                        mode: 'popup',
                        validate: function(v) {
                            if (!v) return '不能为空';
                        }
                    }
                }
            ],
            onEditableSave: function(field, row, oldValue, $el) {
                $.ajax({
                    url: '/' + prefix + '/alert/api',
                    data: JSON.stringify({
                        'type': 't_classification_sup',
                        'action': 'UPD',
                        'data': {
                            'f_id': row.f_id,
                            'f_name': row.f_name,
                            'f_decription': row.f_decription
                        }
                    }),
                    type: 'post',
                    dataType: 'json',
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": 'appliaction/json'
                    },
                    cache: false,
                    success: function(data, status) {
                        if (data.ret == 0) {
                            console.log('success')
                        } else {
                            alert(data.ret_msg);
                        }
                    },
                    error: function(data, status) {
                        alert('can not conncet server...')
                    },
                    complete: function() {
                        $('#sup_table').bootstrapTable('refresh')
                    }
                });
            }
        })
        $('.sub_table').find('tbody').empty();
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({
                'type': 't_classification_sub',
                'action': 'QUE'
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    $('.sub_table').find('tbody').empty();
                    var msg = "";
                    for (i = 1; i <= data.data.length; i++) {
                        var send_now_status = "";
                        if (data.data[i - 1][3] == 1) {
                            send_now_status = "<button type='button' class='btn btn-xs f_bt_bottom sub_action_sendto' value='1'>即时</button>";
                        } else {
                            send_now_status = "<button type='button' class='btn btn-xs f_bt_bottom sub_action_sendto' value='0'>延迟</button>";
                        }
                        msg += "<tr><td>" + i + "</td><td hidden>" + data.data[i - 1][0] + "</td><td>" + data.data[i - 1][1] + "</td><td><button type='button' class='btn btn-xs f_bt_bottom sub_action_sup' value='sup' data-toggle='modal' data-target='.sub_sup_toggle'>父应用集</button></td><td>" + send_now_status + "</td><td>" + data.data[i - 1][4] + "</td><td><button type='button' class='btn btn-xs f_bt_bottom sub_action_UPD' value='UPD' data-toggle='modal' data-target='#sub_upd_toggle'>UPD</button></td></tr>"
                    }
                    $('.sub_table').find('tbody').append(msg);
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('can not connect server...')
            }
        });
    };

    // 子应用集 - 增加
    $('#sub_toolbar button').click(function() {
        $('#sub_toggle').modal('show')
    })
    // 子应用集 - 增加- 确定
    $('.sub_add').click(function() {
        var prefix = window.location.pathname.split('/')[1];
        var sub_name = $('.sub_name').val();
        var sub_decription = $('.sub_decription').val();
        var f_sendnow = $('#sub_toggle .radio input:radio:checked').val();
        if (sub_name.length == 0 && sub_decription == 0) {
            return
        }
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({
                'type': 't_classification_sub',
                'action': 'ADD',
                'data': {
                    'f_name': sub_name,
                    'f_sendnow': f_sendnow,
                    'f_decription': sub_decription
                }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                "Accept": "application/json",
                "Content-Type": 'appliaction/json'
            },
            cache: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    $('#sub_toggle').modal('hide');
                    display_sub();
                } else {
                    alert(data.ret_msg);
                }

            },
            error: function(data, status) {
                alert('can not conncet server...')
            },
            complete: function() {
                $('#sub_table').bootstrapTable('refresh')
            }
        });
    });

    // 用户显示
    top.display_user_rule = function() {
        var prefix = window.location.pathname.split('/')[1];
        $('.user_table').find('tbody').empty();
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({ 'type': 't_media', 'action': 'QUE' }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    $('.user_table').find('tbody').empty();
                    var msg = "";
                    for (i = 1; i <= data.data.length; i++) {
                        msg += "<tr><td>" + i + "</td><td hidden>" + data.data[i - 1][0] + "</td><td>" + data.data[i - 1][1] + "</td><td>" + data.data[i - 1][3] + "</td><td hidden>" + data.data[i - 1][2] + "</td><td><button type='button' class='btn btn-xs f_bt_bottom user_action_DEL' value='DEL'>DEL</button><button type='button' class='btn btn-xs f_bt_bottom user_action_UPD' value='UPD' data-toggle='modal' data-target='#user_media_toggle'>UPD</button></td></tr>"
                    }
                    $('.user_table').find('tbody').append(msg);
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('can not connect server...')
            }
        });
    };
    // 增加
    $('.user_add').click(function() {
        var prefix = window.location.pathname.split('/')[1];
        var user_media = $('.user_media').val();
        var user_decription = $('.user_decription').val();
        if (user_media.length == 0 && user_decription == 0) {
            return
        }
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({
                'type': 't_media',
                'action': 'ADD',
                'data': {
                    'f_sendto': user_media,
                    'f_decription': user_decription
                }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                "Accept": "application/json",
                "Content-Type": 'appliaction/json'
            },
            cache: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    $('#user_toggle').modal('hide');
                    display_user_rule();
                } else {
                    alert(data.ret_msg);
                }

            },
            error: function(data, status) {
                alert('can not conncet server...')
            }
        });
    });
    //删除用户
    $('.panel-body').on('click', '.user_table .user_action_DEL', function() {
        var prefix = window.location.pathname.split('/')[1];
        var table_tr = $(this).parent().parent().find('td');
        var id = table_tr.eq(1).text();
        var y_or_n = confirm("确定删除此条规则?");
        if (!y_or_n) {
            return false
        }
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({
                'type': 't_media',
                'action': 'DEL',
                'data': { 'f_id': id }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                "Accept": "application/json",
                "Content-Type": 'appliaction/json'
            },
            cache: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    alert('success');
                    display_user_rule();
                    $('#user_toggle').modal('hide')
                } else {
                    alert(data.ret_msg)
                }
            },
            error: function(data, status) {
                alert('cant not connect server...')
            }
        });
    });
    //
    $(document).on('click', '.user_action_UPD', function() {
        var prefix = window.location.pathname.split('/')[1];
        var action = $(this).val();
        var f_id = $(this).parent().parent().find('td').eq(1).text();
        var f_sendto = $(this).parent().parent().find('td').eq(2).text();
        var f_decription = $(this).parent().parent().find('td').eq(3).text();
        var td_ments = "<tr><td hidden>" + f_id + "</td><td><input type='text' class='form-control' value='" + f_sendto + "'></td><td><input type='text' value='" + f_decription + "' class='form-control' ></td></tr>"
        $('#user_media_toggle .user_user_toggle_body').empty();
        $('#user_media_toggle .user_user_toggle_body').append(td_ments);
    });
    //更新
    $(document).on('click', '.user_update', function() {
        var prefix = window.location.pathname.split('/')[1];
        var f_id = $(this).parent().parent().find('div').eq(1).find('td').eq(0).text();
        var f_sendto = $(this).parent().parent().find('div').eq(1).find('input').eq(0).val();
        var f_decription = $(this).parent().parent().find('div').eq(1).find('input').eq(1).val();
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({
                'type': 't_media',
                'action': 'UPD',
                'data': {
                    'f_id': f_id,
                    'f_sendto': f_sendto,
                    'f_decription': f_decription
                }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                "Accept": "application/json",
                "Content-Type": 'appliaction/json'
            },
            cache: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    $('#user_media_toggle').modal('hide');
                    display_user_rule();
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('can not conncet server...')
            }
        });
    });

    // 事件绑定
    // 删除规则
    $('.panel-body').on('click', '.table-rule .rule_action_DEL', function() {
        var prefix = window.location.pathname.split('/')[1];
        var table_tr = $(this).parent().parent().find('td');
        var id = table_tr.eq(1).text();
        var y_or_n = confirm("确定删除此条规则?");
        if (!y_or_n) {
            return false
        }
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({
                'type': 't_rule',
                'action': 'DEL',
                'data': { 'f_id': id }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                "Accept": "application/json",
                "Content-Type": 'appliaction/json'
            },
            cache: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    alert('success');
                    display_rule();
                    $('.rule_rule_toggle').modal('hide')
                } else {
                    alert(data.ret_msg)
                }
            },
            error: function(data, status) {
                alert('cant not connect server...')
            }
        });
    });

    // 修改状态
    $('.panel-body').on('click', '.table-rule .rule_action_status', function() {
        var prefix = window.location.pathname.split('/')[1];
        var table_tr = $(this).parent().parent().find('td');
        var statuss = $(this).parent().parent().find('button').eq(1).val();
        if (statuss == 1) {
            var y_or_n = confirm("确定禁用");
        } else {
            var y_or_n = confirm("确定启用");
        }
        if (!y_or_n) {
            return false
        }
        var id = table_tr.eq(1).text();
        if (statuss == 1) {
            statuss = 0;
        } else {
            statuss = 1;
        }
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({
                'type': 't_rule',
                'action': 'UPD',
                'data': { 'f_id': id, 'f_status': statuss }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    alert('success');
                    display_rule();
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('can not connect server...')
            }
        });
    });

    //调整优先级
    $('.panel-body').on('click', '.table-rule .rule_action_priority', function() {
        var now_position = $(this).parent().parent().find('td').eq(1).text();
        var tb_num = $(this).parent().parent().find('td').eq(0).text();
        if (tb_num == 1) {
            return true;
        }
        var nxt_num = tb_num - 2
        var up_position = $(this).parent().parent().parent().find('tr').eq(nxt_num).find('td').eq(1).text();
        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({
                'type': 'priority',
                'action': 'UPD',
                'data': {
                    'height_rule_id': now_position,
                    'low_rule_id': up_position
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
            success: function(data, status) {
                if (data.ret == 0) {
                    display_rule();
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('can not connect server...')
            }
        });
    })

    //修改规则
    $('.panel-body').on('click', '.rule_rule_toggle .rule_update', function() {
        var prefix = window.location.pathname.split('/')[1];
        var table_tr = $('.rule_rule_toggle .rule_user_toggle_body');
        var datas;
        if (table_tr.find('tr').length == 0) {
            return false
        }
        var decription = ' ';
        var f_status = 0;
        var id = table_tr.find('td').eq(0).attr('data-rule-id');
        var type = 'UPD';
        var rule = '';
        var tmp1;
        var tmp2;
        var id = '';
        var tmp_type = '';
        table_tr.find('tr').each(function() {
            if ($(this).find('td').eq(0).attr('data-rule-id') == '') {
                tmp_type = $(this).find('.rule_class').children('option:selected').eq(0).val();
                tmp1 = $(this).find('td').eq(1).find('select').eq(1).children('option:selected').val();
                if (tmp_type == 'host' || tmp_type == 'trigger') {
                    tmp2 = $(this).find('td').eq(1).find('input').val();
                } else if (tmp_type == 'level') {
                    tmp2 = $(this).find('td').eq(1).find('select').eq(2).children('option:selected').attr('data-level');
                } else if (tmp_type == 'app') {
                    tmp2 = $(this).find('td').eq(1).find('select').eq(2).children('option:selected').text();
                }
                rule = "#" + tmp_type + " " + tmp1 + " " + tmp2 + "#";
            } else if ($(this).find('td').eq(0).attr('data-rule-id') == undefined) {
                var options = $(this).find('td').eq(0).find('select').children('option:selected').text();
                tmp_type = $(this).find('.rule_class').children('option:selected').eq(0).val();
                tmp1 = $(this).find('td').eq(1).find('select').eq(1).children('option:selected').val();
                if (tmp_type == 'host' || tmp_type == 'trigger') {
                    tmp2 = $(this).find('td').eq(1).find('input').val();
                } else if (tmp_type == 'level') {
                    tmp2 = $(this).find('td').eq(1).find('select').eq(2).children('option:selected').attr('data-level');
                } else if (tmp_type == 'app') {
                    tmp2 = $(this).find('td').eq(1).find('select').eq(2).children('option:selected').text();
                }
                rule = rule + "" + options + "#" + tmp_type + " " + tmp1 + " " + tmp2 + "#";

            } else {
                id = $(this).find('td').eq(0).attr('data-rule-id');
                tmp_type = $(this).find('.rule_class').children('option:selected').eq(0).val();
                tmp1 = $(this).find('td').eq(1).find('select').eq(1).children('option:selected').val();
                if (tmp_type == 'host' || tmp_type == 'trigger') {
                    tmp2 = $(this).find('td').eq(1).find('input').val();
                } else if (tmp_type == 'level') {
                    tmp2 = $(this).find('td').eq(1).find('select').eq(2).children('option:selected').attr('data-level');
                } else if (tmp_type == 'app') {
                    tmp2 = $(this).find('td').eq(1).find('select').eq(2).children('option:selected').text();
                }
                rule = rule + "#" + tmp_type + " " + tmp1 + " " + tmp2 + "#";
            }
        });
        datas = {
            'type': 't_rule',
            'action': type,
            'data': { 'f_id': id, 'f_rule': rule, 'f_decription': decription }
        };
        if (id == '') {
            type = 'ADD';
            datas = {
                'type': 't_rule',
                'action': type,
                'data': {
                    'f_rule': rule,
                    'f_decription': decription,
                    'f_status': f_status
                }
            }
        }
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify(datas),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    $('.rule_rule_toggle').modal('hide');
                    display_rule();
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('can not connect server...')
            }
        });
    });

    //用户详情
    $('.panel-body').on('click', '.table-rule .rule_action_user', function() {
        var table_tr = $(this).parent().parent().find('td');
        var id = table_tr.eq(1).text();
        var prefix = window.location.pathname.split('/')[1];
        $('.rule_user_toggle .rule_user_toggle_body').empty();
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({
                'type': 't_action',
                'action': 'QUE',
                'data': { 'f_rule_id': id }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            async: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    $('.rule_user_toggle .rule_user_toggle_body').empty();
                    var msg = "";
                    var tmp = '';
                    for (i = 1; i <= data.data.length; i++) {
                        tmp = "<tr><td>" + i + "</td><td hidden>" + data.data[i - 1][0] + "</td><td hidden>" + data.data[i - 1][1] + "</td><td>" + data.data[i - 1][2] + "</td><td><button type='button' class='btn btn-xs f_bt_bottom rule_action_user_action' value='DEL' >删除</button></td></tr>"
                        msg += tmp
                    }
                    $('.rule_user_toggle .rule_user_toggle_body').append(msg);
                    window.mem_rule_id = id;
                } else {
                    window.mem_rule_id = "";
                    alert(data.ret_msg)
                }
            },
            error: function(data, status) {
                window.mem_rule_id = "";
                alert("can not connect server...");
            }

        });
    });

    levels = function(level) {
        var options = '';
        if (level === 'Not classified') {
            options = "<select class='form-control'><option selected = 'selected' data-level='Not classified'>Not classified</option><option data-level='Information'>Information</option><option data-level='Warning'>Warning</option><option data-level='Average'>Average</option><option data-level='High'>High</option><option data-level='Disaster'>Disaster</option></select>"
            return options;
        } else if (level === 'Information') {
            options = "<select class='form-control'><option data-level='Not classified'>Not classified</option><option data-level='Information' selected = 'selected'>Information</option><option data-level='Warning'>Warning</option><option data-level='Average'>Average</option><option data-level='High'>High</option><option data-level='Disaster'>Disaster</option></select>"
            return options;

        } else if (level === 'Warning') {
            options = "<select class='form-control'><option data-level='Not classified'>Not classified</option><option data-level='Information'>Information</option><option data-level='Warning' selected = 'selected'>Warning</option><option data-level='Average'>Average</option><option data-level='High'>High</option><option data-level='Disaster'>Disaster</option></select>"
            return options;

        } else if (level === 'Average') {
            options = "<select class='form-control'><option data-level='Not classified'>Not classified</option><option data-level='Information'>Information</option><option data-level='Warning'>Warning</option><option data-level='Average' selected = 'selected'>Average</option><option data-level='High'>High</option><option data-level='Disaster'>Disaster</option></select>"
            return options;

        } else if (level === 'High') {
            options = "<select class='form-control'><option data-level='Not classified'>Not classified</option><option data-level='Information'>Information</option><option data-level='Warning'>Warning</option><option data-level='Average'>Average</option><option data-level='High' selected = 'selected'>High</option><option data-level='Disaster'>Disaster</option></select>"
            return options;

        } else if (level === 'Disaster') {
            options = "<select class='form-control'><option data-level='Not classified'>Not classified</option><option data-level='Information'>Information</option><option data-level='Warning'>Warning</option><option data-level='Average'>Average</option><option data-level='High'>High</option><option data-level='Disaster' selected = 'selected'>Disaster</option></select>"
            return options;

        }
    };


    apps = function(level) {
        var options = '';
        var prefix = window.location.pathname.split('/')[1];
        var tmp = "";
        var sup_list = "";
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({
                'type': 't_classification_sup',
                'action': 'QUE'
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            async: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    for (i = 1; i <= data.data.length; i++) {
                        tmp += "<option value=" + data.data[i - 1]['f_id'] + ">" + data.data[i - 1]['f_name'] + "</option>"
                    }
                    sup_list = "<select class='form-control'>" + tmp + "</select>";
                } else {
                    alert(data.ret_msg);
                    return false
                }
            },
            error: function(data, status) {
                alert(data);
                return false
            }
        });
        return sup_list
    };

    expression = function(classs) {
        var options = '';
        if (classs === 'host') {
            options = "<select class='form-control'><option value='==' selected='selected'>等于</option><option value='!='>不等于</option></select><input type='text' class='form-control'>"

        } else if (classs === 'level') {
            options = "<select class='form-control'><option value='==' selected='selected'>等于</option><option value='!='>不等于</option><option value='>='>大于等于</option><option value='<='>小于等于</option></select>" + levels('High')

        } else if (classs === 'trigger') {

            options = "<select class='form-control'><option value='in' selected='selected'>相似</option><option value='not in'>不相似</option></select><input type='text' class='form-control'>"

        } else if (classs === '应用集') {
            options = "<select class='form-control'><option value='==' selected='selected'>等于</option><option value='!='>不等于</option></select>" + apps('==')
        }
        return options
    };

    //t_rule 更改
    $('.panel-body').on('click', '.table-rule .rule_action_UPD', function() {
        $('.rule_rule_toggle .rule_user_toggle_body').empty();
        var table_tr = $(this).parent().parent().find('td');
        var table_tr2 = $(this).parent().parent().find('button');
        var rule_id = table_tr.eq(1).text();
        var rule = table_tr.eq(2).text().split('#');
        var prefix = window.location.pathname.split('/')[1];
        var tmp = [];
        var tmp2 = [];
        var tmp1 = "";
        var td_ments = '';
        for (i = 1; i < rule.length; i++) {
            if (i == rule.length - 1) {
                break
            }
            if (rule[i] == 'and') {
                tmp1 = '<td><select class="form-control"><option selected = "selected">and</option><option>or</option></select></td>'
                tmp.push(tmp1);
            } else if (rule[i] == 'or') {
                tmp1 = '<td><select class="form-control"><option>and</option><option selected = "selected">or</option></select></td>'
                tmp.push(tmp1);
            } else {
                if (rule[i].startsWith('host')) {
                    if (rule[i].startsWith('host ==')) {
                        tmp1 = "<td class='form-inline'><select class='form-control rule_class'><option value='host' selected='selected'>主机</option><option value='level'>级别</option><option value='trigger'>触发器名称</option><option value='app' >应用集</option></select><select class='form-control'><option value='==' selected='selected'>等于</option><option value='!='>不等于</option></select><input type='text' value='" + rule[i].replace('host == ', '') + "' class='form-control'></td>"
                    } else {
                        tmp1 = "<td class='form-inline'><select class='form-controli rule_class'><option value='host' selected='selected'>主机</option><option value='level'>级别</option><option value='trigger'>触发器名称</option><option value='app' >应用集</option></select><select class='form-control'><option value='=='>等于</option><option value='!=' selected='selected'>不等于</option></select><input type='text' value='" + rule[i].replace('host == ', '') + "' class='form-control'></td>"
                    }
                } else if (rule[i].startsWith('level')) {
                    if (rule[i].startsWith('level ==')) {
                        tmp1 = "<td class='form-inline'><select class='form-control rule_class'><option value='host'>主机</option><option value='level' selected='selected' >级别</option><option value='trigger'>触发器名称</option><option value='app' >应用集</option></select><select class='form-control'><option value='==' selected='selected'>等于</option><option value='!='>不等于</option><option value='>='>大于等于</option><option value='<='>小于等于</option></select>" + levels(rule[i].replace('level == ', '')) + "</td>"
                    } else if (rule[i].startsWith('level !=')) {
                        tmp1 = "<td class='form-inline'><select class='form-control rule_class'><option value='host'>主机</option><option value='level' selected='selected' >级别</option><option value='trigger'>触发器名称</option><option value='app' >应用集</option></select><select class='form-control'><option value='=='>等于</option><option value='!=' selected='selected'>不等于</option><option value='>='>大于等于</option><option value='<='>小于等于</option></select>" + levels(rule[i].replace('level != ', '')) + "</td>"
                    } else if (rule[i].startsWith('level >=')) {
                        tmp1 = "<td class='form-inline'><select class='form-control rule_class'><option value='host'>主机</option><option value='level' selected='selected' >级别</option><option value='trigger'>触发器名称</option><option value='app' >应用集</option></select><select class='form-control'><option value='=='>等于</option><option value='!='>不等于</option><option value='>=' selected='selected'>大于等于</option><option value='<='>小于等于</option></select>" + levels(rule[i].replace('level >= ', '')) + "</td>"
                    } else if (rule[i].startsWith('level <=')) {
                        tmp1 = "<td class='form-inline'><select class='form-control rule_class'><option value='host'>主机</option><option value='level' selected='selected' >级别</option><option value='trigger'>触发器名称</option><option value='app' >应用集</option></select><select class='form-control'><option value='=='>等于</option><option value='!='>不等于</option><option value='>='>大于等于</option><option value='<=' selected='selected'>小于等于</option></select>" + levels(rule[i].replace('level <= ', '')) + "</td>"
                    }
                } else if (rule[i].startsWith('trigger')) {
                    if (rule[i].startsWith('trigger in')) {
                        tmp1 = "<td class='form-inline'><select class='form-control rule_class'><option value='host'>主机</option><option value='level' >级别</option><option value='trigger' selected='selected'>触发器名称</option><option value='app' >应用集</option></select><select class='form-control'><option value='in' selected='selected'>相似</option><option value='not in'>不相似</option></select><input type='text' value='" + rule[i].replace('trigger in ', '') + "' class='form-control'></td>"
                    } else if (rule[i].startsWith('trigger not in')) {
                        tmp1 = "<td class='form-inline'><select class='form-control rule_class'><option value='host'>主机</option><option value='level' >级别</option><option value='trigger' selected='selected'>触发器名称</option><option value='app' >应用集</option></select><select class='form-control'><option value='in'>相似</option><option value='not in' selected='selected'>不相似</option></select><input type='text' value='" + rule[i].replace('trigger not in ', '') + "' class='form-control'></td>"
                    }
                } else if (rule[i].startsWith('app')) {
                    if (rule[i].startsWith('app ==')) {
                        tmp1 = "<td class='form-inline'><select class='form-control rule_class'><option value='host'>主机</option><option value='level'>级别</option><option value='trigger'>触发器名称</option><option value='app' selected='selected'>应用集</option></select><select class='form-control'><option value='==' selected='selected'>等于</option><option value='!='>不等于</option></select>" + apps(rule[i].replace('app == ', '')) + "</td>"
                    } else if (rule[i].startsWith('app !=')) {
                        tmp1 = "<td class='form-inline'><select class='form-control rule_class'><option value='host'>主机</option><option value='level'>级别</option><option value='trigger'>触发器名称</option><option value='app' selected='selected'>应用集</option></select><select class='form-control'><option value='=='>等于</option><option value='!=' selected='selected'>不等于</option></select>" + apps(rule[i].replace('app != ', '')) + "</td>"
                    }
                }
                tmp2.push(tmp1);
            }
        }
        var tmp3 = [];
        if (tmp.length == 0) {
            td_ments = "<tr><td data-rule-id='" + rule_id + "'></td>" + tmp2[0] + "</tr>"
        } else {
            for (i = 1; i <= tmp2.length; i++) {
                if (i == 1) {
                    tmp1 = "<td data-rule-id='" + rule_id + "'></td>" + tmp2[i - 1];
                } else {
                    tmp1 = tmp[i - 2] + tmp2[i - 1];
                }
                td_ments = td_ments + "<tr>" + tmp1 + "</tr>"
            }
        }
        $('.rule_rule_toggle .rule_user_toggle_body').append(td_ments);
    });

    // t_rule 根据类型修改后续html内容
    $(document).on('change', '.rule_user_toggle_body .rule_class', function() {
        var rule_class = $(this).children("option:selected").text();
        if (rule_class === '主机') {
            $(this).parent().children().eq(1).remove();
            $(this).parent().children().eq(1).remove();
            options = expression('host')
            $(this).parent().append(options)
        } else if (rule_class === '级别') {
            $(this).parent().children().eq(1).remove();
            $(this).parent().children().eq(1).remove();
            options = expression('level')
            $(this).parent().append(options)
        } else if (rule_class === '触发器名称') {
            $(this).parent().children().eq(1).remove();
            $(this).parent().children().eq(1).remove();
            options = expression('trigger')
            $(this).parent().append(options)
        } else if (rule_class == '应用集') {
            $(this).parent().children().eq(1).remove();
            $(this).parent().children().eq(1).remove();
            options = expression('应用集')
            $(this).parent().append(options)
        }
    });

    // 增加rule
    $('.rule_rule_toggle .modal-body button').click(function() {
        var operation = $(this).attr('data-operation');
        var type = '';
        var tmp = $('.rule_rule_toggle  .rule_user_toggle_body').find('tr');
        var mhtml = '';
        if (operation == 'add') {
            if (tmp.length == 0) {
                type = 'new'
            } else {
                type = 'old'
            }
            if (type == 'new') {
                mhtml = "<tr><td data-rule-id=''></td><td class='form-inline'><select class='form-control rule_class'><option value='host'>主机</option><option value='level' >级别</option><option value='trigger' selected='selected'>触发器名称</option><option value='app' >应用集</option></select><select class='form-control'><option value='in'>相似</option><option value='not in' selected='selected'>不相似</option></select><input type='text' class='form-control'></td></tr>"
                $('.rule_user_toggle_body').append(mhtml)
            } else if (type == 'old') {
                mhtml = "<tr><td><select class='form-control'><option selected = 'selected'>and</option><option>or</option></select></td><td class='form-inline'><select class='form-control rule_class'><option value='host'>主机</option><option value='level' >级别</option><option value='trigger' selected='selected'>触发器名称</option><option value='app' >应用集</option></select><select class='form-control'><option value='in'>相似</option><option value='not in' selected='selected'>不相似</option></select><input type='text' class='form-control'></td></tr>"
                $('.rule_user_toggle_body').append(mhtml)
            }
        } else if (operation == 'del') {
            if (tmp.length == 0) {
                return true;
            } else if (tmp.length > 1) {
                var last = tmp.length - 1
                tmp.eq(last).remove();
            } else if (tmp.length == 1) {
                var rule_id = tmp.find('td').eq(0).attr('data-rule-id');
                if (rule_id != '') {
                    alert('至少保留一条规则')
                } else if (rule_id == '') {
                    tmp.eq(0).remove();
                }
            }

        }
    });

    $('#add_rule').click(function() {
        $('.rule_rule_toggle .rule_user_toggle_body').empty();
    });


    //rule规则中用户增加
    $('.rule_user_toggle .modal-body button').click(function() {
        var num = $('.rule_user_toggle .rule_user_toggle_body').find('tr').length + 1;
        var prefix = window.location.pathname.split('/')[1];
        var user_list = "";
        window.rule_user_ids = "";
        rule_id = mem_rule_id;
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({ 'type': 't_media', 'action': 'QUE' }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            async: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    var tmp = "";
                    for (i = 1; i <= data.data.length; i++) {
                        tmp += "<option>" + data.data[i - 1][1] + "</option>"
                    }
                    user_list = "<select class='form-control'>" + tmp + "</select>";
                    rule_user_ids = data.data;
                } else {
                    alert(data.ret_msg);
                    return false
                }
            },
            error: function(data, status) {
                alert(data);
                return false
            }

        });
        tbody_msg = "<tr><td>" + num + "</td><td hidden>" + rule_id + "</td><td hidden></td><td>" + user_list + "</td><td><button type='button' class='btn btn-xs f_bt_bottom rule_action_user_action' value='SURE'>确定</button></td></tr>"
        $('.rule_user_toggle .rule_user_toggle_body').append(tbody_msg);
    });

    // 增加内容 rule user
    modal_user = function() {
        var table_tr = $('.rule_user_toggle .rule_user_toggle_body').find('td');
        var id = table_tr.eq(1).text();
        var prefix = window.location.pathname.split('/')[1];
        $('.rule_user_toggle .rule_user_toggle_body').empty();
        $.ajax({
            url: '/' + prefix + '/alert/api',
            data: JSON.stringify({
                'type': 't_action',
                'action': 'QUE',
                'data': { 'f_rule_id': id }
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            async: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    $('.rule_user_toggle .rule_user_toggle_body').empty();
                    var msg = "";
                    var tmp = '';
                    for (i = 1; i <= data.data.length; i++) {
                        tmp = "<tr><td>" + i + "</td><td hidden>" + data.data[i - 1][0] + "</td><td hidden>" + data.data[i - 1][1] + "</td><td>" + data.data[i - 1][2] + "</td><td><button type='button' class='btn btn-xs f_bt_bottom rule_action_user_action' value='DEL' >删除</button></td></tr>"
                        msg += tmp
                    }
                    $('.rule_user_toggle .rule_user_toggle_body').append(msg);
                    window.mem_rule_id = id;
                } else {
                    window.mem_rule_id = "";
                    alert(data.ret_msg)
                }
            },
            error: function(data, status) {
                window.mem_rule_id = "";
                alert("can not connect server...");
            }
        });
    }

    //点击确定按钮后，发送api更新rule对应的user
    $('.rule_user_toggle').on('click', '.rule_user_toggle_body .rule_action_user_action', function() {
        var action = $(this).val();
        var table_tr = $(this).parent().parent().find('td');
        var f_rule_id = table_tr.eq(1).text();
        var f_sendto = table_tr.eq(3).find("option:selected").text();
        var prefix = window.location.pathname.split('/')[1];
        if (action == 'DEL') {
            var f_media_id = table_tr.eq(2).text();
            $.ajax({
                url: '/' + prefix + '/alert/api',
                data: JSON.stringify({
                    'type': 't_rule',
                    'action': 'UPD',
                    'data': {
                        'action': 'DEL',
                        'f_user_group_id': f_media_id,
                        'f_id': f_rule_id
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
                success: function(data, status) {
                    if (data.ret == 0) {
                        modal_user();
                        //$('.rule_user_toggle').modal('hide');
                    } else {
                        alert(data.ret_msg);
                        return false
                    }
                },
                error: function(data, status) {
                    alert('can not connect server...');
                    return false
                }

            });
        } else {
            var f_media_id = "";
            for (i in rule_user_ids) {
                if (rule_user_ids[i][1] == f_sendto) {
                    f_media_id = rule_user_ids[i][0];
                }
            }
            $.ajax({
                url: '/' + prefix + '/alert/api',
                data: JSON.stringify({
                    'type': 't_rule',
                    'action': 'UPD',
                    'data': {
                        'action': 'ADD',
                        'f_user_group_id': f_media_id,
                        'f_id': f_rule_id
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
                success: function(data, status) {
                    if (data.ret == 0) {
                        modal_user();
                        //$('.rule_user_toggle').modal('hide');
                    } else {
                        alert(data.ret_msg);
                        return false
                    }
                },
                error: function(data, status) {
                    alert('can not connect server...');
                    return false
                }

            });
        }
    });


    // 用户管理
    // 用户组 - 显示
    top.display_user_group = function() {
        var prefix = window.location.pathname.split('/')[1];
        $('.j_user_group_context').find('tbody').empty();
        $.ajax({
            url: '/' + prefix + '/alert/user/api',
            data: JSON.stringify({
                'type': 't_user_group',
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
            success: function(data, status) {
                if (data.ret == 0) {
                    $('.j_user_group_context').find('tbody').empty();
                    var msg = "";
                    var gsg, gsg1, gsg2, gsg3, gsg4, gsg5, gsg6, gsg7, gsg8,
                        gsg9, gsg10, gsg11, gsg12, gsg13, gsg14;
                    var user_group = data.data;
                    for (var i = 1; i <= user_group.length; i++) {
                        gsg1 = '<tr class="j_user_group_line"><td>' + i + '</td>';
                        gsg2 = '<td class="f_hidden_td">' + user_group[i - 1][0] + '</td>';
                        gsg3 = '<td class="f_name_font">' + user_group[i - 1][1] + '</td>';
                        gsg4 = '<td>' + user_group[i - 1][2] + '</td>';
                        gsg5 = '<td>' + user_group[i - 1][4] + '</td>';
                        gsg6 = '<td>' + user_group[i - 1][5] + '</td>';
                        gsg7 = '<td>' + user_group[i - 1][7] + '</td>';
                        gsg8 = '<td>' + user_group[i - 1][8] + '</td>';
                        gsg9 = '<td><button type="button" class="btn btn-success btn-xs f_bt_bottom2 j_user_group_update" data-toggle="modal"';
                        gsg10 = ' data-target="#j_myModal_user_group_update">修改</button><button type="button"';
                        gsg11 = ' class="btn btn-danger btn-xs f_bt_bottom2 j_user_group_delete">删除</button><button type="button"';
                        gsg12 = ' class="btn btn-warning btn-xs f_bt_bottom2 j_user_group_detail" title="绑定详情" data-container="body"';
                        gsg13 = ' data-toggle="popover" data-trigger="focus" data-html="true" data-placement="left" data-content="<p>邮箱:</p>' + user_group[i - 1][3];
                        gsg14 = '<br><br><p>短信:</p>' + user_group[i - 1][6] + '">详情</button></td></tr>';
                        gsg = gsg1 + gsg2 + gsg3 + gsg4 + gsg5 + gsg6 + gsg7 + gsg8 + gsg9 + gsg10 + gsg11 + gsg12 + gsg13 + gsg14;
                        msg += gsg;
                    }
                    $('.j_user_group_context').find('tbody').append(msg);
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('can not connect server...')
            }
        });
    };

    //用户组 - 新建 - 获取用户名
    $(".f_user_manage .j_user_group_add").click(function() {
        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/user/api',
            data: JSON.stringify({
                'type': 't_user_group',
                'action': 'ADD'
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function(data) {
                var mail_msg = '';
                var mobile_msg = '';
                if (data.ret === 0) {
                    // 邮箱用户
                    var user_mail_name = data.data[0];
                    for (var i = 0; i < user_mail_name.length; i++) {
                        mail_msg += '<option>' + user_mail_name[i] + '</option>';
                    }
                    $('.j_user_group_mail_option').append(mail_msg);

                    // 短信用户
                    var user_mobile_name = data.data[1];
                    for (var i = 0; i < user_mobile_name.length; i++) {
                        mobile_msg += '<option>' + user_mobile_name[i] + '</option>';
                    }
                    $('.j_user_group_mobile_option').append(mobile_msg);

                    // 邮箱新建
                    $('#j_user_group_mail_select').multiselect({
                        includeSelectAllOption: true,
                        enableFiltering: true,
                        buttonWidth: '185.55px',
                        maxHeight: 200
                    });

                    // 短信新建
                    $('#j_user_group_mobile_select').multiselect({
                        includeSelectAllOption: true,
                        enableFiltering: true,
                        buttonWidth: '185.55px',
                        maxHeight: 200
                    });
                } else {
                    alert(data.ret_msg);
                    return false
                }
            },
            error: function() {
                alert('新建失败');
            }
        });
    });

    //用户组 - 新建 - 提交确定
    $(".f_user_manage .j_user_group_add_ok").click(function() {
        var user_group_name = $('.j_user_group_name').val();
        var user_group_description = $('.j_user_group_description').val();
        // 获取选中的邮件用户
        var user_group_mail = [];
        $("#j_user_group_mail_select :selected").each(function() {
            user_group_mail.push($(this).val());
        });
        // 获取选中的短信用户
        var user_group_mobile = [];
        $("#j_user_group_mobile_select :selected").each(function() {
            user_group_mobile.push($(this).val());
        });

        if (user_group_name.length == 0) {
            alert('组名不能为空');
            return false;
        }

        var regex = new RegExp(/^[a-zA-Z]\w*$/);
        var ret = regex.test(user_group_name);
        if (!ret) {
            alert('[组名格式错误] - 只能为字母,数字,下划线,且字母开头');
            return false;
        }

        // 提交数据库
        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/user/api',
            data: JSON.stringify({
                'type': 't_user_group',
                'action': 'ADD_OK',
                'data': {
                    'f_name': user_group_name,
                    'f_description': user_group_description,
                    'f_mail_member': user_group_mail,
                    'f_mobile_member': user_group_mobile
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
            success: function(data) {
                if (data.ret === 0) {
                    display_user_group();
                    return true;
                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function() {
                alert('新建提交失败');
            }
        });
    });

    //用户组 - 修改
    var main_user_gourp_id = '';
    $(".f_user_manage").on('click', '.j_user_group_update', function() {
        var user_group_id = $(this).parents('.j_user_group_line').find('td:eq(1)').text();
        main_user_gourp_id = user_group_id;
        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/user/api',
            data: JSON.stringify({
                'type': 't_user_group',
                'action': 'UPDATE',
                'data': {
                    'user_group_id': user_group_id
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
            success: function(data) {
                var msg = '';
                if (data.ret === 0) {
                    var user_data = data.data;
                    var user_group_name = user_data[0];
                    var user_group_description = user_data[1];
                    var user_mail = user_data[2];
                    var user_mail_name = user_data[3];
                    var user_mobile = user_data[4];
                    var user_mobile_name = user_data[5];

                    // input 赋值
                    document.getElementById("j_user_group_name_input").value = user_group_name;
                    document.getElementById("j_user_group_description_input").value = user_group_description;

                    // 用户组 - 邮箱修改
                    $('#j_user_group_update_mail').multiselect({
                        includeSelectAllOption: true,
                        enableFiltering: true,
                        buttonWidth: '185.55px',
                        maxHeight: 200
                    });
                    var options_mail = [];
                    for (var i = 0; i < user_mail_name.length; i++) {
                        var index = $.inArray(user_mail_name[i], user_mail);
                        if (index >= 0) {
                            options_mail[i] = {
                                label: user_mail_name[i],
                                selected: true
                            };
                        } else {
                            options_mail[i] = { label: user_mail_name[i] };
                        }
                    }
                    $('#j_user_group_update_mail').multiselect('dataprovider', options_mail);


                    // 用户组 - 短信修改
                    $('#j_user_group_update_mobile').multiselect({
                        includeSelectAllOption: true,
                        enableFiltering: true,
                        buttonWidth: '185.55px',
                        maxHeight: 200
                    });
                    var options_mobile = [];
                    for (var i = 0; i < user_mobile_name.length; i++) {
                        var index = $.inArray(user_mobile_name[i], user_mobile);
                        if (index >= 0) {
                            options_mobile[i] = {
                                label: user_mobile_name[i],
                                selected: true
                            };
                        } else {
                            options_mobile[i] = { label: user_mobile_name[i] };
                        }
                    }
                    $('#j_user_group_update_mobile').multiselect('dataprovider', options_mobile);

                    return user_group_id;

                } else {
                    alert(data.ret_msg);
                    return false
                }
            },
            error: function() {
                alert('修改失败');
            }
        });
    });

    // 用户组 - 修改 - 确定
    $(".f_user_manage").on('click', '.j_user_group_update_ok', function() {
        var user_group_id = main_user_gourp_id
        var user_group_name = $('.j_user_group_update_name').val();
        var user_group_description = $('.j_user_group_update_description').val();

        // 获取选中的邮件用户
        var user_group_mail = [];
        $("#j_user_group_update_mail :selected").each(function() {
            user_group_mail.push($(this).val());
        });
        // 获取选中的短信用户
        var user_group_mobile = [];
        $("#j_user_group_update_mobile :selected").each(function() {
            user_group_mobile.push($(this).val());
        });

        if (user_group_name.length == 0) {
            alert('组名不能为空');
            return false;
        }

        var regex = new RegExp(/^[a-zA-Z]\w*$/);
        var ret = regex.test(user_group_name);
        if (!ret) {
            alert('[组名格式错误] - 只能为字母,数字,下划线,且字母开头');
            return false;
        }

        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/user/api',
            data: JSON.stringify({
                'type': 't_user_group',
                'action': 'UPDATE_OK',
                'data': {
                    'user_group_id': user_group_id,
                    'user_group_name': user_group_name,
                    'user_group_description': user_group_description,
                    'user_group_mail': user_group_mail,
                    'user_group_mobile': user_group_mobile
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
            success: function(data) {
                if (data.ret === 0) {
                    display_user_group();
                    return true;
                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function() {
                alert('修改失败');
            }
        });
    });

    // 用户组 - 删除
    $(".f_user_manage").on('click', '.j_user_group_delete', function() {
        var user_group_id = $(this).parents('.j_user_group_line').find('td:eq(1)').text();
        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/user/api',
            data: JSON.stringify({
                'type': 't_user_group',
                'action': 'DELETE',
                'data': {
                    'user_group_id': user_group_id
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
            success: function(data) {
                if (data.ret === 0) {
                    var result = data.data;
                    if (result.length !== 0) {
                        alert("该用户组已绑定触发器规则, 请先解绑!");
                        return false;
                    } else {
                        display_user_group();
                        return true;
                    }

                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function() {
                alert('删除失败');
            }
        });
    });


    // 用户组 - 详情
    $(".f_user_manage").on('click', '.j_user_group_detail', function() {
        $(this).popover('show');
    });

    // 用户
    // 用户 - 显示
    top.display_user = function() {
        var prefix = window.location.pathname.split('/')[1];
        $('.j_user_context').find('tbody').empty();
        $.ajax({
            url: '/' + prefix + '/alert/user/api',
            data: JSON.stringify({ 'type': 't_user', 'action': 'DISPLAY' }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret == 0) {
                    $('.j_user_context').find('tbody').empty();
                    var msg = "";
                    var gsg, gsg1, gsg2, gsg3, gsg4, gsg5, gsg6, gsg7, gsg8,
                        gsg9;
                    var user = data.data;
                    for (var i = 1; i <= user.length; i++) {
                        gsg1 = '<tr class="j_user_line"><td>' + i + '</td>';
                        gsg2 = '<td class="f_hidden_td">' + user[i - 1][0] + '</td>';
                        gsg3 = '<td class="f_name_font">' + user[i - 1][1] + '</td>';
                        gsg4 = '<td>' + user[i - 1][2] + '</td>';
                        gsg5 = '<td>' + user[i - 1][3] + '</td>';
                        gsg6 = '<td>' + user[i - 1][4] + '</td>';
                        gsg7 = '<td><button type="button" class="btn btn-success btn-xs f_bt_bottom2 j_user_update" data-toggle="modal"';
                        gsg8 = ' data-target="#j_myModal_user_update">修改</button><button type="button"';
                        gsg9 = ' class="btn btn-danger btn-xs f_bt_bottom2 j_user_delete">删除</button></td></tr>';
                        gsg = gsg1 + gsg2 + gsg3 + gsg4 + gsg5 + gsg6 + gsg7 + gsg8 + gsg9;
                        msg += gsg;
                    }
                    $('.j_user_context').find('tbody').append(msg);
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('can not connect server...')
            }
        });
    };

    // 用户 - RTX添加 - 确定
    $(".f_user_manage").on('click', '.j_user_rtx_add_ok', function() {
        var user_rtx = $('.j_user_rtx').val();

        if (user_rtx.length == 0) {
            alert('用户名不能为空');
            return false;
        }

        var regex = new RegExp(/^[a-zA-Z;]*$/);
        var ret = regex.test(user_rtx);
        if (!ret) {
            alert('[RTX格式错误] - 只能为字母,分号,且字母开头结尾');
            return false;
        }

        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/user/api',
            data: JSON.stringify({
                'type': 't_user',
                'action': 'RTX_ADD_OK',
                'data': {
                    'user_rtx': user_rtx
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
            success: function(data) {
                if (data.ret === 0) {
                    var user = data.data;
                    var rtx_exist = user[0];
                    var rtx_not_exist = user[1];
                    if (rtx_exist.length == 0) {
                        alert(rtx_not_exist + ' - RTX添加成功');
                    } else {
                        var msg1 = rtx_exist + ' - RTX用户已存在';
                        var msg2 = rtx_not_exist + ' - RTX添加成功';
                        alert(msg1 + '\n' + msg2);
                    }
                    display_user();
                    return true;
                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function() {
                alert('RTX添加失败');
            }
        });

    });

    //用户 - 添加 - 确定
    $(".f_user_manage .j_user_add_ok").click(function() {
        var user = $('.j_user').val();
        var user_name = $('.j_user_name').val();
        var user_mail = $('.j_user_mail').val();
        var user_mobile = $('.j_user_mobile').val();

        if (user.length === 0) {
            alert('用户名不能为空');
            return false;
        }

        var regex = new RegExp(/^[a-zA-Z]\w*$/);
        var ret = regex.test(user);
        if (!ret) {
            alert('[用户名格式错误] - 只能为字母,下划线,数字,且字母开头!');
            return false;
        }
        if (user_mobile) {
            if (user_mobile.length !== 11) {
                alert('[手机号错误] - 请输入11位号码!');
                return false;
            }
        }

        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/user/api',
            data: JSON.stringify({
                'type': 't_user',
                'action': 'ADD_OK',
                'data': {
                    'user': user,
                    'user_name': user_name,
                    'user_mail': user_mail,
                    'user_mobile': user_mobile
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
            success: function(data) {
                if (data.ret === 0) {
                    var user_exist = data.data;
                    if (user_exist.length === 0) {
                        alert(user + ' - 添加成功');
                    } else {
                        alert(user + ' - 用户已存在');
                    }
                    display_user();
                    return true;
                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function() {
                alert('RTX添加失败');
            }
        });

    });

    //用户 - 搜索
    top.user_search = function() {
        // 声明变量
        var input, filter, table, tr, td, i;
        input = document.getElementById("j_user_search_input");
        filter = input.value.toUpperCase();
        table = document.getElementById("j_user_search_table");
        tr = table.getElementsByTagName("tr");

        // 循环表格每一行，查找匹配项
        for (i = 0; i < tr.length; i++) {
            // 匹配第二列
            td = tr[i].getElementsByTagName("td")[2];
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    };

    //用户 - 批量删除
    $(".f_user_manage .j_user_more_delete").click(function() {
        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/user/api',
            data: JSON.stringify({
                'type': 't_user',
                'action': 'MORE_DELETE'
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function(data) {
                var msg = '';
                if (data.ret === 0) {
                    var user_name = data.data;
                    for (var i = 0; i < user_name.length; i++) {
                        msg += '<option>' + user_name[i] + '</option>'
                    }
                    $('.j_user_more_delete_option').append(msg);

                    $('#j_user_more_delete_select').multiselect({
                        includeSelectAllOption: true,
                        enableFiltering: true,
                        buttonWidth: '185.55px',
                        maxHeight: 200
                    });

                } else {
                    alert(data.ret_msg);
                    return false
                }
            },
            error: function() {
                alert('获取用户失败');
            }
        });
    });

    //用户 - 批量删除 - 确定
    $(".f_user_manage .j_user_more_delete_ok").click(function() {
        // 获取选中的用户
        var user_more_delete = [];
        $("#j_user_more_delete_select :selected").each(function() {
            user_more_delete.push($(this).val());
        });

        var gnl = confirm(user_more_delete + "\n你确定要删除这些用户吗?");
        if (gnl === false) {
            return false;
        }

        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/user/api',
            data: JSON.stringify({
                'type': 't_user',
                'action': 'MORE_DELETE_OK',
                'data': {
                    'user_more_delete': user_more_delete
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
            success: function(data) {
                if (data.ret === 0) {
                    display_user();
                    display_user_group();
                    return true;
                } else {
                    alert(data.ret_msg);
                    return false
                }
            },
            error: function() {
                alert('批量删除用户失败');
            }
        });
    });

    //用户 - 修改
    var main_user_id = '';
    var main_user_mail = '';
    var main_user_mobile = '';
    $(".f_user_manage").on('click', '.j_user_update', function() {
        var user_id = $(this).parents('.j_user_line').find('td:eq(1)').text();
        main_user_id = user_id;
        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/user/api',
            data: JSON.stringify({
                'type': 't_user',
                'action': 'UPDATE',
                'data': {
                    'user_id': user_id
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
            success: function(data) {
                if (data.ret === 0) {
                    var user_data = data.data;
                    var user_rtx = user_data[1];
                    var user_name = user_data[2];
                    var user_mail = user_data[3];
                    var user_mobile = user_data[4];

                    main_user_mail = user_mail;
                    main_user_mobile = user_mobile;

                    // input 赋值
                    document.getElementById("j_user_rtx_text").value = user_rtx;
                    document.getElementById("j_user_name_text").value = user_name;
                    document.getElementById("j_user_mail_text").value = user_mail;
                    document.getElementById("j_user_mobile_text").value = user_mobile;

                } else {
                    alert(data.ret_msg);
                    return false
                }
            },
            error: function() {
                alert('修改失败');
            }
        });
    });

    // 用户 - 修改 - 确定
    $(".f_user_manage .j_user_update_ok").click(function() {
        var user_id = main_user_id;
        var user_mail_status = 0;
        var user_mobile_status = 0;
        var user_rtx = $('.j_user_rtx_value').val();
        var user_name = $('.j_user_name_value').val();
        var user_mail = $('.j_user_mail_value').val();
        var user_mobile = $('.j_user_mobile_value').val();


        if (user_rtx.length === 0) {
            alert('用户名不能为空');
            return false;
        }

        var regex = new RegExp(/^[a-zA-Z]\w*$/);
        var ret = regex.test(user_rtx);
        if (!ret) {
            alert('[组名格式错误] - 只能为字母,数字,下划线,且字母开头');
            return false;
        }

        if (main_user_mail.length > 0) {
            if (user_mail.length === 0) {
                user_mail_status = 1;
                var gnl = confirm("邮箱被修改为空! 你确定要修改吗?");
                if (gnl === false) {
                    return false;
                }
            }
        }

        if (main_user_mobile.length > 0) {
            if (user_mobile.length === 0) {
                user_mobile_status = 1;
                gnl = confirm("手机被修改为空! 你确定要修改吗?");
                if (gnl === false) {
                    return false;
                }
            }
        }

        if (user_mobile) {
            if (user_mobile.length !== 11) {
                alert('[手机号错误] - 请输入11位号码!');
                return false;
            }
        }

        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/user/api',
            data: JSON.stringify({
                'type': 't_user',
                'action': 'UPDATE_OK',
                'data': {
                    'user_id': user_id,
                    'user_rtx': user_rtx,
                    'user_name': user_name,
                    'user_mail': user_mail,
                    'user_mail_status': user_mail_status,
                    'user_mobile': user_mobile,
                    'user_mobile_status': user_mobile_status
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
            success: function(data) {
                if (data.ret === 0) {
                    display_user();
                    display_user_group();
                    return true;
                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function() {
                alert('修改确定失败');
            }
        });
    });

    // 用户 - 删除
    $(".f_user_manage").on('click', '.j_user_delete', function() {
        var user_id = $(this).parents('.j_user_line').find('td:eq(1)').text();
        var user_rtx = $(this).parents('.j_user_line').find('td:eq(2)').text();

        var gnl = confirm("你确定要删除" + user_rtx + "用户吗?");
        if (gnl == false) {
            return false;
        }

        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/alert/user/api',
            data: JSON.stringify({
                'type': 't_user',
                'action': 'DELETE',
                'data': {
                    'user_id': user_id
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
            success: function(data) {
                if (data.ret === 0) {
                    display_user_group();
                    display_user();
                    return true;
                } else {
                    alert(data.ret_msg);
                    return false;
                }
            },
            error: function() {
                alert('删除用户失败');
            }
        });
    });

});

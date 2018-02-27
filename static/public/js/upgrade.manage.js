$(document).ready(function () {
    //textarea支持tab缩进
    $("textarea").on(
        'keydown',
        function (e) {
            if (e.keyCode == 9) {
                e.preventDefault();
                var indent = '    ';
                var start = this.selectionStart;
                var end = this.selectionEnd;
                var selected = window.getSelection().toString();
                selected = indent + selected.replace(/\n/g, '\n' + indent);
                this.value = this.value.substring(0, start) + selected +
                    this.value.substring(end);
                this.setSelectionRange(start + indent.length, start +
                    selected.length);
            }
        });


    // openresty 返回特定接口
    $('.panel-body .maintain .j_system_maintenance').click(function () {
        if (confirm("确定执行？")) {
            console.log('');
        } else {
            return false;
        }
        $('.panel-body .result .alert-success').hide();
        $('.panel-body .result .alert-danger').hide();
        $('.panel-body .maintain button').attr("disabled", "disabled")
        var prefix = window.location.pathname.split('/')[1];
        var type = $(this).val();
        var ac_type = '';
        var slave = $('.j_msg_homed').eq(0).val();
        var iacs = $('.j_msg_homed').eq(1).val();
        var title = $('.j_msg_homed').eq(2).val();
        var msgs = $('.j_msg_homed').eq(3).val();
        var start_time = $('.j_start_datetime').val();
        var end_time = $('.j_end_datetime').val();
        if (type === 'offline') {
            ac_type = 'openresty 设置';
            if (msgs === '' || msgs === undefined) {
                msgs = '系统升级';
            }
            if (start_time === '' || start_time === undefined || end_time === '' || end_time === undefined ) {
                $('.panel-body .result .alert-danger').text('开始时间.结束时间不能为空');
                $('.panel-body .result .alert-success').hide();
                $('.panel-body .result .alert-danger').show();
                $('.panel-body .maintain button').removeAttr("disabled")
                return false;
            }
        } else if (type === 'online') {
            ac_type = 'openresty 恢复';
        }
        $.ajax({
            url: '/' + prefix + '/upgrade/homed/manage/api',
            data: JSON.stringify({
                'type': type,
                'title': title,
                'msgs': msgs,
                'start_time': start_time,
                'end_time': end_time,
                'slave': slave,
                'iacs': iacs
            }),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            success: function (data) {
                if (data.ret === 0) {
                    $('.panel-body .result .alert-success').text(ac_type + " " + data.ret_msg);
                    $('.panel-body .result .alert-danger').hide();
                    $('.panel-body .result .alert-success').show();
                    $('.panel-body .maintain button').removeAttr("disabled")
                } else {
                    $('.panel-body .result .alert-danger').text(ac_type + ' ' + data.ret_msg);
                    $('.panel-body .result .alert-success').hide();
                    $('.panel-body .result .alert-danger').show();
                    $('.panel-body .maintain button').removeAttr("disabled")
                }
            },
            error: function () {
                $('.panel-body .result .alert-danger').text('调用接口失败');
                $('.panel-body .result .alert-success').hide();
                $('.panel-body .result .alert-danger').show();
                $('.panel-body .maintain button').removeAttr("disabled")
            }
        });
    });

    //升级时间控件设置
    $(".j_start_datetime").datetimepicker({
        format: 'yyyy-mm-dd hh:ii'
    });
    $(".j_end_datetime").datetimepicker({
        format: 'yyyy-mm-dd hh:ii'
    });
});
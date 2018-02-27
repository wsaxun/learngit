$(document).ready(function() {
    // agent - 搜索
    top.agent_search = function() {
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
    
    submit_cluster_data=function(){
    	var form=$("#cluster_form").serializeArray();
    	data = {};
    	for (var i in form){
    		obj=form[i];
    		if(obj.value == ""){
    			alert("数据不能为空！");
    			return false;
    		}
    		else
    		{
    			data[obj.name]=obj.value;
    		}
    	}
    	console.log(data);
    	var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/lvs/manage/add_cluster',
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            processData: false,
            cache: false,
            success: function(data, status) {
            	alert(data.ret_msg);
            },
        });
    	
    	//window.location.reload();
    };

	add_ip=function(ip){
		$("input[name=master]").val(ip);
		//$("input[name=master]").attr("disabled",true);
	};
    // agent 列表 - 显示
    top.display_lvs_info = function() {
        var prefix = window.location.pathname.split('/')[1];
        $('.j_agent_context').find('tbody').empty();
        $.ajax({
            url: '/' + prefix + '/lvs/server/api',
            type: 'post',
            dataType: 'json',
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret === 0) {
                    var msg = "";
                    var gsg, gsg1, gsg2, gsg3, gsg4, gsg5;
                    var result = data.data;
                    console.log(result);
                    for (var i = 1; i <= result.length; i++) {     
                        gsg1 = '<td>' + result[i - 1][0] + '</td>';
                        gsg2 = '<td>' + result[i - 1][1] + '</td>';
                        gsg3 = '<td>' + result[i - 1][2] + '</td>';
                        gsg4 = '<td>' + result[i - 1][3] + '</td>';
                        gsg5 = '<td>' + result[i - 1][4] + '</td>';
                        if (result[i-1][5] == 0)
                        {
                        gsg6 = '<td>' +
                        '<button  type="submit" class="btn btn-success" id="upload_btn" \
							data-toggle="modal" data-target="#exampleModal" onClick="add_ip(\''
						 + result[i - 1][1]+'\');">Create Cluster</button>'        
                         + '</td></tr>';}
                         else { gsg6 = '<td>' +
                        '<button  type="submit" class="btn btn-success">Already Add</button>'; }

                        gsg = '<tr>'+gsg1 + gsg2 + gsg3 + gsg4 + gsg5 + gsg6+'</tr>';
                        msg += gsg;
                    }
                    if (msg){
                    	$('.j_agent_context').find('tbody').append(msg);
                    }
                    else {
                     return '<p>Have not found lvs server.<\p>';}
                } 
                else {
                    alert(data.ret_msg);
                    
                }
            },
            error: function(data, status) {
                alert('can not get info...');
            },
        });
    };
    
    
     top.display_cluster_info = function() {
        var prefix = window.location.pathname.split('/')[1];
        $('#publish_table_body').empty();
        $.ajax({
            url: '/' + prefix + '/lvs/cluster/api',
            type: 'post',
            dataType: 'json',
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret === 0) {
                    var msg = "";
                    var gsg, gsg1, gsg2, gsg3, gsg4, gsg5;
                    var result = data.data;
                    console.log(result);
                    for (var item in result) {     
                        gsg1 = '<td>' + result[item].name + '</td>';
                        gsg2 = '<td>' + result[item].description + '</td>';
                        gsg3 = '<td>' + result[item].area + '</td>';
                        gsg4 = '<td>' + result[item].master + '</td>';
                        //gsg6 = '<td><button type="submit" class="btn btn-success">操作</button></td></tr>';
                        gsg6 = '<td><a href="/maintain/lvs/config/?id=' + result[item].id + '"' +
                        'class="btn btn-success"><span class="fui-gear"></span></span>配置</a> \
				        <a class="btn btn-primary" style="position: relative;left: 5px;"> \
				        <span class="fui-arrow-left"></span>回滚</a> \
				        <a class="btn btn-warning" style= "position: relative;left: 10px;"> \
				        <span class="fui-check-inverted-2"></span>发布</a> \
				        <a class="btn btn-danger" style="position: relative;left: 15px;"> \
				        <span class="fui-calendar-solid"></span>Keepalived操作</a></td> ';

                        gsg = '<tr>'+gsg1 + gsg2 + gsg3 + gsg4 + gsg5 + gsg6 + '</tr>';
                        msg += gsg;
                    }
                    $('#publish_table_body').append(msg);
                } 
                else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('can not get info...');
            },
        });
    };
    
    
    top.display_config_info = function() {
    	var pam = window.location.href.split('?')[1]
    	console.log(pam);
    	var data = {}
    	data[pam.split('=')[0]]=pam.split('=')[1]
    	console.log(data)
        var prefix = window.location.pathname.split('/')[1];
        //$('#publish_table_body').empty();
        $.ajax({
            url: '/' + prefix + '/lvs/config/api',
            type: 'post',
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret === 0) {
                    var msg = "";
                    var gsg, gsg1, gsg2, gsg3, gsg4, gsg5;
                    var result = data.data;
                    console.log(result);
                    $('#publish_table_body').empty();
                    for (var item in result) {     
                        gsg1 = '<td>' + result[item].name + '</td>';
                        gsg2 = '<td>' + result[item].lb_kind + '</td>';
                        gsg3 = '<td>' + result[item].lb_algo + '</td>';
                        //gsg6 = '<td><button type="submit" class="btn btn-success">操作</button></td></tr>';
                        //javascript:;" onClick="javascript:online_vip_instanc('0000000','{{ vipinstance.vip_instance }}
                        //href="javascript:;" onClick="javascript:offline_vip_instance('0000000','{{ vipinstance.vip_instance }}')"
                        //href="javascript:;" onClick="javascript:remove_vip_instance('0000000','{{ vipinstance.vip_instance }}')
                        gsg4 =
                        '<td>'
                        +'<a href="lvs/edit/virtualip/?id="' 
                        +'class="btn btn-sm btn-success"><span class="fui-new"></span>编辑</a>'
                        +'<a href="#" class="btn btn-sm btn-info"><span class="fui-play"></span>上线</a>'
                        +'<a  href="#" class="btn btn-sm btn-warning"><span class="fui-pause"></span>下线</a>'
                        +'<a  href="#" class="btn btn-sm btn-danger"><span class="fui-cross"></span>删除</a>'
				    	+'</td>';

                        gsg ='<tr>' + gsg1 + gsg2 + gsg3 + gsg4 + '</tr>';
                        msg += gsg;
                    }
                    $('#publish_table_body').append(msg);
                } 
                else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('can not get info...');
            },
        });
    };
    
    top.change_cluster_name = function() {
    	var pam = window.location.href.split('?')[1]
    	console.log(pam);
    	var data = {}
    	data[pam.split('=')[0]]=pam.split('=')[1]
    	console.log(data)
        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/lvs/cluster/name/api',
            type: 'post',
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            cache: false,
            success: function(data, status) {
                if (data.ret === 0) {
                     name = data.data
                    $('h4').text(name);
                } 
                else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('can not get info...');
            },
        });
    };
   

    // task - 获取IP
    top.display_task = function() {
        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/elves/manage/api',
            data: JSON.stringify({
                'type': 't_task',
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
                if (data.ret === 0) {
                    var msg = "";
                    var result = data.data;
                    for (var i = 0; i < result.length; i++) {
                        msg += '<option>' + result[i][0] + ' - ' + result[i][1] + '</option>';
                    }
                    $('.j_task_ip_option').append(msg);

                    // IP 列表
                    $('#j_task_ip_select').multiselect({
                        includeSelectAllOption: true,
                        enableFiltering: true,
                        buttonWidth: '250.55px',
                        maxHeight: 350
                    });
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('display_task is failed')
            }
        });
    };

    // task - 执行
    $(".f_elves_manage .j_exec_task").click(function() {
        // 获取选中的IP
        var agent_ip = [];
        $("#j_task_ip_select :selected").each(function() {
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
            success: function(data, status) {
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
            error: function(data, status) {
                alert('exec_task is failed');
            }
        });
    });


    // cron - 新建 - 获取IP列表
    $(".f_elves_manage .j_cron_add").click(function() {
        var prefix = window.location.pathname.split('/')[1];
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
            success: function(data, status) {
                if (data.ret === 0) {
                    var msg = "";
                    var result = data.data;
                    for (var i = 0; i < result.length; i++) {
                        msg += '<option>' + result[i][0] + ' - ' + result[i][1] + '</option>';
                    }
                    $('.j_cron_ip_option').append(msg);

                    // IP 列表
                    $('#j_cron_ip_select').multiselect({
                        includeSelectAllOption: true,
                        enableFiltering: true,
                        buttonWidth: '185.55px',
                        maxHeight: 200
                    });
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('cron add get IP is failed')
            }
        });
    });

    //cron - 新建 - 确定
    $(".f_elves_manage .j_cron_add_ok").click(function() {
        // 获取选中的IP
        var agent_ip = [];
        $("#j_cron_ip_select :selected").each(function() {
            agent_ip.push($(this).val());
        });
        // 获取APP
        var app = $("#j_cron_add_app").val();

        // 获取秒分时日月周
        var second = $(".j_cron_add_second").val();
        if (second.length == 0) {
            second = '0';
        }
        var minute = $(".j_cron_add_minute").val();
        if (minute.length == 0) {
            minute = '1';
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
        var rule = [second, minute, hour, day, month, week]

        var param = $(".j_cron_add_param").val();


        var prefix = window.location.pathname.split('/')[1];
        $.ajax({
            url: '/' + prefix + '/elves/manage/api',
            data: JSON.stringify({
                'type': 't_cron',
                'action': 'ADD',
                'data': {
                    'agent_ip': agent_ip,
                    'app': app,
                    'rule': rule,
                    'param': param,
                    'func': 'exec_cmd'
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
                if (data.ret === 0) {
                    alert('添加计划任务 - 成功');
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('cron add is failed')
            }
        });

    });

    // cron - 操作 - 获取IP列表
    $(".f_elves_manage .j_cron_batch").click(function() {
        var prefix = window.location.pathname.split('/')[1];
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
            success: function(data, status) {
                if (data.ret === 0) {
                    var msg = "";
                    var result = data.data;
                    for (var i = 0; i < result.length; i++) {
                        msg += '<option>' + result[i][0] + ' - ' + result[i][1] + '</option>';
                    }
                    $('.j_cron_ip_option2').append(msg);

                    // IP 列表
                    $('#j_cron_ip_select2').multiselect({
                        includeSelectAllOption: true,
                        enableFiltering: true,
                        buttonWidth: '185.55px',
                        maxHeight: 200
                    });
                } else {
                    alert(data.ret_msg);
                }
            },
            error: function(data, status) {
                alert('cron batch get IP is failed')
            }
        });
    });
});

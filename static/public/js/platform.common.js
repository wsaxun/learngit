// 定义运维自动化系统的统一JS
$(document).ready(function () {

  	//表单序号
    var number = 1;
    $('.j_newsort > tr').each(function() {
        $(this).find('td:first').text(number++);
    });

    //第二个表单序号
    var number2 = 1;
    $('.j_newsort2 > tr').each(function() {
        $(this).find('td:first').text(number2++);
    });

});

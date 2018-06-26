/**
 * Created by susie on 2018/6/15 0015.
 */
$(function(){
	$('.wp-inner').fullpage({
		page: '.page',
		resize: false,
		change: function (index) {
			var pageTotal = ($('.page').length)*1-1;
			if (index.cur == pageTotal) {
				$('.start').hide();
			}else {
				$('.start').show();
			}
		}
	});
	
	var x = document.getElementById("isOwener");
	x.selectedIndex = -1;
});

function telChange () {
	var tel = $('.tel-num').val();
	tel = tel.replace(/(^\s*)|(\s*$)/g, '');
	var regs = /^1[3|4|5|7|8]\d{9}$/;
	if (regs.test(tel)) return true;
	if (!regs.test(tel) || tel === '') return false
}

var isValue = false;
var isShow = false;

function checkIsRequest(obj,error,errorObj){
	if ($(obj).val() == ''){
		isValue = false;
		isShow = false;
		$(errorObj).show();
		$(errorObj).text(error);
		setTimeout(function () {
			$(errorObj).hide();
		},2000);
	} else{
		isValue = true;
		isShow = true
	}
}

function num() {
	var num = $('.quantity').val();
	var reg = /^[0-9]+$/;
	if(!reg.test(num)){
		$('.quantity-tip').show();
		$('.quantity-tip').text('请填写到1~999的数字');
		setTimeout(function () {
			$('.quantity-tip').hide();
		},2000);
		return false
	}else {
		return true
	}
}

function isEmoji(s) {
	return /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g.test(s)
}
$('.submit').on('click',function () {
	var quantity = $('.quantity').val();
	var owenr = $('.is-owener').val();
	var telFlag = telChange();
	if(telFlag){
		var numFlag = num();
	}
	checkIsRequest('.real-name','姓名不能为空','.name-tip');
	if(!isShow){
		return
	}
	if(!telFlag){
		$('.tel-tip').show();
		$('.tel-tip').text('手机号格式不正确');
		setTimeout(function () {
			$('.tel-tip').hide();
		},2000);
		return
	}
	if(quantity == ''){
		checkIsRequest('.quantity','QQ号数量不能为空','.quantity-tip');
		return
	}
	if(owenr == '' && numFlag){
		checkIsRequest('.is-owener','请填写是否为群主','.own-tip');
		return
	}
	if(isValue && isShow && telFlag && numFlag){
		if (isEmoji($('.real-name').val())){
			$('.name-tip').show();
			$('.name-tip').text('输入格式错误');
			setTimeout(function () {
				$('.name-tip').hide();
			},2000);
		}else {
			$('.submit').attr("disabled",true);
			$.ajax({
				type: 'post',
				url: '/qtrade_bond/api/temp/product_trail/apply.do',
				data: {
					name: $('.real-name').val(),
					mobile: $('.tel-num').val(),
					email: $('.email').val(),
					org_name: $('.company').val(),
					department: $('.branch').val(),
					position: $('.duties').val(),
					qq_amount: quantity,
					is_group_holder: owenr
				},
				dataType: 'json',
				success: function (data) {
					$('.submit').removeAttr("disabled");
					$('.success').show();
					if (String(data.ret) === '0' || String(data.ret) === '-1') {
						$('.success').html('提交成功');
						$('.input-item').val('');
						var x = document.getElementById("isOwener");
						x.selectedIndex = -1;
					}else if(String(data.ret) === '-2'){
						$('.success').html(data.retmsg);
					}
					setTimeout(function () {
						$('.success').hide();
					},2800);
				},
				error: function() {
					$('.submit').removeAttr("disabled");
				}
			})
		}
	}
})
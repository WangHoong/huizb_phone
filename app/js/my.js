
document.addEventListener('DOMContentLoaded', function () {
            Code.photoSwipe('a', '#ul1');
}, false);
document.addEventListener('DOMContentLoaded', function () {
        Code.photoSwipe('a', '#ul2');
}, false);

$(function () {
   /* 动画按钮 */
    $(".install-a").on('touchstart',function () {
        var btnInsValue = parseInt($('#btn-ins').val());
        if ( btnInsValue == 0 ) {
            $('.install-a').addClass('last-a');
            $('.install-b').addClass('last-b');
            $('#btn-ins').val(1);
        } else {
            $('.install-a').removeClass('last-a');
            $('.install-b').removeClass('last-b');
            $('#btn-ins').val(0);
        }
    });

	/* 图片滚动 */

	var bullets = document.getElementById('position').getElementsByTagName('li');
    var banner = Swipe(document.getElementById('mySwipe'), {
        auto: 4000,
        continuous: true,
        disableScroll:false,
        callback: function(pos) {
            var i = bullets.length;

            while (i--) {
                bullets[i].className = ' ';
            }
            bullets[pos].className = 'cur';
        }
    });
 
	/* 点击照相机出现下拉框 */
    $("#camera").on('click',function () {
        $(".popup").slideToggle('slow');
    });
    $(".cancal").on('click',function () {
        $(".popup").slideToggle('slow');
    });


    /* 点击详情 */
    $(".detail").on('touchstart',function () {
        $(".twopk-content").slideToggle('slow');
    });
    $(".twopk-clarity").on('touchstart',function () {
        $(".twopk-content").slideToggle('slow');

    });

    /* 点击抢单 */
    $(".qdan").on('click',function () {
        $('.bosom').show(200);
    });
    $("#quxiao").on('click',function () {
        $('.bosom').hide(200);
    });

});

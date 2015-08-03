$(document).ready(function() {
    'use strict';

    var rotateDegree = 0;

    function setSizes() {
        $('.row, footer').css({height: window.innerHeight});
        $('#content').css({top: window.innerHeight});
        $('footer').css({marginBottom: window.innerHeight});
    }

    // window resize

    $(window).on('debouncedresize',function() {
        setSizes();
    });

    // mousewheel

    $('body').on('mousewheel', function(event) {
        if(event.deltaY < 0 && $(window).scrollTop() + window.innerHeight === $(document).height()){
            $(window).scrollTop(0);
            rotateDegree -= 360;
            $('.logo').css({transform: 'perspective(1000px) rotateX('+rotateDegree+'deg)'});
            //$('#audio-flip')[0].play();
        } else if(event.deltaY > 0 && $(window).scrollTop() === 0){
            $(window).scrollTop($(document).height() - window.innerHeight);
            rotateDegree += 360;
            $('.logo').css({transform: 'perspective(1000px) rotateX('+rotateDegree+'deg)'});
            //$('#audio-flip')[0].play();
        }
    });

    // init

    setSizes();

});
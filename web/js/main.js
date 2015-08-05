$(document).ready(function() {
    'use strict';

    var rotateDegree = 0;

    // set sizes

    function setSizes() {
        $('#home, footer').css({height: window.innerHeight});
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
            randomLanguage = contentTranslate[Math.floor((Math.random() * contentTranslate.length))];
            $(window).scrollTop(0);
            rotateDegree -= 360;
            $('.logo').css({transform: 'perspective(1000px) rotateX('+rotateDegree+'deg)'});
            $('.logo a').text(randomLanguage[1]);
            setTimeout(function(){
                $('.description').html(randomLanguage[2]).css({transform: 'perspective(1000px) rotateX('+rotateDegree+'deg)'});
            },200);
        } else if(event.deltaY > 0 && $(window).scrollTop() === 0){
            randomLanguage = contentTranslate[Math.floor((Math.random() * contentTranslate.length))];
            $(window).scrollTop($(document).height() - window.innerHeight);
            rotateDegree += 360;
            $('.logo').css({transform: 'perspective(1000px) rotateX('+rotateDegree+'deg)'});
            $('.logo a').text(randomLanguage[1]);
            setTimeout(function(){
                $('.description').html(randomLanguage[2]).css({transform: 'perspective(1000px) rotateX('+rotateDegree+'deg)'});
            },200);
        }
    });

    // glitch

    $('body').on('click', function() {
        var glitchID = Math.floor((Math.random() * 255) + 1);
        $('#glitch source').remove();
        $('#glitch')[0].src = 'mp3/GL1-'+ glitchID +'.mp3';
        $('#glitch')[0].play();
    });

    // init

    setSizes();

});
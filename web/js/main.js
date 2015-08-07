$(document).ready(function() {
    'use strict';

    var rotateDegree = 0;

    // set sizes

    function setSizes() {
        $('#home, footer').css({height: window.innerHeight});
        $('#content').css({top: window.innerHeight});
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
        var glitchID = Math.floor((Math.random() * 72) + 1);
        var filename = glitchID.toString();
        for (var i = 2 - glitchID.toString().length; i >= 0; i--) {
            filename = '0' + filename;
        }
        $('#container').addClass('glitch');
        setTimeout(function(){
            $('#container').removeClass('glitch');
        },150);
        $('#glitch source').remove();
        $('#glitch')[0].src = 'mp3/glitch-'+ filename +'.mp3';
        $('#glitch')[0].play();
    });

    // init

    setSizes();

    var getMax = function(){
        return $(document).height() - $(window).height();
    };

    var getValue = function(){
        return $(window).scrollTop();
    };

    var progressBar = $('.progress-bar'),
        max = getMax(),
        value, width;

    var getWidth = function(){
        value = getValue();
        width = (value/max) * 100;
        width = width + '%';
        return width;
    };

    var setWidth = function(){
        progressBar.css({ width: getWidth() });
    };

    $(document).on('scroll', setWidth);
    $(window).on('resize', function(){
        max = getMax();
        setWidth();
    });
});
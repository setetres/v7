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

    var getMax = function(){
        return $(document).height() - $(window).height();
    }

    var getValue = function(){
        return $(window).scrollTop();
    }

    if('max' in document.createElement('progress')){
        // Browser supports progress element
        var progressBar = $('progress');

        // Set the Max attr for the first time
        progressBar.attr({ max: getMax() });

        $(document).on('scroll', function(){
            // On scroll only Value attr needs to be calculated
            progressBar.attr({ value: getValue() });
        });

        $(window).resize(function(){
            // On resize, both Max/Value attr needs to be calculated
            progressBar.attr({ max: getMax(), value: getValue() });
        });
    }
    else {
        var progressBar = $('.progress-bar'),
            max = getMax(),
            value, width;

        var getWidth = function(){
            // Calculate width in percentage
            value = getValue();
            width = (value/max) * 100;
            width = width + '%';
            return width;
        }

        var setWidth = function(){
            progressBar.css({ width: getWidth() });
        }

        $(document).on('scroll', setWidth);
        $(window).on('resize', function(){
            // Need to reset the Max attr
            max = getMax();
            setWidth();
        });
    }
});
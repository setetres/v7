$(document).ready(function() {
    'use strict';

    var rotateDegree = 0;

    // about blank

    $('a[rel=external]').attr('target', '_blank');

    // mousewheel

    $('body').on('mousewheel', function(event) {
        if (event.deltaY < 0 && $(window).scrollTop() + window.innerHeight === $(document).height()) {
            randomLanguage = contentTranslate[Math.floor((Math.random() * contentTranslate.length))];
            $(window).scrollTop(0);
            rotateDegree -= 360;
            $('.logo').css({transform: 'perspective(1000px) rotateX(' + rotateDegree + 'deg)'});
            $('.logo a').text(randomLanguage[2]);
            setTimeout(function() {
                $('.description').html(randomLanguage[3]).css({transform: 'perspective(1000px) rotateX(' + rotateDegree + 'deg)'});
            }, 200);
        } else if (event.deltaY > 0 && $(window).scrollTop() === 0) {
            randomLanguage = contentTranslate[Math.floor((Math.random() * contentTranslate.length))];
            $(window).scrollTop($(document).height() - window.innerHeight);
            rotateDegree += 360;
            $('.logo').css({transform: 'perspective(1000px) rotateX(' + rotateDegree + 'deg)'});
            $('.logo a').text(randomLanguage[2]);
            setTimeout(function() {
                $('.description').html(randomLanguage[3]).css({transform: 'perspective(1000px) rotateX(' + rotateDegree + 'deg)'});
            }, 200);
        }
    });

    // glitch

    function glitch() {
        var glitchID = Math.floor((Math.random() * 72) + 1);
        var filename = glitchID.toString();
        for (var i = 2 - glitchID.toString().length; i >= 0; i--) {
            filename = '0' + filename;
        }
        $('#threejs').addClass('glitch');
        setTimeout(function() {
            $('#threejs').removeClass('glitch');
        }, 150);
        $('#glitch source').remove();
        $('#glitch')[0].src = 'mp3/glitch-' + filename + '.mp3';
        $('#glitch')[0].play();
    }

    $('body').on('click', function() {
        glitch();
    });

    $('.projects a').on('mouseover', function() {
        glitch();
    });

    // set sizes

    function setSizes() {
        $('#home').css({height: window.innerHeight});
        $('#content').css({top: window.innerHeight});
        if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $('footer').css({height: window.innerHeight});
        } else {
            $('header').css({position: 'absolute'});
        }
    }
    setSizes();

    // progress bar

    var getMax = function() {
        return $(document).height() - window.innerHeight;
    };

    var getValue = function() {
        return $(window).scrollTop();
    };

    var progressBar = $('.progress-bar'),
        max = getMax(),
        value, width;

    var getWidth = function() {
        value = getValue();
        width = (value / max) * 100;
        width = width + '%';
        return width;
    };

    var setWidth = function() {
        progressBar.css({width: getWidth()});
    };

    $(document).on('scroll', setWidth);

    $(window).on('resize', function() {
        max = getMax();
        setWidth();
        setSizes();
    });

    $(window).on('load',function(){
        setTimeout(function(){
            $('#loading').removeClass('active');
        },666);
    });

    // threejs

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    }
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    var windowHalfX = screenHeight / 2;
    var windowHalfY = screenWidth / 2;
    var clock = new THREE.Clock(), margin = 0, time = 0, mouseX = 0, mouseY = 0,
        ambientLight,
        camera,
        composer,
        container,
        controls,
        renderTarget,
        current_material,
        effect,
        effectController,
        hblur,
        light,
        material,
        materials,
        numBlobs,
        pointLight,
        renderer,
        resolution,
        scene,
        effectFXAA,
        vblur;

    function onWindowResize(event) {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight - 2 * margin;
        camera.aspect = screenWidth / screenHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(screenWidth, screenHeight);
        composer.setSize(screenWidth, screenHeight);
        hblur.uniforms.h.value = 4 / screenWidth;
        vblur.uniforms.v.value = 4 / screenHeight;
        effectFXAA.uniforms.resolution.value.set(1 / screenWidth, 1 / screenHeight);
    }

    function createShaderMaterial(id, light, ambientLight) {
        var shader = THREE.ShaderToon[id];
        var u = THREE.UniformsUtils.clone(shader.uniforms);
        var vs = shader.vertexShader;
        var fs = shader.fragmentShader;
        var material = new THREE.ShaderMaterial({
            uniforms: u,
            vertexShader: vs,
            fragmentShader: fs
        });
        material.uniforms.uDirLightPos.value = light.position;
        material.uniforms.uDirLightColor.value = light.color;
        material.uniforms.uAmbientLightColor.value = ambientLight.color;
        return material;
    }

    function generateMaterials() {
        var hatchingMaterial = createShaderMaterial('hatching', light, ambientLight);
        var materials = {
            'hatching': {
                m: hatchingMaterial,
                h: 0.2,
                s: 1,
                l: 0.9
            }
        };
        return materials;
    }

    function setupGui() {
        effectController = {
            speed: 0.73,
            numBlobs: 27,
            resolution: 50,
            isolation: 73,
            hex: '0x4b538b',
            lhue: 0.04,
            lsaturation: 1.0,
            llightness: 0.5,
            lx: -1,
            ly: 1,
            lz: 1,
            postprocessing: false,
            dummy: function() {}
        };
    }

    function onDocumentMouseMove( event ) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }


    function updateCubes(object, time, numblobs) {
        object.reset();
        var i, ballx, bally, ballz, subtract, strength;
        subtract = 12;
        strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);
        for (i = 0; i < numblobs; i++) {
            ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
            bally = Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77;
            ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + 0.5;
            object.addBall(ballx, bally, ballz, strength, subtract);
        }
    }

    function render() {
        var delta = clock.getDelta();
        time += delta * effectController.speed * 0.5;
        if (effectController.resolution !== resolution) {
            resolution = effectController.resolution;
            effect.init(resolution);
        }
        if (effectController.isolation !== effect.isolation) {
            effect.isolation = effectController.isolation;
        }
        updateCubes(effect, time, effectController.numBlobs);
        if (effect.material instanceof THREE.ShaderMaterial) {
            effect.material.uniforms.uBaseColor.value.setHex(effectController.hex);
        } else {
            effect.material.color.setHex(effectController.hex);
        }
        light.position.set(effectController.lx, effectController.ly, effectController.lz);
        light.position.normalize();
        camera.position.x += ( mouseX - camera.position.x ) * 0.5;
        camera.position.y += ( - mouseY - camera.position.y ) * 0.5;
        camera.position.z += ( - mouseY - camera.position.z ) * 0.000005;
        camera.lookAt( scene.position );
        renderer.clear();
        renderer.render(scene, camera);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function init() {
        container = document.getElementById('threejs');
        camera = new THREE.PerspectiveCamera(45, screenWidth / screenHeight, 1, 10000);
        camera.position.set(-500, 500, 1500);
        scene = new THREE.Scene();
        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0.5, 0.5, 1);
        scene.add(light);
        ambientLight = new THREE.AmbientLight(0x080808);
        scene.add(ambientLight);
        materials = generateMaterials();
        current_material = 'hatching';
        resolution = 28;
        numBlobs = 10;
        effect = new THREE.MarchingCubes(resolution, materials[current_material].m, true, true);
        effect.position.set(0, 0, 0);
        effect.scale.set(700, 700, 700);
        effect.enableUvs = false;
        effect.enableColors = false;
        scene.add(effect);
        renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        renderer.setClearColor(0x15191d, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(screenWidth, screenHeight);
        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.top = margin + 'px';
        renderer.domElement.style.left = '0px';
        container.appendChild(renderer.domElement);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.noZoom = true;
        renderer.autoClear = false;
        var renderTargetParameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat,
            stencilBuffer: false
        };
        renderTarget = new THREE.WebGLRenderTarget(screenWidth, screenHeight, renderTargetParameters);
        effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
        hblur = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);
        vblur = new THREE.ShaderPass(THREE.VerticalTiltShiftShader);
        var bluriness = 8;
        hblur.uniforms.h.value = bluriness / screenWidth;
        vblur.uniforms.v.value = bluriness / screenHeight;
        hblur.uniforms.r.value = vblur.uniforms.r.value = 0.5;
        effectFXAA.uniforms.resolution.value.set(1 / screenWidth, 1 / screenHeight);
        composer = new THREE.EffectComposer(renderer, renderTarget);
        var renderModel = new THREE.RenderPass(scene, camera);
        vblur.renderToScreen = true;
        composer = new THREE.EffectComposer(renderer, renderTarget);
        composer.addPass(renderModel);
        composer.addPass(effectFXAA);
        composer.addPass(hblur);
        composer.addPass(vblur);
        setupGui();
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
    }

    init();
    animate();

});


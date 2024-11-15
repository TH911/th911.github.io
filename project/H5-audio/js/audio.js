document.addEventListener('DOMContentLoaded', function () {
    // 设置音频文件名显示宽度
    var element = document.querySelector('.audio-right');
    var maxWidth = window.getComputedStyle(element, null).width;
    document.querySelector('.audio-right p').style.maxWidth = maxWidth;

    // 可能会有多个音频，逐个初始化音频控制事件
    var audios = document.getElementsByTagName('audio');
    for (var i = 0; i < audios.length; i++) {
        initAudioEvent(i);
    }

    // 添加音频自动播放功能
    autoPlayFirstAudio();

}, false);

/**
 * 自动播放第一个音频
 */
function autoPlayFirstAudio() {
    var audio = document.getElementsByTagName('audio')[0];
    var audioPlayer = document.getElementById('audioPlayer0');

    var playAudio = function () {
        audio.play();
        audioPlayer.src = './image/pause.png';
    }

    if (navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1) {
        // 微信浏览器
        if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
            playAudio();
        } else {
            // 监听客户端抛出事件"WeixinJSBridgeReady"
            if (document.addEventListener) {
                document.addEventListener("WeixinJSBridgeReady", playAudio, false);
            } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", playAudio);
                document.attachEvent("onWeixinJSBridgeReady", playAudio);
            }
        }
    } else {
        // 非微信浏览器
        audio.addEventListener('canplaythrough', function () {
            var playPromise = audio.play();
            if (playPromise) {
                playPromise.then(() => {
                    audioPlayer.src = './image/pause.png';
                }).catch(error => {
                    // Auto-play was prevented
                    // Show paused UI.
                    console.log(error.message);

                    // 如果以上方法还是不能让音频自动播放，必须要在用户交互后触发，则只能退而求其次在用户第一次点击页面（即产生了交互）时开始播放
                    if (audio.paused) {
                        document.addEventListener("touchstart", playAudio, false);
                        document.addEventListener('mousedown', playAudio, false);
                    }
                });
            }
        });
    }
}

/**
 * 初始化音频控制事件
 * @param {number} index 索引，表示第几个音频（从0开始）
 */
function initAudioEvent(index) {
    var audio = document.getElementsByTagName('audio')[index];
    var audioPlayer = document.getElementById('audioPlayer' + index);

    // 监听音频播放时间并更新进度条
    audio.addEventListener('timeupdate', function () {
        updateProgress(audio, index);
    }, false);

    // 监听播放完成事件
    audio.addEventListener('ended', function () {
        audioEnded(index);
    }, false);

    // 点击播放/暂停图片时，控制音乐的播放与暂停
    audioPlayer.addEventListener('click', function () {
        // 改变播放/暂停图片
        if (audio.paused) {
            // 暂停其他正在播放的音频
            var audios = document.getElementsByTagName('audio');
            for (var i = 0; i < audios.length; i++) {
                if (i != index && !audios[i].paused) {
                    audios[i].pause();
                    document.getElementById('audioPlayer' + i).src = './image/play.png';
                }
            }

            // 开始播放当前点击的音频
            audio.play();
            audioPlayer.src = './image/pause.png';
        } else {
            audio.pause();
            audioPlayer.src = './image/play.png';
        }
    }, false);

    // 点击进度条跳到指定点播放
    // PS：此处不要用click，否则下面的拖动进度点事件有可能在此处触发，此时e.offsetX的值非常小，会导致进度条弹回开始处（简直不能忍！！）
    var progressBarBg = document.getElementById('progressBarBg' + index);
    progressBarBg.addEventListener('mousedown', function (event) {
        // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
        if (!audio.paused || audio.currentTime != 0) {
            var pgsWidth = parseFloat(window.getComputedStyle(progressBarBg, null).width.replace('px', ''));
            var rate = event.offsetX / pgsWidth;
            audio.currentTime = audio.duration * rate;
            updateProgress(audio, index);
        }
    }, false);

    // 拖动进度点调节进度
    dragProgressDotEvent(audio, index);
}

/**
 * 鼠标拖动进度点时可以调节进度
 * @param {*} audio
 * @param {number} index 索引，表示第几个音频（从0开始）
 */
function dragProgressDotEvent(audio, index) {
    var dot = document.getElementById('progressDot' + index);

    var position = {
        oriOffestLeft: 0, // 移动开始时进度条的点距离进度条的偏移值
        oriX: 0, // 移动开始时的x坐标
        maxLeft: 0, // 向左最大可拖动距离
        maxRight: 0 // 向右最大可拖动距离
    };
    var flag = false; // 标记是否拖动开始

    // 鼠标按下时
    dot.addEventListener('mousedown', down, false);
    dot.addEventListener('touchstart', down, false);

    // 开始拖动
    document.addEventListener('mousemove', move, false);
    document.addEventListener('touchmove', move, false);

    // 拖动结束
    document.addEventListener('mouseup', end, false);
    document.addEventListener('touchend', end, false);

    function down(event) {
        if (!audio.paused || audio.currentTime != 0) { // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
            flag = true;

            position.oriOffestLeft = dot.offsetLeft;
            position.oriX = event.touches ? event.touches[0].clientX : event.clientX; // 要同时适配mousedown和touchstart事件
            position.maxLeft = position.oriOffestLeft; // 向左最大可拖动距离
            position.maxRight = document.getElementById('progressBarBg' + index).offsetWidth - position.oriOffestLeft; // 向右最大可拖动距离

            // 禁止默认事件（避免鼠标拖拽进度点的时候选中文字）
            if (event && event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }

            // 禁止事件冒泡
            if (event && event.stopPropagation) {
                event.stopPropagation();
            } else {
                window.event.cancelBubble = true;
            }
        }
    }

    function move(event) {
        if (flag) {
            var clientX = event.touches ? event.touches[0].clientX : event.clientX; // 要同时适配mousemove和touchmove事件
            var length = clientX - position.oriX;
            if (length > position.maxRight) {
                length = position.maxRight;
            } else if (length < -position.maxLeft) {
                length = -position.maxLeft;
            }
            var progressBarBg = document.getElementById('progressBarBg' + index);
            var pgsWidth = parseFloat(window.getComputedStyle(progressBarBg, null).width.replace('px', ''));
            var rate = (position.oriOffestLeft + length) / pgsWidth;
            audio.currentTime = audio.duration * rate;
            updateProgress(audio, index);
        }
    }

    function end() {
        flag = false;
    }
}

/**
 * 更新进度条与当前播放时间
 * @param {object} audio - audio对象
 * @param {number} index 索引，表示第几个音频（从0开始）
 */
function updateProgress(audio, index) {
    var value = audio.currentTime / audio.duration;
    document.getElementById('progressBar' + index).style.width = value * 100 + '%';
    document.getElementById('progressDot' + index).style.left = value * 100 + '%';
    document.getElementById('audioCurTime' + index).innerText = transTime(audio.currentTime);
}

/**
 * 播放完成时把进度调回开始的位置
 * @param {number} index 索引，表示第几个音频（从0开始）
 */
function audioEnded(index) {
    document.getElementById('progressBar' + index).style.width = 0;
    document.getElementById('progressDot' + index).style.left = 0;
    document.getElementById('audioCurTime' + index).innerText = transTime(0);
    document.getElementById('audioPlayer' + index).src = './image/play.png';

    // 自动播放下一个音频
    var audios = document.getElementsByTagName('audio');
    var nextIndex = (index + 1) >= audios.length ? 0 : index + 1;
    audios[nextIndex].play();
    document.getElementById('audioPlayer' + nextIndex).src = './image/pause.png';
}

/**
 * 音频播放时间换算
 * @param {number} value - 音频当前播放时间，单位秒
 */
function transTime(value) {
    var time = "";
    var h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (h > 0) {
        time = formatTime(h + ":" + m + ":" + s);
    } else {
        time = formatTime(m + ":" + s);
    }

    return time;
}

/**
 * 格式化时间显示，补零对齐
 * eg：2:4  -->  02:04
 * @param {string} value - 形如 h:m:s 的字符串 
 */
function formatTime(value) {
    var time = "";
    var s = value.split(':');
    var i = 0;
    for (; i < s.length - 1; i++) {
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];
        time += ":";
    }
    time += s[i].length == 1 ? ("0" + s[i]) : s[i];

    return time;
}
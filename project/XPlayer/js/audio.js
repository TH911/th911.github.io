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

}, false);

function initAudioEvent(index) {
    var audio = document.getElementsByTagName('audio')[index];
    var audioPlayer = document.getElementById('audioPlayer' + index);

    audio.addEventListener('loadedmetadata', function() {
        // Get how long the song is
        const duration = audio.duration;
        var len=document.getElementById("audio-length-total");
        len.textContent = transTime(Math.ceil(duration));
    });

    // Update the progress bar
    audio.addEventListener('timeupdate', function () {
        updateProgress(audio, index);
    }, false);

    //Update the img
    audio.addEventListener('pause', function() {
        audioPlayer.src = './img/play.png';
    }, false);
    audio.addEventListener('play', function() {
        audioPlayer.src = './img/pause.png';
    }, false);
    
    // play/pause when click
    audioPlayer.addEventListener('click', function () {
        if (audio.paused)audio.play();
        else audio.pause();
    }, false);

    //enable keyboard control , spacebar to play and pause
    window.addEventListener('keydown', function(e) {
        if (e.key == ' ') {
            if (audio.paused)audio.play();
            else audio.pause();
        }
    }, false);

    // change the time when click the progress bar
    // PS：DON'T USE CLICK，or The drag progress point event below may trigger here, and at this point, the value of e.offsetX is very small, which can cause the progress bar to pop back to the beginning (unbearable!!)
    var progressBarBg = document.getElementById('progressBarBg' + index);
    progressBarBg.addEventListener('mousedown', function (event) {

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
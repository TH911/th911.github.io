var cvs = document.getElementById("spectrum-cvs");
var ctx = cvs.getContext("2d");
var audio = document.getElementById("audio");
let analyser = null;
let dataArray = new Uint8Array(512);

function initAudio() {
    audio.addEventListener('play', function() {
        let audctx = new AudioContext();
        let source = audctx.createMediaElementSource(audio);
        analyser = audctx.createAnalyser();
        analyser.fftSize = 512;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        draw();

        source.connect(analyser);
        analyser.connect(audctx.destination);
    });
}

function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    analyser.getByteFrequencyData(dataArray);

    const len = cvs.width / 3;
    const barWidth = 3;

    const gradient = ctx.createLinearGradient(0, 0, cvs.width, 0);
    gradient.addColorStop(0, "#00ffff");
    gradient.addColorStop(1, "#ff1493");

    for (let i = 0; i < len; i++) {
        const data = dataArray[i];
        const barHeight = data / 255 * cvs.height;
        const x = i * barWidth;
        const y = cvs.height - barHeight;

        drawRoundedRect(x, y, barWidth, barHeight, 3);

        // 设置渐变色为当前条的颜色
        ctx.fillStyle = gradient;
        ctx.fill(); // 填充矩形
    }
}

function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y); // 起点
    ctx.lineTo(x + width - radius, y); // 上边
    ctx.arcTo(x + width, y, x + width, y + height, radius); // 右上角圆角
    ctx.lineTo(x + width, y + height - radius); // 右边
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius); // 右下角圆角
    ctx.lineTo(x + radius, y + height); // 下边
    ctx.arcTo(x, y + height, x, y + height - radius, radius); // 左下角圆角
    ctx.lineTo(x, y + radius); // 左边
    ctx.arcTo(x, y, x + radius, y, radius); // 左上角圆角
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000'; // 黑色边框
    ctx.stroke(); // 绘制边框
}

initAudio();

document.getElementById("audio").addEventListener('pause', function(){
    document.getElementById("spectrum-cvs").clearRect(0, 0, cvs.width, cvs.height);
});

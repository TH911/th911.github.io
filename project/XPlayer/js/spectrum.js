var cvs = document.getElementById("spectrum-cvs");
var ctx = cvs.getContext("2d");
var audio = document.getElementById("audio");
let analyser = null;
let dataArray = new Uint8Array(512);

function initAudio() {
    let audctx = new AudioContext();
    let source = audctx.createMediaElementSource(audio);
    analyser = audctx.createAnalyser();
    analyser.fftSize = 512;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    draw();

    source.connect(analyser);
    analyser.connect(audctx.destination);
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

        ctx.fillStyle = gradient;
        ctx.fill(); 
    }
}

function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

initAudio();

document.getElementById("audio").addEventListener('pause', function(){
    ctx.clearRect(0, 0, cvs.width, cvs.height);
});

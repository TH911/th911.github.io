// 获取页面元素
const dropArea = document.getElementById('drop-area');
const output = document.getElementById('output');
const dataUrlTextArea = document.getElementById('data-url');
const downloadLink = document.getElementById('download-link');

// 阻止默认的拖拽行为
dropArea.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropArea.style.backgroundColor = '#ecf0f1';  // 改变背景色，指示可拖拽
});

dropArea.addEventListener('dragleave', function () {
    dropArea.style.backgroundColor = '';  // 恢复背景色
});

function solve(json){
    var json2 = "";
    for(var i = 0;i < json.length;i++){
        if(json[i] == '\r' || json[i] == '\n'){
            continue;
        }
        json2 = json2 + json[i];
    }
    return json2;
}

// 处理文件拖拽到页面上
dropArea.addEventListener('drop', function (event) {
    event.preventDefault();
    dropArea.style.backgroundColor = '';  // 恢复背景色

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const dataUrl = solve(e.target.result);
            dataUrlTextArea.value = dataUrl;  // 在文本框显示 Data URL
            try{
                navigator.clipboard.writeText(dataUrl);
                showToast("复制成功");
            } catch(error){
                showToast("复制失败");
            }
            output.style.display = 'block';  // 显示 Data URL 区域

            // 设置下载链接
            downloadLink.href = dataUrl;
            downloadLink.download = file.name;
            downloadLink.style.display = 'inline-block';
        };

        reader.readAsDataURL(file);  // 将文件转换为 Data URL
    }
});

// 显示提示框
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message; // 设置提示框文本内容
    toast.classList.add("show"); // 添加 show 类来显示提示框

    // 设置提示框自动消失的时间
    setTimeout(() => {
        toast.classList.remove("show"); // 移除 show 类来隐藏提示框
    }, 1500); // 3秒后消失
}

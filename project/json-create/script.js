// 获取页面元素
const dropArea = document.getElementById('drop-area');
const output = document.getElementById('output');
const jsonAreaTextArea = document.getElementById('json-area');
const downloadLink = document.getElementById('download-link');

// 阻止默认的拖拽行为
dropArea.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropArea.style.backgroundColor = '#ecf0f1';  // 改变背景色，指示可拖拽
});

dropArea.addEventListener('dragleave', function () {
    dropArea.style.backgroundColor = '';  // 恢复背景色
});

var files = [];
var out_json = [];

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

function read_tag(i){
    if(i == files.length){
        console.log(out_json);
        console.log(out_json.length);
        console.log(out_json[0]);

        var json = "{\"data\"\:\[";

        json = json + "{\"song_name\"\:\"" + out_json[0][0] + "\",\"artist\"\:\"" + out_json[0][1] + "\",\"album\"\:\"" + out_json[0][2] + "\",\"lrc_name\"\:\"" + "1" + "\"\}";

        for(var i = 1;i < files.length; i++){
            json = json + ",{\"song_name\"\:\"" + out_json[i][0] + "\",\"artist\"\:\"" + out_json[i][1] + "\",\"album\"\:\"" + out_json[i][2] + "\",\"lrc_name\"\:\"" + (i+1) + "\"\}";
        }

        json = json + "]}";

        json = solve(json);

        jsonAreaTextArea.value = json;

        try{
            navigator.clipboard.writeText(json);
            showToast("复制成功");
        } catch(error){
            showToast("复制失败");
        }

        output.style.display = 'block';  // 显示 json 区域
        return;
    }
    jsmediatags.read(files[i], {
        onSuccess: function(tag) {
            var info = [tag.tags.title || '', tag.tags.artist || '', tag.tags.album || ''];
            out_json.push(info);
            console.log("Successed on " + files[i].name);
            if(i % 10 == 0)showToast("Successed on #" + i);
            read_tag(i + 1);
        },
        onError: function(error) {
            showToast("failed on " + files[i].name);
            console.log(':(', error.type, error.info);
        }
    });
}

// 处理文件拖拽到页面上
dropArea.addEventListener('drop', function (event) {
    event.preventDefault();
    dropArea.style.backgroundColor = '';  // 恢复背景色

    files = Array.from(event.dataTransfer.files);

    if(files.length == 0)return;

    out_json = [];

    files.sort((a,b) => {
        if(a.name.length != b.name.length){
            if(a.name.length < b.name.length)return -1;
            else return 1;
        }
        return a.name.localeCompare(b.name);
    });

    read_tag(0);
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

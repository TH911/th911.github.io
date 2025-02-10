/*!
 * Clean Blog v1.0.0 (http://startbootstrap.com)
 * Copyright 2015 Start Bootstrap
 * Licensed under Apache 2.0 (https://github.com/IronSummitMedia/startbootstrap/blob/gh-pages/LICENSE)
 */

 /*!
 * Hux Blog v1.6.0 (http://startbootstrap.com)
 * Copyright 2016 @huxpro
 * Licensed under Apache 2.0 
 */

// Tooltip Init
// Unuse by Hux since V1.6: Titles now display by default so there is no need for tooltip
// $(function() {
//     $("[data-toggle='tooltip']").tooltip();
// });


// make all images responsive
/* 
 * Unuse by Hux
 * actually only Portfolio-Pages can't use it and only post-img need it.
 * so I modify the _layout/post and CSS to make post-img responsive!
 */
// $(function() {
//  $("img").addClass("img-responsive");
// });

// responsive tables
$(document).ready(function() {
    $("table").wrap("<div class='table-responsive'></div>");
    $("table").addClass("table");
});

// responsive embed videos
$(document).ready(function() {
    $('iframe[src*="youtube.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    $('iframe[src*="youtube.com"]').addClass('embed-responsive-item');
    $('iframe[src*="vimeo.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    $('iframe[src*="vimeo.com"]').addClass('embed-responsive-item');
});

// 
function isMobile(){
    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return screenWidth < screenHeight || screenWidth < 800;
}

// Navigation Scripts to Show Header on Scroll-Up
jQuery(document).ready(function($) {
    var MQL = 1170;

    //primary navigation slide-in effect
    if ($(window).width() > MQL) {
        var headerHeight = $('.navbar-custom').height(),
            bannerHeight  = $('.intro-header .container').height();     
        $(window).on('scroll', {
                previousTop: 0
            },
            function() {
                var currentTop = $(window).scrollTop(),
                    $catalog = $('.side-catalog');

                //check if user is scrolling up by mouse or keyborad
                if (currentTop < this.previousTop) {
                    //if scrolling up...
                    if (currentTop > 0 && $('.navbar-custom').hasClass('is-fixed')) {
                        $('.navbar-custom').addClass('is-visible');
                    } else {
                        $('.navbar-custom').removeClass('is-visible is-fixed');
                        if(!isMobile()){
                            document.getElementById("buttonLightDarkMode").getElementsByTagName('svg')[0].setAttribute("fill","#fff");
                        }
                    }
                } else {
                    //if scrolling down...
                    $('.navbar-custom').removeClass('is-visible');
                    if (currentTop > headerHeight && !$('.navbar-custom').hasClass('is-fixed')){
                        $('.navbar-custom').addClass('is-fixed');
                        document.getElementById("buttonLightDarkMode").getElementsByTagName('svg')[0].setAttribute("fill","#000");
                    }
                }
                this.previousTop = currentTop;


                //adjust the appearance of side-catalog
                $catalog.show()
                if (currentTop > (bannerHeight + 41)) {
                    $catalog.addClass('fixed')
                } else {
                    $catalog.removeClass('fixed')
                }
            });
    }
});

function showNotification(Title,Body,func,Icon='/favicon.ico') {
    //can't support Notification API
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return false;
    }
    if (Notification.permission === "granted") {
        var notification = new Notification(Title, {
            body: Body,
            icon: Icon
        });
        notification.onclick = func;
        return true;
    }
    // get permission
    if (Notification.permission === "default") {
        Notification.requestPermission().then(function(permission) {
            if (permission === "granted"){
                var notification = new Notification(Title, {
                    body: Body,
                    icon: Icon
                });
                notification.onclick = func;
                return true;
            }
        });
    }
}

// The button for each code blocks
var copyCodeList = [];
document.addEventListener('DOMContentLoaded', function() {
    var preList = document.getElementsByTagName('pre');
    for(var i = 2 ; i < preList.length ; i+=3){
        var code = preList[i].outerText;
        // emplace the end '\n'
        if(code.length && code[code.length-1] == '\n'){
            code = code.substring(0,code.length-1);
        }
        copyCodeList.push(code);
        var parent = preList[i-2].parentNode.parentNode;
        var button = document.getElementById("copyButton").cloneNode(3);
        button.id = '';
        button.style = '';
        button.className = 'button before';
        button.setAttribute('codeId',(i-2)/3);
        button.addEventListener("mouseenter", function(){
            this.style.backgroundColor = "#555";
            this.style.cursor = "pointer";
        });
        button.addEventListener("mouseleave", function(){
            this.style.backgroundColor = "transparent";
            this.style.cursor = "default";
        });
        button.addEventListener("click", function(){
            navigator.clipboard.writeText(copyCodeList[this.getAttribute("codeId")]);
            this.innerHTML = document.getElementById("copyButtonDone").innerHTML;
            this.className = 'button after';
            var that = this;
            setTimeout(function(){
                that.innerHTML = document.getElementById("copyButton").innerHTML;
                that.className = 'button before';
            },2500);
        });
        parent.appendChild(button);
    }
});

document.addEventListener("DOMContentLoaded", function(){
    var imgs = document.getElementsByTagName("img");
    
    for(var i = 0; i < imgs.length ; i++){
        // add alt="" to each <img> without alt.
        var img = imgs[i];
        if(navigator.language == "zh-CN"){
            img.alt = "加载图片失败,请检查网络并刷新重试,多次仍不成功请联系作者修复";
        }else {
            img.alt = "Failed to load the image, please check the network and refresh to try again. If it still fails after multiple attempts, please contact the author to fix it.";
        }
        // set the background-color for each <img>,because some img has transparent background,and this will make <img> not correct with dark mode
        img.style.background = "#fff";
    }
});
Array.from(document.getElementsByClassName("menuPrevNext")).forEach(element => {
    element.addEventListener("mouseenter", function(){
        var lightDarkMode = localStorage.getItem("lightDarkMode");
        if(lightDarkMode == "system"){
            lightDarkMode = systemLightDarkMode();
        }
        if(lightDarkMode == null){
            localStorage.setItem("lightDarkMode","light");
            lightDarkMode = "light";
        }
        if(lightDarkMode == "dark"){
            this.style.color = "#0085A1";
        }else{
            this.style.color = "#fff";
        }
    });
    element.addEventListener("mouseleave", function(){
        var lightDarkMode = localStorage.getItem("lightDarkMode");
        if(lightDarkMode == "system"){
            lightDarkMode = systemLightDarkMode();
        }
        if(lightDarkMode == null){
            localStorage.setItem("lightDarkMode","light");
            lightDarkMode = "light";
        }
        if(lightDarkMode == "dark"){
            this.style.color = "#fff";
        }else{
            this.style.color = "#404040";
        }
    });
});
Array.from(document.getElementsByClassName("post-title")).forEach(element => {
    element.addEventListener("mouseenter", function(){
        this.style.color = "#0085A1";
    });
    element.addEventListener("mouseleave", function(){
        var lightDarkMode = localStorage.getItem("lightDarkMode");
        if(lightDarkMode == "system"){
            lightDarkMode = systemLightDarkMode();
        }
        if(lightDarkMode == null){
            localStorage.setItem("lightDarkMode","light");
            lightDarkMode = "light";
        }
        if(lightDarkMode == "dark"){
            this.style.color = "#fff";
        }else{
            this.style.color = "#404040";
        }
    });
});
Array.from(document.getElementsByClassName("post-subtitle")).forEach(element => {
    element.addEventListener("mouseenter", function(){
        this.style.color = "#0085A1";
    });
    element.addEventListener("mouseleave", function(){
        var lightDarkMode = localStorage.getItem("lightDarkMode");
        if(lightDarkMode == "system"){
            lightDarkMode = systemLightDarkMode();
        }
        if(lightDarkMode == null){
            localStorage.setItem("lightDarkMode","light");
            lightDarkMode = "light";
        }
        if(lightDarkMode == "dark"){
            this.style.color = "#fff";
        }else{
            this.style.color = "#404040";
        }
    });
});
function changeLightMode(){
    localStorage.setItem("lightDarkMode","light");
    document.body.style.background = "#fff";
    document.body.style.color = "#000";
    document.getElementById("buttonLightDarkMode").title = "明亮 light";
    var svg = document.getElementById("buttonLightDarkMode").getElementsByTagName('svg')[0];
    svg.innerHTML = '<path d="M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0-7 2.39 3.42C13.65 5.15 12.84 5 12 5s-1.65.15-2.39.42zM3.34 7l4.16-.35A7.2 7.2 0 0 0 5.94 8.5c-.44.74-.69 1.5-.83 2.29zm.02 10 1.76-3.77a7.131 7.131 0 0 0 2.38 4.14zM20.65 7l-1.77 3.79a7.02 7.02 0 0 0-2.38-4.15zm-.01 10-4.14.36c.59-.51 1.12-1.14 1.54-1.86.42-.73.69-1.5.83-2.29zM12 22l-2.41-3.44c.74.27 1.55.44 2.41.44.82 0 1.63-.17 2.37-.44z"></path>';
    Array.from(document.getElementsByClassName("menuPrevNext")).forEach(element => {
        element.style.background = "";
        element.style.color = "";
    });
    Array.from(document.getElementsByClassName("post-title")).forEach(element => {
        element.style.color = "";
    });
    Array.from(document.getElementsByClassName("post-subtitle")).forEach(element => {
        element.style.color = "";
    });
    Array.from(document.getElementsByTagName('select')).forEach(element => {
        element.style.background = "#fff";
    });
}
function changeDarkMode(){
    localStorage.setItem("lightDarkMode","dark");
    document.body.style.background = "#000";
    document.body.style.color = "#fff";
    document.getElementById("buttonLightDarkMode").title = "暗黑 dark";
    var svg = document.getElementById("buttonLightDarkMode").getElementsByTagName('svg')[0];
    svg.innerHTML = '<path d="m17.75 4.09-2.53 1.94.91 3.06-2.63-1.81-2.63 1.81.91-3.06-2.53-1.94L12.44 4l1.06-3 1.06 3zm3.5 6.91-1.64 1.25.59 1.98-1.7-1.17-1.7 1.17.59-1.98L15.75 11l2.06-.05L18.5 9l.69 1.95zm-2.28 4.95c.83-.08 1.72 1.1 1.19 1.85-.32.45-.66.87-1.08 1.27C15.17 23 8.84 23 4.94 19.07c-3.91-3.9-3.91-10.24 0-14.14.4-.4.82-.76 1.27-1.08.75-.53 1.93.36 1.85 1.19-.27 2.86.69 5.83 2.89 8.02a9.96 9.96 0 0 0 8.02 2.89m-1.64 2.02a12.08 12.08 0 0 1-7.8-3.47c-2.17-2.19-3.33-5-3.49-7.82-2.81 3.14-2.7 7.96.31 10.98 3.02 3.01 7.84 3.12 10.98.31"></path>';
    Array.from(document.getElementsByClassName("menuPrevNext")).forEach(element => {
        element.style.background = "#000";
        element.style.color = "#fff";
    });
    Array.from(document.getElementsByClassName("post-title")).forEach(element => {
        element.style.color = "#fff";
    });
    Array.from(document.getElementsByClassName("post-subtitle")).forEach(element => {
        element.style.color = "#fff";
    });
    Array.from(document.getElementsByTagName('select')).forEach(element => {
        element.style.background = "#000";
    });
}
function systemLightDarkMode(){
    if(window.matchMedia('(prefers-color-scheme: dark)').matches){
        return "dark";
    } else {
        return "light";
    }
}
function changeSystemMode(){
    if(systemLightDarkMode() == "dark"){
        changeDarkMode();
    } else {
        changeLightMode();
    }
    localStorage.setItem("lightDarkMode","system");
    document.getElementById("buttonLightDarkMode").title = "跟随系统 system";
    var svg = document.getElementById("buttonLightDarkMode").getElementsByTagName('svg')[0];
    svg.innerHTML = '<path d="M24 12A12 12 0 1 0 0 12a12 12 0 0 0 24 0m-12 7.5v1.5H6.75a.75.75 0 0 0-.14.014A10.5 10.5 0 0 1 4.65 19.5zm0-1.5H3.383a10.5 10.5 0 0 1-.872-1.5H12zm-10.065-3a10.5 10.5 0 0 1-.33-1.5H12v1.5zM2.25 12q0-.765.105-1.5H12v1.5zm.435-3.25q.233-.778.576-1.5H12v1.5zm1.447-3.25q.566-.81 1.269-1.5H12v1.5zm3.206-3.25A10.455 10.455 0 0 1 12 2.25v1.5z"/>';
}
document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("buttonLightDarkMode").style.height = document.getElementById("navButtonHome").offsetHeight + 'px';

    if(isMobile()){
        document.getElementById("buttonLightDarkMode").getElementsByTagName('svg')[0].setAttribute("fill","#000");
    }
    var lightDarkMode = localStorage.getItem("lightDarkMode");
    if(lightDarkMode == null){
        localStorage.setItem("lightDarkMode","light");
        lightDarkMode = "light";
    }

    if(lightDarkMode == "system"){
        changeSystemMode();
    } else if (lightDarkMode == "dark"){
        changeDarkMode();
    }else{
        changeLightMode();
    }

    // document.getElementById("buttonLightDarkMode").style.height = document.getElementsByClassName
    document.getElementById("buttonLightDarkMode").addEventListener("click", function(){
        switch(localStorage.getItem("lightDarkMode")){
            case "light":
                changeDarkMode();
                break;
            case "dark":
                changeSystemMode();
                break;
            case "system":
                changeLightMode();
                break;
        }
    });
});

window.addEventListener('beforeprint', function(){
    document.querySelectorAll('details').forEach(details => {
        if(details.open){
            details.opened = true;
        }
        details.open = true;
    });
    document.querySelectorAll('span.katex-display').forEach(katex => {
        katex.style.fontSize = '1em';
        while(katex.scrollWidth > katex.clientWidth){
            katex.style.fontSize = `calc(${katex.style.fontSize} - 0.05em)`;
            console.log(katex.style.fontSize);
        }
    });
});

window.addEventListener('afterprint', function(){
    document.querySelectorAll('details').forEach(details => {
        if(!details.opened){
            details.open = false;
        }else{
            details.opened = false;
        }
    });
    document.querySelectorAll('span.katex-display').forEach(katex => {
        katex.style.fontSize = '';
    });
});
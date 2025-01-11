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
                    }
                } else {
                    //if scrolling down...
                    $('.navbar-custom').removeClass('is-visible');
                    if (currentTop > headerHeight && !$('.navbar-custom').hasClass('is-fixed')) $('.navbar-custom').addClass('is-fixed');
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
            console.log("copy at:" + this.getAttribute("codeId"));
            navigator.clipboard.writeText(copyCodeList[this.getAttribute("codeId")]);
            this.innerHTML = document.getElementById("copyButtonDone").innerHTML;
            this.className = 'button after';
            var that = this;
            setTimeout(function(){
                that.innerHTML = document.getElementById("copyButton").innerHTML;
                that.className = 'button before';
            },2500);
        });
        console.log(button);
        parent.appendChild(button);
    }
});
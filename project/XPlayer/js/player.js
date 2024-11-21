/*
 * Selected | a collection of songs that I love
 * v0.3.0
 * also as a showcase that shows how to sync lyric with the HTML5 audio tag
 * Wayou  Apr 5th,2014
 * view on GitHub:https://github.com/wayou/selected
 * see the live site:http://wayou.github.io/selected/
 * songs used in this project are only for educational purpose
 */

//hack IOS
function isIOS() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPhone|iPad|iPod/i.test(userAgent);
}

//the menu of fontfamily,fontsize,background-img,...
$(document).ready(function() {
    $('.menu-title').click(function() {
        $(this).siblings('.menu-content').toggleClass('show');
    });
});

function menu_color_change(that,mode){
    if(mode == 2)that.style.color = "#bbb";
    else that.style.color = "#fff";
    if(localStorage.getItem("player_mode") == that.id.substring(5))that.style.color="#fff";
}

function fontFamily_change(font){
    if(font=="songti"){
        var lyricWrapper = document.getElementById("lyricWrapper");
        lyricWrapper.style.fontFamily = "songti";
    }
}

//to change the opacity when mouse across the player
function player_opacity(){
    var player=document.getElementById("player");
    if(player.style.opacity==1)player.style.opacity=0.6;
    else player.style.opacity=1;
}

//change the playermode
function playmode_change(mode){
    var mode2=localStorage.getItem("player_mode");
    if(mode2!=null)document.getElementById("menu_" + localStorage.getItem("player_mode")).style.color = "#bbb";
    localStorage.setItem("player_mode",mode);
    document.getElementById("menu_" + mode).style.color = "#fff";
}
window.onload = function() {
    //for the color of the menu
    var mode=localStorage.getItem("player_mode");
    if(mode == null){
        localStorage.setItem("player_mode","order");
        mode="order";
    }document.getElementById("menu_"+mode).style.color = "#fff";
    new Selected().init();
};
var Selected = function() {
    this.audio = document.getElementById('audio');
    this.lyricContainer = document.getElementById('lyricContainer');
    this.playlist = document.getElementById('playlist');
    this.currentIndex = 0;
    this.lyric = null;
    this.lyricStyle = 0; //random num to specify the different class name for lyric
};
Selected.prototype = {
    constructor: Selected, //fix the prototype chain
    init: function() {
        
        //get all songs and add to the playlist
        this.initialList(this);

        var that = this,
            allSongs = this.playlist.children[0].children,
            currentSong, randomSong;

        //get the hash from the url if there's any.
        var songName = window.location.hash.substring(1);
        //then get the index of the song from all songs
        var indexOfHashSong = (function() {
            /*By TH911:XPlayer use the number to flag each songs,instead of using words,so XPlayer needn't use this.*/
            /*var index = 0;
            Array.prototype.forEach.call(allSongs, function(v, i, a) {
                if (v.children[0].getAttribute('data-name') == songName) {
                    index = i;
                    return false;
                }
            });
            return index;*/
            if(1<=songName&&songName<=allSongs.length)return songName;
            return 0;
        })();

        this.currentIndex = indexOfHashSong || Math.floor(Math.random() * allSongs.length);
        //Because the index of the first song is zero,minus 1.
        this.currentIndex=this.currentIndex-1;

        currentSong = allSongs[this.currentIndex];
        randomSong = currentSong.children[0].getAttribute('data-name');

        //set the song name to the hash of the url
        window.location.hash = window.location.hash || randomSong;


        //handle playlist
        this.playlist.addEventListener('click', function(e) {
            if (e.target.nodeName.toLowerCase() !== 'a') {
                return;
            };
            var allSongs = that.playlist.children[0].children,
                selectedIndex = Array.prototype.indexOf.call(allSongs, e.target.parentNode);
            that.currentIndex = selectedIndex;
            that.setClass(selectedIndex);
            var songName = e.target.getAttribute('data-name');
            window.location.hash = songName;
            that.play(songName);
        }, false);
        this.audio.onended = function() {
            that.ending(that);
        }
        this.audio.onerror = function(e) {
            that.lyricContainer.textContent = '歌曲加载失败 :(';
        };

        //enable keyboard control , spacebar to change the song
        window.addEventListener('keydown', function(e) {
            if(e.code == 'ArrowUp')that.playPrev(that);
            else if(e.code == 'ArrowDown')that.playNext(that);
            else if(e.code == 'ArrowLeft'){
                var Song = this.document.getElementById("audio");
                Song.currentTime-=10;
            }else if(e.code == 'ArrowRight'){
                var Song = this.document.getElementById("audio");
                Song.currentTime+=10;
            }
        }, false);

        //initialize the background setting
        document.getElementById('bg_dark').addEventListener('click', function() {
            document.getElementsByTagName('html')[0].className = 'colorBg';
       });
        document.getElementById('bg_pic').addEventListener('click', function() {
            document.getElementsByTagName('html')[0].className = 'imageBg';
        });
        //initially start from a random song
        for (var i = allSongs.length - 1; i >= 0; i--) {
            allSongs[i].className = '';
        };
        currentSong.className = 'current-song';
        this.play(randomSong);
    },
    initialList: function(ctx) {
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', './json/content.json', false);
        xhttp.onreadystatechange = function() {
            if (xhttp.status == 200 && xhttp.readyState == 4) {
                var fragment = document.createDocumentFragment(),
                    data = JSON.parse(xhttp.responseText).data,
                    ol = ctx.playlist.getElementsByTagName('ol')[0],
                    fragment = document.createDocumentFragment();

                data.forEach(function(v, i, a) {
                    var li = document.createElement('li'),
                        a = document.createElement('a');
                    a.href = 'javascript:void(0)';
                    a.dataset.name = v.lrc_name;
                    a.textContent = v.song_name + ' - ' + v.artist;
                    li.appendChild(a);
                    fragment.appendChild(li);
                });
                ol.appendChild(fragment);
            }
        };
        xhttp.send();
    },
    play: function(songName) {
        var that = this;
        this.lyricContainer.textContent = 'loading song...'
        this.audio.src = '/music/' + songName + '.mp3';

        document.getElementById("songimg").style.display="none";
        songinfo_audio.textContent = this.playlist.getElementsByTagName("li")[songName-1].textContent;
        if(isIOS())document.getElementById("audio").title = songinfo_audio.textContent;
        document.title = songinfo_audio.textContent + " | XPlayer";

        //from: https://www.zhangxinxu.com/wordpress/2023/11/js-mp3-media-tags-metadata/
        // https://zhuanlan.zhihu.com/p/66320621
        // https://www.jianshu.com/p/b10118aeec9d
        // get the information of the song(artist,album,lyric,...)by jsmediatags,insteading of use another file
        jsmediatags.read(this.audio.src, {
            onSuccess: function(tag) {
                var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                if(screenWidth<screenHeight||screenWidth<800);
                else{
                    var songinfo_name = document.getElementById('songinfo_name');
                    songinfo_name.textContent = tag.tags.title;
                    var songinfo_artist = document.getElementById('songinfo_artist');
                    songinfo_artist.textContent = "歌手: " + tag.tags.artist;
                    var songinfo_album = document.getElementById("songinfo_album");
                    songinfo_album.textContent = "专辑: " + tag.tags.album;
                    document.getElementById('cover_img').src = URL.createObjectURL(new Blob([new Uint8Array(tag.tags.picture.data).buffer]));
                    document.getElementById("songimg").style.display="block";
                    alert(1);
                    // https://stackoverflow.com/questions/44418606/how-do-i-set-a-thumbnail-when-playing-audio-in-ios-safari
                    if ('mediaSession' in navigator) {
                        alert(2);
                        navigator.mediaSession.metadata = new MediaMetadata({
                          title: songinfo_name.textContent,
                          artist: songinfo_artist.textContent,
                          album: songinfo_album.textContent,
                          artwork: [
                            { src: document.getElementById('cover_img').src, sizes: document.getElementById("songimg").style.width.split('px')[0] + 'x' + document.getElementById("songimg").style.width.split('px')[0] }
                          ]
                        });
                        // navigator.mediaSession.setActionHandler('play', that.play());
                        // navigator.mediaSession.setActionHandler('pause', );
                        // navigator.mediaSession.setActionHandler('seekbackward', function() {});
                        // navigator.mediaSession.setActionHandler('seekforward', function() {});
                        // navigator.mediaSession.setActionHandler('previoustrack', function() {});
                        // navigator.mediaSession.setActionHandler('nexttrack', function() {});
                      }
                }
            },
            onError: function(error) {
                console.log(':(', error.type, error.info);
            }
        });
        
        
        this.lyricContainer.style.top = '130px';
        //empty the lyric
        this.lyric = null;
        this.lyricStyle = Math.floor(Math.random() * 4);
        this.audio.addEventListener('canplay', function() {
            that.getLyric(that.audio.src.replace('.mp3', '.lrc'));
            this.play();
        });
        //sync the lyric
        this.audio.addEventListener("timeupdate", function(e) {
            if (!that.lyric) return;
            for (var i = 0, l = that.lyric.length; i < l; i++) {
                if (this.currentTime > that.lyric[i][0] - 0.50 /*preload the lyric by 0.50s*/ ) {
                    //single line display mode
                    // that.lyricContainer.textContent = that.lyric[i][1];
                    //scroll mode
                    var line = document.getElementById('line-' + i),
                        prevLine = document.getElementById('line-' + (i > 0 ? i - 1 : i));
                    prevLine.className = '';
                    //randomize the color of the current line of the lyric
                    line.className = 'current-line-' + that.lyricStyle;
                    that.lyricContainer.style.top = 130 - line.offsetTop + 'px';
                    //for IOS.
                    if(isIOS())document.getElementById("audio").title = line.textContent;
                };
            };
        });
    },
    getLyric: function(url) {
        var that = this,
            request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'text';
        //fix for the messy code problem for Chinese.  reference: http://xx.time8.org/php/20101218/ajax-xmlhttprequest.html
        //request['overrideMimeType'] && request.overrideMimeType("text/html;charset=gb2312");
        request.onload = function() {
            that.lyric = that.parseLyric(request.response);
            //display lyric to the page
            that.appendLyric(that.lyric);
        };
        request.onerror = request.onabort = function(e) {
            that.lyricContainer.textContent = '歌词加载失败 :(';
        }
        this.lyricContainer.textContent = 'loading lyric...';
        request.send();
    },
    parseLyric: function(text) {
        //get each line from the text
        var lines = text.split('\n'),
            //this regex mathes the time [00.12.78]
            pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
            result = [];

        // Get offset from lyrics
        var offset = this.getOffset(text);

        //exclude the description parts or empty parts of the lyric
        while (!pattern.test(lines[0])) {
            lines = lines.slice(1);
        };
        //remove the last empty item
        lines[lines.length - 1].length === 0 && lines.pop();
        //display all content on the page
        lines.forEach(function(v, i, a) {
            var time = v.match(pattern),
                value = v.replace(pattern, '');
            time.forEach(function(v1, i1, a1) {
                //convert the [min:sec] to secs format then store into result
                var t = v1.slice(1, -1).split(':');
                result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]) + parseInt(offset) / 1000, value]);
            });
        });
        //sort the result by time
        result.sort(function(a, b) {
            return a[0] - b[0];
        });
        console.log(result);
        return result;
    },
    appendLyric: function(lyric) {
        var that = this,
            lyricContainer = this.lyricContainer,
            fragment = document.createDocumentFragment();
        //clear the lyric container first
        this.lyricContainer.innerHTML = '';
        lyric.forEach(function(v, i, a) {
            var line = document.createElement('p');
            line.id = 'line-' + i;
            line.textContent = v[1];
            fragment.appendChild(line);
        });
        lyricContainer.appendChild(fragment);
    },
    ending: function(that) {
        //order,reverse,random.
        var player_mode;
        if(localStorage.getItem("player_mode")){
            player_mode=localStorage.getItem("player_mode");
        }else localStorage.setItem("player_mode","order");
        if(player_mode == "order")that.playNext(that);
        else if(player_mode == "reverse")that.playPrev(that);
        else window.location.href = "/project/XPlayer/";
    },
    playNext: function(that) {
        var allSongs = this.playlist.children[0].children,
            nextItem;
        //reaches the last song of the playlist?
        if (that.currentIndex === allSongs.length - 1) {
            //play from start
            that.currentIndex = 0;
        } else {
            //play next index
            that.currentIndex += 1;
        };
        nextItem = allSongs[that.currentIndex].children[0];
        that.setClass(that.currentIndex);
        var songName = nextItem.getAttribute('data-name');
        window.location.hash = songName;
        that.play(songName);
    },
    playPrev: function(that) {
        var allSongs = this.playlist.children[0].children,
            prevItem;
        //reaches the first song of the playlist?
        if (that.currentIndex === 0) {
            //play from end
            that.currentIndex = allSongs.length - 1;
        } else {
            //play prev index
            that.currentIndex -= 1;
        };
        prevItem = allSongs[that.currentIndex].children[0];
        that.setClass(that.currentIndex);
        var songName = prevItem.getAttribute('data-name');
        window.location.hash = songName;
        that.play(songName);
    },
    setClass: function(index) {
        var allSongs = this.playlist.children[0].children;
        for (var i = allSongs.length - 1; i >= 0; i--) {
            allSongs[i].className = '';
        };
        allSongs[index].className = 'current-song';
    },
    getOffset: function(text) {
        //Returns offset in miliseconds.
        var offset = 0;
        try {
            // Pattern matches [offset:1000]
            var offsetPattern = /\[offset:\-?\+?\d+\]/g,
                // Get only the first match.
                offset_line = text.match(offsetPattern)[0],
                // Get the second part of the offset.
                offset_str = offset_line.split(':')[1];
            // Convert it to Int.
            offset = parseInt(offset_str);
        } catch (err) {
            // alert("offset error: "+err.message);
            offset = 0;
        }return offset;
    }
};

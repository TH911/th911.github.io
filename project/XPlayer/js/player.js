/*
 * Selected | a collection of songs that I love
 * v0.3.0
 * also as a showcase that shows how to sync lyric with the HTML5 audio tag
 * Wayou  Apr 5th,2014
 * view on GitHub:https://github.com/wayou/selected
 * see the live site:http://wayou.github.io/selected/
 * songs used in this project are only for educational purpose
 */

document.addEventListener('keydown', function(event) {
    //prevent default spacebar behavior (for spacebar to control play/pause)
    if(event.key === ' ')event.preventDefault();
})

//the menu of fontfamily,fontsize,background-img,...
$(document).ready(function() {
    $('.menu-title').click(function() {
        $(this).siblings('.menu-content').toggleClass('show');
    });
});

function menu_color_change(that,mode){
    if(mode == 2)that.style.color = "#999";
    else that.style.color = "#fff";
    if(localStorage.getItem("player_mode") == that.id.substring(5))that.style.color = "#fff";
    if(localStorage.getItem("player_font") == that.id.substring(10))that.style.color = "#fff";
}

//to change the opacity when mouse across the player
function player_opacity(mode){
    var player=document.getElementById("player");
    if(mode==1)player.style.opacity=0.6;
    else player.style.opacity=1;
}

//change the playermode
function playmode_change(mode){
    var mode2=localStorage.getItem("player_mode");
    if(mode2!=null)document.getElementById("menu_" + localStorage.getItem("player_mode")).style.color = "#999";
    localStorage.setItem("player_mode",mode);
    document.getElementById("menu_" + mode).style.color = "#fff";
}

function font_change(font){
    var font2 = localStorage.getItem("player_font");
    if(font2!=null)document.getElementById("menu_font_" + font2).style.color = "#999";
    localStorage.setItem("player_font",font);
    document.getElementById("menu_font_" + font).style.color = "#fff";
    var lyricWrapper = document.getElementById("lyricWrapper");
    lyricWrapper.style.fontFamily = font;
    switch(font){
        case "fordefault":
            lyricWrapper.style.fontSize = "16px";
            break;
        case "youyuan":
            lyricWrapper.style.fontSize = "16px";
            break;
        default :
            lyricWrapper.style.fontSize = "18px";
            break;
    }
}
function hide_font(){
    var font_menu = document.getElementById("menu-font");
    if(font_menu.style.display == "none")font_menu.style.display = "block";
    else font_menu.style.display = "none";
}
function hide_playmode(){
    var playmode_menu = document.getElementById("menu-playmode");
    if(playmode_menu.style.display == "none")playmode_menu.style.display = "block";
    else playmode_menu.style.display = "none";
}

// https://stackoverflow.com/questions/44418606/how-do-i-set-a-thumbnail-when-playing-audio-in-ios-safari
function mediaSessionAPI(that,name,lyric){
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: name,
            artist: lyric,
            artwork: [
            { src: document.getElementById('cover_img').src }
            ]
        });
        navigator.mediaSession.setActionHandler("seekbackward", function () {
            var audio = document.getElementById("audio");
            audio.currentTime-=Math.min(10,audio.currentTime);
        });
        navigator.mediaSession.setActionHandler("seekforward", function () {
            var audio = document.getElementById("audio");
            audio.currentTime+=Math.min(10,audio.duration-audio.currentTime);
        });
        navigator.mediaSession.setActionHandler("previoustrack", function () {
            that.playPrev(that);
        });
        navigator.mediaSession.setActionHandler("nexttrack", function () {
            that.playNext(that);
        });
        navigator.mediaSession.setActionHandler("play", function () {
            var audio = document.getElementById("audio");
            audio.play();
        });
        navigator.mediaSession.setActionHandler("pause", function () {
            var audio = document.getElementById("audio");
            audio.pause();
        });
        return true;
    }else return false;
}

var PLAYER;
window.onload = function() {
    //for the color of the menu
    var mode = localStorage.getItem("player_mode");
    if(mode == null){
        localStorage.setItem("player_mode","order");
        mode = "order";
    }playmode_change(mode);

    //for the font of lyrics
    var font = localStorage.getItem("player_font");
    if(font == null){
        localStorage.setItem("player_font","fordefault");
        font = "fordefault";
    }font_change(font);

    PLAYER = new Selected();
    PLAYER.init();
};
var Selected = function() {
    this.audio = document.getElementById('audio');
    this.lyricContainer = document.getElementById('lyricContainer');
    this.playlist = document.getElementById('playlist');
    this.currentIndex = 0;
    this.lyric = null;
    this.lyricStyle = 0; //random num to specify the different class name for lyric
    this.audio_name = [];
    this.audio_artist = [];
    this.audio_album = [];
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

        this.currentIndex = indexOfHashSong || Math.floor(Math.random() * allSongs.length)+1;
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
            var tmp = that.currentIndex;
            that.currentIndex = selectedIndex;
            that.setClass(tmp,selectedIndex);
            var songName = e.target.getAttribute('data-name');
            window.location.hash = songName;
            that.play(songName);
        }, false);
        this.audio.onended = function() {
            that.ending(that);
        }
        this.audio.onerror = function(e) {
            that.lyricContainer.textContent = '歌曲加载失败,请检查网络或清空缓存并重试';
        };

        //when play/pause,solve the lyric's animation of color
        this.audio.addEventListener('play', function(){
            var lines = document.getElementsByClassName('current-line-' + that.lyricStyle);
            for(var i = 0; i < lines.length;i++){
                // lines[i].style.animationPlayState = "running";
            }
        });
        this.audio.addEventListener('pause', function(){
            var lines = document.getElementsByClassName('current-line-' + that.lyricStyle);
            for(var i = 0; i < lines.length;i++){
                // lines[i].style.animationPlayState = "paused";
            }
        });

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
        var that = this;
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
                    that.audio_name[v.lrc_name] = v.song_name;
                    that.audio_artist[v.lrc_name] = v.artist;
                    that.audio_album[v.lrc_name] = v.album;
                    li.appendChild(a);
                    li.id = "playlist-" + i;
                    fragment.appendChild(li);
                });
                ol.appendChild(fragment);
            }
        };
        xhttp.send();
    },
    play: function(songName) {
        
        var that = this;
        this.lyricContainer.textContent = 'loading song...';
        this.audio.src = '/music/' + songName + '.mp3';

        this.audio.play();

        //scroll to which is playing
        var playlist_ol = document.getElementById("playlist_ol");
        var now = document.getElementById("playlist-" + PLAYER.currentIndex);
        var playlist_height = playlist.style.height.split('px')[0];
        playlist_ol.scrollTop = Math.max(0,now.offsetTop - Math.floor(parseInt(playlist_height)/2));

        songinfo_audio.textContent = this.playlist.getElementsByTagName("li")[songName-1].textContent;
        document.title = songinfo_audio.textContent + " | XPlayer";

        document.getElementById("cover_img").src = "/music/" + songName + '.webp';

        document.getElementById('songinfo_name').textContent = this.audio_name[songName];
        document.getElementById('songinfo_artist').textContent = "歌手: " + this.audio_artist[songName];
        document.getElementById('songinfo_album').textContent = "专辑: " + this.audio_album[songName];


        sessionStorage.setItem("audio_name",this.audio_name[songName]);
        mediaSessionAPI(this,sessionStorage.getItem("audio_name"),' ');

        var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.lyricContainer.style.top = Math.floor((screenHeight-100)*0.4);
        //empty the lyric
        this.lyric = null;
        this.lyricStyle = Math.floor(Math.random() * 4);

        sessionStorage.setItem("flag_canplay","true");

        this.audio.addEventListener('canplay', function() {
            var flag_canplay = sessionStorage.getItem("flag_canplay");
            // console.log("flag_canplay = " + flag_canplay);
            if(flag_canplay == null || flag_canplay == "true"){
                // console.log("audio canplay.");
                sessionStorage.setItem("flag_canplay","true");
                that.getLyric(that.audio.src.replace('.mp3', '.lrc'));
                that.audio.play();
            }else sessionStorage.setItem("flag_canplay","true");
        });
        var last=-1;
        //sync the lyric
        this.audio.addEventListener("timeupdate", function(e) {
            if(!that.lyric)return;
            for (var i = 0, l = that.lyric.length; i <= l; i++) {
                // try{
                    //preload the lyric by 0.10s || end
                    if (i == l || this.currentTime <= that.lyric[i][0] - 0.10){
                        if(i > 0) i--;
                        
                        //handle which song has 2 languages
                        if(i>0){
                            if(that.lyric[i][0] == that.lyric[i-1][0])i--;
                        }

                        var line = document.getElementById('line-' + i);
                        //randomize the color of the current line of the lyric
                        line.className = 'current-line-' + that.lyricStyle;

                        if(i+1 < l){
                            if(that.lyric[i][0] != that.lyric[i+1][0]){
                                // line.style.animationDuration = that.lyric[i+1][0] - that.lyric[i][0] - 0.2 + 's';
                            }else if(i+2 < l){
                                // line.style.animationDuration = that.lyric[i+2][0] - that.lyric[i][0] - 0.2 + 's';
                            }
                            //If you want this color a line once
                            //line.style.animationDuration = "0s";
                        }
                        if(i!=last){
                            last=i;
                            document.getElementById("lyricWrapper").scrollTop = line.offsetTop;
                        }

                        //for the lyric to MediaSession
                        var lyric_for_API;
                        if(i==0||that.lyric[i-1][0]!=that.lyric[i][0])lyric_for_API = that.lyric[i][1];
                        else lyric_for_API = that.lyric[i-1][1];
                        if(lyric_for_API.length == 0)lyric_for_API = " ";

                        //sync MediaSession API
                        mediaSessionAPI(that,sessionStorage.getItem("audio_name"),lyric_for_API);

                        //del the color of which lyric after this.
                        for(var j = i+1 ; j<l ; j++){
                            var line = document.getElementById('line-' + j);
                            line.className='';
                        }break;
                    }else{
                        try{
                            var line = document.getElementById('line-' + i);
                        line.className = '';
                        }catch{
                            console.log("error on #" + i);
                        }
                    }
                // }
                // catch {
                    // break;
                // }
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
            that.lyricContainer.textContent = '歌词加载失败,请检查网络或清空缓存并重试';
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
        if(lines[lines.length - 1].length == 0)lines.pop();
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
        return result;
    },
    appendLyric: function(lyric) {
        var lyricContainer = this.lyricContainer,
            fragment = document.createDocumentFragment();
        //clear the lyric container first
        this.lyricContainer.innerHTML = '';
        var that = this;
        lyric.forEach(function(v, i, a) {
            var line_p = document.createElement('p');
            var line = document.createElement('span');
            line.id = 'line-' + i;
            line.textContent = v[1];
            line.style.backgroundClip = "text";
            // for(var j = 0;j < v[1].length;j++){
            //     var letter = document.createElement('span');
            //     letter.textContent = v[1][j];
            //     line.appendChild(letter);
            // }
            line.addEventListener("click", function(){
                sessionStorage.setItem("flag_canplay","false");
                that.audio.currentTime = v[0];
                document.getElementById("lyricWrapper").scrollTop = line.offsetTop;
                // console.log("that.audio.currentTime="+that.audio.currentTime);
            });
            line_p.appendChild(line);
            fragment.appendChild(line_p);
        });
        lyricContainer.appendChild(fragment);
    },
    ending: function(that) {
        //order,reverse,random,loop.
        var player_mode = "order";
        if(localStorage.getItem("player_mode")!=null)player_mode=localStorage.getItem("player_mode");
        else localStorage.setItem("player_mode",player_mode);
        switch(player_mode){
            case "order":
                that.playNext(that);
                break;
            case "reverse":
                that.playPrev(that);
                break;
            case "random":
                that.playRandom(that);
                break;
            case "loop":
                that.playAgain(that);
                break;
        }
    },
    all_played: function(that){
        var allSongs = that.playlist.children[0].children;
        for(var i = 0 ; i<allSongs.length ; i++ ){
            if(allSongs[i].className != 'current-song-played' && allSongs[i].className != 'current-song'){
                return false;
            }
        }
        return true;
    },
    playNum: function(that,index){
        var allSongs = this.playlist.children[0].children;
        var tmp = that.currentIndex;
        that.currentIndex = index;
        that.setClass(tmp,that.currentIndex);
        var Item = allSongs[that.currentIndex].children[0];
        var songName = Item.getAttribute('data-name');
        window.location.hash = songName;
        that.play(songName);
    },
    playRandom: function(that){
        var allSongs = this.playlist.children[0].children,
            randomItem;
        var tmp = that.currentIndex;
        var flag = that.all_played(that);
        if(flag){
            for(var i = 0 ; i < allSongs.length ; i++)allSongs[i].className = '';
        }
        do{
            that.currentIndex = Math.floor(Math.random() * this.playlist.children[0].children.length);
        } while(allSongs[that.currentIndex].className == 'current-song-played' || allSongs[that.currentIndex].className == 'current-song');
        randomItem = allSongs[that.currentIndex].children[0];
        that.setClass((flag ? -1 : tmp),that.currentIndex);
        var songName = randomItem.getAttribute('data-name');
        window.location.hash = songName;
        that.play(songName);
    },
    playAgain: function(that) {
        that.play(window.location.hash.substring(1));
    },
    playNext: function(that) {
        var allSongs = this.playlist.children[0].children,
            nextItem;
        var tmp = that.currentIndex;
        //reaches the last song of the playlist?
        if (that.currentIndex === allSongs.length - 1) {
            //play from start
            that.currentIndex = 0;
        } else {
            //play next index
            that.currentIndex += 1;
        };
        nextItem = allSongs[that.currentIndex].children[0];
        that.setClass(tmp,that.currentIndex);
        var songName = nextItem.getAttribute('data-name');
        window.location.hash = songName;
        that.play(songName);
    },
    playPrev: function(that) {
        var allSongs = this.playlist.children[0].children,
            prevItem;
        var tmp = that.currentIndex;
            //reaches the first song of the playlist?
        if (that.currentIndex === 0) {
            //play from end
            that.currentIndex = allSongs.length - 1;
        } else {
            //play prev index
            that.currentIndex -= 1;
        };
        prevItem = allSongs[that.currentIndex].children[0];
        that.setClass(tmp,that.currentIndex);
        var songName = prevItem.getAttribute('data-name');
        window.location.hash = songName;
        that.play(songName);
    },
    setClass: function(old_index,new_index) {
        var allSongs = this.playlist.children[0].children;
        if(old_index!=-1)allSongs[old_index].className = 'current-song-played';
        allSongs[new_index].className = 'current-song';
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

function rwd(flag_playlist){
        var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        // this.alert(screenWidth + 'x' + screenHeight);
        var playlist_button=document.getElementById("playlist_button");
        var songimg = document.getElementById("songimg");
        var audio_player = document.getElementById("player");
        var playlist_ol = document.getElementById("playlist_ol");
        var playlist=document.getElementById("playlist");
        var header = document.getElementById("header");
        var lyricWrapper = document.getElementById("lyricWrapper");
        lyricWrapper.style.height = (screenHeight - 130) + 'px';
        var controls = document.getElementById("controls");

        // for mobile
        if(screenWidth<screenHeight||screenWidth<800){
            //hide "controls"
            // controls.style.display = "none";
            controls.style.position = "fixed";
            controls.style.top = "0px";
            controls.style.height = "200px";
            //for br
            document.getElementById("menu_font_br").style.display = "block";

            header.style.display = "none";
            playlist_button.style.display = "block";
            // hide the cover of the song(and the info) if the width of the screen is too small
            songimg.style.display = "none";
            
            //close the playlist for default
            if(flag_playlist)playlist.style.display = "none";
            //the height of the playlist
            
            playlist.style.width = Math.floor(screenWidth*0.8)+'px';
            playlist.style.height = (screenHeight - 140) + 'px';
            playlist_ol.style.height = playlist.style.height;
            playlist.style.backgroundColor = "#1b2426";
    
            //for the player
            audio_player.style.width = Math.floor(screenWidth*0.9) +'px';
            audio_player.style.opacity = 1;
            audio_player.style.bottom = '0px';
        }else{
            controls.style.position = "relative";
            controls.style.height = "77px";
            //for br
            document.getElementById("menu_font_br").style.display = "none";

            header.style.display = "block";
            songimg.style.display = "block";
            playlist.style.display = "block";
            playlist_button.style.display = "none";
    
            playlist.style.height = (screenHeight - 80) + 'px';
            playlist.style.width = Math.floor(screenWidth*0.24) + 'px';
            playlist.style.backgroundColor = "#32323280";
            playlist_ol.style.height = playlist.style.height;
            audio_player.style.width = Math.floor(screenWidth*0.5) +'px';
            songimg.style.width = playlist.style.width;

            audio_player.style.bottom = '5px';
            audio_player.style.opacity = 0.6;

            var songinfo_name = document.getElementById("songinfo_name");
            songinfo_name.style.fontSize = Math.floor(Math.floor(screenWidth*0.24)/15) + 'px';
            var songinfo_artist = document.getElementById("songinfo_artist");
            songinfo_artist.style.fontSize = Math.floor(Math.floor(screenWidth*0.24)/20) + 'px';
            var songinfo_album = document.getElementById("songinfo_album");
            songinfo_album.style.fontSize = Math.floor(Math.floor(screenWidth*0.24)/20) + 'px';

            songimg.style.top = Math.floor((screenHeight - Math.floor(screenWidth*0.24) - Math.floor(Math.floor(screenWidth*0.24)/15) - Math.floor(Math.floor(screenWidth*0.24)/20) - Math.floor(Math.floor(screenWidth*0.24)/20))/2) + 'px';
        }
}
rwd(true);
window.addEventListener('resize', function(){
    rwd(true);
});
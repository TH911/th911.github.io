var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
if(screenWidth<=1000){
    // hide the cover of the song(and the info) if the width of the screen is too small
    var cover_img=document.getElementById("cover_img");
    cover_img.style.display="none";
    var info_name = document.getElementById("songinfo_name");
    info_name.style.display="none";
    var info_artist = document.getElementById("songinfo_artist");
    info_artist.style.display="none";
    
    //close the playlist for default
    var playlist=document.getElementById("playlist");
    playlist.style.display="none";
    
    //for the player's width
    // var audio_player=document.getElementsByClassName("audio-wrapper");
    // audio_player.style. = screenWidth+'px';
    // alert(screenWidth+'px');
    
}else{
    var playlist_button=document.getElementById("playlist_button");
    playlist_button.style.display="none";
}
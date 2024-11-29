function playlist_hide(){
    var playlist=document.getElementById("playlist");
    var button_search = document.getElementById("button_search-container");
    if(playlist.style.display == "none"){
        playlist.style.display = "block";
        button_search.style.display = "none";
        document.getElementById("search-container").style.display = "none";
        document.getElementById("controls").style.display = "none";

        //scroll to which is playing
        var playlist_ol = document.getElementById("playlist_ol");
        var now = document.getElementById("playlist-" + PLAYER.currentIndex);
        var playlist_height = playlist.style.height.split('px')[0];
        playlist_ol.scrollTop = Math.max(0,now.offsetTop - Math.floor(parseInt(playlist_height)/2));
    }else{
        playlist.style.display = "none";
        button_search.style.display = "block";
        document.getElementById("controls").style.display = "block";
    }
}
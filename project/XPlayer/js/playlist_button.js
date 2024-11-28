function playlist_hide(){
    var playlist=document.getElementById("playlist");
    if(playlist.style.display == "none")playlist.style.display="block";
    else playlist.style.display="none";
    var button_search = document.getElementById("button_search-container");
    if(button_search.style.display == "block")button_search.style.display = "none";
    else{
        var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        if(screenWidth<screenHeight||screenWidth<800){
            button_search.style.display = "block";
        }
    }
}
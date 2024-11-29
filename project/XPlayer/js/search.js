const searchBox = document.getElementById('search-box');
const searchResults = document.getElementById('search-results');

async function loadData() {
    try {
        const response = await fetch('json/content.json');
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('failed to loading the search box of songs:', error);
    }
}

async function searchSongs(query) {
    if (!query) {
        searchResults.innerHTML = '';
        return;
    }

    const songs = await loadData();
    const queryLowerCase = query.toLowerCase();
    const filteredSongs = songs.filter(song => 
        song.song_name.toLowerCase().includes(queryLowerCase) || song.artist.toLowerCase().includes(queryLowerCase) || song.lrc_name.toLowerCase().includes(queryLowerCase)
    );

    searchResults.innerHTML = filteredSongs.map(song => 
        `<li id='search-songs-${song.lrc_name}'>
            <strong>${song.song_name}</strong> - ${song.artist}
        </li>`
    ).join('');
}


searchBox.addEventListener('input', (event) => {
    const query = event.target.value;
    searchSongs(query);
});


searchResults.addEventListener('click', (event) => {
    const clickedItem = event.target;
    if (clickedItem.tagName.toLowerCase() === 'li') {
        document.getElementById("search-box").value = "";
        document.getElementById("search-results").innerHTML = "";
        search_hide();
        PLAYER.playNum(PLAYER,parseInt(clickedItem.id.substring(13))-1);
    }
});

function search_hide(){
    var search_container = document.getElementById("search-container");
    if(search_container.style.display == "none"){
        search_container.style.display = "block";
        document.getElementById("controls").style.display = "none";
    }else{
        search_container.style.display = "none";
        document.getElementById("controls").style.display = "block";
    }
}
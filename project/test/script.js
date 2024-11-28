// 获取 DOM 元素
const searchBox = document.getElementById('search-box');
const searchResults = document.getElementById('search-results');

// 加载 JSON 数据（模拟异步加载）
async function loadData() {
    try {
        const response = await fetch('./content.json');
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('加载数据失败:', error);
    }
}

// 搜索功能
async function searchSongs(query) {
    if (!query) {
        searchResults.innerHTML = '';  // 清空搜索结果
        return;
    }

    const songs = await loadData();
    const filteredSongs = songs.filter(song => 
        song.song_name.includes(query) || song.artist.includes(query)
    );

    // 显示搜索结果
    searchResults.innerHTML = filteredSongs.map(song => 
        `<li>
            <strong>${song.song_name}</strong> - ${song.artist}
        </li>`
    ).join('');
}

// 监听输入框变化
searchBox.addEventListener('input', (event) => {
    const query = event.target.value;
    searchSongs(query);
});

// 监听点击事件，点击某个搜索结果后，可以做相应操作
searchResults.addEventListener('click', (event) => {
    const clickedItem = event.target;
    if (clickedItem.tagName.toLowerCase() === 'li') {
        const songName = clickedItem.querySelector('strong').textContent;
        alert(`你选择的歌曲是：${songName}`);
    }
});

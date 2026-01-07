const Songs = [
  {
    id: 1,
    name: "APT.",
    artist: "ROSE & Bruno Mars",
    img: "image/pop/APT.webp",
    genre: "pop",
    source: "music/pop/ROSÉ & Bruno Mars - APT. (Official Music Video).mp3",
  },
  {
    id: 2,
    name: "Espresso",
    artist: "Sabrina Carpenter",
    img: "image/pop/Espresso.webp",
    genre: "pop",
    source: "music/pop/Sabrina Carpenter - Espresso.mp3",
  },
  {
    id: 3,
    name: "Timeless",
    artist: "The Weekend, Playboi Carti",
    img: "image/r&b/Timeless.webp",
    genre: "r&b",
    source:"music/r&b/The Weeknd, Playboi Carti - Timeless (Audio).mp3",
  },
  {
    id: 4,
    name: "Luther",
    artist: "Kendrick Lamar",
    img: "image/hip-hop/Luther.webp",
    genre: "hiphop",
    source:"music/hip-hop/Kendrick Lamar - luther (Official Audio).mp3",
  },
  {
    id: 5,
    name: "No Broke Boys",
    artist: "Disco Lines & Tinashe",
    img: "image/edm/NoBrokeBoys.webp",
    genre: "edm",
    source: "music/edm/Disco Lines & Tinashe - No Broke Boys (Official Audio).mp3",
  }
];


const toggleThemeBtn = document.querySelector(".toggle-btn");
const root = document.querySelector(":root");
const genreSelect = document.getElementById("Genre");
const songListContainer = document.querySelector(".song-list-container .song-list");
const prevBtn = document.querySelector(".previous-btn");
const nextBtn = document.querySelector(".next-btn");
const currentPlaylistContainer = document.querySelector(".current-playlist .song-list");
const allPlaylistsContainer = document.querySelector(".all-playlist .song-list");
const createPlaylistForm = document.querySelector(".createPlaylist-container");
const playlistNameInput = createPlaylistForm.querySelector("input");
const addToPlaylistBtn = document.querySelector(".addToPlaylist-btn");


// Playlist data
// Each playlist: { name: string, songs: [songId, ...] }
let playlists = [];
let activePlaylistIndex = null; // which playlist is "current" in right panel

let currentSongIndex = 0;          // index in currentPlaylist
let currentPlaylist = [...Songs];  // what is currently shown / used


// These return HTMLCollection → need [0] (or use querySelector)
const songImg = document.querySelector(".song-img");
const songName = document.querySelector(".song-name");
const artistName = document.querySelector(".artist-name");
const songAudio = document.querySelector(".song-audio-controller");

// -------------------------------------------------------------THEME TOGGLE
toggleThemeBtn.addEventListener("click", () => {
  toggleThemeBtn.classList.toggle("dark"); // no dot

  if (toggleThemeBtn.classList.contains("dark")) {
    toggleThemeBtn.style.cssText =
      "transform: translateX(44px); transition: all 0.5s;";
    toggleThemeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    root.style.setProperty("--light-color", "#696969ff");
    root.style.setProperty("--dark-color", "#d7d7d7ff");
    root.style.setProperty("--primary-color", "#2e373e");
    root.style.setProperty("--secondary-color", "#444544ff");
  } else {
    toggleThemeBtn.style.cssText =
      "transform: translateX(0px); transition: all 0.5s;";
    toggleThemeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    root.style.setProperty("--light-color", "#EBF4DD");
    root.style.setProperty("--dark-color", "#2e373e");
    root.style.setProperty("--primary-color", "#90AB8B");
    root.style.setProperty("--secondary-color", "#5A7863");
  }
});
//--------------------------------------------------------------render song in all-song-list
function loadSongByIndex(index) {
  const song = currentPlaylist[index];
  if (!song) return;

  songImg.innerHTML = `<img src="${song.img}" alt="${song.name}-image" />`;
  songName.textContent = song.name;
  artistName.textContent = song.artist;
  songAudio.innerHTML = `
    <audio src="${song.source}" controls autoplay></audio>
  `;
}

// RENDER SONGS
function showSongs(filteredSongs) {
  currentPlaylist = filteredSongs;   // update playlist
  songListContainer.innerHTML = "";

  filteredSongs.forEach((song, index) => {
    const songli = document.createElement("li");
    songli.className = "song";
    songli.dataset.index = index;    // store index in playlist
    songli.innerHTML = `<span>${song.name} - ${song.artist}</span>`;

    songli.addEventListener("click", () => {
      currentSongIndex = index;      // set current index
      loadSongByIndex(currentSongIndex);
    });

    songListContainer.appendChild(songli);
  });

  // Optionally load first song of new list
  if (filteredSongs.length > 0) {
    currentSongIndex = 0;
    loadSongByIndex(currentSongIndex);
  }
}

// ----------------------------------------------------next button 
nextBtn.addEventListener("click", () => {
  if (currentPlaylist.length === 0) return;
  currentSongIndex++;
  if (currentSongIndex >= currentPlaylist.length) {
    currentSongIndex = 0; // loop to first
  }
  loadSongByIndex(currentSongIndex);
});
//--------------------------------------------------------previous button
prevBtn.addEventListener("click", () => {
  if (currentPlaylist.length === 0) return;
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = currentPlaylist.length - 1; // loop to last
  }
  loadSongByIndex(currentSongIndex);
});

//------------------------------------------------------------- FILTER BY GENRE
genreSelect.addEventListener("change", (e) => {
  const selectedGenre = e.target.value.toLowerCase().trim();

  let filteredSongs;
  if (selectedGenre === "allsong") {
    filteredSongs = Songs;
  } else {
    filteredSongs = Songs.filter(
      (song) => song.genre.toLowerCase() === selectedGenre
    );
  }

  showSongs(filteredSongs);
});

showSongs(Songs);

function getCurrentSong() {
  return currentPlaylist[currentSongIndex] || null;
}

createPlaylistForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = playlistNameInput.value.trim();
  if (!name) return;

  //----------------------------------------------------- Create new empty playlist
  const newPlaylist = {
    name,
    songs: []  // store song ids
  };

  playlists.push(newPlaylist);
  playlistNameInput.value = "";

  renderAllPlaylists();
});
// --------------------------------------------------------rendering all playlist
function renderAllPlaylists() {
  allPlaylistsContainer.innerHTML = "";

  if (playlists.length === 0) {
    allPlaylistsContainer.innerHTML = "<li><span>No playlists yet</span></li>";
    return;
  }

  playlists.forEach((pl, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;
    li.innerHTML = `<span>${pl.name}</span> <i class="fa-solid fa-trash"></i>`;

    li.addEventListener("click", () => {
      activePlaylistIndex = index;
      renderCurrentPlaylist();
    });

    allPlaylistsContainer.appendChild(li);
  });
}
// ----------------------------------------------------- render current playlist
function renderCurrentPlaylist() {
  currentPlaylistContainer.innerHTML = "";

  if (activePlaylistIndex === null || !playlists[activePlaylistIndex]) {
    currentPlaylistContainer.innerHTML =
      "<li><span>Select a playlist</span></li>";
    return;
  }

  const activePlaylist = playlists[activePlaylistIndex];

  if (activePlaylist.songs.length === 0) {
    currentPlaylistContainer.innerHTML =
      "<li><span>Playlist is empty</span></li>";
    return;
  }

  activePlaylist.songs.forEach((songId) => {
    const song = Songs.find((s) => s.id === songId);
    if (!song) return;

    const li = document.createElement("li");
    li.innerHTML = `<span>${song.name} - ${song.artist}</span> <i class="fa-solid fa-trash"></i>`;
    currentPlaylistContainer.appendChild(li);
  });
}

addToPlaylistBtn.addEventListener("click", () => {
  if (activePlaylistIndex === null || !playlists[activePlaylistIndex]) {
    alert("Please select or create a playlist first.");
    return;
  }

  const song = getCurrentSong();
  if (!song) {
    alert("No song is playing right now.");
    return;
  }

  const activePlaylist = playlists[activePlaylistIndex];

  // Avoid adding duplicates
  if (!activePlaylist.songs.includes(song.id)) {
    activePlaylist.songs.push(song.id);
  }

  renderCurrentPlaylist();
});

currentPlaylistContainer.addEventListener('click', (e) => {
  if (e.target.matches('.fa-trash')) {
    e.stopPropagation();
    const li = e.target.closest('li');
    const songId = Songs.find(s => s.name === li.textContent.trim().split(' - ')[0]).id;
    const activePlaylist = playlists[activePlaylistIndex];
    activePlaylist.songs = activePlaylist.songs.filter(id => id !== songId);
    renderCurrentPlaylist();
  }
});

allPlaylistsContainer.addEventListener('click', (e) => {
  if (e.target.matches('.fa-trash')) {
    e.stopPropagation();
    const li = e.target.closest('li');
    const playlistIndex = parseInt(li.dataset.index);
    playlists.splice(playlistIndex, 1);
    if (activePlaylistIndex === playlistIndex) {
      activePlaylistIndex = null;
      renderCurrentPlaylist();
    }
    renderAllPlaylists();
  }
});
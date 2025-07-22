const musicList = [
  { title: "Song A", src: "audio/song1.mpeg", category: "pop" },
  { title: "Song B", src: "audio/song2.mpeg", category: "rock" },
  { title: "Song C", src: "audio/song3.mpeg", category: "jazz" },
  { title: "Song D", src: "audio/song4.mpeg", category: "pop" }
];

let currentIndex = 0;
const audio = new Audio();
audio.volume = 0.5;

const playlistEl = document.getElementById("playlist");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const volumeControl = document.getElementById("volume");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");

function renderPlaylist(filter = "") {
  playlistEl.innerHTML = "";
  musicList.forEach((song, index) => {
    if (
      (song.title.toLowerCase().includes(filter.toLowerCase()) ||
      filter === "") &&
      (categorySelect.value === "all" || song.category === categorySelect.value)
    ) {
      const li = document.createElement("li");
      li.textContent = song.title;
      li.onclick = () => playSong(index);
      if (index === currentIndex) li.classList.add("active");
      playlistEl.appendChild(li);
    }
  });
}

function playSong(index) {
  currentIndex = index;
  audio.src = musicList[currentIndex].src;
  audio.play();
  updatePlaylistHighlight();
  playBtn.textContent = "⏸️";
}

function updatePlaylistHighlight() {
  const items = playlistEl.querySelectorAll("li");
  items.forEach((item, i) => {
    item.classList.toggle("active", i === currentIndex);
  });
}

playBtn.onclick = () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸️";
  } else {
    audio.pause();
    playBtn.textContent = "▶️";
  }
};

prevBtn.onclick = () => {
  currentIndex = (currentIndex - 1 + musicList.length) % musicList.length;
  playSong(currentIndex);
};

nextBtn.onclick = () => {
  currentIndex = (currentIndex + 1) % musicList.length;
  playSong(currentIndex);
};

volumeControl.oninput = () => {
  audio.volume = volumeControl.value;
};

searchInput.oninput = () => renderPlaylist(searchInput.value);
categorySelect.onchange = () => renderPlaylist(searchInput.value);

audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${percent}%`;
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

audio.addEventListener("ended", () => {
  nextBtn.click();
});

renderPlaylist();

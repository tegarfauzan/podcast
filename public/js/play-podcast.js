// TABS
const audioTab = document.getElementById("audio-tab");
const audio = document.getElementById("audio");
const videoTab = document.getElementById("video-tab");
const video = document.getElementById("video");
function toggleMedia(mediaType) {
    const audioTab = document.getElementById("audio-tab");
    const audio = document.getElementById("audio");
    const videoTab = document.getElementById("video-tab");
    const video = document.getElementById("video");
    if (mediaType === "audio") {
        videoTab.classList.remove("active");
        videoTab.classList.add("nonactive");
        video.classList.add("hidden");
        audioTab.classList.remove("nonactive");
        audioTab.classList.add("active");
        audio.classList.remove("hidden");
    } else if (mediaType === "video") {
        audioTab.classList.remove("active");
        audioTab.classList.add("nonactive");
        audio.classList.add("hidden");
        videoTab.classList.add("active");
        videoTab.classList.remove("nonactive");
        video.classList.remove("hidden");
    }
}

// AUDIO CONTROLS
const audioElement = document.getElementById("audio-element");
const audioSeekBar = document.getElementById("audio-seek-bar");
const audioCurrentTime = document.getElementById("audio-current-time");
const audioTotalTime = document.getElementById("audio-total-time");
const audioPlayPause = document.getElementById("audio-play-pause");
const audioPrevious = document.getElementById("audio-previous");
const audioNext = document.getElementById("audio-next");
const audioDownload = document.getElementById("audio-download");

// PROGRESS BAR
audioElement.addEventListener("loadedmetadata", () => {
    audioSeekBar.max = Math.floor(audioElement.duration);
    const minutes = Math.floor(audioSeekBar.max / 60);
    const secs = Math.floor(audioSeekBar.max % 60);
    const formatTime = `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    audioTotalTime.textContent = formatTime;
});
audioElement.addEventListener("timeupdate", () => {
    audioSeekBar.value = Math.floor(audioElement.currentTime);
    const minutes = Math.floor(audioSeekBar.value / 60);
    const secs = Math.floor(audioSeekBar.value % 60);
    const formatTime = `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    audioCurrentTime.textContent = formatTime;
    const percentage = (audioSeekBar.value / audioSeekBar.max) * 100;
    audioSeekBar.style.background = `linear-gradient(to right, #6E8E29 ${percentage}%, rgba(110, 142, 41, 0.2) ${percentage}%)`;
});
audioSeekBar.addEventListener("input", () => {
    audioElement.currentTime = audioSeekBar.value;
});

// PLAY/PAUSE
audioPlayPause.addEventListener("click", () => {
    audioElement.paused ? audioElement.play() : audioElement.pause();
});

// MUNDUR 10 DETIK
audioPrevious.addEventListener("click", () => {
    audioElement.currentTime = Math.max(audioElement.currentTime - 10, 0); // Tidak boleh kurang dari 0
});

// MAJU 10 DETIK
audioNext.addEventListener("click", () => {
    audioElement.currentTime = Math.min(audioElement.currentTime + 10, audioElement.duration); // Tidak boleh lebih dari durasi audio
});

// DOWNLOAD
audioDownload.addEventListener("click", () => {
    const audioSrc = audioElement.src; // Ambil sumber audio dari elemen audio
    const link = document.createElement("a");
    link.href = audioSrc;
    link.download = "audio.mp3"; // Nama file yang akan diunduh
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Hapus link setelah diunduh
});


// VIDEO CONTROLS


// LOGIKA OTHER EPISODES
const toggleEpisodes = document.getElementById("toggle-episodes");
const otherEpisodes = document.getElementById("other-episodes");
toggleEpisodes.addEventListener("click", function () {
    if (otherEpisodes.classList.contains("-bottom-[336px]")) {
        otherEpisodes.classList.remove("-bottom-[336px]");
        otherEpisodes.classList.add("bottom-0");
    } else if (otherEpisodes.classList.contains("bottom-0")) {
        otherEpisodes.classList.remove("bottom-0");
        otherEpisodes.classList.add("-bottom-[336px]");
    }
});

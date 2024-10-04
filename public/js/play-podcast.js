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
const audioCurrentTime = document.getElementById("audio-current-time");
const audioTotalTime = document.getElementById("audio-total-time");
const audioProgressPlay = document.getElementById("audio-progress-play");
const audioPrevious = document.getElementById("audio-previous");
const audioPlayPause = document.getElementById("audio-play-pause");
const audioNext = document.getElementById("audio-next");


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

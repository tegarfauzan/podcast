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

// AUDIO PROGRESS BAR
audioElement.addEventListener("loadedmetadata", () => {
    audioSeekBar.max = Math.floor(audioElement.duration);
    const minutes = Math.floor(audioSeekBar.max / 60);
    const secs = Math.floor(audioSeekBar.max % 60);
    const formatTime = `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    audioTotalTime.textContent = formatTime;
});
audioElement.addEventListener("timeupdate", () => {
    audioSeekBar.value = Math.floor(audioElement.currentTime);
    const minutes = Math.floor(audioSeekBar.value / 60);
    const secs = Math.floor(audioSeekBar.value % 60);
    const formatTime = `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    audioCurrentTime.textContent = formatTime;
    const percentage = (audioSeekBar.value / audioSeekBar.max) * 100;
    audioSeekBar.style.background = `linear-gradient(to right, #6E8E29 ${percentage}%, rgba(110, 142, 41, 0.2) ${percentage}%)`;
});
audioSeekBar.addEventListener("input", () => {
    audioElement.currentTime = audioSeekBar.value;
});

// AUDIO PLAY/PAUSE
audioPlayPause.addEventListener("click", () => {
    audioElement.paused ? audioElement.play() : audioElement.pause();
});

// MUNDUR 10 DETIK
audioPrevious.addEventListener("click", () => {
    audioElement.currentTime = Math.max(audioElement.currentTime - 10, 0);
});

// AUDIO MAJU 10 DETIK
audioNext.addEventListener("click", () => {
    audioElement.currentTime = Math.min(audioElement.currentTime + 10, audioElement.duration);
});
// AUDIO DOWNLOAD
audioDownload.addEventListener("click", function () {
    const audioSrc = audioElement.src;
    const downloadLink = document.createElement("a");
    downloadLink.href = audioSrc;
    downloadLink.download = "audio.mp3";
    downloadLink.click();
});

// VIDEO CONTROLS
let player;
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: "100%",
        width: "100%",
        videoId: "Q2qVPTdywaA",
        playerVars: {
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
}

function updateTimeAndSeekBar() {
    const videoCurrentTime = document.getElementById("video-current-time");
    const videoTotalTime = document.getElementById("video-total-time");
    const videoSeekBar = document.getElementById("video-seek-bar");

    function updateSeekBarColor(percentage) {
        videoSeekBar.style.background = `linear-gradient(to right, #6E8E29 ${percentage}%, rgba(110, 142, 41, 0.2) ${percentage}%)`;
    }

    setInterval(() => {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();

        videoCurrentTime.textContent = formatTime(currentTime);
        videoTotalTime.textContent = formatTime(duration);

        const percentage = (currentTime / duration) * 100;
        videoSeekBar.value = percentage;

        updateSeekBarColor(percentage);
    }, 1000);

    videoSeekBar.addEventListener("input", (e) => {
        const duration = player.getDuration();
        const seekPercentage = e.target.value;
        const newTime = (seekPercentage / 100) * duration;
        player.seekTo(newTime);
        updateSeekBarColor(seekPercentage);
        videoCurrentTime.textContent = formatTime(newTime);
    });
}

function onPlayerReady(event) {
    const videoPlayPauseButton = document.getElementById("video-play-pause");
    const videoPreviousButton = document.getElementById("video-previous");
    const videoNextButton = document.getElementById("video-next");
    const videoSeekBar = document.getElementById("video-seek-bar");
    const fullscreenButton = document.getElementById("fullscreen");
    const videoContainer = document.getElementById("player");

    const videoTotalTime = document.getElementById("video-total-time");
    videoTotalTime.textContent = formatTime(player.getDuration());

    videoPlayPauseButton.addEventListener("click", () => {
        const playerState = player.getPlayerState();
        if (playerState === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    });

    videoPreviousButton.addEventListener("click", () => {
        const currentTime = player.getCurrentTime();
        player.seekTo(Math.max(currentTime - 10, 0));
    });

    videoNextButton.addEventListener("click", () => {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        player.seekTo(Math.min(currentTime + 10, duration));
    });

    videoSeekBar.addEventListener("input", () => {
        const seekToTime = (videoSeekBar.value / 100) * player.getDuration();
        player.seekTo(seekToTime);
    });

    fullscreenButton.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) {
                videoContainer.mozRequestFullScreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    });
    updateTimeAndSeekBar();
}

function onPlayerStateChange(event) {
    // Logic tambahan bisa ditambahkan di sini jika diperlukan
}

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

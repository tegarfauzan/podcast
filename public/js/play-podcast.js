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
    audioElement.currentTime = Math.max(audioElement.currentTime - 10, 0); // Tidak boleh kurang dari 0
});

// AUDIO MAJU 10 DETIK
audioNext.addEventListener("click", () => {
    audioElement.currentTime = Math.min(audioElement.currentTime + 10, audioElement.duration); // Tidak boleh lebih dari durasi audio
});
// AUDIO DOWNLOAD
audioDownload.addEventListener("click", function () {
    const audioSrc = audioElement.src; //src ngambil dari audio
    const downloadLink = document.createElement("a"); // Membuat elemen <a>
    downloadLink.href = audioSrc; // Mengatur link unduhan sesuai dengan source audio
    downloadLink.download = "audio.mp3"; // Nama default untuk file yang diunduh
    downloadLink.click(); // Menjalankan klik otomatis untuk memulai unduhan
});

// VIDEO CONTROLS
let player;
// Fungsi untuk memformat waktu menjadi 00:00
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Load YouTube IFrame API secara asynchronous
function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: "100%",
        width: "100%",
        videoId: "Q2qVPTdywaA", // Ganti dengan ID video YouTube yang diinginkan
        playerVars: {
            controls: 0, // Menghilangkan kontrol default
            modestbranding: 1, // Menghilangkan logo YouTube
            rel: 0, // Menghilangkan video terkait setelah video selesai
            showinfo: 0, // Menyembunyikan informasi video
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
}

// Fungsi untuk memperbarui waktu dan seek bar
function updateTimeAndSeekBar() {
    const videoCurrentTime = document.getElementById("video-current-time");
    const videoTotalTime = document.getElementById("video-total-time");
    const videoSeekBar = document.getElementById("video-seek-bar");

    // Fungsi untuk memperbarui background seek bar
    function updateSeekBarColor(percentage) {
        videoSeekBar.style.background = `linear-gradient(to right, #6E8E29 ${percentage}%, rgba(110, 142, 41, 0.2) ${percentage}%)`;
    }

    // Update waktu dan seek bar setiap detik
    setInterval(() => {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();

        // Memperbarui teks waktu
        videoCurrentTime.textContent = formatTime(currentTime);
        videoTotalTime.textContent = formatTime(duration);

        // Memperbarui seek bar
        const percentage = (currentTime / duration) * 100;
        videoSeekBar.value = percentage;

        // Perbarui warna seek bar
        updateSeekBarColor(percentage);
    }, 10); // Update setiap detik

    // Event listener untuk ketika pengguna menggeser seek bar
    videoSeekBar.addEventListener("input", (e) => {
        const duration = player.getDuration();
        const seekPercentage = e.target.value;

        // Hitung waktu berdasarkan persentase seek bar
        const newTime = (seekPercentage / 100) * duration;

        // Memperbarui waktu video sesuai dengan posisi seek bar
        player.seekTo(newTime);

        // Perbarui warna seek bar secara realtime
        updateSeekBarColor(seekPercentage);

        // Memperbarui teks waktu sesuai dengan posisi baru
        videoCurrentTime.textContent = formatTime(newTime);
    });
}

// Ketika player sudah siap
function onPlayerReady(event) {
    const videoPlayPauseButton = document.getElementById("video-play-pause");
    const videoPreviousButton = document.getElementById("video-previous");
    const videoNextButton = document.getElementById("video-next");
    const videoSeekBar = document.getElementById("video-seek-bar");

    // Set total waktu ketika video siap
    const videoTotalTime = document.getElementById("video-total-time");
    videoTotalTime.textContent = formatTime(player.getDuration());

    // Event listener untuk play/pause
    videoPlayPauseButton.addEventListener("click", () => {
        const playerState = player.getPlayerState();
        if (playerState === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    });

    // Event listener untuk previous (mundur 10 detik)
    videoPreviousButton.addEventListener("click", () => {
        const currentTime = player.getCurrentTime();
        player.seekTo(Math.max(currentTime - 10, 0));
    });

    // Event listener untuk next (maju 10 detik)
    videoNextButton.addEventListener("click", () => {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        player.seekTo(Math.min(currentTime + 10, duration));
    });

    // Event listener untuk seek bar
    videoSeekBar.addEventListener("input", () => {
        const seekToTime = (videoSeekBar.value / 100) * player.getDuration();
        player.seekTo(seekToTime);
    });

    // Mulai update waktu dan seekbar
    updateTimeAndSeekBar();
}

// State change handler (tidak digunakan di sini tapi diperlukan untuk event binding)
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
// Q2qVPTdywaA

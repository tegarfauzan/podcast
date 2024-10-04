const audioPlayer = document.getElementById("audio-player");
const currentTimeElem = document.getElementById("current-time");
const totalDurationElem = document.getElementById("total-duration");
const progressBar = document.getElementById("progress-bar");
const progressHandle = document.getElementById("progress-handle");
const playPauseButton = document.getElementById("play-pause");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const downloadButton = document.getElementById("download");
const continueButton = document.getElementById("continue");
const toggleEpisodes = document.getElementById("toggle-episodes");
const otherEpisodes = document.getElementById("other-episodes");
let repeatDisabled = false; // Untuk melacak apakah repeat dinonaktifkan atau tidak

// TABS
function toggleMedia(mediaType) {
    const audioTab = document.getElementById("audio-tab");
    const videoTab = document.getElementById("video-tab");
    const audioPlayer = document.getElementById("audio-player-container");
    const videoPlayer = document.getElementById("video-player-container");

    if (mediaType === "audio") {
        // Cek apakah elemen audio ada
        if (audioPlayer) {
            videoTab.classList.remove("active");
            videoTab.classList.add("nonactive");
            audioTab.classList.remove("nonactive");
            audioTab.classList.add("active");
            audioPlayer.classList.remove("hidden", "nonactive"); // Tampilkan audio player
            videoPlayer.classList.add("hidden", "active"); // Sembunyikan video player
        } else {
            // Jika audio player tidak ada, tetap tampilkan video player
            videoPlayer.classList.remove("hidden");
        }
    } else if (mediaType === "video") {
        audioTab.classList.remove("active");
        audioTab.classList.add("nonactive");
        videoTab.classList.remove("nonactive");
        videoTab.classList.add("active");
        // Tampilkan video player dan sembunyikan audio player
        videoPlayer.classList.remove("hidden", "nonactive");
        audioPlayer.classList.add("hidden");
    }
}

// LOGIKA PLAYER
{
    let player;
    let apiCheckInterval;
    let isDragging = false; // Menandakan apakah sedang menggeser progress

    // Fungsi untuk mengecek apakah YouTube API sudah siap
    function checkYouTubeAPIReady() {
        if (typeof YT !== "undefined" && typeof YT.Player !== "undefined") {
            // Jika API sudah siap, jalankan fungsi untuk menginisialisasi player
            clearInterval(apiCheckInterval); // Hentikan pengecekan lebih lanjut
            onYouTubeIframeAPIReady();
        } else {
            console.log("API belum siap, mencoba lagi...");
        }
    }

    // Fungsi ini dipanggil otomatis ketika API YouTube sudah siap
    function onYouTubeIframeAPIReady() {
        player = new YT.Player("video-player", {
            events: {
                onReady: onPlayerReady,
            },
        });
    }

    function onPlayerReady(event) {
        console.log("Player is ready!");

        // Memperbarui progress sesingkat mungkin
        function updateProgress() {
            updateCurrentTimeAndProgressBarAndHandle();
            requestAnimationFrame(updateProgress);
        }

        // Panggil saat player dimulai
        requestAnimationFrame(updateProgress);

        // Mengatur event listener untuk tombol play-pause
        const playPauseButton = document.getElementById("play-pause");
        playPauseButton.addEventListener("click", togglePlayPause);

        // Mengatur event listener untuk tombol fullscreen
        const fullscreenButton = document.getElementById("fullscreen");
        fullscreenButton.addEventListener("click", toggleFullscreen);

        // Mengatur event listener untuk tombol previous dan next
        const previousButton = document.getElementById("previous");
        const nextButton = document.getElementById("next");
        previousButton.addEventListener("click", function () {
            seekVideo(-10); // Mundur 10 detik
        });
        nextButton.addEventListener("click", function () {
            seekVideo(10); // Maju 10 detik
        });

        // Mengatur event listener untuk progress bar click dan drag
        const progressContainer = document.getElementById("progress-container");
        progressContainer.addEventListener("mousedown", startDragging);
        document.addEventListener("mousemove", dragging);
        document.addEventListener("mouseup", stopDragging);

        // Memperbarui total durasi video
        updateTotalDuration();

        // Menampilkan konten halaman setelah player siap
        const audioVideo = document.getElementById("audio-video");
        audioVideo.classList.remove("hidden");

        // Memperbarui waktu saat ini dan progress bar setiap detik
        setInterval(updateCurrentTimeAndProgressBarAndHandle, 1000);
    }

    function togglePlayPause() {
        if (!player || typeof player.getPlayerState !== "function") {
            console.log("Player belum siap");
            location.reload();
        }

        const playPauseButton = document.getElementById("play-pause");
        console.log("Button clicked, player state:", player.getPlayerState());
        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }
    // Fungsi untuk memundurkan atau memajukan video
    function seekVideo(seconds) {
        if (!player || typeof player.getCurrentTime !== "function") {
            console.log("Player belum siap untuk seek");
            location.reload();
        }

        const currentTime = player.getCurrentTime();
        player.seekTo(currentTime + seconds, true); // true untuk mengatur pemutaran segera
    }

    // Fungsi untuk memperbarui waktu saat ini dan progress bar
    function updateCurrentTimeAndProgressBarAndHandle() {
        if (!player || typeof player.getCurrentTime !== "function" || typeof player.getDuration !== "function") {
            console.log("Player belum siap untuk update progress");
            location.reload();
        }
        if (!isDragging) {
            // Hanya memperbarui jika tidak sedang drag
            const currentTime = player.getCurrentTime();
            const totalDuration = player.getDuration();
            const progressPercentage = (currentTime / totalDuration) * 100;

            // Memperbarui waktu saat ini
            const formattedTime = formatTime(currentTime);
            document.getElementById("current-time").innerHTML = formattedTime;

            // Memperbarui lebar progress bar
            const progressBar = document.getElementById("progress-bar");
            progressBar.style.width = progressPercentage + "%";

            // Memperbarui posisi progress handle
            const progressHandle = document.getElementById("progress-handle");
            progressHandle.style.left = progressPercentage + "%";
        }
    }

    // Fungsi untuk memperbarui total durasi video
    function updateTotalDuration() {
        if (!player || typeof player.getDuration !== "function") {
            console.log("Player belum siap untuk durasi");
            location.reload();
        }
        const totalDuration = player.getDuration();
        const formattedDuration = formatTime(totalDuration);
        document.getElementById("total-duration").innerHTML = formattedDuration;
    }

    // Fungsi untuk memformat waktu dalam menit:detik
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }

    // Fungsi untuk memulai dragging (klik dan tahan)
    function startDragging(event) {
        isDragging = true;
        seekOnDrag(event); // Panggil fungsi untuk mengubah progress saat mulai drag
    }

    // Fungsi untuk mengubah progress bar saat mouse digeser
    function dragging(event) {
        isDragging && seekOnDrag(event);
    }

    // Fungsi untuk menghentikan dragging
    function stopDragging(event) {
        isDragging && (seekOnDrag(event), (isDragging = false));
    }

    // Fungsi untuk mengubah progress berdasarkan posisi mouse saat drag
    function seekOnDrag(event) {
        const progressContainer = document.getElementById("progress-container");
        const rect = progressContainer.getBoundingClientRect();
        const clickX = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left; // Posisi X relatif terhadap progress-container
        const totalWidth = rect.width;
        const clickPercentage = Math.max(0, Math.min(clickX / totalWidth, 1)); // Batasi antara 0% hingga 100%
        const totalDuration = player.getDuration();

        // Mengatur waktu pemutaran berdasarkan persentase drag
        const newTime = totalDuration * clickPercentage;
        player.seekTo(newTime, true); // true untuk memulai pemutaran segera

        // Memperbarui posisi progress bar dan handle
        const progressBar = document.getElementById("progress-bar");
        const progressHandle = document.getElementById("progress-handle");
        progressBar.style.width = clickPercentage * 100 + "%";
        progressHandle.style.left = clickPercentage * 100 + "%";

        // Menambahkan event listeners untuk touch
        progressContainer.addEventListener("touchstart", startDragging);
        progressContainer.addEventListener("touchmove", dragging);
        progressContainer.addEventListener("touchend", stopDragging);
    }

    // Fungsi untuk mengaktifkan fullscreen
    function toggleFullscreen() {
        const videoPlayer = document.getElementById("video-player");
        switch (true) {
            case !!videoPlayer.requestFullscreen:
                videoPlayer.requestFullscreen();
                break;
            case !!videoPlayer.mozRequestFullScreen:
                // Firefox
                videoPlayer.mozRequestFullScreen();
                break;
            case !!videoPlayer.webkitRequestFullscreen:
                // Chrome, Safari and Opera
                videoPlayer.webkitRequestFullscreen();
                break;
            case !!videoPlayer.msRequestFullscreen:
                // IE/Edge
                videoPlayer.msRequestFullscreen();
                break;
            default:
                console.log("Fullscreen is not supported on this browser.");
        }
    }

    // Memulai pengecekan API setiap 1 detik
    apiCheckInterval = setInterval(checkYouTubeAPIReady, 1000);
}

// // LOGIKA OTHER EPISODES
toggleEpisodes.addEventListener("click", function () {
    if (otherEpisodes.classList.contains("-bottom-[336px]")) {
        otherEpisodes.classList.remove("-bottom-[336px]");
        otherEpisodes.classList.add("bottom-0");
    } else if (otherEpisodes.classList.contains("bottom-0")) {
        otherEpisodes.classList.remove("bottom-0");
        otherEpisodes.classList.add("-bottom-[336px]");
    }
});

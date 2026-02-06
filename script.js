// =============================================
// DOM ELEMENTS
// =============================================

const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");
const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

// =============================================
// ENVELOPE INTERACTION
// =============================================

envelope.addEventListener("click", () => {
    envelope.style.display = "none";
    letter.style.display = "flex";

    setTimeout(() => {
        document.querySelector(".letter-window").classList.add("open");
        // Show album 1 and start playing
        document.getElementById("album-player-1").style.display = "flex";
        player1.play();
    }, 50);
});

// =============================================
// NO BUTTON - MOVING LOGIC
// =============================================

// Track mouse position
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Function to move no button away from a point
function moveNoButtonAway(fromX, fromY) {
    const noBtnRect = noBtn.getBoundingClientRect();
    const btnCenterX = noBtnRect.left + noBtnRect.width / 2;
    const btnCenterY = noBtnRect.top + noBtnRect.height / 2;

    // Calculate angle away from the cursor/touch point
    const angle = Math.atan2(btnCenterY - fromY, btnCenterX - fromX);
    const distance = 200;
    
    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    noBtn.style.transition = "transform 0.3s ease";
    noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

// Desktop: Run away from cursor on hover
noBtn.addEventListener("mouseover", () => {
    moveNoButtonAway(mouseX, mouseY);
});

// Mobile: Run away when tapped (use click event which works better for repeated taps)
noBtn.addEventListener("click", (e) => {
    // Prevent the default click behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Get the touch point or mouse point
    let touchX, touchY;
    if (e.touches && e.touches.length > 0) {
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
        touchX = e.changedTouches[0].clientX;
        touchY = e.changedTouches[0].clientY;
    } else {
        touchX = e.clientX;
        touchY = e.clientY;
    }
    
    moveNoButtonAway(touchX, touchY);
});

// Also handle touchstart for immediate response
noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.touches.length > 0) {
        moveNoButtonAway(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

// =============================================
// YES BUTTON - VALENTINE RESPONSE
// =============================================

yesBtn.addEventListener("click", () => {
    title.textContent = "Yippeeee!";
    catImg.src = "kiss.gif";
    document.querySelector(".letter-window").classList.add("final");
    buttons.style.display = "none";
    finalText.style.display = "block";

    // Hide album 1 and show album 2
    document.getElementById("album-player-1").style.display = "none";
    document.getElementById("album-player-2").style.display = "flex";

    // Stop album 1 and play album 2
    player1.pause();
    player2.play();
});

// =============================================
// SONG PLAYER CLASS
// =============================================

class SongPlayer {
    constructor(playerId, pauseId, audioId, albumId, playlist) {
        this.playBtn = document.getElementById(playerId);
        this.pauseBtn = document.getElementById(pauseId);
        this.audio = document.getElementById(audioId);
        this.albumArt = document.getElementById(albumId);
        this.playlist = playlist;
        this.currentSongIndex = 0;

        this.init();
    }

    init() {
        this.playBtn.addEventListener("click", () => this.play());
        this.pauseBtn.addEventListener("click", () => this.pause());
    }

    play() {
        if (this.playlist.length === 0) {
            console.warn("No songs in playlist");
            return;
        }

        // Loop back to beginning if we've reached the end
        if (this.currentSongIndex >= this.playlist.length) {
            this.currentSongIndex = 0;
        }

        const currentSong = this.playlist[this.currentSongIndex];
        this.audio.src = currentSong.songUrl;
        this.albumArt.src = currentSong.albumArt;

        console.log("Playing:", currentSong.songUrl); // Debug log

        this.audio.load();
        this.audio.play().catch(error => {
            console.error("Audio playback error:", error);
        });
        // Auto-play next song when current one finishes
        this.audio.onended = () => {
            this.currentSongIndex++;
            if (this.currentSongIndex < this.playlist.length) {
                this.play();
            } else {
                this.currentSongIndex = 0; // Reset for next cycle
            }
        };
    }

    pause() {
        this.audio.pause();
    }
}

// =============================================
// PLAYLIST CONFIGURATION
// =============================================

// Album 1 (plays before yes) - song1.mp3 with album1.webp
const songPlaylist1 = [
    { songUrl: 'song1.mp3', albumArt: 'album1.webp' },
];

// Album 2 (plays after yes) - song2.mp3 with album2.webp
const songPlaylist2 = [
    { songUrl: 'song2.mp3', albumArt: 'album2.webp' },
];

// =============================================
// INITIALIZE SONG PLAYERS
// =============================================

const player1 = new SongPlayer("play-btn-1", "pause-btn-1", "audio-1", "album1", songPlaylist1);

const player2 = new SongPlayer("play-btn-2", "pause-btn-2", "audio-2", "album2", songPlaylist2);




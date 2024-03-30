// Have items slide in
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".slide-in");

  function slideInElements() {
    elements.forEach((element) => {
      if (
        element.getBoundingClientRect().top < window.innerHeight - 10 &&
        window.getComputedStyle(element, null).display !== "none"
      ) {
        element.classList.add("slide-in--activate");
      }
    });
  }

  window.addEventListener("scroll", slideInElements);
  slideInElements();
});

// Make the background image parallax
document.addEventListener("scroll", () => {
  let html = document.querySelector("html");

  let scrolledPercentage = window.scrollY / html.offsetHeight;

  let backgroundImage = document.getElementById("background-image");

  if (!backgroundImage) return;

  let roomToScroll = backgroundImage.offsetHeight - window.innerHeight;

  let newTop = scrolledPercentage * roomToScroll;

  backgroundImage.style.top = `-${newTop}px`;
});

// Have the navbar disappear and reappear when scrolling
let navbar = document.getElementById("navbar");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  if (lastScrollY < window.scrollY) {
    // Going down
    navbar.classList.add("navbar--hidden");
  } else {
    // Going up
    navbar.classList.remove("navbar--hidden");
  }

  lastScrollY = window.scrollY;
});

// This function is for hiding and showing content through the click of a button.
function hideShowContent(
  buttonId,
  contentId,
  showContentButtonText,
  hideContentButtonText
) {
  let button = document.getElementById(buttonId);
  let content = document.getElementById(contentId);
  let arrow = button.querySelector("i.fas");

  content.classList.toggle("hidden");
  arrow.classList.toggle("fa-angle-down");
  arrow.classList.toggle("fa-angle-up");

  if (content.classList.contains("hidden")) {
    button.innerText = `${showContentButtonText} `;
    button.appendChild(arrow);
    content.classList.remove("slide-in--activate");
  } else {
    button.innerText = `${hideContentButtonText} `;
    button.appendChild(arrow);
  }

  let buttonPosition =
    button.getBoundingClientRect().top + window.pageYOffset - 200;

  // Scroll the page to the button"s position
  window.scrollTo({
    top: buttonPosition,
    behavior: "smooth", // Optional: smooth scrolling effect
  });
}

// Music Player JS

// The wrapper for the song that is currently playing / was most recently played.
// Access info using query selector. It should have <audio>, .song-name, and .song-length as descendants.
const songNameSelector = ".song-name";
const songLengthSelector = ".song-length";
const songAudioSelector = "audio";
const songPlayPauseIconSelector = ".play";

// This is not inside the currentSongWrapper.
const albumPlayPauseIconSelector = ".album-play-pause";
const albumSeekSliderSelector = ".album-seek-slider";
const currentSongTimeSelector = ".currently-playing-song-current-time";

function getCurrentSongWrapperForAlbum(albumID) {
  let currentSongWrapper = document.getElementById(albumID).querySelector(".song.current");

  if (!currentSongWrapper) {
    const firstSongWrapper = document.getElementById(albumID).querySelector(".song-list > .song:first-child");
    setCurrentSongWrapperForAlbum(albumID, firstSongWrapper);
    updateAlbumCurrentlyPlayingInfo(albumID);
    highlightCurrentlyPlayingSong(albumID);
    currentSongWrapper = firstSongWrapper;
  }

  return currentSongWrapper;
}

function setCurrentSongWrapperForAlbum(albumID, songWrapper) {
  const oldSong = document.getElementById(albumID).querySelector(".song.current");
  if (oldSong) {
    oldSong.classList.remove("current");
  }

  songWrapper.classList.add('current');
  return songWrapper;
}

function songOnClick(event, albumID) {
  const newSongWrapper = event.currentTarget;
  const newSongAudio = newSongWrapper.querySelector(songAudioSelector);
  const currentSongAudio = getCurrentSongWrapperForAlbum(albumID)?.querySelector(songAudioSelector);

  // Set an interval of 1 second for updating the seek slider.
  const albumInfo = document.getElementById(albumID);
  if (!albumInfo.classList.contains("seek-update-running")) {
    setInterval(() => seekUpdateForAlbum(albumID), 1000);
    albumInfo.classList.add("seek-update-running");
  }

  // Same song as before
  if (newSongAudio === currentSongAudio) {
    if (newSongAudio.paused) {
      newSongAudio.play();
    } else {
      newSongAudio.pause();
    }
  }
  // New song
  else {
    dehighlightCurrentlyPlayingSong(albumID);
    currentSongAudio?.pause();
    updateCurrentlyPlayingSongPlayPauseIcon(albumID);

    setCurrentSongWrapperForAlbum(albumID, newSongWrapper);

    highlightCurrentlyPlayingSong(albumID);
    newSongAudio.play();
    updateAlbumCurrentlyPlayingInfo(albumID);
  }

  updateCurrentlyPlayingSongPlayPauseIcon(albumID);
  updateAlbumPlayPauseIcon(albumID);
}

function dehighlightCurrentlyPlayingSong(albumID) {
  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);
  const currentSongName = currentSongWrapper.querySelector(songNameSelector);
  currentSongName.classList.remove("heading-color");
  currentSongName.classList.remove("fw-bold");

  const currentSongLength =
    currentSongWrapper.querySelector(songLengthSelector);
  currentSongLength.classList.remove("heading-color");
  currentSongLength.classList.remove("fw-bold");
}

function highlightCurrentlyPlayingSong(albumID) {
  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);
  const currentSongName = currentSongWrapper.querySelector(songNameSelector);
  currentSongName.classList.add("heading-color");
  currentSongName.classList.add("fw-bold");

  const currentSongLength =
    currentSongWrapper.querySelector(songLengthSelector);
  currentSongLength.classList.add("heading-color");
  currentSongLength.classList.add("fw-bold");
}

// Song wrapper gives context to which album player is open
function updateAlbumCurrentlyPlayingInfo(albumID) {
  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);

  const albumInfo = document.getElementById(albumID);

  const currentlyPlayingSongName = albumInfo.querySelector(
    ".currently-playing-song-name"
  );
  currentlyPlayingSongName.innerText =
    currentSongWrapper.querySelector(songNameSelector).innerText;

  const currentlyPlayingSongLength = albumInfo.querySelector(
    ".currently-playing-song-length"
  );
  currentlyPlayingSongLength.innerText =
    currentSongWrapper.querySelector(songLengthSelector).innerText;
}

function updateCurrentlyPlayingSongPlayPauseIcon(albumID) {
  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);

  const currentSongAudio = currentSongWrapper.querySelector(songAudioSelector);
  const currentSongPlayPauseIcon = currentSongWrapper.querySelector(
    songPlayPauseIconSelector
  );

  // Song is paused. Show a play icon.
  if (currentSongAudio.paused) {
    currentSongPlayPauseIcon.classList.remove("fa-pause");
    currentSongPlayPauseIcon.classList.add("fa-play");
  }
  // Song is playing. Show a pause icon.
  else {
    currentSongPlayPauseIcon.classList.remove("fa-play");
    currentSongPlayPauseIcon.classList.add("fa-pause");
  }
}

function updateAlbumPlayPauseIcon(albumID) {
  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);

  const albumInfo = document.getElementById(albumID);
  const albumPlayPauseIcon = albumInfo.querySelector(
    albumPlayPauseIconSelector
  );
  const currentSongAudio = currentSongWrapper.querySelector(songAudioSelector);

  if (currentSongAudio.paused) {
    albumPlayPauseIcon.classList.remove("fa-pause");
    albumPlayPauseIcon.classList.add("fa-play");
  } else {
    albumPlayPauseIcon.classList.remove("fa-play");
    albumPlayPauseIcon.classList.add("fa-pause");
  }
}

function playCurrentSong(albumID) {
  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);

  const currentSongAudio = currentSongWrapper.querySelector(songAudioSelector);
  currentSongAudio.play();
}

function pauseCurrentSong(albumID) {
  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);

  const currentSongAudio = currentSongWrapper.querySelector(songAudioSelector);
  currentSongAudio.pause();
}

function stopAndResetCurrentSong(albumID) {
  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);

  const currentSongAudio = currentSongWrapper.querySelector(songAudioSelector);
  currentSongAudio.pause();
  currentSongAudio.currentTime = 0;
}

function albumPlayPauseOnClick(event, albumID) {
  // Toggle play/pause icon
  const playPauseIcon = event.currentTarget.querySelector("i");
  playPauseIcon.classList.toggle("fa-play");
  playPauseIcon.classList.toggle("fa-pause");

  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);

  // Set an interval of 1 second for updating the seek slider.
  const albumInfo = document.getElementById(albumID);
  if (!albumInfo.classList.contains("seek-update-running")) {
    setInterval(() => seekUpdateForAlbum(albumID), 1000);
    albumInfo.classList.add("seek-update-running");
  }

  // Play/pause the current song
  const currentSongAudio = currentSongWrapper.querySelector(songAudioSelector);

  if (currentSongAudio.paused) {
    currentSongAudio.play();
  } else {
    currentSongAudio.pause();
  }

  highlightCurrentlyPlayingSong(albumID);
  updateCurrentlyPlayingSongPlayPauseIcon(albumID);
}

function previousSongOnClick(albumID) {
  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);
  const previousSongWrapper = currentSongWrapper.previousElementSibling;
  if (!previousSongWrapper || !previousSongWrapper.classList.contains("song"))
    return;

  dehighlightCurrentlyPlayingSong(albumID);
  stopAndResetCurrentSong(albumID);
  updateCurrentlyPlayingSongPlayPauseIcon(albumID);
  setCurrentSongWrapperForAlbum(albumID, previousSongWrapper);
  highlightCurrentlyPlayingSong(albumID);
  playCurrentSong(albumID);
  updateCurrentlyPlayingSongPlayPauseIcon(albumID);
  updateAlbumCurrentlyPlayingInfo(albumID);
}

function nextSongOnClick(albumID) {
  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);
  const nextSongWrapper = currentSongWrapper.nextElementSibling;
  if (!nextSongWrapper || !nextSongWrapper.classList.contains("song")) return;

  dehighlightCurrentlyPlayingSong(albumID);
  stopAndResetCurrentSong(albumID);
  updateCurrentlyPlayingSongPlayPauseIcon(albumID);
  setCurrentSongWrapperForAlbum(albumID, nextSongWrapper);
  highlightCurrentlyPlayingSong(albumID);
  playCurrentSong(albumID);
  updateCurrentlyPlayingSongPlayPauseIcon(albumID);
  updateAlbumCurrentlyPlayingInfo(albumID);
}

function setVolumeForAlbum(event, albumID) {
  const albumInfo = document.getElementById(albumID);
  const volume = event.currentTarget.value;

  const allSongsOnAlbum = albumInfo.querySelectorAll("audio");
  allSongsOnAlbum.forEach((audio) => {
    audio.volume = volume / 100;
  });
}

var secondaryColor = "#06a68c";
var bodyColor = "#dee2e6bf";

function seekUpdateForAlbum(albumID) {
  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);

  const albumInfo = document.getElementById(albumID);

  const seekSlider = albumInfo.querySelector(albumSeekSliderSelector);
  const currentSongAudio = currentSongWrapper.querySelector(songAudioSelector);
  const currentSongTime = albumInfo.querySelector(currentSongTimeSelector);

  updateSeekSliderAndSongTime(seekSlider, currentSongAudio, currentSongTime, albumID);
}

function albumSeekSliderOnClick(event, albumID) {
  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);

  const seekSlider = event.currentTarget;
  const currentSongAudio = currentSongWrapper.querySelector(songAudioSelector);
  updateSeekSlider(event, seekSlider, currentSongAudio);
}

function singlePlayPauseOnClick(event) {
  const playPauseButton = event.currentTarget.querySelector("i");
  const singleAudio = event.currentTarget.querySelector("audio");
  if (singleAudio.paused) {
    singleAudio.play();
    playPauseButton.classList.remove("fa-play");
    playPauseButton.classList.add("fa-pause");
  }
  else {
    singleAudio.pause();
    playPauseButton.classList.remove("fa-pause");
    playPauseButton.classList.add("fa-play");
  }

  // Set an interval of 1 second for updating the seek slider.
  if (!singleAudio.classList.contains("seek-update-running")) {
    setInterval(() => {seekUpdateForSingle(playPauseButton)}, 1000);
    singleAudio.classList.add("seek-update-running");
  }
}

function setVolumeForSingle(event) {
  const volumeSlider = event.currentTarget;
  const singleMusicPlayerDiv = getSingleMusicPlayerDivFromDescendantElement(volumeSlider);
  const singleAudio = singleMusicPlayerDiv.querySelector("audio");
  singleAudio.volume = volumeSlider.value / 100;
}

function getSingleMusicPlayerDivFromDescendantElement(descendantElement) {
  while (!descendantElement.classList.contains("single-music-player")) {
    descendantElement = descendantElement.parentElement;
  }
  return descendantElement;
}

function seekUpdateForSingle(descendantElement) {
  const singleMusicPlayerDiv = getSingleMusicPlayerDivFromDescendantElement(descendantElement);
  const singleSeekSlider = singleMusicPlayerDiv.querySelector(".single-seek-slider");
  const audio = singleMusicPlayerDiv.querySelector("audio");
  const currentSongTime = singleMusicPlayerDiv.querySelector(".currently-playing-song-current-time");
  updateSeekSliderAndSongTime(singleSeekSlider, audio, currentSongTime, null);
}

function singleSeekSliderOnClick(event) {
  const seekSlider = event.currentTarget;
  const singleMusicPlayerDiv = getSingleMusicPlayerDivFromDescendantElement(seekSlider);
  const audio = singleMusicPlayerDiv.querySelector("audio");
  updateSeekSlider(event, seekSlider, audio);
}

function updateSeekSlider(event, seekSlider, audio) {
  // Update song position
  let clickPosition = event.clientX - seekSlider.getBoundingClientRect().left;
  let seekPercentage = clickPosition / seekSlider.offsetWidth;
  let newTime = seekPercentage * audio.duration;
  audio.currentTime = newTime;

  // Update background of seek slider
  seekSlider.style.background = `linear-gradient(to right, ${secondaryColor} 0%, ${secondaryColor} ${
    seekPercentage * 100
  }%, ${bodyColor} ${seekPercentage * 100}%, ${bodyColor} 100%)`;
}

function updateSeekSliderAndSongTime(seekSlider, audio, currentSongTimeElement, albumID) {
  // Check if the current track duration is a legible number
  if (isNaN(audio.duration)) return;

  let seekPosition = audio.currentTime * (100 / audio.duration);

  // Update background of seek slider
  seekSlider.style.background = `linear-gradient(to right, ${secondaryColor} 0%, ${secondaryColor} ${seekPosition}%, ${bodyColor} ${seekPosition}%, ${bodyColor} 100%)`;

  // Calculate the time left and the total duration
  let currentMinutes = Math.floor(audio.currentTime / 60);
  let currentSeconds = Math.floor(
    audio.currentTime - currentMinutes * 60
  );
  let durationMinutes = Math.floor(audio.duration / 60);
  let durationSeconds = Math.floor(
    audio.duration - durationMinutes * 60
  );

  // Add a zero to the single digit time values
  if (currentSeconds < 10) {
    currentSeconds = "0" + currentSeconds;
  }
  if (durationSeconds < 10) {
    durationSeconds = "0" + durationSeconds;
  }

  // Display the updated duration
  currentSongTimeElement.textContent = currentMinutes + ":" + currentSeconds;

  // Go to next song if the current song is over
  if (albumID && seekPosition >= 100) {
    nextSongOnClick(albumID);
  }
}

// //Create a volume slider for each music player
// document.addEventListener("DOMContentLoaded", () => {
//   //Wait 1 second for the <audio> elements to load.
//   setTimeout(setupVolumeSliders, 1000);
// });

// function setupVolumeSliders() {
//   setupVolumeSlidersForSingles();
//   setupVolumeSlidersForAlbums();
// }

// function setupVolumeSlidersForSingles() {
//   const musicPlayersInfo = document.querySelectorAll(".compact-info-bottom");

//   musicPlayersInfo.forEach((musicPlayerInfo) => {
//     let volumeSliderWrapper = createVolumeSlider();

//     let spacer = document.createElement("div");
//     spacer.classList.add("spacer");

//     musicPlayerInfo.insertBefore(spacer, musicPlayerInfo.firstChild);

//     musicPlayerInfo.insertBefore(
//       volumeSliderWrapper,
//       musicPlayerInfo.firstChild
//     );

//     let audioElement =
//       findNearsetAudioTagForSingleVolumeSlider(volumeSliderWrapper);

//     let volumeSliderInput = volumeSliderWrapper.querySelector("input");

//     volumeSliderInput.addEventListener("input", () => {
//       SetVolume(volumeSliderInput, audioElement);
//     });
//   });
// }

// function setupVolumeSlidersForAlbums() {
//   //Loop through the controls of each album player. Setup the volume slider for each.
//   let albumPlayerControlsList = document.querySelectorAll(".swp_player_bottom");

//   albumPlayerControlsList.forEach((albumPlayerControls) => {
//     setupVolumeSlidersForAlbum(albumPlayerControls);
//   });
// }

// function setupVolumeSlidersForAlbum(albumPlayerControls) {
//   let volumeSliderWrapper = createVolumeSlider();

//   albumPlayerControls.appendChild(volumeSliderWrapper);

//   let volumeSliderInput = volumeSliderWrapper.querySelector("input");

//   let audioTags = findAllAudioTagsForAlbum(albumPlayerControls);

//   volumeSliderInput.addEventListener("input", () => {
//     audioTags.forEach((audioTag) => {
//       SetVolume(volumeSliderInput, audioTag);
//     });
//   });
// }

// function createVolumeSlider() {
//   let volumeSliderWrapper = document.createElement("div");
//   volumeSliderWrapper.classList.add("volume-slider-wrapper");

//   let muteVolumeIcon = document.createElement("i");
//   muteVolumeIcon.classList.add("mute-volume-icon");
//   muteVolumeIcon.classList.add("fa");
//   muteVolumeIcon.classList.add("fa-volume-down");

//   let volumeSlider = document.createElement("input");
//   volumeSlider.classList.add("volume-slider");
//   volumeSlider.type = "range";
//   volumeSlider.min = "0";
//   volumeSlider.max = "100";
//   volumeSlider.value = "50";

//   let maxVolumeIcon = document.createElement("div");
//   maxVolumeIcon.classList.add("max-volume-icon");
//   maxVolumeIcon.classList.add("fa");
//   maxVolumeIcon.classList.add("fa-volume-up");

//   volumeSliderWrapper.appendChild(muteVolumeIcon);
//   volumeSliderWrapper.appendChild(volumeSlider);
//   volumeSliderWrapper.appendChild(maxVolumeIcon);

//   return volumeSliderWrapper;
// }

// function findNearsetAudioTagForSingleVolumeSlider(volumeSlider) {
//   let swpMusicPlayer = volumeSlider.parentElement;

//   while (!swpMusicPlayer.classList.contains("swp_music_player")) {
//     swpMusicPlayer = swpMusicPlayer.parentElement;
//   }

//   let audioElement = swpMusicPlayer.querySelector("audio");

//   //Set the default volume of the songs.
//   audioElement.volume = 0.5;

//   return audioElement;
// }

// function findAllAudioTagsForAlbum(albumPlayerControls) {
//   let swpMusicPlayer = albumPlayerControls.parentElement;

//   while (!swpMusicPlayer.classList.contains("swp_music_player")) {
//     swpMusicPlayer = swpMusicPlayer.parentElement;
//   }

//   return swpMusicPlayer.querySelectorAll(".swp_music_player_entry audio");
// }

// function SetVolume(volumeSlider, audioElement) {
//   audioElement.volume = volumeSlider.value / 100;
// }

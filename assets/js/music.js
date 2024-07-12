// Music Player JS

// The wrapper for the song that is currently playing / was most recently played.
// Access info using query selector. It should have <audio>, .song-name, and .song-length as descendants.
const albumMusicPlayerSelector = ".album-music-player";
const songNameSelector = ".song-name";
const songLengthSelector = ".song-length";
const songAudioSelector = "audio";
const songPlayPauseIconSelector = ".play";

// This is not inside the currentSongWrapper.
const albumPlayPauseIconSelector = ".album-play-pause";
const albumSeekSliderSelector = ".album-seek-slider";
const currentSongTimeSelector = ".currently-playing-song-current-time";

const singleMusicPlayerSelector = ".single-music-player";

const pauseButton = document.querySelector("#pause-button");

function showPauseButton() {
  pauseButton.classList.add("display");
}

function hidePauseButton() {
  pauseButton.classList.remove("display");
}

function pauseButtonOnClick() {
  pauseAllSongs();
  hidePauseButton();
}

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
      pauseAllSongs();
      newSongAudio.play();
      showPauseButton();
    } else {
      newSongAudio.pause();
      hidePauseButton();
    }
  }
  // New song
  else {
    dehighlightCurrentlyPlayingSong(albumID);
    pauseAllSongs();
    setCurrentSongWrapperForAlbum(albumID, newSongWrapper);
    highlightCurrentlyPlayingSong(albumID);
    newSongAudio.play();
    showPauseButton();
    updateAlbumCurrentlyPlayingInfo(albumID);
  }

  updateCurrentlyPlayingSongPlayPauseIcon(albumID);
  updateAlbumPlayPauseIcon(albumID);
}

function pauseAllSongs() {
  // Pause all albums. Update Play/Pause icon.
  const albums = document.querySelectorAll(albumMusicPlayerSelector);
  albums.forEach((album) => {
    const albumID = album.id;
    const currentSongAudio = getCurrentSongWrapperForAlbum(albumID)?.querySelector(songAudioSelector);
    currentSongAudio?.pause();
    hidePauseButton();
    updateCurrentlyPlayingSongPlayPauseIcon(albumID);
    updateAlbumPlayPauseIcon(albumID);
  })

  // Pause all singles.
  const singles = document.querySelectorAll(singleMusicPlayerSelector);
  singles.forEach((single) => {
    const playPauseButton = single.querySelector("i");
    const singleAudio = single.querySelector("audio");
    if (!singleAudio.paused) {
      singleAudio.pause();
      hidePauseButton();
      playPauseButton.classList.remove("fa-pause");
      playPauseButton.classList.add("fa-play");
    }
  });
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
  showPauseButton();
}

function pauseCurrentSong(albumID) {
  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);

  const currentSongAudio = currentSongWrapper.querySelector(songAudioSelector);
  currentSongAudio.pause();
  hidePauseButton();
}

function stopAndResetCurrentSong(albumID) {
  const currentSongWrapper = getCurrentSongWrapperForAlbum(albumID);

  const currentSongAudio = currentSongWrapper.querySelector(songAudioSelector);
  currentSongAudio.pause();
  hidePauseButton();
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
    showPauseButton();
  } else {
    currentSongAudio.pause();
    hidePauseButton();
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
    pauseAllSongs();
    singleAudio.play();
    showPauseButton();
    playPauseButton.classList.remove("fa-play");
    playPauseButton.classList.add("fa-pause");
  }
  else {
    singleAudio.pause();
    hidePauseButton();
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
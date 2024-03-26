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

	// Scroll the page to the button's position
	window.scrollTo({
		top: buttonPosition,
		behavior: "smooth", // Optional: smooth scrolling effect
	});
}

// // Hide/Show the About - Learn More section

// let aboutLearnMoreButton = document.getElementById("about-learn-more-button");
// let aboutLearnMoreContent = document.getElementById("about-learn-more");

// hideShowContent(
//   aboutLearnMoreButton,
//   aboutLearnMoreContent,
//   "Learn more",
//   "Hide info"
// );

// // Hide/Show the "More Music" section

// let moreMusicButton = document.getElementById("more-music-button");

// let moreMusicContent = document.getElementById("more-music-content");

// hideShowContent(moreMusicButton, moreMusicContent, "More music", "Hide music");

// // Hide/Show the "More Photos" section

// let morePhotosButton = document.getElementById("more-photos-button");

// let morePhotosContent = document.getElementById("more-photos-content");

// hideShowContent(
//   morePhotosButton,
//   morePhotosContent,
//   "More photos",
//   "Hide photos"
// );

//Create a volume slider for each music player
document.addEventListener("DOMContentLoaded", () => {
  //Wait 1 second for the <audio> elements to load.
  setTimeout(setupVolumeSliders, 1000);
});

function setupVolumeSliders() {
  setupVolumeSlidersForSingles();
  setupVolumeSlidersForAlbums();
}

function setupVolumeSlidersForSingles() {
  const musicPlayersInfo = document.querySelectorAll(".compact-info-bottom");

  musicPlayersInfo.forEach((musicPlayerInfo) => {
    let volumeSliderWrapper = createVolumeSlider();

    let spacer = document.createElement("div");
    spacer.classList.add("spacer");

    musicPlayerInfo.insertBefore(spacer, musicPlayerInfo.firstChild);

    musicPlayerInfo.insertBefore(
      volumeSliderWrapper,
      musicPlayerInfo.firstChild
    );

    let audioElement =
      findNearsetAudioTagForSingleVolumeSlider(volumeSliderWrapper);

    let volumeSliderInput = volumeSliderWrapper.querySelector("input");

    volumeSliderInput.addEventListener("input", () => {
      SetVolume(volumeSliderInput, audioElement);
    });
  });
}

function setupVolumeSlidersForAlbums() {
  //Loop through the controls of each album player. Setup the volume slider for each.
  let albumPlayerControlsList = document.querySelectorAll(".swp_player_bottom");

  albumPlayerControlsList.forEach((albumPlayerControls) => {
    setupVolumeSlidersForAlbum(albumPlayerControls);
  });
}

function setupVolumeSlidersForAlbum(albumPlayerControls) {
  let volumeSliderWrapper = createVolumeSlider();

  albumPlayerControls.appendChild(volumeSliderWrapper);

  let volumeSliderInput = volumeSliderWrapper.querySelector("input");

  let audioTags = findAllAudioTagsForAlbum(albumPlayerControls);

  volumeSliderInput.addEventListener("input", () => {
    audioTags.forEach((audioTag) => {
      SetVolume(volumeSliderInput, audioTag);
    });
  });
}

function createVolumeSlider() {
  let volumeSliderWrapper = document.createElement("div");
  volumeSliderWrapper.classList.add("volume-slider-wrapper");

  let muteVolumeIcon = document.createElement("i");
  muteVolumeIcon.classList.add("mute-volume-icon");
  muteVolumeIcon.classList.add("fa");
  muteVolumeIcon.classList.add("fa-volume-down");

  let volumeSlider = document.createElement("input");
  volumeSlider.classList.add("volume-slider");
  volumeSlider.type = "range";
  volumeSlider.min = "0";
  volumeSlider.max = "100";
  volumeSlider.value = "50";

  let maxVolumeIcon = document.createElement("div");
  maxVolumeIcon.classList.add("max-volume-icon");
  maxVolumeIcon.classList.add("fa");
  maxVolumeIcon.classList.add("fa-volume-up");

  volumeSliderWrapper.appendChild(muteVolumeIcon);
  volumeSliderWrapper.appendChild(volumeSlider);
  volumeSliderWrapper.appendChild(maxVolumeIcon);

  return volumeSliderWrapper;
}

function findNearsetAudioTagForSingleVolumeSlider(volumeSlider) {
  let swpMusicPlayer = volumeSlider.parentElement;

  while (!swpMusicPlayer.classList.contains("swp_music_player")) {
    swpMusicPlayer = swpMusicPlayer.parentElement;
  }

  let audioElement = swpMusicPlayer.querySelector("audio");

  //Set the default volume of the songs.
  audioElement.volume = 0.5;

  return audioElement;
}

function findAllAudioTagsForAlbum(albumPlayerControls) {
  let swpMusicPlayer = albumPlayerControls.parentElement;

  while (!swpMusicPlayer.classList.contains("swp_music_player")) {
    swpMusicPlayer = swpMusicPlayer.parentElement;
  }

  return swpMusicPlayer.querySelectorAll(".swp_music_player_entry audio");
}

function SetVolume(volumeSlider, audioElement) {
  audioElement.volume = volumeSlider.value / 100;
}

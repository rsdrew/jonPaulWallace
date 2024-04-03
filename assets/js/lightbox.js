// LIGHTBOX

const lightbox = document.getElementById("lightbox");
const lightboxPhoto = document.getElementById("lightbox-photo");
const lightboxOverlay = document.getElementById("lightbox-overlay"); // Stops users from accidentally interacting with the content behind the lightbox.
const allPhotos = document.querySelectorAll(".photo");
let currentLightboxPhotoIndex = null;

function photoWrapperOnClick(event) {
  let photo = event.currentTarget.querySelector('img');
  openLightbox(photo);
}

function openLightbox(photo) {
  lightbox.style.display = "block";
  lightbox.style.backgroundColor = "rgba(0,0,0,0.8)";
  lightboxOverlay.style.display = "block";
  document.body.style.overflow = "hidden"; // Stops the users from scrolling by accident.

  const photoIndex = getPhotoIndex(photo);
  setLightboxPhoto(photo.src, photoIndex);
}

function closeLightboxOnClick() {
  lightbox.style.backgroundColor = "transparent";

  setTimeout(() => {
    lightbox.style.display = "none";
    lightboxOverlay.style.display = "none";
    document.body.style.overflow = "auto";
  }, 200);
}

function setLightboxPhoto(src, photoIndex) {
  lightboxPhoto.src = src;
  currentLightboxPhotoIndex = photoIndex;
}

function prevPhotoOnClick(event) {
  if (currentLightboxPhotoIndex === 0) {
    currentLightboxPhotoIndex = allPhotos.length - 1;
  }
  else {
    currentLightboxPhotoIndex = currentLightboxPhotoIndex - 1;
  }
  const newPhoto = allPhotos[currentLightboxPhotoIndex];
  setLightboxPhoto(newPhoto.src, currentLightboxPhotoIndex);
}

function nextPhotoOnClick(event) {
  if (currentLightboxPhotoIndex === allPhotos.length - 1) {
    currentLightboxPhotoIndex = 0;
  }
  else {
    currentLightboxPhotoIndex = currentLightboxPhotoIndex + 1;
  }
  const newPhoto = allPhotos[currentLightboxPhotoIndex];
  setLightboxPhoto(newPhoto.src, currentLightboxPhotoIndex);
}

function getPhotoIndex(photo) {
  return Array.from(allPhotos).findIndex((element) => element === photo);
}
const popupCookieKey = "popupExpiration";

const popup = document.getElementById("popup");
const popupBackground = document.getElementById("popup-background");

function setPopupCookie() {
  const popupExpiration = Date.now() + (7 * 24 * 60 * 60 * 1000) // Expires after one week
  localStorage.setItem(popupCookieKey, popupExpiration);
}

function getPopupCookie() {
  return localStorage.getItem(popupCookieKey);
}

// Will show the popup if the user hasn't seen it in the last week.
function showPopup() {
  const popupExpiration = getPopupCookie();

  if (popupExpiration && popupExpiration > Date.now()) return;

  popup.style.display = "block";
  popupBackground.style.display = "block";
  setTimeout(() => {
    popup.style.opacity = 1;
    popupBackground.style.opacity = 1;
    document.body.style.overflow = "hidden"; // Stops the users from scrolling by accident.
  }, 1000)
  setPopupCookie();
}

function closePopup() {
  popup.style.opacity = 0;
  popupBackground.style.opacity = 0;

  setTimeout(() => {
    popup.style.display = "none";
    popupBackground.style.display = "none";
    document.body.style.overflow = "auto";
  }, 200);
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(showPopup, 2000); // Show popup after 2 seconds.
});
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
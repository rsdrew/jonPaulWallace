const successMessage = document.getElementById("emailing-list-success-message");
const errorMessage = document.getElementById("emailing-list-error-message");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("emailing-list-form");

  form.addEventListener("submit", async function(event) {
    event.preventDefault();
  
    const email = document.getElementById("emailing-list-email").value;
    const data = { email: email };

    try {
      const response = await fetch("https://transcendent-marzipan-2b3200.netlify.app/.netlify/functions/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      resetMessages();

      if (response.ok) {
        displaySuccessMessage();
      }
      else {
        displayErrorMessage();
      }
    }
    catch {
      displayErrorMessage();
    }
  });

});

function displaySuccessMessage() {
  successMessage.classList.remove("hidden");
}

function displayErrorMessage() {
  errorMessage.classList.remove("hidden");
}

function resetMessages() {
  successMessage.classList.add("hidden");
  errorMessage.classList.add("hidden");
}
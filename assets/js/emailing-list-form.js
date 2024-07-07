const formClassName = "emailing-list-form";
const emailInputClassName = "emailing-list-email";
const successMessageClassName = "emailing-list-success-message";
const errorMessageClassName = "emailing-list-error-message";

const forms = document.querySelectorAll(`.${formClassName}`);

async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;

  resetMessagesForForm(form);
  
  const email = form.querySelector("input[name='email']").value;
  const data = { email: email };

  try {

    setButtonAsSubmittingForForm(form);

    //const debugUrl = "http://localhost:8888/.netlify/functions/subscribe";
    const prodUrl = "https://main--transcendent-marzipan-2b3200.netlify.app/.netlify/functions/subscribe";
    const response = await fetch(prodUrl, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
        "credentials": "include"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    enableButtonForForm(form);

    if (response.ok) {
      displaySuccessMessageForForm(form, result.message);
    }
    else {
      displayErrorMessageForForm(form, result.message);
    }
  }
  catch {
    displayErrorMessageForForm(form, result.message);
  }
}

forms.forEach((form) => {
  form.addEventListener('submit', handleFormSubmit);
})

function displaySuccessMessageForForm(form, message) {
  const successMessage = getSuccessMessageForForm(form);
  successMessage.classList.remove("hidden");
  setTimeout(() => {
    successMessage.classList.add("slide-in--activate");
  }, 1);
  successMessage.innerHTML = message;
}

function displayErrorMessageForForm(form, message) {
  const errorMessage = getErrorMessageForForm(form);
  errorMessage.classList.remove("hidden");
  setTimeout(() => {
    errorMessage.classList.add("slide-in--activate");
  }, 1);
  errorMessage.innerHTML = message;
}

function resetMessagesForForm(form) {
  const successMessage = getSuccessMessageForForm(form);
  const errorMessage = getErrorMessageForForm(form);
  successMessage.classList.add("hidden");
  errorMessage.classList.add("hidden");
  successMessage.classList.remove("slide-in--activate");
  errorMessage.classList.remove("slide-in--activate");
}

function getSuccessMessageForForm(form) {
  return form.querySelector(`.${successMessageClassName}`);
}

function getErrorMessageForForm(form) {
  return form.querySelector(`.${errorMessageClassName}`);
}

function getButtonForForm(form) {
  return form.querySelector("button[type='submit']");
}

function setButtonAsSubmittingForForm(form) {
  const button = getButtonForForm(form);
  button.disabled = true;
  button.innerHTML = "Signing up...";
}

function enableButtonForForm(form) {
  const button = getButtonForForm(form);
  button.disabled = false;
  button.innerHTML = "Sign up";
}

function handleEmailInputOnChange(event) {
  const emailInput = event.target;

  const form = getFormFromDescendant(emailInput);

  resetMessagesForForm(form);
}

const emailInputs = document.querySelectorAll(`.${emailInputClassName}`);

emailInputs.forEach((input) => {
  input.addEventListener('input', handleEmailInputOnChange)
});

function getFormFromDescendant(element) {
  while (!element.classList.contains(`${formClassName}`)) {
    element = element.parentElement;
  }
  return element;
}
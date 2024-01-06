// gebruikerinfo van een JSON-string naar een JavaScript-object.
let user = JSON.parse(sessionStorage.getItem('user'));
document.addEventListener("DOMContentLoaded", function () {
    const authErrorMessage = document.getElementById("auth-error-message");

    if (authErrorMessage) {
        authErrorMessage.innerText = "Jouw foutmelding hier";
    } else {
        console.error("Element with ID 'auth-error-message' not found.");
    }
});


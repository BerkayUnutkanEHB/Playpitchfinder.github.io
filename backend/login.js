document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.getElementById('login-link');
    const usernameDisplay = document.getElementById('username-display');

    const userInSession = sessionStorage.getItem('user');

    if (userInSession) {
        const userData = JSON.parse(userInSession);

        // Verberg login 
        if (loginLink) {
            loginLink.style.display = 'none';
        }

        // Toon de gebruikersnaam
        if (usernameDisplay) {
            const username = userData.username || 'Gebruiker';
            usernameDisplay.textContent = username;
            usernameDisplay.style.display = 'inline';
            usernameDisplay.style.color = "#c90e0e";

            //afmelden met 1 klik
            usernameDisplay.addEventListener('click', function () {
                const confirmLogout = confirm('Weet je zeker dat je wilt afmelden?');

                if (confirmLogout) {
                    sessionStorage.removeItem('user'); // verwijderen van gebruiker uit pagina
                    window.location.href = '/frontend/login.html';
                }
            });
        }
    }

    document.getElementById('login-container').addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = { email, password };

        postData('http://localhost:3000/login', user)
            .then(result => {
                sessionStorage.setItem('user', JSON.stringify(result.data));
                console.log('Login successful:', result);

                //inlog gelukt
                showLoginMessage('Inloggen succesvol!', 'success');

                //3 seconden wachten en dan naar homepage
                setTimeout(function () {
                    window.location.href = '/frontend/index.html';
                }, 1500);
            })
            .catch(error => {
                console.error('Login error:', error);
                // Toon de foutmelding
                showLoginMessage('Er is een fout opgetreden bij het inloggen.', 'error');
            });
    });

    async function postData(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Server responded with an error: ${response.status} - ${errorMessage}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error during fetch:', error);
            throw error;
        }
    }

    function showLoginMessage(message, messageType) {
        const loginMessage = document.getElementById('login-message');
        loginMessage.textContent = message;

        if (messageType === 'error') {
            loginMessage.classList.add('error-message');
        } else {
            loginMessage.classList.remove('error-message');
        }
    }
});

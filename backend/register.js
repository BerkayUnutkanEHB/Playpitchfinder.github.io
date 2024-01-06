document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('register-container').addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = { name, username, email, password };

        postData('http://localhost:3000/register', user)
            .then(data => {
                // registratie
                console.log('Registration successful:', data);
                window.location.href = '/frontend/login.html';
            })
            .catch(error => {
                console.error('Registration error:', error);


                if (error.response && error.response.status === 400) {
                    // zelfde gebruikersnaam
                    alert('Deze gebruikersnaam is al in gebruik. Kies een andere.');
                } else {
                    // Andere fouten
                    alert('Er is een fout opgetreden bij het registreren.');
                }
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
});

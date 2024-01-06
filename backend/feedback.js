function submitFeedback(feedbackData)
//postverzoek
{
    fetch('http://localhost:3000/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error submitting feedback:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    const feedbackForm = document.getElementById('feedbackForm');

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const loggedInUser = JSON.parse(sessionStorage.getItem('user'));

            const feedbackData = {
                userId: loggedInUser.uuid,
                fieldId: document.getElementById('field').value, // Haal de waarde van het dropdown-menu op
                rating: document.getElementById('rating').value,
                comment: document.getElementById('comment').value,
                timestamp: new Date().toISOString()
            };

            submitFeedback(feedbackData);
        });
    } else {
        console.error("Element with ID 'feedbackForm' not found.");
    }
    // Functie om feedback te verwijderen
    window.deleteFeedback = function (feedbackId) {
        console.log('Deleting feedback with feedbackId:', feedbackId);

        // Stuur een HTTP DELETE-verzoek naar de server
        fetch(`http://localhost:3000/feedback/${feedbackId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Haal en toon alle feedback opnieuw
                    refreshFeedbackList();
                } else {
                    console.error('Failed to delete feedback.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    // Feedback ophalen
    fetch('http://localhost:3000/feedback')
        .then(response => response.json())
        .then(feedbackList => {
            feedbackList.forEach(feedback => {
                console.log(feedback);
            });
        })
        .catch(error => console.error('Error fetching feedback:', error));
});

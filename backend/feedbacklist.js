
document.addEventListener('DOMContentLoaded', function () {
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackListContainer = document.getElementById('feedback-list');

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const loggedInUser = JSON.parse(sessionStorage.getItem('user'));

            const feedbackData = {
                userId: loggedInUser.uuid,
                username: loggedInUser.username,
                fieldId: document.getElementById('field').value,
                rating: document.getElementById('rating').value,
                comment: document.getElementById('comment').value,
                timestamp: new Date().toISOString()
            };

            // opslaan feedback lokale opslag
            saveFeedback(feedbackData);
            refreshFeedbackList();
        });
    } else {
        console.error("Element with ID 'feedbackForm' not found.");
    }
    refreshFeedbackList();

    function saveFeedback(feedbackData) {
        // bestaande feedback
        const existingFeedback = JSON.parse(localStorage.getItem('feedbackList')) || [];
        existingFeedback.push(feedbackData);
        localStorage.setItem('feedbackList', JSON.stringify(existingFeedback));
    }

    function refreshFeedbackList() {
        const feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
        feedbackListContainer.innerHTML = '';

        // Voeg elke feedback toe aan de lijst
        feedbackList.forEach(feedback => {
            const feedbackItem = document.createElement('div');
            feedbackItem.innerHTML = `
                                <p>${feedback.username} zegt over voetbalveld ${getFootballFieldById(feedback.fieldId)}: ${feedback.comment} - ${feedback.rating}/5</p>
                                <button data-timestamp="${feedback.timestamp}" onclick="deleteFeedback('${feedback.timestamp}')">Verwijder Feedback</button>
                            `;
            feedbackListContainer.appendChild(feedbackItem);
        });
    }

    //voetbalvelden keuze
    function getFootballFieldById(fieldId) {
        switch (fieldId) {
            case '1':
                return 'Koninklijke Voetbalclub Asse-Ter Heide';
            case '2':
                return 'J VD Steen De Mey Stadion';
            case '3':
                return 'Fc De Kampioenen Veld';
            case '4':
                return 'Molenkouter';
            case '5':
                return 'Cmp: Steenland';
            case '6':
                return 'Zellik veld';
            case '7':
                return 'Mollem Cmp: De Kareel';
            default:
                return 'Onbekend veld';
        }
    }

    // feedback verwijderen
    window.deleteFeedback = function (timestamp) {
        console.log('Deleting feedback with timestamp:', timestamp);
        const existingFeedback = JSON.parse(localStorage.getItem('feedbackList')) || [];

        // filter van feedback
        const updatedFeedback = existingFeedback.filter(feedback => feedback.timestamp !== timestamp);
        localStorage.setItem('feedbackList', JSON.stringify(updatedFeedback));
        refreshFeedbackList();
    }
});

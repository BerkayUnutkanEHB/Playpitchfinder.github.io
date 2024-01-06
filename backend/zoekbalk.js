// zoekbalk.js
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const suggestionsDatalist = document.getElementById('suggestions');

    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value;
        // Controleer of de zoekterm niet leeg is
        if (searchTerm.trim() !== '') {
            // Bepaal de URL voor de zoekresultaten 
            const searchResultsURL = determineSearchResultsURL(searchTerm);
            window.location.href = searchResultsURL;
        } else {
            alert('Voer een zoekterm in voordat je zoekt.');
        }
    });

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value;
        displaySuggestions(searchTerm);
    });
    // Functie om de URL voor zoekresultaten op basis van de zoekterm
    function determineSearchResultsURL(searchTerm) {
        if (searchTerm.toLowerCase().includes('voetbalvelden')) {
            return '/frontend/voetbalvelden.html?q=' + encodeURIComponent(searchTerm);
        } else if (searchTerm.toLowerCase().includes('feedback')) {
            return '/frontend/feedback.html?q=' + encodeURIComponent(searchTerm);
        } else if (searchTerm.toLowerCase().includes('over ons')) {
            return '/frontend/overons.html?q=' + encodeURIComponent(searchTerm);
        } else {
            return '/frontend/index.html';
        }
    }
    // Functie om suggesties weer te geven 
    function displaySuggestions(searchTerm) {
        suggestionsDatalist.innerHTML = '';

        const suggestions = getSuggestions(searchTerm);
        suggestions.forEach(suggestion => {
            const suggestionOption = document.createElement('option');
            suggestionOption.value = suggestion;
            suggestionsDatalist.appendChild(suggestionOption);
        });
    }

    function getSuggestions(searchTerm) {
        const allSuggestions = ['voetbalvelden', 'feedback', 'over ons'];
        return allSuggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById('search-input');
    var searchButton = document.getElementById('search-button');
    var filterIcon = document.querySelector('.filter-icon');


    filterIcon.addEventListener('click', function () {
        toggleSearchBar();
    });

    // Functie om de zoekbalk te tonen of te verbergen
    function toggleSearchBar() {
        if (searchInput.style.display === 'none') {
            // Toon de zoekbalk
            searchInput.style.display = 'inline-block';
            searchButton.style.display = 'inline-block';
        } else {
            // Verberg de zoekbalk
            searchInput.style.display = 'none';
            searchButton.style.display = 'none';
        }
    }
});

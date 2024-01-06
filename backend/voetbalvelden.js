fetch('http://localhost:3000/fields')
    .then(response => response.json())
    .then(fields => {
        const fieldsSection = document.getElementById('fields-section');

        fields.forEach(field => {
            const fieldBlock = document.createElement('div');
            fieldBlock.className = 'field-block';

            // voetbalvelden
            fieldBlock.innerHTML = `
                <img src="${field.image}" alt="${field.name}">
                <h3>${field.name}</h3>
                <ul>
                    <li><i class="fas fa-map-marker-alt"></i> ${field.location}</li>
                    <li><i class="fas fa-walking"></i> ${field.distance} km</li>
                    <li><i class="fas fa-leaf"></i> ${field.grass_type}</li>
                    <li><i class="fas fa-check"></i> ${field.facilities}</li>
                    <li><i class="fas fa-star"></i> ${field.quality}</li>
                </ul>
                <a class="cta-button" href="feedback.html?id=${field.id}">Geef nu feedback</a>
            `;

            fieldsSection.appendChild(fieldBlock);
        });
    })
    .catch(error => console.error('Error fetching fields:', error));


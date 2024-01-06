// fetch
fetch('http://localhost:3000/fields')
    .then(response => response.json())
    .then(fields => {
        const fieldsSection = document.getElementById('fields-section');

        // 3 velden weergeven
        for (let i = 0; i < Math.min(3, fields.length); i++) {
            const field = fields[i];
            const fieldBlock = document.createElement('div');
            fieldBlock.className = 'field-block';

            //opmaak veld
            fieldBlock.innerHTML = `
                <img src="${field.image}" alt="${field.name}">
                <h3>${field.name}</h3>
                <ul>
                <li><i class="fas fa-map-marker-alt"></i> ${field.location}</li>
                <li><i class="fas fa-walking"></i> ${field.distance} km</li>
                <li><i class="fas fa-leaf"></i> ${field.grass_type}</li>
                </ul>
                <a class="cta-button" href="veld-info.html?id=${field.id}">Klik voor meer info</a>
            `;

            fieldsSection.appendChild(fieldBlock);
        }
    })
    .catch(error => console.error('Error fetching fields:', error));

var latitude = 40.4168;
var longitude = -3.7038;
var iconClima = '';

function mapa(latitude,longitude) {
    var divMapa = document.getElementById('mapa');
    // Verifica si el elemento 'mapa' existe antes de intentar modificar su contenido
    if (divMapa) {
        divMapa.innerHTML = `
            <h3>Ubicacion aproximada</h3>
            <iframe class="iframe" src="https://maps.google.com/?ll=${latitude},${longitude}&radius=100&z=12&t=m&output=embed" height="600" width="100%" frameborder="0" style="border:0" allowfullscreen></iframe>
            <div class="esfera"></div>
            `;
    } else {
        console.error('Elemento "mapa" no encontrado en el documento.');
    }

}

function obtenerCoordenadas() {
    var inputSitio = document.getElementById('inputSitio').value;

    // Si el campo de entrada está vacío, no hagas nada
    if (!inputSitio) {
        alert('Por favor, ingrese un lugar válido.');
        return;
    }

    var apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputSitio)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Tomar las coordenadas del primer resultado
            var latitude = parseFloat(data[0].lat);
            var longitude = parseFloat(data[0].lon);


            // Llamar a la función para obtener el clima con las nuevas coordenadas
            obtenerClima(latitude, longitude, inputSitio);
            mapa(latitude, longitude);
        })
        .catch(error => {
            console.error('Error al obtener coordenadas:', error);
            alert('Error al obtener coordenadas. Por favor, inténtelo de nuevo.');
        });
    var weatherBody = document.getElementById('weather-body');
    weatherBody.className = '';

    // Agrega la nueva clase basada en el clima actual
    weatherBody.classList.add(iconClima);

}

function obtenerClima(latitude, longitude, inputSitio) {
    
    // URL de la API de Open-Meteo
    var apiurl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;

    // Realiza la solicitud a la API
    fetch(apiurl)
        .then(response => response.json())
        .then(data => {
            // Muestra la información del clima en la página
            var climaInfo = document.getElementById('clima-info');
            var climaAhora = data.current;

            var iconClima = '';

            if (climaAhora.weather_code === 0) {
                iconClima = 'sunny';
            } else if (climaAhora.weather_code >= 1 && climaAhora.weather_code <= 48) {
                iconClima = 'cloudy';
            } else if (climaAhora.weather_code >= 51 && climaAhora.weather_code <= 67) {
                iconClima = 'rainy';
            } else if (climaAhora.weather_code >= 71 && climaAhora.weather_code <= 77) {
                iconClima = 'snow';
            } else if (climaAhora.weather_code >= 80 && climaAhora.weather_code <= 82) {
                iconClima = 'rainy';
            } else if (climaAhora.weather_code >= 85 && climaAhora.weather_code <= 86) {
                iconClima = 'snow';
            } else if (climaAhora.weather_code >= 95) {
                iconClima = 'thunderstorm';
            }

            document.getElementById('weather-body').classList.add(iconClima);

            var imagenTemp = '';
            
            if (climaAhora.temperature_2m  <= 12) {
                imagenTemp = 'img/temperatura/frio.png';
            } else if (climaAhora.temperature_2m >= 28) {
                imagenTemp = 'img/temperatura/calor.png';
            } else {
                imagenTemp = 'img/temperatura/normal.png'
            }

            
            climaInfo.innerHTML = `
                        <h2>Tiempo actual en ${inputSitio}</h2>
                        <ion-icon name="${iconClima}" style="font-size: 10em;"></ion-icon>
                        <h3>Temperatura: ${climaAhora.temperature_2m} °C <img src="${imagenTemp}" alt="Icono de temperatura" height="20" width="20"></h3>
                        
                    `;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// Llama a la función al cargar la página
obtenerClima(latitude,longitude,"Madrid");

mapa(latitude,longitude);
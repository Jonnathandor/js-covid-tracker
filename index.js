let map;
// let infoWindow;


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 49.8951, lng: 97.1384 },
        zoom: 1,
    });

    // infoWindow = new google.maps.infoWindow();
}

fetch('https://corona.lmao.ninja/v2/countries')
.then((response) => {
    return response.json();
}).then(data => {
    displayDataOnMap(data);
});

const displayDataOnMap = (countries) => {

    countries.map(country => {

        let countryCenter = {
            lat: country.countryInfo.lat,
            lng: country.countryInfo.long
        }

        let countryCircle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map,
            center: countryCenter,
            radius: Math.sqrt(country.cases) * 100,
        });

        var html = `
            <div class="info-container">
                <div class="info-flag">
                    <img src="${country.countryInfo.flag}"/>
                </div>
                <div class="info-name">
                    ${country.country}
                </div>
                <div class="info-confirmed">
                    Total: ${country.cases}
                </div>
                <div class="info-recovered">
                    Recovered: ${country.recovered}
                </div>
                <div class="info-deaths">
                    Deaths: ${country.deaths}
                </div>
            </div>        
        `

        let infoWindow = new google.maps.InfoWindow({
            content: html,
            position: countryCircle.center
        });

        google.maps.event.addListener(countryCircle,'mouseover', () => {
            infoWindow.open(map);
        });

        google.maps.event.addListener(countryCircle,'mouseout', () => {
            infoWindow.close();
        });
    });
}


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

        let infoWindow = new google.maps.InfoWindow({
            content: 'Hello',
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


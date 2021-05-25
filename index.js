let map;
let coronaGlobal;


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 56.1304, lng: 106.3468 },
        zoom: 3,
        styles: mapStyle
    });

    // infoWindow = new google.maps.infoWindow();
}

fetch('http://localhost:3000/countries')
.then((response) => {
    return response.json();
}).then(data => {
    coronaGlobal = data;
    displayDataOnMap(data);
    buildCountryTable(data);
    getHistoricalData();
    getWorldCoronaData();
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
                <div class="info-flag" style="background-image: url(${country.countryInfo.flag})">
                    
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
        `;

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

const buildCountryTable = (data) => {
    let html = '';
    data.forEach((country) => {
        html += `
        <tr>
            <td>${country.country}</td>
            <td>${country.cases}</td>
            <td>${country.recovered}</td>
            <td>${country.deaths}</td>
        </tr>
        `;
    })

    // document.getElementById('table-data').innerHTML = html;
}

const getWorldCoronaData = () => {
    fetch('https://disease.sh/v2/all')
    .then((response) => {
        return response.json();
    }).then(data => {
        buildPieChart(data)
        populateCards(data);
    });
}

const getHistoricalData = () => {
    fetch('https://corona.lmao.ninja/v2/historical/all?lastdays=120')
    .then((response) => {
        return response.json();
    }).then(data => {
        let chartData = buildChartData(data);
        buildChart(chartData);
    });
}

const populateCards = (data) => {
    console.log(data)
    document.getElementById('total-cases').innerText = data.cases;
    document.getElementById('active-cases').innerText = data.active;
    document.getElementById('recovered-cases').innerText = data.recovered;
    document.getElementById('deaths').innerText = data.deaths
}


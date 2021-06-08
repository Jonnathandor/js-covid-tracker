window.onload = () => {
    getCountriesData();
    getHistoricalData();
    getWorldCoronaData();
}

let map;
let coronaGlobal;
let mapCircles = [];
const worldWideSelection = {
    name: 'Worldwide',
    value: 'www',
    selected: true
}
const casesTypeColors = {
    cases: '#1d2c4d',
    active: '#9d80fe',
    recovered: '#7dd71d',
    deaths: '#fb4443'
}

const mapCenter = {
    lat: 56.1304,
    lng: 106.3468
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: mapCenter,
        zoom: 3,
        styles: mapStyle
    });

    // infoWindow = new google.maps.infoWindow();
}

const getCountriesData = () => {
    fetch('http://localhost:3000/countries')
    .then((response) => {
        return response.json();
    }).then(data => {
        coronaGlobal = data;
        setSearchList(data);
        displayDataOnMap(data);
        buildCountryTable(data);
    });
}

const initDropdown = (searchList) => {
    $('.ui.dropdown').dropdown({
        values: searchList,
        onChange: function(value, text) {
            if(value !== worldWideSelection.value){
                getCountryData(value);
            } else {
                getWorldCoronaData();
            }
        }
    });

}

const setSearchList = (data) => {
    let searchList = [];

    searchList.push(worldWideSelection);

    data.forEach(countryData => {
        searchList.push({
            name: countryData.country,
            value: countryData.countryInfo.iso3
        })
    })

    initDropdown(searchList);
}

const changeDataSelection = (casesType) => {
    clearTheMap();
    displayDataOnMap(coronaGlobal, casesType);
}

const clearTheMap = () => {
    for(let circle of mapCircles){
        circle.setMap(null);
    }
}

const setMapCenter = (lat, long, zoom) => {
    map.setZoom(zoom)
    map.panTo({
        lat: lat,
        lng: long
    });
}

const displayDataOnMap = (countries, casesType = 'cases') => {

    countries.map(country => {

        let countryCenter = {
            lat: country.countryInfo.lat,
            lng: country.countryInfo.long
        }

        let countryCircle = new google.maps.Circle({
            strokeColor: casesTypeColors[casesType],
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: casesTypeColors[casesType],
            fillOpacity: 0.35,
            map,
            center: countryCenter,
            radius: Math.sqrt(country[casesType]) * 100,
        });

        mapCircles.push(countryCircle);

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

    document.getElementById('table-data').innerHTML = html;
}

const getCountryData = (countryIso) => {
    const URL = `https://disease.sh/v3/covid-19/countries/${countryIso}`;
    fetch(URL)
    .then((response) => {
        return response.json();
    }).then(data => {
        populateCards(data);
        setMapCenter(data.countryInfo.lat, data.countryInfo.long, 2);
    });
}

const getWorldCoronaData = () => {
    fetch('https://disease.sh/v2/all')
    .then((response) => {
        return response.json();
    }).then(data => {
        populateCards(data);
        setMapCenter(mapCenter.lat, mapCenter.lng, 3);
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
    document.getElementById('total-cases').innerText = numeral(data.cases).format('+0,0');
    // document.getElementById('active-cases').innerText = data.active;
    document.getElementById('recovered-cases').innerText = numeral(data.recovered).format('+0,0');
    document.getElementById('deaths').innerText = numeral(data.deaths).format('+0,0');
}



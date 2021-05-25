const buildChartData = (data) => {
    let chartData = [];

    for(let date in data.cases){
        let newDataPoint = {
            x: date,
            y: data.cases[date]
        }
        
        chartData.push(newDataPoint);
    }

    return chartData;
}

const buildPieChart = (cases) => {
    const data = {
        labels: [
          'Active',
          'Recovered',
          'Deaths'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [cases.active, cases.recovered, cases.deaths],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      };

      const config = {
        type: 'pie',
        data: data
      };

      var myChart = new Chart(
        document.getElementById('myPieChart'),
        config
    );
}

const buildChart = (chartData) => {
    let timeFormat = 'MM/DD/YY';
    const data = {
        datasets: [{
            label: 'Total Cases',
            backgroundColor: 'rgb(6, 1, 148)',
            borderColor: 'rgb(6, 1, 148)',
            data: chartData,
        }]
    };

    // const options = {
    //     interaction: {
    //         mode: 'index'
    //     },
    //     plugins: {
    //         tooltips: {
    //             intersect: false
    //         }
    //     },
    //     scales: {
    //         x: [{
    //             type: "time",
    //             time: {
    //                 format: timeFormat,
    //                 tooltipFormat: 'll'
    //             },
    //             scaleLabel: {
    //                 display: false,
    //                 labelString: 'Date'
    //             }
    //         }],
    //         y: [{
    //             scaleLabel: {
    //                 display: true,
    //                 labelString: 'value'
    //             }
    //         }]
    //     }
    // }

    const config = {
    type: 'line',
    data,
    options: {}
    };

    var myChart = new Chart(
    document.getElementById('myChart'),
    config
    );
}
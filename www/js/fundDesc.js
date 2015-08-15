// Fund description
var fundDescRenderer = function(data) {
  var index = 0;
  fundName = data.hits.hits[index]._source.fundName;
  dateArray = data.hits.hits[index]._source.HistoricalDates;
  aumData = data.hits.hits[index]._source.HistoricalAUM;
  grossLongExposure = data.hits.hits[index]._source.GrossLongExposure;
  grossShortExposure = data.hits.hits[index]._source.GrossShortExposure;
  netExposure = data.hits.hits[index]._source.NetExposure;
  totalExposure = data.hits.hits[index]._source.TotalExposure;
  returnsData = data.hits.hits[index]._source.NetReturn;
  grossReturn = data.hits.hits[index]._source.GrossReturn;
  longPositions = data.hits.hits[index]._source.LongPositions;
  shortPositions = data.hits.hits[index]._source.ShortPositions;
  // aum chart
  $(function() {
    $('#container1').highcharts({
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'Historical AUM',
        x: -20 //center
      },
      xAxis: {
        categories: dateArray
      },
      yAxis: {
        title: {
          text: 'In Million $'
        }
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        valueSuffix: ' million $',
        crosshairs: [true, true],
        followPointer: true,
        followTouchMove: false

      },
      series: [{
        type: 'area',
        name: 'Historical AUM',
        data: aumData
      }]


    });

    $('#container2').highcharts({
      title: {
        text: 'Historical Monthly Exposures',
        x: -20 //center
      },
      xAxis: {
        categories: dateArray
      },
      yAxis: {
        title: {
          text: '% Exposure'
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      tooltip: {
        valueSuffix: '%'
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      series: [{
        name: 'Gross Long Exposure',
        data: grossLongExposure
      }, {
        name: 'Gross Short Exposure',
        data: grossShortExposure
      }, {
        name: 'Net Exposure',
        data: netExposure
      }, {
        name: 'Total Exposure',
        data: totalExposure
      }]
    });


    $('#container3').highcharts({
      title: {
        text: 'Historical Monthly Returns',
        x: -20 //center
      },
      xAxis: {
        categories: dateArray
      },
      yAxis: {
        title: {
          text: '% Return'
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      tooltip: {
        valueSuffix: '%'
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      series: [{
        name: 'Net Returns',
        data: returnsData
      }, {
        name: 'Gross Returns',
        data: grossReturn
      }, {
        name: 'Long Positions',
        data: longPositions
      }, {
        name: 'Short Positions',
        data: shortPositions
      }]
    });
  });
}

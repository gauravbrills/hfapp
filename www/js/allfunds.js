function renderDataVizModal($scope) {
  /// aum chart defaults
  $scope.showYTDMTD = true;
  $scope.charttyp = 'YTDMTD';
  showYTDMTD(pruneData($scope.fundapproach, $scope.data));
  // show modal now once stuff completes

}
// Graph Data Pojo
var graphResource = function(approach, YTD, MTD, fundnames, HistoricalDates) {
  this.approach = approach;
  this.YTD = YTD;
  this.MTD = MTD;
  this.fundnames = fundnames;
  this.HistoricalDates = HistoricalDates;
}

function pruneData(approach, datum) {
  var ytd = [];
  var mtd = [];
  var fundnames = [];
  var HistoricalDates = [];
  angular.forEach(datum.hits.hits, function(value, key) {
    if (value._source._source.InvestmentApproach == approach) {
      ytd.push(value._source._source.YTD);
      mtd.push(value._source._source.MTD);
      fundnames.push(value._source._source.fundName);
      HistoricalDates.push(value._source._source.HistoricalDates);
    }
  });
  resource = new graphResource(approach, ytd, mtd, fundnames, HistoricalDates);
  console.log("graphResource  " + angular.toJson(resource, true));
  return resource
}

function showYTDMTD(data) {
  $(function() {
    $('#mtdytd').highcharts({
      chart: {
        type: 'bar'
      },
      xAxis: {
        categories: data.fundnames,
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: '(net)',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: ' %'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'YTD',
        data: data.YTD
      }, {
        name: 'MTD',
        data: data.MTD
      }]
    });
  });
}

function createAllFundsViz($scope, $window, model, funds, svg, arc, path, layout) {
  var modelObj = model.hits.hits[0]._source._source;

  var width = $window.innerWidth / 1.3,
    height = $window.innerHeight / 1.3;
  console.log("canvas params " + width + " : " + height);
  var outerRadius = Math.min(width, height) / 2.6;
  var innerRadius = outerRadius - 24;
  var formatPercent = d3.format(".1%");

  var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  var layout = d3.layout.chord()
    .padding(.04)
    .sortSubgroups(d3.descending)
    .sortChords(d3.ascending);

  var path = d3.svg.chord()
    .radius(innerRadius);

  var svg = d3.select("#sidebar").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("id", "circle")
    .attr("transform", "translate(" + width / 2.9 + "," + height / 1.9 + ")");

  svg.append("circle")
    .attr("r", outerRadius);
  // Compute the chord layout.
  layout.matrix(modelObj.fundRelation);

  // Add a group per neighborhood.
  var group = svg.selectAll(".group")
    .data(layout.groups)
    .enter().append("g")
    .attr("class", "group")
    .on("click", click);


  // Add the group arc.
  var groupPath = group.append("svg:path")
    .attr("id", function(d, i) {
      return "group" + i;
    })
    .attr("d", arc)
    .style("fill", function(d, i) {
      return modelObj.fundColor[i];
    });

  var groupText = group.append("text")
    .each(function(d) {
      d.angle = (d.startAngle + d.endAngle) / 2;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) {
      return d.angle > Math.PI ? "end" : null;
    })
    .attr("transform", function(d) {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + (innerRadius + 26) + ")" + (d.angle > Math.PI ? "rotate(180)" : "");
    }).attr("font-family", "Arial")
    .attr("font-size", "10px").style("fill", "#005a96")
    .text(function(d) {
      return modelObj.fundName[d.index];
    });


  // Add the chords.
  var chord = svg.selectAll(".chord")
    .data(layout.chords)
    .enter().append("path")
    .attr("class", "chord")
    .style("fill", function(d) {
      return "#4682B4";
    })
    .attr("d", path);


  // Add an elaborate mouseover title for each chord.
  chord.append("title").text(function(d) {
    return modelObj.fundName[d.source.index] + " & " + modelObj.fundName[d.target.index] + "\nBelong to Same Category";
  });

  function click(d, i) {
    populateFundInfo(i); // as in json 0th entry is different , generic info not fund specific
    document.getElementById("fundProps").style.display = 'block';

    chord.classed("fade", function(p) {
      return p.source.index != i && p.target.index != i;
    });
  }

  function populateFundInfo(index) {
    console.log(" fund index " + index);
    var investmentApproach;
    var inceptionDate;
    var strategyAUM;
    var MTD;
    var YTD;
    var annualizedSinceInception;
    var status;
    var fundName;
    var category;
    // sort funds
    funds.hits.hits.sort(function compare(a, b) {
      return a._source._source.fundName.localeCompare(b._source._source.fundName);
    });


    fundName = funds.hits.hits[index]._source._source.fundName;
    investmentApproach = funds.hits.hits[index]._source._source.InvestmentApproach;
    inceptionDate = funds.hits.hits[index]._source._source.InceptionDate;
    strategyAUM = funds.hits.hits[index]._source._source.StrategyAUM;
    MTD = funds.hits.hits[index]._source._source.MTD + "%";
    YTD = funds.hits.hits[index]._source._source.YTD + "%";
    annualizedSinceInception = funds.hits.hits[index]._source._source.AnnualizedSinceInception;
    status = funds.hits.hits[index]._source._source.Status;
    category = funds.hits.hits[index]._source._source.Category;

    $scope.fundName = fundName;
    $scope.fundapproach = investmentApproach;
    $scope.inceptionDate = inceptionDate;
    $scope.strategyAUM = strategyAUM;
    $scope.MTD = MTD;
    $scope.YTD = YTD;
    $scope.annualizedSinceInception = annualizedSinceInception;
    $scope.status = status;
    $scope.category = funds.hits.hits[index]._source._source.Category;
    $scope.$apply();
  }
}

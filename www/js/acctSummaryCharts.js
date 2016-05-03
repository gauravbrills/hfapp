function drawacctsumm(data, $window, $scope, $timeout) {
  var hedgeFundArray = [];
  var hedgeFundequity = [];
  var hedgeFundYtd = [];
  var hedgeFundMtd = [];

  var publicCapitalFundArray = [];
  var totalHF = 0;
  var totalPHF = 0;

  var formatAsPercentage = d3.format("%"),
    formatAsPercentage1Dec = d3
    .format(".1%"),
    formatAsInteger = d3.format(","),
    fsec = d3.time
    .format("%S s"),
    fmin = d3.time.format("%M m"),
    fhou = d3.time
    .format("%H h"),
    fwee = d3.time.format("%a"),
    fdat = d3.time
    .format("%d d"),
    fmon = d3.time.format("%b");
  // hide show message
  $scope.showbanner = true
    /*
     ############# PIE CHART ###################
     -------------------------------------------
     */
  for (var i = 0; i < data.hits.hits.length; i++) {
    node = data.hits.hits[i];
    if (node._source.privateFundFlg == true) {
      publicCapitalFundArray.push(node._source);
      totalPHF = totalPHF + node._source.Equity;
    } else {
      hedgeFundArray.push(node._source);
      totalHF = totalHF + node._source.Equity;
    }
  }
  //  console.log(angular.toJson(publicCapitalFundArray,true) + " -< public");
  //  console.log(angular.toJson(hedgeFundArray,true) + " -< hedge");
  showHedgeFundsMaster(hedgeFundArray, publicCapitalFundArray, $window, totalHF, totalPHF, $scope, $timeout);

}

function myFunction() {
  document.getElementById("pieChart2").style.display = 'none';
}

function showDivPie2() {
  document.getElementById("pieChart2").style.display = 'block';
  document.getElementById("pieChart").style.display = 'none';
  document.getElementById("chartdiv").style.display = 'none';
  document.getElementById("chartdiv2").style.display = 'none';
}

function showDivPie1() {
  document.getElementById("pieChart").style.display = 'block';
  document.getElementById("pieChart2").style.display = 'none';
  document.getElementById("chartdiv").style.display = 'none';
  document.getElementById("chartdiv2").style.display = 'none';

}

function showHedgeFundsMaster(hedgeFundArray, publicCapitalFundArray, $window, totalHF, totalPHF, $scope, $timeout) {
  var width = $window.innerWidth / 2,
    height = $window.innerWidth / 1.8;
  $scope.publicFundRendered = false;
  $scope.privateFundRendered = false;
  showHedgeFundView();
  // Computes the label angle of an arc, converting from radians to degrees.
  function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    return a > 90 ? a - 180 : a;
  }

  function showHedgeFundView() {
    //  if ($scope.publicFundRendered == false)
    //    else {
    $timeout(function() {
      $scope.totalAUM = totalHF;
      $scope.showbanner = true;
      $scope.fundtyp = "Private Hedge Funds";
      //..
    }, 200);
    showHedgeFunds();
  }

  function showHedgeFunds() {
    document.getElementById("pieChart").innerHTML = "";
    document.getElementById("pieChart2").style.display = 'none';
    document.getElementById("pieChart").style.display = 'block';
    document.getElementById("chartdiv").style.display = 'none';
    document.getElementById("chartdiv2").style.display = 'none';
    document.getElementById("privhfytmtd").style.display = 'none';
    document.getElementById("hfytmtd").style.display = 'none';
    var color = d3.scale.category20(),
      radius = width / 2.35,
      innerRadius = (width / 2) * .45;

    var canvas = d3.select("#pieChart").append("svg:svg") //create the SVG element inside the <body>
      //associate our data with the document
      .attr("width", width) //set the width and height of our visualization (these will be attributes of the <svg> tag
      .attr("height", height)
    var vis = canvas.append("svg:g").data([hedgeFundArray]) //make a group to hold our pie chart

    .attr("transform", "translate(" + width / 2.1 + "," + height / 1.8 + ")");
    var arc = d3.svg.arc() //this will create <path> elements for us using arc data
      .outerRadius(radius).innerRadius(100);

    var arcFinal = d3.svg.arc().innerRadius(100).outerRadius(radius);
    var arcFinal3 = d3.svg.arc().innerRadius(innerRadius)
      .outerRadius(radius * 1.05);
    var pie = d3.layout.pie() //this will create arc data for us given a list of values
      .value(function(d) {
        return d.Equity;
      });
    var arcs = vis.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
      .data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
      .enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
      .append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
      .attr("class", "slice").on("mouseover", mouseover).on("mouseout",
        mouseout).on("click", function(d, i) {
        $timeout(function() {
          $scope.fundSelected = d.data.fundName;
          $scope.showbanner = false;
          //..
        }, 200);
        showHedgeFundTransactions(d.data.fundName, d.data.Equity, color(i), hedgeFundArray);
      });

    arcs.append("svg:path").attr("fill", function(d, i) {
      return Highcharts.Color(Highcharts.getOptions().colors[0]).brighten((i - 3) / 7).get();
    }).transition().ease("bounce").duration(1700).attrTween("d", tweenPie).transition().ease("elastic").
    delay(function(d, i) {                                         
      return  5000 + i * 50;                                 
    }).duration(3000).attrTween("d", tweenDonut);

    arcs
      .append("svg:text")
      .attr("dy", ".20em")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")";
      })
      .text(function(d) {
        return d.data.fundName;
      });
    arcs
      .append("svg:text")
      .attr("dy", "1.8em").attr("font-size", "10")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")";
      })
      .text(function(d) {
        return "$ " + d.data.Equity;
      });
    // circle center
    var center = vis.append("circle").attr("r", 30).attr("fill",
      "#212121").on("click", showPublicCapitalView).on("mouseout", function() {
      d3.select(this).style("fill", "#hello");
    });;

    function mouseover(d, i) {
      d3.select(this).select("path").transition().duration(550).attr(
        "stroke", "white").attr("stroke-width", 2).attr("d",
        arcFinal3);
    }

    function mouseout() {
      d3.select(this).select("path").transition().duration(550).attr(
        "stroke", "white").attr("stroke-width", 2).attr(
        "d", arcFinal);
    }


    function tweenPie(b) {
      b.innerRadius = 0;
      var i = d3.interpolate({
        startAngle: 0,
        endAngle: 0
      }, b);
      return function(t) {
        return arc(i(t));
      };
    }

    function tweenDonut(b) {
      b.innerRadius = radius * .6;
      var i = d3.interpolate({
        innerRadius: 0
      }, b);
      return function(t) {
        return arc(i(t));
      };
    }

  }

  function showPublicCapitalView() {
    //  if ($scope.privateFundRendered == false)
    //  else {
    $timeout(function() {
      $scope.totalAUM = totalPHF;
      $scope.showbanner = true;
      $scope.fundtyp = "Public Hedge Funds";
      //..
    }, 200);
    showPublicCapital();
  }

  function showPublicCapital() {
    document.getElementById("pieChart2").innerHTML = "";
    document.getElementById("pieChart").style.display = 'none';
    document.getElementById("pieChart2").style.display = 'block';
    document.getElementById("chartdiv").style.display = 'none';
    document.getElementById("chartdiv2").style.display = 'none';
    document.getElementById("privhfytmtd").style.display = 'none';
    document.getElementById("hfytmtd").style.display = 'none';
    var color = d3.scale.category20(),
      radius = width / 2.35,
      innerRadius = (width / 2) * .45;

    var canvas = d3.select("#pieChart2").append("svg:svg") //create the SVG element inside the <body>
      //associate our data with the document
      .attr("width", width) //set the width and height of our visualization (these will be attributes of the <svg> tag
      .attr("height", height)
    var vis = canvas.append("svg:g").data([publicCapitalFundArray]) //make a group to hold our pie chart
      .attr("transform", "translate(" + width / 2.1 + "," + height / 1.8 + ")");
    var arc = d3.svg.arc() //this will create <path> elements for us using arc data
      .outerRadius(radius).innerRadius(100);

    var arcFinal = d3.svg.arc().innerRadius(100).outerRadius(radius);
    var arcFinal3 = d3.svg.arc().innerRadius(innerRadius)
      .outerRadius(radius * 1.05);
    var pie = d3.layout.pie() //this will create arc data for us given a list of values
      .value(function(d) {
        return d.Equity;
      });
    var arcs = vis.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
      .data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
      .enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
      .append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
      .attr("class", "slice").on("mouseover", mouseover).on("mouseout",
        mouseout).on("click", function(d, i) {
        $timeout(function() {
          $scope.fundSelected = d.data.fundName;
          $scope.showbanner = false;
        }, 200);
        showPublicCapitalTransactions(d.data.fundName, color(i), publicCapitalFundArray);
      });

    arcs.append("svg:path").attr("fill", function(d, i) {
      return Highcharts.Color(Highcharts.getOptions().colors[8]).brighten((i - 3) / 7).get();
    }).transition().ease("bounce").duration(1700).attrTween("d", tweenPie).transition().ease("elastic").
    delay(function(d, i) {                                         
      return  5000 + i * 50;                                 
    }).duration(3000).attrTween("d", tweenDonut);
    // labels
    arcs
      .append("svg:text")
      .attr("dy", ".22em")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")";
      })
      .text(function(d) {
        return d.data.fundName;
      });
    arcs.append("svg:text")
      .attr("dy", "1.8em").attr("font-size", "10")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")";
      })
      .text(function(d) {
        return "$ " + d.data.Equity;
      });
    // circle center
    var center = vis.append("circle").attr("r", 30).attr("fill",
      "#212121").on("click", showHedgeFundView).on("mouseout", function() {
      d3.select(this).style("fill", "#hello");
    });;

    function mouseover(d, i) {
      d3.select(this).select("path").transition().duration(550).attr(
        "stroke", "white").attr("stroke-width", 2).attr("d",
        arcFinal3);
    }

    function mouseout() {
      d3.select(this).select("path").transition().duration(550).attr(
        "stroke", "white").attr("stroke-width", 2).attr(
        "d", arcFinal);
    }

    function up(d, i) {
      showPublicCapitalTransactions(d.data.fundName, color(i), publicCapitalFundArray);
    }

    function tweenPie(b) {
      b.innerRadius = 0;
      var i = d3.interpolate({
        startAngle: 0,
        endAngle: 0
      }, b);
      return function(t) {
        return arc(i(t));
      };
    }

    function tweenDonut(b) {
      b.innerRadius = radius * .6;
      var i = d3.interpolate({
        innerRadius: 0
      }, b);
      return function(t) {
        return arc(i(t));
      };
    }
  }
}

function showHedgeFundTransactions(fundName, equity, color, hedgeFundArray) {
  document.getElementById("chartdiv").style.display = 'block';
  document.getElementById("chartdiv2").style.display = 'none';
  document.getElementById("privhfytmtd").style.display = 'none';
  document.getElementById("hfytmtd").style.display = 'block';
  var chart = AmCharts.makeChart("chartdiv", {
    "type": "serial",
    "theme": "none",
    "marginRight": 80,
    "autoMarginOffset": 20,
    "dataDateFormat": "YYYY-MM-DD",
    "titles": [{
      "text": "Transactions for  " + fundName,
      "size": 35,
      "bold": true,
      "color": "black"
    }],
    "valueAxes": [{
      "id": "v1",
      "axisAlpha": 0,
      "position": "left",
      "color": color
    }],
    "balloon": {
      "borderThickness": 1,
      "shadowAlpha": 0
    },
    "graphs": [{
      "id": "g1",
      "bullet": "round",
      "bulletBorderAlpha": 1,
      "bulletColor": color,
      "bulletSize": 5,
      "hideBulletsCount": 50,
      "lineThickness": 2,
      "title": color + "line",
      "useLineColorForBulletBorder": true,
      "valueField": "value",
      "balloonText": "<div style='margin:5px; font-size:19px;'><span style='font-size:12px;'>" + fundName + "</span><br>[[type]]: $[[value]]</div>"
    }],
    "chartScrollbar": {
      "graph": "g1",
      "oppositeAxis": false,
      "offset": 30,
      "scrollbarHeight": 80,
      "backgroundAlpha": 0,
      "selectedBackgroundAlpha": 0.1,
      "selectedBackgroundColor": color,
      "graphFillAlpha": 0,
      "graphLineAlpha": 0.5,
      "selectedGraphFillAlpha": 0,
      "selectedGraphLineAlpha": 1,
      "autoGridCount": true,
      "color": color
    },
    "chartCursor": {
      "pan": true,
      "valueLineEnabled": true,
      "valueLineBalloonEnabled": true,
      "cursorAlpha": 0,
      "valueLineAlpha": 0.2
    },
    "categoryField": "date",
    "categoryAxis": {
      "parseDates": true,
      "dashLength": 1,
      "minorGridEnabled": true
    },
    "export": {
      "enabled": true
    },
    "responsive": {
      "enabled": true,
      "rules": [
        // at 400px wide, we hide legend
        {
          "maxWidth": 400,
          "overrides": {
            "legend": "enabled"

          }
        },
        // at 300px or less, we move value axis labels inside plot area
        // the legend is still hidden because the above rule is still applicable
        {
          "maxWidth": 300,
          "overrides": {
            "valueAxes": {
              "inside": true
            }
          }
        },
        // at 200 px we hide value axis labels altogether
        {
          "maxWidth": 200,
          "overrides": {
            "valueAxes": {
              "labelsEnabled": false
            }
          }
        }
      ]
    },
    "dataProvider": getTransactions(fundName, hedgeFundArray)
  });
  chart.addListener("rendered", zoomChart);
  zoomChart();

  function zoomChart() {
    chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
  }
  var fundnames = [];
  fundnames.push(fundName);
  showBarGph('#hfytmtd', '', getSeries(fundName, hedgeFundArray), fundnames);

}

function getTransactions(fundName, hfArray) {
  for (i = 0; i < hfArray.length; i++) {
    if (hfArray[i].fundName == fundName) {
      return hfArray[i].Transactions;
    }
  }
}

function getSeries(fundName, hfArray) {
  for (i = 0; i < hfArray.length; i++) {
    if (hfArray[i].fundName == fundName) {
      return [{
        name: 'YTD',
        data: [hfArray[i].YTD]
      }, {
        name: 'MTD',
        data: [hfArray[i].MTD]
      }];
    }
  }
}


function showPublicCapitalTransactions(fundName, color, publicCapitalFundArray) {
  document.getElementById("chartdiv").style.display = 'block';
  document.getElementById("chartdiv2").style.display = 'none';
  document.getElementById("privhfytmtd").style.display = 'block';
  document.getElementById("hfytmtd").style.display = 'none';
  var chart = AmCharts.makeChart("chartdiv", {
    "type": "serial",
    "theme": "none",
    "marginRight": 80,
    "autoMarginOffset": 20,
    "dataDateFormat": "YYYY-MM-DD",
    "titles": [{
      "text": "Transactions for  " + fundName,
      "size": 35,
      "bold": true,
      "color": "black"
    }],
    "valueAxes": [{
      "id": "v1",
      "axisAlpha": 0,
      "position": "left",
      "color": color
    }],
    "balloon": {
      "borderThickness": 1,
      "shadowAlpha": 0
    },
    "graphs": [{
      "id": "g1",
      "bullet": "round",
      "bulletBorderAlpha": 1,
      "bulletColor": color,
      "bulletSize": 5,
      "hideBulletsCount": 50,
      "lineThickness": 2,
      "title": color + "line",
      "useLineColorForBulletBorder": true,
      "valueField": "value",
      "balloonText": "<div style='margin:5px; font-size:19px;'><span style='font-size:12px;'>" + fundName + "</span><br>[[type]]: $[[value]]</div>"
    }],
    "chartScrollbar": {
      "graph": "g1",
      "oppositeAxis": false,
      "offset": 30,
      "scrollbarHeight": 80,
      "backgroundAlpha": 0,
      "selectedBackgroundAlpha": 0.1,
      "selectedBackgroundColor": color,
      "graphFillAlpha": 0,
      "graphLineAlpha": 0.5,
      "selectedGraphFillAlpha": 0,
      "selectedGraphLineAlpha": 1,
      "autoGridCount": true,
      "color": color
    },
    "chartCursor": {
      "pan": true,
      "valueLineEnabled": true,
      "valueLineBalloonEnabled": true,
      "cursorAlpha": 0,
      "valueLineAlpha": 0.2
    },
    "categoryField": "date",
    "categoryAxis": {
      "parseDates": true,
      "dashLength": 1,
      "minorGridEnabled": true
    },
    "export": {
      "enabled": true
    },
    "responsive": {
      "enabled": true,
      "rules": [
        // at 400px wide, we hide legend
        {
          "maxWidth": 400,
          "overrides": {
            "legend": "enabled"

          }
        },
        // at 300px or less, we move value axis labels inside plot area
        // the legend is still hidden because the above rule is still applicable
        {
          "maxWidth": 300,
          "overrides": {
            "valueAxes": {
              "inside": true
            }
          }
        },

        // at 200 px we hide value axis labels altogether
        {
          "maxWidth": 200,
          "overrides": {
            "valueAxes": {
              "labelsEnabled": false
            }
          }
        }
      ]
    },
    "dataProvider": getTransactions(fundName, publicCapitalFundArray)
  });

  chart.addListener("rendered", zoomChart);
  zoomChart();

  function zoomChart() {
    chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
  }
  var fundnames = [];
  fundnames.push(fundName);
  showBarGph('#privhfytmtd', ' ', getSeries(fundName, publicCapitalFundArray), fundnames);
}

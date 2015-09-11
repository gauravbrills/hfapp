function drawacctsumm(data) {
  var hedgeFundArray = [];
  var hedgeFundequity = [];
  var hedgeFundYtd = [];
  var hedgeFundMtd = [];

  var publicCapitalFundArray = [];
  var publicCapitalFundequity = [];
  var publicCapitalFundYtd = [];
  var publicCapitalFundMtd = [];

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

  /*
   ############# PIE CHART ###################
   -------------------------------------------
   */
  for (var i = 0; i < data.hits.HedgeFundHoldings.length; i++) {

    hedgeFundArray
      .push(data.hits.HedgeFundHoldings[i]._source);
    hedgeFundequity
      .push(data.hits.HedgeFundHoldings[i]._source.Equity);
    hedgeFundYtd
      .push(data.hits.HedgeFundHoldings[i]._source.YTD);
    hedgeFundMtd
      .push(data.hits.HedgeFundHoldings[i]._source.MTD);
  }

  for (var i = 0; i < data.hits.publicCapitalFundHoldings.length; i++) {
    publicCapitalFundArray
      .push(data.hits.publicCapitalFundHoldings[i]._source);
    publicCapitalFundequity
      .push(data.hits.publicCapitalFundHoldings[i]._source.Equity);
    publicCapitalFundYtd
      .push(data.hits.publicCapitalFundHoldings[i]._source.YTD);
    publicCapitalFundMtd
      .push(data.hits.publicCapitalFundHoldings[i]._source.MTD);
  }

  showHedgeFunds(hedgeFundArray,publicCapitalFundArray);

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

function showHedgeFunds(hedgeFundArray,publicCapitalFundArray) {
  document.getElementById("pieChart").innerHTML = "";
  document.getElementById("pieChart2").style.display = 'none';
  document.getElementById("pieChart").style.display = 'block';
  document.getElementById("chartdiv2").style.display = 'none';

  var graphWidth = 400,
    graphHeight = 400;
  if (document.getElementById('main-wrap').clientWidth < 500) {
    var fluidDim = .9 * document.getElementById('main-wrap').clientWidth;
    graphWidth = fluidDim;
    graphHeight = fluidDim;
  }

  var width = graphWidth,
    height = graphHeight,
    color = d3.scale.category20(),
    radius = Math
    .min(width, height) / 2,
    innerRadiusFinal = 100 * .5,
    innerRadiusFinal3 = (width / 2) * .45;

  var vis = d3.select("#pieChart").append("svg:svg") //create the SVG element inside the <body>
    .data([hedgeFundArray]) //associate our data with the document
    .attr("width", width) //set the width and height of our visualization (these will be attributes of the <svg> tag
    .attr("height", height).append("svg:g") //make a group to hold our pie chart
    .attr("transform", "translate(" + width / 2 + "," + 200 + ")");




  var arc = d3.svg.arc() //this will create <path> elements for us using arc data
    .outerRadius(width / 2).innerRadius(100);

  var arcFinal = d3.svg.arc().innerRadius(100).outerRadius(width / 2);
  var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal3)
    .outerRadius(width / 2);
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
      showHedgeFundTransactions(d.data.fundName, d.data.Equity, color(i), hedgeFundArray);
    });

  arcs.append("svg:path").attr("fill", function(d, i) {
    return color(i);
  }).transition().ease("bounce").duration(1700).attrTween("d",
    tweenPie).transition().ease("elastic").delay(
    function(d, i) {
      return 5000 + i * 50;
    }).duration(3000).attrTween("d", tweenDonut);

  function mouseover(d, i) {
    d3.select(this).select("path").transition().duration(750).attr(
      "stroke", "red").attr("stroke-width", 1.5).attr("d",
      arcFinal3)

    ;
  }

  function mouseout() {
    d3.select(this).select("path").transition().duration(750).attr(
      "stroke", "transparent").attr("stroke-width", 0).attr(
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



  var center = vis.append("circle").attr("r", 30).attr("fill",
    "#CCFFCC").on("click", showPublicCapital).on("mouseout", function() {
    d3.select(this).style("fill", "#hello");
  });;

}

function showPublicCapital(publicCapitalFundArray) {
  document.getElementById("pieChart2").innerHTML = "";
  document.getElementById("pieChart").style.display = 'none';
  document.getElementById("pieChart2").style.display = 'block';
  document.getElementById("chartdiv").style.display = 'none';

  var graphWidth = 400,
    graphHeight = 400;
  if (document.getElementById('main-wrap').clientWidth < 500) {
    var fluidDim = .9 * document.getElementById('main-wrap').clientWidth;
    graphWidth = fluidDim;
    graphHeight = fluidDim;
  }

  var width = graphWidth,
    height = graphHeight,
    color = d3.scale.category20(),
    radius = Math
    .min(width, height) / 2,
    innerRadiusFinal = 100 * .5,
    innerRadiusFinal3 = (width / 2) * .45;

  var vis = d3.select("#pieChart2").append("svg:svg") //create the SVG element inside the <body>
    .data([publicCapitalFundArray]) //associate our data with the document
    .attr("width", width) //set the width and height of our visualization (these will be attributes of the <svg> tag
    .attr("height", height).append("svg:g") //make a group to hold our pie chart
    .attr("transform", "translate(" + width / 2 + "," + 200 + ")") //move the center of the pie chart from 0, 0 to radius, radius
  ;

  var arc = d3.svg.arc() //this will create <path> elements for us using arc data
    .outerRadius(width / 2).innerRadius(100);

  var arcFinal = d3.svg.arc().innerRadius(100).outerRadius(width / 2);
  var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal3)
    .outerRadius(width / 2);
  var pie = d3.layout.pie() //this will create arc data for us given a list of values
    .value(function(d) {
      return d.Equity;
    });

  var arcs = vis.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
    .data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
    .enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
    .append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
    .attr("class", "slice").on("mouseover", mouseover).on("mouseout",
      mouseout).on("click", up);

  arcs.append("svg:path").attr("fill", function(d, i) {
    return color(i);
  }).transition().ease("bounce").duration(1700).attrTween("d",
    tweenPie).transition().ease("elastic").delay(
    function(d, i) {
      return 5000 + i * 50;
    }).duration(3000).attrTween("d", tweenDonut);

  function mouseover(d, i) {
    d3.select(this).select("path").transition().duration(750).attr(
      "stroke", "red").attr("stroke-width", 1.5).attr("d",
      arcFinal3)

    ;
  }

  function mouseout() {
    d3.select(this).select("path").transition().duration(750).attr(
      "stroke", "transparent").attr("stroke-width", 0).attr(
      "d", arcFinal);
  }

  function up(d, i) {

    /* update bar chart when user selects piece of the pie chart */
    //updateBarChart(dataset[i].category);
    //	updateBarChart(d.FundName, color(i));
    showPublicCapitalTransactions(d.data.fundName, color(i),publicCapitalFundArray);
    //	updateLineChart(d.data.category, color(i));

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

  var center = vis.append("circle").attr("r", 30).attr("fill",
    "#CCFFCC").on("click", showHedgeFunds).on("mouseout", function() {
    d3.select(this).style("fill", "#hello");
  });;

  var legendRectSize = 18;
  var legendSpacing = 4;
  var legend = d3.select("#legend").append("svg:svg").selectAll('.legend')
    .data(publicCapitalFundArray)
    .enter()
    // .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset = height * color.domain().length / 2;
      var horz = -2 * legendRectSize;
      var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
    });


  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', function(d, i) {
      return color(i);
    })
    .style('stroke', function(d, i) {
      return color(i);
    });

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(publicCapitalFundArray) {
      return publicCapitalFundArray.fundName;
    });

}


function showHedgeFundTransactions(fundName, equity, color, hedgeFundArray) {
  document.getElementById("chartdiv").style.display = 'block';
  document.getElementById("chartdiv2").style.display = 'none';

  var chart = AmCharts.makeChart("chartdiv", {
    "type": "serial",
    "theme": "none",
    "marginRight": 80,
    "autoMarginOffset": 20,
    "dataDateFormat": "YYYY-MM-DD",
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
    "dataProvider": getTransactions(fundName, hedgeFundArray)
  });

  chart.addListener("rendered", zoomChart);

  zoomChart();

  function zoomChart() {
    chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
  }


}


function getTransactions(fundName, hedgeFundArray) {

  for (i = 0; i < hedgeFundArray.length; i++) {

    if (hedgeFundArray[i].fundName == fundName) {
      return hedgeFundArray[i].Transactions;
    }


  }

}

function getTransactionsPublicCapital(fundName, publicCapitalFundArray) {

  for (i = 0; i < publicCapitalFundArray.length; i++) {

    if (publicCapitalFundArray[i].fundName == fundName) {
      return publicCapitalFundArray[i].Transactions;
    }


  }

}

function showPublicCapitalTransactions(fundName, color,publicCapitalFundArray) {
  document.getElementById("chartdiv").style.display = 'block';
  document.getElementById("chartdiv2").style.display = 'none';
  var chart = AmCharts.makeChart("chartdiv", {
    "type": "serial",
    "theme": "none",
    "marginRight": 80,
    "autoMarginOffset": 20,
    "dataDateFormat": "YYYY-MM-DD",
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
    "dataProvider": getTransactionsPublicCapital(fundName,publicCapitalFundArray)
  });

  chart.addListener("rendered", zoomChart);

  zoomChart();

  function zoomChart() {
    chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
  }


}

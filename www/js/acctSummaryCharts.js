/*
################ FORMATS ##################
-------------------------------------------
*/

var formatAsPercentage = d3.format("%"),
  formatAsPercentage1Dec = d3.format(".1%"),
  formatAsInteger = d3.format(","),
  fsec = d3.time.format("%S s"),
  fmin = d3.time.format("%M m"),
  fhou = d3.time.format("%H h"),
  fwee = d3.time.format("%a"),
  fdat = d3.time.format("%d d"),
  fmon = d3.time.format("%b");

/*
############# PIE CHART ###################
-------------------------------------------
*/


function myFunction() {
  document.getElementById("pieChart2").style.display = 'none';
  document.getElementById("barChart2").style.display = 'none';
}

function showDivPie2() {
  document.getElementById("pieChart2").style.display = 'block';
  document.getElementById("pieChart").style.display = 'none';
  document.getElementById("barChart2").style.display = 'block';
  document.getElementById("barChart").style.display = 'none';
}

function showDivPie1() {
  document.getElementById("pieChart").style.display = 'block';
  document.getElementById("pieChart2").style.display = 'none';
  document.getElementById("barChart2").style.display = 'none';
  document.getElementById("barChart").style.display = 'block';
}

function dsPieChart() {

  var dataset = [{
    category: "Sam",
    measure: 0.30
  }, {
    category: "Peter",
    measure: 0.25
  }, {
    category: "John",
    measure: 0.15
  }, {
    category: "Rick",
    measure: 0.05
  }, {
    category: "Lenny",
    measure: 0.18
  }, {
    category: "Paul",
    measure: 0.04
  }, {
    category: "Steve",
    measure: 0.03
  }];

  var width = 400,
    height = 400,
    outerRadius = Math.min(width, height) / 2,
    innerRadius = outerRadius * .999,
    // for animation
    innerRadiusFinal = outerRadius * .5,
    innerRadiusFinal3 = outerRadius * .45,
    color = d3.scale.category20() //builtin range of colors
  ;

  var vis = d3.select("#pieChart")
    .append("svg:svg") //create the SVG element inside the <body>
    .data([dataset]) //associate our data with the document
    .attr("width", width) //set the width and height of our visualization (these will be attributes of the <svg> tag
    .attr("height", height)
    .append("svg:g") //make a group to hold our pie chart
    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")") //move the center of the pie chart from 0, 0 to radius, radius
  ;

  var arc = d3.svg.arc() //this will create <path> elements for us using arc data
    .outerRadius(outerRadius).innerRadius(innerRadius);

  // for animation
  var arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
  var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

  var pie = d3.layout.pie() //this will create arc data for us given a list of values
    .value(function(d) {
      return d.measure;
    }); //we must tell it out to access the value of each element in our data array

  var arcs = vis.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
    .data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
    .enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
    .append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
    .attr("class", "slice") //allow us to style things in the slices (like text)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("click", up);

  arcs.append("svg:path")
    .attr("fill", function(d, i) {
      return color(i);
    }) //set the color for each slice to be chosen from the color function defined above
    .attr("d", arc) //this creates the actual SVG path using the associated data (pie) with the arc drawing function
    .append("svg:title") //mouseover title showing the figures
    .text(function(d) {
      return d.data.category + ": " + formatAsPercentage(d.data.measure);
    })
    //.each(cycle);

  //	arcs.transition().style("fill-opacity",1).attrTween("d",function(d){return arcTween.call(this,updateArc(d))})



  function cycle(d) {
    d3.select(this).transition()
      .duration(4000)
      .attrTween("transform", function(interpolate) {
        return d3[interpolate](
          "rotate(180)translate(0,-100)",
          "rotate(360)translate(0,-100)"
        );
      })
      .each("end", cycle);
  }

  d3.selectAll("g.slice").selectAll("path").transition()
    .duration(750)
    .delay(10)
    .attr("d", arcFinal);

  // Add a label to the larger arcs, translated to the arc centroid and rotated.
  // source: http://bl.ocks.org/1305337#index.html
  arcs.filter(function(d) {
      return d.endAngle - d.startAngle > .2;
    })
    .append("svg:text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    //.text(function(d) { return formatAsPercentage(d.value); })
    .text(function(d) {
      return d.data.category;
    });

  // Computes the label angle of an arc, converting from radians to degrees.
  function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    return a > 90 ? a - 180 : a;
  }

  var center = vis.append("circle")
    .attr("r", 3)
    .on("click", showDivPie2);


  vis.select("circle");

  // Pie chart title
  /**vis.append("svg:text")
	     	.attr("dy", ".35em")
	      .attr("text-anchor", "middle")
	      .text("Revenue Share 2012")
	      .attr("class","title")
	      ;		**/


  function mouseover() {
    d3.select(this).select("path").transition()
      .duration(750)
      //.attr("stroke","red")
      //.attr("stroke-width", 1.5)
      .attr("d", arcFinal3);
  }

  function mouseout() {
    d3.select(this).select("path").transition()
      .duration(750)
      //.attr("stroke","blue")
      //.attr("stroke-width", 1.5)
      .attr("d", arcFinal);
  }

  function up(d, i) {

    /* update bar chart when user selects piece of the pie chart */
    //updateBarChart(dataset[i].category);
    updateBarChart(d.data.category, color(i));
    //	updateLineChart(d.data.category, color(i));

  }

  function arcTween(b) {
    var i = d3.interpolate(this._current, b);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  }

  function updateArc(d) {
    return {
      x: d.x,
      dx: d.dx
    };
  }

}

function dsPieChart2() {

  var dataset = [{
    category: "Private",
    measure: 0.30
  }, {
    category: "Arch",
    measure: 0.25
  }, {
    category: "Spindrift",
    measure: 0.15
  }];

  var width = 400,
    height = 400,
    outerRadius = Math.min(width, height) / 2,
    innerRadius = outerRadius * .999,
    // for animation
    innerRadiusFinal = outerRadius * .5,
    innerRadiusFinal3 = outerRadius * .45,
    color = d3.scale.category20() //builtin range of colors
  ;

  var vis = d3.select("#pieChart2")
    .append("svg:svg") //create the SVG element inside the <body>
    .data([dataset]) //associate our data with the document
    .attr("width", width) //set the width and height of our visualization (these will be attributes of the <svg> tag
    .attr("height", height)
    .append("svg:g") //make a group to hold our pie chart
    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")") //move the center of the pie chart from 0, 0 to radius, radius
  ;

  var arc = d3.svg.arc() //this will create <path> elements for us using arc data
    .outerRadius(outerRadius).innerRadius(innerRadius);

  // for animation
  var arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
  var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

  var pie = d3.layout.pie() //this will create arc data for us given a list of values
    .value(function(d) {
      return d.measure;
    }); //we must tell it out to access the value of each element in our data array

  var arcs = vis.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
    .data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
    .enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
    .append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
    .attr("class", "slice") //allow us to style things in the slices (like text)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("click", up);

  arcs.append("svg:path")
    .attr("fill", function(d, i) {
      return color(i);
    }) //set the color for each slice to be chosen from the color function defined above
    .attr("d", arc) //this creates the actual SVG path using the associated data (pie) with the arc drawing function
    .append("svg:title") //mouseover title showing the figures
    .text(function(d) {
      return d.data.category + ": " + formatAsPercentage(d.data.measure);
    });

  d3.selectAll("g.slice").selectAll("path").transition()
    .duration(750)
    .delay(10)
    .attr("d", arcFinal);

  // Add a label to the larger arcs, translated to the arc centroid and rotated.
  // source: http://bl.ocks.org/1305337#index.html
  arcs.filter(function(d) {
      return d.endAngle - d.startAngle > .2;
    })
    .append("svg:text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    //.text(function(d) { return formatAsPercentage(d.value); })
    .text(function(d) {
      return d.data.category;
    });

  // Computes the label angle of an arc, converting from radians to degrees.
  function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    return a > 90 ? a - 180 : a;
  }

  var center = vis.append("circle")
    .attr("r", 3)
    .on("click", showDivPie1);


  vis.select("circle");

  // Pie chart title
  /**vis.append("svg:text")
	     	.attr("dy", ".35em")
	      .attr("text-anchor", "middle")
	      .text("Revenue Share 2012")
	      .attr("class","title")
	      ;		**/

  function mouseover() {
    d3.select(this).select("path").transition()
      .duration(750)
      //.attr("stroke","red")
      //.attr("stroke-width", 1.5)
      .attr("d", arcFinal3);
  }

  function mouseout() {
    d3.select(this).select("path").transition()
      .duration(750)
      //.attr("stroke","blue")
      //.attr("stroke-width", 1.5)
      .attr("d", arcFinal);
  }

  function up(d, i) {

    /* update bar chart when user selects piece of the pie chart */
    //updateBarChart(dataset[i].category);
    updateBarChart2(d.data.category, color(i));
    //	updateLineChart(d.data.category, color(i));

  }
}

/*
############# BAR CHART ###################
-------------------------------------------
*/

var data = {
  labels: [
    'Sam', 'Peter', 'John',
    'Rick', 'Lenny', 'Paul', 'Steve'
  ],
  series: [{
    label: 'MTD',
    values: [4, 8, 15, 1, 23, 12, 20]
  }, {
    label: 'YTD',
    values: [12, 43, 22, 11, 73, 25, 42]
  }]
};

var data2 = {
  labels: [
    'PrivateHolding', 'Arch', 'Spindrift'
  ],
  series: [{
    label: 'MTD',
    values: [4, 8, 15]
  }, {
    label: 'YTD',
    values: [12, 43, 22]
  }]
};

// set initial group value
var group = "All";

function datasetBarChosen(group) {

  var zippedData = [];
  for (var i = 0; i < data.labels.length; i++) {
    for (var j = 0; j < data.series.length; j++) {
      zippedData.push(data.series[j].values[i]);
    }
  }
  return zippedData;
}

function datasetBarChosen2(group) {

  var zippedData = [];
  for (var i = 0; i < data2.labels.length; i++) {
    for (var j = 0; j < data2.series.length; j++) {
      zippedData.push(data2.series[j].values[i]);
    }
  }
  return zippedData;
}


function dsBarChartBasics() {

  var chartWidth = 300,
    barHeight = 20,
    groupHeight = barHeight * data.series.length,
    gapBetweenGroups = 5,
    spaceForLabels = 100,
    spaceForLegend = 100,
    color = d3.scale.category20c();

  return {
    //margin : margin,
    chartWidth: chartWidth,
    barHeight: barHeight,
    groupHeight: groupHeight,
    gapBetweenGroups: gapBetweenGroups,
    spaceForLabels: spaceForLabels,
    spaceForLegend: spaceForLegend,
    color: color
  };
}
var bar;

function dsBarChart() {

  var zippedData = datasetBarChosen(group);

  var basics = dsBarChartBasics();

  //var margin = basics.margin,
  var chartWidth = basics.chartWidth,
    barHeight = basics.barHeight,
    groupHeight = basics.groupHeight,
    gapBetweenGroups = basics.gapBetweenGroups,
    spaceForLabels = basics.spaceForLabels,
    spaceForLegend = basics.spaceForLegend,
    color = basics.color;



  var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

  var x = d3.scale.linear()
    .domain([0, d3.max(zippedData)])
    .range([0, chartWidth]);

  var y = d3.scale.linear()
    .range([chartHeight + gapBetweenGroups, 0]);

  var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat('')
    .tickSize(0)
    .orient("left");

  // Specify the chart area and dimensions
  var chart = d3.select(".chart")
    .attr("width", spaceForLabels + chartWidth + spaceForLegend)
    .attr("height", chartHeight);

  // Create bars
  bar = chart.selectAll("g")
    .data(zippedData)
    .enter().append("g")
    .attr("transform", function(d, i) {
      return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / data.series.length))) + ")";
    });

  // Create rectangles of the correct width
  bar.append("rect")
    // .attr("fill", function(d,i) { return color((i % data.series.length)+10); })
    .attr("fill", function(d, i) {
      return color(12 + (i % data.series.length));
    })
    .attr("class", "bar")
    .attr("width", x)
    .attr("height", barHeight - 1);

  // Add text label in bar
  bar.append("text")
    .attr("x", function(d) {
      return x(d) - 3;
    })
    .attr("y", barHeight / 2)
    .attr("fill", "red")
    .attr("dy", ".35em")
    .text(function(d) {
      return d;
    });

  // Draw labels
  bar.append("text")
    .attr("class", "label")
    .attr("x", function(d) {
      return -10;
    })
    .attr("y", groupHeight / 2)
    .attr("dy", ".35em")
    .text(function(d, i) {
      if (i % data.series.length === 0)
        return data.labels[Math.floor(i / data.series.length)];
      else
        return ""
    });

  chart.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups / 2 + ")")
    .call(yAxis);

  // Draw legend
  var legendRectSize = 18,
    legendSpacing = 4;

  var legend = chart.selectAll('.legend')
    .data(data.series)
    .enter()
    .append('g')
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset = -gapBetweenGroups / 2;
      var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
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
    .attr('class', 'legend')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) {
      return d.label;
    });
}
var bar2;

function dsBarChart2() {

  var zippedData = datasetBarChosen2(group);

  var basics = dsBarChartBasics();

  //var margin = basics.margin,
  var chartWidth = basics.chartWidth,
    barHeight = basics.barHeight,
    groupHeight = basics.groupHeight,
    gapBetweenGroups = basics.gapBetweenGroups,
    spaceForLabels = basics.spaceForLabels,
    spaceForLegend = basics.spaceForLegend,
    color = basics.color;



  var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data2.labels.length;

  var x = d3.scale.linear()
    .domain([0, d3.max(zippedData)])
    .range([0, chartWidth]);

  var y = d3.scale.linear()
    .range([chartHeight + gapBetweenGroups, 0]);

  var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat('')
    .tickSize(0)
    .orient("left");

  // Specify the chart area and dimensions
  var chart = d3.select(".chart2")
    .attr("width", spaceForLabels + chartWidth + spaceForLegend)
    .attr("height", chartHeight);

  // Create bars
  bar2 = chart.selectAll("g")
    .data(zippedData)
    .enter().append("g")
    .attr("transform", function(d, i) {
      return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / data2.series.length))) + ")";
    });

  // Create rectangles of the correct width
  bar2.append("rect")
    // .attr("fill", function(d,i) { return color(i % data.series.length); })
    .attr("fill", function(d, i) {
      return color(i % data2.series.length);
    })
    .attr("class", "bar")
    .attr("width", x)
    .attr("height", barHeight - 1);

  // Add text label in bar
  bar2.append("text")
    .attr("x", function(d) {
      return x(d) - 15;
    })
    .attr("y", barHeight / 2)
    .attr("fill", "black")
    .attr("dy", ".35em")
    .text(function(d) {
      return d;
    });

  // Draw labels
  bar2.append("text")
    .attr("class", "label")
    .attr("x", function(d) {
      return -70;
    })
    .attr("y", groupHeight / 2)
    .attr("dy", ".35em")
    .text(function(d, i) {
      if (i % data2.series.length === 0)
        return data2.labels[Math.floor(i / data2.series.length)];
      else
        return ""
    })
    /**.attr("transform", function(d) {
        return "rotate(-15)"
    })**/
  ;

  chart.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups / 2 + ")")
    .call(yAxis);

  // Draw legend
  var legendRectSize = 18,
    legendSpacing = 4;

  var legend = chart.selectAll('.legend')
    .data(data.series)
    .enter()
    .append('g')
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset = -gapBetweenGroups / 2;
      var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
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
    .attr('class', 'legend')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) {
      return d.label;
    });
}

/* ** UPDATE CHART ** */

/* updates bar chart on request */

function shadeColor1(color, percent) {
  var num = parseInt(color.slice(1), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function updateBarChart(group, colorChosen) {

  var currentDatasetBarChart = datasetBarChosen(group);

  var rects = bar.selectAll("rect");
  for (i = 0; i < rects.length; i++) {

    if (rects[i].parentNode.textContent.indexOf(group) != -1) {
      //alert("Found");
      rect = rects[i][0];
      rects[i][0].attributes.fill.value = colorChosen;
      rects[i + 1][0].attributes.fill.value = shadeColor1(colorChosen, 10);
      setTimeout(clearColor, 700);
    }


    i++
  }

}

function updateBarChart2(group, colorChosen) {

  var currentDatasetBarChart = datasetBarChosen2(group);

  var rects = bar2.selectAll("rect");
  for (i = 0; i < rects.length; i++) {

    if (rects[i].parentNode.textContent.indexOf(group) != -1) {
      //alert("Found");
      rect = rects[i][0];
      rects[i][0].attributes.fill.value = colorChosen;
      rects[i + 1][0].attributes.fill.value = shadeColor1(colorChosen, 10);

      setTimeout(clearColor2, 1000);

    }


    i++
  }

}

function clearColor() {

  var rects = bar.selectAll("rect");
  for (i = 0; i < rects.length; i += 2) {
    rects[i][0].attributes.fill.value = "#1f77b4";
    rects[i + 1][0].attributes.fill.value = "#aec7e8";

  }
}

function clearColor2() {

  var rects = bar2.selectAll("rect");
  for (i = 0; i < rects.length; i += 2) {
    rects[i][0].attributes.fill.value = "#1f77b4";
    rects[i + 1][0].attributes.fill.value = "#aec7e8";

  }
}


/*
############# LINE CHART ##################
-------------------------------------------
*/

var datasetLineChart = [{
  group: "All",
  category: 2008,
  measure: 289309
}, {
  group: "All",
  category: 2009,
  measure: 234998
}, {
  group: "All",
  category: 2010,
  measure: 310900
}, {
  group: "All",
  category: 2011,
  measure: 223900
}, {
  group: "All",
  category: 2012,
  measure: 234500
}, {
  group: "Sam",
  category: 2008,
  measure: 81006.52
}, {
  group: "Sam",
  category: 2009,
  measure: 70499.4
}, {
  group: "Sam",
  category: 2010,
  measure: 96379
}, {
  group: "Sam",
  category: 2011,
  measure: 64931
}, {
  group: "Sam",
  category: 2012,
  measure: 70350
}, {
  group: "Peter",
  category: 2008,
  measure: 63647.98
}, {
  group: "Peter",
  category: 2009,
  measure: 61099.48
}, {
  group: "Peter",
  category: 2010,
  measure: 87052
}, {
  group: "Peter",
  category: 2011,
  measure: 58214
}, {
  group: "Peter",
  category: 2012,
  measure: 58625
}, {
  group: "Rick",
  category: 2008,
  measure: 23144.72
}, {
  group: "Rick",
  category: 2009,
  measure: 14099.88
}, {
  group: "Rick",
  category: 2010,
  measure: 15545
}, {
  group: "Rick",
  category: 2011,
  measure: 11195
}, {
  group: "Rick",
  category: 2012,
  measure: 11725
}, {
  group: "John",
  category: 2008,
  measure: 34717.08
}, {
  group: "John",
  category: 2009,
  measure: 30549.74
}, {
  group: "John",
  category: 2010,
  measure: 34199
}, {
  group: "John",
  category: 2011,
  measure: 33585
}, {
  group: "John",
  category: 2012,
  measure: 35175
}, {
  group: "Lenny",
  category: 2008,
  measure: 69434.16
}, {
  group: "Lenny",
  category: 2009,
  measure: 46999.6
}, {
  group: "Lenny",
  category: 2010,
  measure: 62180
}, {
  group: "Lenny",
  category: 2011,
  measure: 40302
}, {
  group: "Lenny",
  category: 2012,
  measure: 42210
}, {
  group: "Paul",
  category: 2008,
  measure: 7232.725
}, {
  group: "Paul",
  category: 2009,
  measure: 4699.96
}, {
  group: "Paul",
  category: 2010,
  measure: 6218
}, {
  group: "Paul",
  category: 2011,
  measure: 8956
}, {
  group: "Paul",
  category: 2012,
  measure: 9380
}, {
  group: "Steve",
  category: 2008,
  measure: 10125.815
}, {
  group: "Steve",
  category: 2009,
  measure: 7049.94
}, {
  group: "Steve",
  category: 2010,
  measure: 9327
}, {
  group: "Steve",
  category: 2011,
  measure: 6717
}, {
  group: "Steve",
  category: 2012,
  measure: 7035
}];

// set initial category value
var group = "All";

function datasetLineChartChosen(group) {
  var ds = [];
  for (x in datasetLineChart) {
    if (datasetLineChart[x].group == group) {
      ds.push(datasetLineChart[x]);
    }
  }
  return ds;
}

function dsLineChartBasics() {

  var margin = {
      top: 20,
      right: 10,
      bottom: 0,
      left: 50
    },
    width = 500 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

  return {
    margin: margin,
    width: width,
    height: height
  };
}


function dsLineChart() {

  var firstDatasetLineChart = datasetLineChartChosen(group);

  var basics = dsLineChartBasics();

  var margin = basics.margin,
    width = basics.width,
    height = basics.height;

  var xScale = d3.scale.linear()
    .domain([0, firstDatasetLineChart.length - 1])
    .range([0, width]);

  var yScale = d3.scale.linear()
    .domain([0, d3.max(firstDatasetLineChart, function(d) {
      return d.measure;
    })])
    .range([height, 0]);

  var line = d3.svg.line()
    //.x(function(d) { return xScale(d.category); })
    .x(function(d, i) {
      return xScale(i);
    })
    .y(function(d) {
      return yScale(d.measure);
    });

  var svg = d3.select("#lineChart").append("svg")
    .datum(firstDatasetLineChart)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    // create group and move it so that margins are respected (space for axis and title)

  var plot = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("id", "lineChartPlot");

  /* descriptive titles as part of plot -- start */
  var dsLength = firstDatasetLineChart.length;

  plot.append("text")
    .text(firstDatasetLineChart[dsLength - 1].measure)
    .attr("id", "lineChartTitle2")
    .attr("x", width / 2)
    .attr("y", height / 2);
  /* descriptive titles -- end */

  plot.append("path")
    .attr("class", "line")
    .attr("d", line)
    // add color
    .attr("stroke", "lightgrey");

  plot.selectAll(".dot")
    .data(firstDatasetLineChart)
    .enter().append("circle")
    .attr("class", "dot")
    //.attr("stroke", function (d) { return d.measure==datasetMeasureMin ? "red" : (d.measure==datasetMeasureMax ? "green" : "steelblue") } )
    .attr("fill", function(d) {
      return d.measure == d3.min(firstDatasetLineChart, function(d) {
        return d.measure;
      }) ? "red" : (d.measure == d3.max(firstDatasetLineChart, function(d) {
        return d.measure;
      }) ? "green" : "white")
    })
    //.attr("stroke-width", function (d) { return d.measure==datasetMeasureMin || d.measure==datasetMeasureMax ? "3px" : "1.5px"} )
    .attr("cx", line.x())
    .attr("cy", line.y())
    .attr("r", 3.5)
    .attr("stroke", "lightgrey")
    .append("title")
    .text(function(d) {
      return d.category + ": " + formatAsInteger(d.measure);
    });

  svg.append("text")
    .text("Performance 2012")
    .attr("id", "lineChartTitle1")
    .attr("x", margin.left + ((width + margin.right) / 2))
    .attr("y", 10);

}

//dsLineChart();


/* ** UPDATE CHART ** */

/* updates bar chart on request */
function updateLineChart(group, colorChosen) {

  var currentDatasetLineChart = datasetLineChartChosen(group);

  var basics = dsLineChartBasics();

  var margin = basics.margin,
    width = basics.width,
    height = basics.height;

  var xScale = d3.scale.linear()
    .domain([0, currentDatasetLineChart.length - 1])
    .range([0, width]);

  var yScale = d3.scale.linear()
    .domain([0, d3.max(currentDatasetLineChart, function(d) {
      return d.measure;
    })])
    .range([height, 0]);

  var line = d3.svg.line()
    .x(function(d, i) {
      return xScale(i);
    })
    .y(function(d) {
      return yScale(d.measure);
    });

  var plot = d3.select("#lineChartPlot")
    .datum(currentDatasetLineChart);

  /* descriptive titles as part of plot -- start */
  var dsLength = currentDatasetLineChart.length;

  plot.select("text")
    .text(currentDatasetLineChart[dsLength - 1].measure);
  /* descriptive titles -- end */

  plot
    .select("path")
    .transition()
    .duration(750)
    .attr("class", "line")
    .attr("d", line)
    // add color
    .attr("stroke", colorChosen);

  var path = plot
    .selectAll(".dot")
    .data(currentDatasetLineChart)
    .transition()
    .duration(750)
    .attr("class", "dot")
    .attr("fill", function(d) {
      return d.measure == d3.min(currentDatasetLineChart, function(d) {
        return d.measure;
      }) ? "red" : (d.measure == d3.max(currentDatasetLineChart, function(d) {
        return d.measure;
      }) ? "green" : "white")
    })
    .attr("cx", line.x())
    .attr("cy", line.y())
    .attr("r", 3.5)
    // add color
    .attr("stroke", colorChosen);

  path
    .selectAll("title")
    .text(function(d) {
      return d.category + ": " + formatAsInteger(d.measure);
    });

}

function createAllFundsViz(funds, svg, arc, path, layout) {

  // Compute the chord layout.
  layout.matrix(funds.hits.hits[0]._source.fundRelation);

  // Add a group per neighborhood.
  var group = svg.selectAll(".group")
    .data(layout.groups)
    .enter().append("g")
    .attr("class", "group")
    .on("click", click);


  // Add the group arc.
  var groupPath = group.append("path")
    .attr("id", function(d, i) {
      return "group" + i;
    })
    .attr("d", arc)
    .style("fill", function(d, i) {
      return funds.hits.hits[0]._source.fundColor[i];
    });

  // Add a text label.
  var groupText = group.append("text")
    .attr("x", 6)
    .attr("dy", 15);

  groupText.append("textPath")
    .attr("xlink:href", function(d, i) {
      return "#group" + i;
    })
    .text(function(d, i) {
      return funds.hits.hits[0]._source.fundName[i];
    });

  // Remove the labels that don't fit. :(
  groupText.filter(function(d, i) {
      return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength();
    })
    .remove();

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
    return funds.hits.hits[0]._source.fundName[d.source.index] + " & " + funds.hits.hits[0]._source.fundName[d.target.index] + "\nBelong to Same Category";
  });

  function click(d, i) {
    populateFundInfo(i + 1); // as in json 0th entry is different , generic info not fund specific
    document.getElementById("fundProps").style.display = 'block';

    chord.classed("fade", function(p) {
      return p.source.index != i && p.target.index != i;
    });
  }

  function populateFundInfo(index) {
    var investmentApproach;
    var inceptionDate;
    var strategyAUM;
    var MTD;
    var YTD;
    var annualizedSinceInception;
    var status;
    var fundName;
    var category;



    fundName = funds.hits.hits[index]._source.fundName
    investmentApproach = "Investment Approach : " + funds.hits.hits[index]._source.InvestmentApproach;
    inceptionDate = "Inception Date :" + funds.hits.hits[index]._source.InceptionDate;
    strategyAUM = "Strategy AUM (US$ mil) : " + funds.hits.hits[index]._source.StrategyAUM;
    MTD = "MTD(net) : " + funds.hits.hits[index]._source.MTD + "%";
    YTD = "YTD(net) : " + funds.hits.hits[index]._source.YTD + "%";
    annualizedSinceInception = "Annualized Since Inception(net) : " + funds.hits.hits[index]._source.AnnualizedSinceInception;
    status = "Status : " + funds.hits.hits[index]._source.Status;
    category = funds.hits.hits[index]._source.Category;


    d3.select("#fundName").text(fundName);
    d3.select("#fundApproach").text(investmentApproach);
    d3.select("#inceptionDate").text(inceptionDate);
    d3.select("#strategyAUM").text(strategyAUM);
    d3.select("#MTD").text(MTD);
    d3.select("#YTD").text(YTD);
    d3.select("#annualizedSinceInception").text(annualizedSinceInception);
    d3.select("#status").text(status);
    d3.select("#categoryName").text("Showing funds in category :" + category);

  }
}

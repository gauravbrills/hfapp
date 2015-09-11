angular.module('hfapp.controllers', [])

.controller('acctSummCtrl', function($scope, acctsumm) {
  $scope.data = acctsumm.get();
  $scope.data.$promise.then(function(data) {
    drawacctsumm(data);
  });

  })
  .controller('fundAumCtrl', function($scope, funds) {
    $scope.data = funds.get();
    $scope.data.$promise.then(function(data) {
      fundDescRenderer(data);
    });
  })

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('allfundsCtrl', function($scope, $ionicLoading, allfunds) {
  var graphWidth = 420,
    graphHeight = 420;
  if (document.getElementById('main-wrap').clientWidth < 420) {
    var fluidDim = .9 * document.getElementById('main-wrap').clientWidth;
    graphWidth = fluidDim;
    graphHeight = fluidDim;
  }
  var width = graphWidth,
    height = graphHeight,
    outerRadius = Math.min(width, height) / 2 - 10,
    innerRadius = outerRadius - 24;

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
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  svg.append("circle")
    .attr("r", outerRadius);
  // get all funds data
  $scope.data = allfunds.get();
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };
  $scope.data.$promise.then(function(data) {
    createAllFundsViz(data, svg, arc, path, layout);
  });
  $scope.hide = function() {
    $ionicLoading.hide();
  };
});

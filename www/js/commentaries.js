function openCommGraph($scope, comm) {
  currentFund = function currentFund(name, date, fullText, img) {
    this.name = name;
    this.date = date;
    this.fullText = fullText;
    this.img = img;
  };
  openCommentary = function openCommentary(fund, month) {
    var nodes = comm.hits.hits;
    angular.forEach(nodes, function(value, key) {
      var node = value._source;
      if (node.name == fund && node.date.startsWith(month)) {
        $scope.currentFund = new currentFund(node.name, node.date, node.fullText, node.img);
        $scope.showComm = true;
        if (!$scope.$$phase) {
          $scope.$apply();
        }
        return;
      }
    });
  }
  $(function() {
    $('#container').highcharts({
      chart: {
        type: 'scatter'
      },
      title: {
        text: 'Market Commentaries'
      },
      subtitle: {
        text: 'Annual Meetings and Quarterly Fund Updates'
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
      },
      yAxis: {
        categories: ['Fund A', 'Fund B', 'Fund C', 'Fund D'],
        title: {
          text: 'Funds'
        },
        labels: {
          enabled: false
        },
        gridLineColor: 'transparent'
      },
      tooltip: {
        crosshairs: true,
        shared: true,
        enabled: false
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 7,
            lineColor: '#666666',
            lineWidth: 1
          },
          cursor: 'pointer',
          point: {
            events: {

              click: function($event) {
                var fundSelected = $event.point.series.name;
                var date = $event.point.category;
                console.log(fundSelected, date);
                openCommentary(fundSelected, date);
                $scope.showComm = false;
              }

            }
          }
        }
      },
      series: [{
        name: 'Fund A',
        marker: {
          symbol: 'square'
        },
        data: [7.0, 9.5, 14.5, 18.2, 21.5, 25.2, 29, 23.3, 18.3, 13.9, 9.6]

      }, {
        name: 'Fund B',
        marker: {
          symbol: 'diamond'
        },
        data: [2.5, 4.2, 5.7, 8.9]
      }, {
        name: 'Fund C',
        marker: {
          symbol: 'circle'
        },
        data: [3.9, 14, 2, 17, 15, 18]
      }, {
        name: 'Fund D',
        marker: {
          symbol: 'triangle'
        },
        data: [1, 2, 8, 7, 12, 18, 19.3, 17.9, 9]
      }]
    });
  });
}

angular.module('hfapp.controllers', [])
  .controller('acctSummCtrl', function($scope, $window, $ionicLoading, acctsumm) {
    $scope.data = acctsumm.get();
    $ionicLoading.show({
      template: 'Loading the awesome...'
    });
    $scope.data.$promise.then(function(data) {
      drawacctsumm(data, $window, $scope);
      $ionicLoading.hide();
    });
  })
  .controller('fundAumCtrl', function($scope, funds) {
    $scope.data = funds.get();
    $scope.data.$promise.then(function(data) {
      fundDescRenderer(data);
    });
  })

.controller('checkForUpdatesCtrl', function($scope) {
    var deploy = new Ionic.Deploy();

    // Update app code with new release from Ionic Deploy
    $scope.doUpdate = function() {
      deploy.update().then(function(res) {
        console.log('Ionic Deploy: Update Success! ', res);
      }, function(err) {
        console.log('Ionic Deploy: Update error! ', err);
      }, function(prog) {
        console.log('Ionic Deploy: Progress... ', prog);
      });
    };

    // Check Ionic Deploy for new code
    $scope.checkForUpdates = function() {
      console.log('Ionic Deploy: Checking for updates');
      deploy.check().then(function(hasUpdate) {
        console.log('Ionic Deploy: Update available: ' + hasUpdate);
        $scope.hasUpdate = hasUpdate;
      }, function(err) {
        console.error('Ionic Deploy: Unable to check for updates', err);
      });
    }
  })
  .controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.login = function() {
      LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
        $state.go('app.acctsumm');
      }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
    }
  })
  .controller('allfundsCtrl', function($scope, $ionicModal, $ionicLoading, $window, allfunds, allfundsmodel) {
    $scope.fundapproach = "All";
    // get all funds data
    $scope.model = allfundsmodel.get();
    //$scope.data = allfunds.getSortedFunds('{ "sort": { "fundName": { "order": "asc" }}}');
    $scope.data = allfunds.getSortedFunds();
    $ionicLoading.show({
      template: 'Loading the awesome...'
    });
    $scope.data.$promise.then(function(data) {
      $scope.model.$promise.then(function(model) {
        createAllFundsViz($scope, $window, model, data);
        $ionicLoading.hide();
      });
      // modal stuff
      $ionicModal.fromTemplateUrl('templates/allfunds-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openFndVizModal = function() {
        $scope.modal.show();
        renderDataVizModal($scope);

      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });
      // graph corousal
      $scope.openGraph = function openGraph(key) {
        if (key == "NETRET") {
          showContGraph("Comparing Net Returns", "% Returns", $scope.graphdata.HistoricalDates, $scope.graphdata.NetReturn);
        } else if (key == "TOTEXP") {
          showContGraph("Comparing Total Exposure", "Aum million $", $scope.graphdata.HistoricalDates, $scope.graphdata.TotalExposure);
        } else if (key == "GRSSRET") {
          showContGraph("Comparing Gross Returns", "% Returns", $scope.graphdata.HistoricalDates, $scope.graphdata.GrossReturn);
        } else if (key == "GLEXP") {
          showContGraph("Comparing Gross Long Exposure", "Aum million $", $scope.graphdata.HistoricalDates, $scope.graphdata.GrossLongExposure);
        } else if (key == "NETEXP") {
          showContGraph("Comparing Long Positions", "Aum million $", $scope.graphdata.HistoricalDates, $scope.graphdata.LongPositions);
        } else if (key == "GRSSRET") {
          showContGraph("Comparing Gross Returns", "% Returns", $scope.graphdata.HistoricalDates, $scope.graphdata.GrossReturn);
        } else if (key == "LNGPSN") {
          showContGraph("Comparing Long Positions", "Aum million $", $scope.graphdata.HistoricalDates, $scope.graphdata.LongPositions);
        } else if (key == "MTDYTD") {
          var series = [{
            name: 'YTD',
            data: $scope.graphdata.YTD
          }, {
            name: 'MTD',
            data: $scope.graphdata.MTD
          }];
          showBarGph('YTD MTD Comparison', series, $scope.graphdata);
        } else if (key == "SAUM") {
          var series = [{
            name: 'Strategic AUM (million $)',
            data: $scope.graphdata.AUM
          }];
          showBarGph('Strategic AUM Comparison', series, $scope.graphdata);
        } else if (key == "SHRTPSN") {
          showContGraph("Comparing Short Positions", "% Returns", $scope.graphdata.HistoricalDates, $scope.graphdata.ShortPositions);
        } else if (key == "HAUM") {
          showContGraph("Comparing Historical AUM", "Aum million $", $scope.graphdata.HistoricalDates, $scope.graphdata.HistoricalAUM);
        }
      }
    });

    $scope.doRefresh = function() {
      $scope.data = allfunds.get();
      $scope.data.$promise.then(function(data) {
        $scope.model.$promise.then(function(model) {
          createAllFundsViz($scope, $window, model, data);
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });
      });
    }

  });

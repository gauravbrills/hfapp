angular.module('hfapp.controllers', [])

.controller('acctSummCtrl', function($scope, $window, acctsumm) {
    $scope.data = acctsumm.get();
    $scope.data.$promise.then(function(data) {
      drawacctsumm(data, $window, $scope);
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

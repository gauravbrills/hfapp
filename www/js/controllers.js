angular.module('hfapp.controllers', [])

.controller('DashCtrl', function($scope) {
  myFunction();
  dsPieChart();
  dsPieChart2();
})

.controller('ChatsCtrl', function($scope, funds) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.data = funds.get();
  $scope.data.$promise.then(function(data) {
      fundDescRenderer(data);
  });
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

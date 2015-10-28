var initCloudServices = function initCloudServices($rootScope, $ionicPopup, $ionicPlatform, $ionicPush) {
  var user = Ionic.User.current();
  // this will give you a fresh user or the previously saved 'current user'
  var success = function(loadedUser) {
    // if this user should be treated as the current user,
    // you will need to set it as such:
    Ionic.User.current(loadedUser);
    //kickOffpush($rootScope, $ionicPopup, $ionicPlatform, $ionicPush);
    // assuming you previous had var user = Ionic.User.current()
    // you will need to update your variable reference
    var user = Ionic.User.current();
    user.addPushToken($rootScope.deviceToken);
    user.save();
    $rootScope.currentUserName = user.get('name');
    $rootScope.avatar = user.get('avatar');
    console.log('Found User ' + user.get('name'));
  };
  var failure = function(error) {
    console.log('something went wrong in getting user');
    user.id = Ionic.User.anonymousId();
    user.save();
  };
  Ionic.User.load($rootScope.user.ionicuid).then(success, failure);

}

function kickOffpush($rootScope, $ionicPopup, $ionicPlatform, $ionicPush) {
  // kick off the platform web client
$ionicPush.init({
    "debug": true,
    "onNotification": function(notification) {
      // var text = notification._raw.text; -- for dummy push
      var text = notification.title; // for real push
      text = text.replace(/#/g, '"');
      var pushNote = $rootScope.$eval(text);
      $rootScope.pushNotes.push(pushNote);
      $rootScope.notificationCount = $rootScope.pushNotes.length;
      if (!$rootScope.silenceNotification) {
        var popup = $ionicPopup.alert({
          title: "<i class='icon ion-lightbulb'></i>  Fund Notification",
          template: pushNote.title
        });
      }
      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }
      console.log("added ", pushNote);
    },
    "onRegister": function(data) {
      $rootScope.deviceToken = data.token;
      user.addPushToken(data.token);
      user.save();
    },
    "pluginConfig": {
      "ios": {
        "badge": true,
        "sound": true
      },
      "android": {
        "iconColor": "#343434"
      }
    }
  });
$ionicPush.register();

}

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('hfapp', ['ionic', 'ionic.service.core', 'ionic.service.push', 'hfapp.controllers', 'hfapp.services'])

.run(function($rootScope, $ionicPopup, $ionicPlatform) {
  $ionicPlatform.ready(function() {
    Ionic.io();
    $rootScope.pushNotes = [];
    var user = Ionic.User.current();
    // this will give you a fresh user or the previously saved 'current user'
    var success = function(loadedUser) {
      // if this user should be treated as the current user,
      // you will need to set it as such:
      Ionic.User.current(loadedUser);
      // assuming you previous had var user = Ionic.User.current()
      // you will need to update your variable reference
      var user = Ionic.User.current();
      console.log('Found User ' + user.get('name'));
    };
    var failure = function(error) {
      console.log('something went wrong in getting user');
      user.id = Ionic.User.anonymousId();
      user.save();
    };
    Ionic.User.load('c920919f-18a5-4f4c-a2f8-1eca3477689a').then(success, failure);
    // kick off the platform web client
    var push = new Ionic.Push({
      "debug": true,
      "onNotification": function(notification) {
        var text = notification._raw.text;
        text = text.replace(/#/g, '"');
        var pushNote = $rootScope.$eval(text);
        $rootScope.pushNotes.push(pushNote);
        $rootScope.notificationCount = $rootScope.pushNotes.length;
        var popup = $ionicPopup.alert({
          title: "<i class='icon ion-lightbulb'></i>  Fund Notification",
          template: pushNote.title
        });
        if (!$rootScope.$$phase) {
          $rootScope.$apply();
        }
        console.log("added ", pushNote);
      },
      "onRegister": function(data) {
        $rootScope.deviceToken = data.token;
        console.log("device token " + data.token);
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

    push.register(function(token) {
      console.log("Device token:" + token.token + token.platform);
    });
    push.addTokenToUser(user);
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.navigator && window.navigator.splashscreen) {
      window.plugins.orientationLock.unlock();
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  // side menu
  //login page
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html'
    })
    .state('app.acctsumm', {
      url: '/acctsumm',
      views: {
        'menuContent': {
          templateUrl: 'templates/acctsumm.html',
          controller: 'acctSummCtrl'
        }
      }
    })
    .state('app.allfunds', {
      //  cache: false,
      url: '/allfunds',
      views: {
        'menuContent': {
          templateUrl: 'templates/allfunds.html',
          controller: 'allfundsCtrl'
        }
      }
    })
    .state('app.marketcommentary', {
      url: '/marketcommentary',
      views: {
        'menuContent': {
          templateUrl: 'templates/marketcommentary.html',
          controller: 'marketcommentaryCtrl'
        }
      }
    })
    .state('app.checkForUpdates', {
      cache: false,
      url: '/checkForUpdates',
      views: {
        'menuContent': {
          templateUrl: 'templates/checkForUpdates.html',
          controller: 'checkForUpdatesCtrl'
        }
      }
    })
    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});

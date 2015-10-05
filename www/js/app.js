// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('hfapp', ['ionic', 'ionic.service.core', 'hfapp.controllers', 'hfapp.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // kick off the platform web client
    Ionic.io();
    var push = new Ionic.Push({
      "debug": true
    });

    push.register(function(token) {
      console.log("Device token:", token.token);
    });
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
    .state('app.fundDescription', {
      url: '/fundDescription',
      views: {
        'menuContent': {
          templateUrl: 'templates/fundDescription.html',
          controller: 'fundAumCtrl'
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

// Ionic Starter App
var notificationType = {
    NOTE: "note",
    CMS: "cms"
};

angular.module('hfapp', ['ionic','ionic.service.core', 'pdf',  'ionic.service.push', 'ionic.service.analytics', 'hfapp.controllers', 'hfapp.services'])

.run(function($rootScope, $ionicPopup, $ionicPlatform, $ionicAnalytics, cms, $parse) {
    $ionicPlatform.ready(function() {
        Ionic.io();
        $ionicAnalytics.register();
        $rootScope.profile = {};
        $rootScope.pushNotes = [];
        $rootScope.silenceNotification = false;
        $rootScope.userEs = "";

        var push = new Ionic.Push({
            "debug": true,
            "onNotification": function(notification) {
                var text = notification.text; //for dummy push
                //var text = notification.title; // for real push
                text = text.replace(/#/g, '"');
                var notification = $rootScope.$eval(text);
                switch (notification.type) {
                    case notificationType.NOTE:
                        $rootScope.pushNotes.push(notification);
                        $rootScope.notificationCount = $rootScope.pushNotes.length;
                        if (!$rootScope.silenceNotification) {
                            var popup = $ionicPopup.alert({
                                title: "<i class='icon ion-lightbulb'></i>  Fund Notification",
                                template: notification.title
                            });
                        }
                        if (!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                        console.log("added ", pushNote);
                        break;
                    case notificationType.CMS:
                        // get rule and apply content
                        cms.get({
                            term: notification.tagupdated
                        }).$promise.then(function(data) {
                            console.log("Rule to update ", data);
                            // add rule to scope
                            var node = data._source;
                            var model = $parse(node.codeValue);
                            // Assigns a value to it
                            model.assign($rootScope, node.content);
                            // Apply it to the scope
                            if (!$rootScope.$$phase) {
                                $rootScope.$apply();
                            }
                        });
                        break;
                }
            },
            "onRegister": function(data) {
                $rootScope.deviceToken = data.token;
                //user.addPushToken(data.token);
                //user.save();
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


        // register ionic push callback

        var callback = function(token) {
            console.log('Registered token:', token.token);
            push.saveToken(token);
        }

        push.register(callback);

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
        .state('app.cms', {
            cache: false,
            url: '/cms',
            views: {
                'menuContent': {
                    templateUrl: 'templates/cms.html',
                    controller: 'cmsCtrl'
                }
            }
        })
        .state('app.userprofile', {
            cache: false,
            url: '/userprofile',
            views: {
                'menuContent': {
                    templateUrl: 'templates/userProfile.html',
                    controller: 'userprofileCtrl'
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

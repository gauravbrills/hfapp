'use strict'
angular.module('hfapp.services', ['ngResource'])
  .constant('ApiEndpoint', {
    url: '/api'
  })
  // For the real endpoint, we'd use this /api
  // .constant('ApiEndpoint', {
  //  url: 'http://elastic.pixelsorcery.in/elasticsearch'
  // })
  .service('LoginService', function($q, $rootScope, user, $ionicPopup, $ionicPlatform, $ionicPush) {
    return {
      loginUser: function(name, pw) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get data from user service
        user.get({
          userid: name
        }).$promise.then(function(data) {
            if (pw == data._source.password) {
              $rootScope.user = data._source;
              initCloudServices($rootScope, $ionicPopup, $ionicPlatform, $ionicPush);
              deferred.resolve('Welcome ' + name + '!');
            } else {
              deferred.reject('Wrong credentials.');
            }
          },
          function(reason) {
            deferred.reject('Wrong credentials.');
            console.log('Failed: ' + reason);
          });
        // --------
        promise.success = function(fn) {
          promise.then(fn);
          return promise;
        }
        promise.error = function(fn) {
          promise.then(null, fn);
          return promise;
        }
        return promise;
      }
    }
  })
  .factory('user', function($resource, ApiEndpoint) {
    return $resource(ApiEndpoint.url + '/users/user/:userid', {
      userid: "@userid"
    }, {
      getByUserId: {
        method: 'GET'
      }
    });
  }).factory('allfunds', function($resource, ApiEndpoint) {
    // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
    // '/data/allfunds.json'
    // ApiEndpoint.url + '/transactions/transaction/_search?size=30'
    return $resource(ApiEndpoint.url + '/transactions/transaction/_search?size=30', {}, {
      getSortedFunds: {
        method: 'GET'
      }
    });
  }).factory('cms', function($resource, ApiEndpoint) {
    // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
    // '/data/allfunds.json'
    // ApiEndpoint.url + '/transactions/transaction/_search?size=30'
    return $resource(ApiEndpoint.url + '/ruleengine/rule/_search', {}, {
      getAllRules: {
        method: 'GET'
      }
    });
  }).factory('allfundsmodel', function($resource, ApiEndpoint) {
    // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
    // '/data/model.json'
    // ApiEndpoint.url + '/fundrelation/fundrelation/_search'
    return $resource(ApiEndpoint.url + '/fundrelation/fundrelation/_search', {}, {
      get: {
        method: 'GET'
      }
    });
  })
  .factory('marketcommentary', function($resource, ApiEndpoint) {
    // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
    // '/data/comm.json'
    // ApiEndpoint.url + '/commentaries/commentary/_search?size=31'
    return $resource(ApiEndpoint.url + '/commentaries/commentary/_search?size=31', {}, {
      get: {
        method: 'GET'
      }
    });
  })
  .factory('acctsumm', function($resource, ApiEndpoint) {
    // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
    // '/data/acctsumm.json'
    // ApiEndpoint.url + '/acctsummaries/account/_search?sort=_uid'
    return $resource(ApiEndpoint.url + '/acctsummaries/account/_search?sort=_uid', {}, {
      get: {
        method: 'GET'
      }
    });
  });

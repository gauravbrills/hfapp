'use strict'
angular.module('hfapp.services', ['ngResource'])
  .constant('ApiEndpoint', {
    url: '/api'
  })
  // For the real endpoint, we'd use this
  // .constant('ApiEndpoint', {
  //  url: 'http://es.pixelsorcery.in:9200'
  // })
  .factory('funds', function($resource) {
    // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
    // /api/transactions/transaction/_search'
    return $resource('/data/aum.json', {}, {
      get: {
        method: 'GET'
      }
    });
  }).factory('allfunds', function($resource, ApiEndpoint) {
    // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
    // /api/transactions/transaction/_search'
    return $resource(ApiEndpoint.url + '/transactions/transaction/_search?size=30', {}, {
      getSortedFunds: {
        method: 'GET'
      }
    });
  }).factory('allfundsmodel', function($resource, ApiEndpoint) {
    // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
    // /api/transactions/transaction/_search'
    return $resource(ApiEndpoint.url + '/fundrelation/fundrelation/_search', {}, {
      get: {
        method: 'GET'
      }
    });
  }).factory('acctsumm', function($resource, ApiEndpoint) {
    // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
    return $resource(ApiEndpoint.url +'/acctsummaries/account/_search?sort=_uid', {}, {
      get: {
        method: 'GET'
      }
    });
  });

'use strict'
angular.module('hfapp.services', ['ngResource'])

.factory('funds', function($resource) {
    // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
    // /api/transactions/transaction/_search'
        return $resource('/data/aum.json', {}, {
          get: {
            method: 'GET'
          }
        });
  }).factory('allfunds', function($resource) {
      // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
      // /api/transactions/transaction/_search'
          return $resource('/data/allfunds.json', {}, {
            get: {
              method: 'GET'
            }
          });
    })  .factory('acctsumm', function($resource) {
      // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
          return $resource('/data/acctsumm.json', {}, {
            get: {
              method: 'GET'
            }
          });
    });

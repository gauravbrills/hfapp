'use strict'
angular.module('hfapp.services', ['ngResource'])
    .constant('ApiEndpoint', {
        url: '/test'
    })
    // For the real endpoint, we'd use this /api
    // .constant('ApiEndpoint', {https://hf-harness-5501403966.us-east-1.bonsai.io
    //  url: 'http://elastic.pixelsorcery.in/elasticsearch'
    // })
    .service('LoginService', function($q, $rootScope, user, $ionicPopup, $ionicPlatform, $ionicPush) {
        return {
            loginUser: function(name, pw) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                // this will give you a fresh user or the previously saved 'current user'
                var success = function(loadedUser) {
                    Ionic.User.current(loadedUser);
                    var iUser = Ionic.User.current();
                    iUser.set('pushToken', $rootScope.deviceToken);
                    user.update({
                        userid: name
                    }, $rootScope.profile);
                    iUser.migrate();
                    iUser.save();
                    // get details
                    $rootScope.profile.email = name;
                    $rootScope.profile.pushToken = iUser.get('pushToken');
                    $rootScope.profile.name = iUser.get('name');
                    $rootScope.profile.avatar = iUser.get('avatar');
                    console.log('Found User ' + iUser.get('name'));
                    deferred.resolve('Welcome ' + name + '!');

                };
                var failure = function(error) {
                    console.log('something went wrong in getting user');
                    //Ionic.Auth.signup(details);
                    //user.id = Ionic.User.anonymousId();
                    ///user.save();
                    deferred.reject('Wrong credentials.');
                };
                details.password = pw;
                details.email = name;
                Ionic.Auth.signup(details);
                Ionic.Auth.login('basic', options, details).then(success, failure);

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
    .factory('user', function($resource, $rootScope, ApiEndpoint) {

        return $resource(ApiEndpoint.url + '/hf/users/:userid', {
            userid: "@userid"
        }, {
            getByUserId: {
                method: 'GET',
                headers: {
                    'Authorization': authToken
                }
            },
            get: {
                method: 'GET',
                params: {
                    userid: "_search"
                },
                headers: {
                    'Authorization': authToken
                }
            },
            update: {
                method: 'PUT',
                params: {
                    userid: "@userid"
                },
                headers: {
                    'Authorization': authToken
                }
            }
        });
    }).factory('allfunds', function($resource, $rootScope, ApiEndpoint) {
        return $resource(ApiEndpoint.url + '/hf/transactions/_search?size=30', {}, {
            getSortedFunds: {
                method: 'GET',
                headers: {
                    'Authorization': authToken
                }
            }
        });
    }).factory('cms', function($resource, $rootScope, ApiEndpoint) {
        return $resource(ApiEndpoint.url + '/hf/rule/:term', {
            term: "@term"
        }, {
            getAllRules: {
                method: 'GET',
                params: {
                    term: "_search"
                },
                headers: {
                    'Authorization': authToken
                }
            },
            get: {
                method: 'GET',
                params: {
                    term: "@term"
                },
                headers: {
                    'Authorization': authToken
                }
            },
            update: {
                method: 'PUT',
                params: {
                    term: "@term"
                },
                headers: {
                    'Authorization': authToken
                }
            },
            create: {
                method: 'POST',
                headers: {
                    'Authorization': authToken
                }
            },
            delete: {
                method: 'DELETE',
                params: {
                    term: "@term"
                },
                headers: {
                    'Authorization': authToken
                }
            }
        });
    }).factory('allfundsmodel', function($resource, $rootScope, ApiEndpoint) {
        // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
        // '/data/model.json'
        // ApiEndpoint.url + '/fundrelation/fundrelation/_search'
        return $resource(ApiEndpoint.url + '/hf/fundrelation/_search', {}, {
            get: {
                method: 'GET',
                headers: {
                    'Authorization': authToken
                }
            }
        });
    })
    .factory('marketcommentary', function($resource, $rootScope, ApiEndpoint) {
        // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
        // '/data/comm.json'
        // ApiEndpoint.url + '/commentaries/commentary/_search?size=31'
        return $resource(ApiEndpoint.url + '/hf/commentary/_search?size=31', {}, {
            get: {
                method: 'GET',
                headers: {
                    'Authorization': authToken
                }
            }
        });
    })
    .factory('acctsumm', function($resource, $rootScope, ApiEndpoint) {
        // http://10.0.2.2:8100 for android http://es.pixelsorcery.in:9200/transactions/transaction/_search
        // '/data/acctsumm.json'
        // ApiEndpoint.url + '/acctsummaries/account/_search?sort=_uid'
        return $resource(ApiEndpoint.url + '/hf/account/_search?sort=_uid', {}, {
            get: {
                method: 'GET',
                headers: {
                    'Authorization': authToken
                }
            }
        });
    });

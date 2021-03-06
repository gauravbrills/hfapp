angular.module('hfapp.controllers', [])
    .controller('PushCtrl', function($scope, $rootScope, $ionicLoading, $ionicPush, $ionicPopup) {
        $ionicPush.init({
            "debug": true,
            "onNotification": function(notification) {
                var payload = notification.payload;
                console.log(notification);
            },
            "onRegister": function(data) {
                console.log(data.token);
            }
        });
    })
    .controller('cmsCtrl', function($scope, $rootScope, cms, $ionicLoading, $http, $ionicPopup, user) {
        $scope.decisionCodes = ['default', 'country'];
        $scope.scores = ['FundPf', 'InvestorType', 'GroupId', 'asummnote'];
        $scope.decisionValues = ['Australia', 'Canada', 'UK', 'US', 'Onshore', 'OffShore', 'default'];
        cms.getAllRules().$promise.then(function(data) {
            $scope.rules = [];
            angular.forEach(data.hits.hits, function(value, key) {
                var node = value._source;
                $scope.rules.push(node);
            });
        });

        $scope.deleteRule = function(rule) {
            var index = $scope.rules.indexOf(rule);
            $scope.rules.splice(index, 1);
            $scope.$emit('ruleDeleted', rule);
            cms.delete({
                term: rule.id
            });
        };
        // save update rule
        $scope.saveRule = function(rule, $resource, ApiEndpoint) {
            $scope.$emit('ruleAdded', rule);
            $scope.newRule = false;
            $ionicLoading.show({
                template: 'Saving and Propagating Rule'
            });
            if (rule.codeValue) {
                promise = cms.update({
                    term: rule.codeValue
                }, rule).$promise;
            } else {
                promise = cms.create(rule).$promise;
            }
            promise.then(function(data) {
                // add tokens to push request and rule trigger
                // get tokens
                user.get().$promise.then(function(data) {
                    angular.forEach(data.hits.hits, function(value, key) {
                        var node = value._source;
                        req = {
                            method: 'POST',
                            url: 'https://api.ionic.io/push/notifications',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + jwt
                            },
                            data: {
                                "tokens": [node.pushToken],
                                "profile": profile,
                                "notification": {
                                    "message": "{#type#:#cms#,#tagupdated#:#" + rule.codeValue + "#}"
                                }
                            }
                        };
                        // Make the API call
                        $http(req).success(function(resp) {
                            //success
                            console.log("val ", req.data.tokens, " value ", value)
                        }).error(function(error) {
                            // Handle error
                            console.log("Ionic Push: Push error...");
                        });
                    });

                    // Handle success
                    var alertPopup = $ionicPopup.alert({
                        title: 'CMS update!',
                        template: 'Update successfully propagated!'
                    });
                    //  req.data.tokens = tokens;
                    $ionicLoading.hide();
                });
            });
        };

        $scope.addRule = function() {
            $scope.rules.push({});
        };

        $scope.populateDecisionCode = function(Rule) {
            var codeValue = Rule.codeValue;
            if (codeValue == 'FundPg' || codeValue == 'InvestorType') {
                $scope.scores = ['InvestorType', 'GroupId', 'FundId', 'FundType'];
            } else {
                $scope.scores = ['Australia', 'Canada', 'UK', 'US'];
            }
        }
        $scope.populateDecisionValues = function(Rule) {
            var decisionCode = Rule.decisionCode;
            if (decisionCode == 'InvestorType') {
                $scope.decisionValues = ['Onshore', 'Offshore']
            } else if (decisionCode == 'country') {
                $scope.scores = ['Australia', 'Canada', 'UK', 'US'];
            }
        }
    })
    .controller('acctSummCtrl', function($rootScope, $scope, $window, $ionicLoading, $timeout, acctsumm) {
        var user = Ionic.User.current();
        $scope.totalAUM = 0;
        $scope.showbanner = "";
        $scope.fundtyp = "";
        $scope.data = acctsumm.get();
        $ionicLoading.show({
            template: 'Loading the awesome...'
        });
        $scope.data.$promise.then(function(data) {
            drawacctsumm(data, $window, $scope, $timeout);
            $ionicLoading.hide();
        });
    })
    .controller('marketcommentaryCtrl', function($scope, $ionicLoading, marketcommentary) {
        $scope.data = marketcommentary.get();
        $ionicLoading.show({
            template: 'Loading the awesome...'
        });
        $scope.data.$promise.then(function(comm) {
            openCommGraph($scope, comm);
            $ionicLoading.hide();
        });

    })

.controller('checkForUpdatesCtrl', function($rootScope, $scope, $ionicPopup) {
        var deploy = new Ionic.Deploy();
        // change notification Status
        $scope.changeStatus = function() {
            if ($scope.silenceNotification == false) {
                $rootScope.silenceNotification = true;
            } else
                $rootScope.silenceNotification = false;
        };
        // Update app code with new release from Ionic Deploy
        $scope.doUpdate = function() {
            deploy.update().then(function(res) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Update Status!',
                    template: 'Ionic Deploy: Update Success!'
                });
            }, function(err) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Update Status!',
                    template: 'Ionic Deploy: Update error! ' + err
                });
            }, function(prog) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Update Status!',
                    template: 'Ionic Deploy: Update error! ' + prog
                });
            });
        };

        // Check Ionic Deploy for new code
        $scope.checkForUpdates = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Update Status!',
                template: 'Ionic Deploy: Checking for updates'
            });
            deploy.check().then(function(hasUpdate) {
                console.log('Ionic Deploy: Update available: ' + hasUpdate);
                $scope.hasUpdate = hasUpdate;
                alertPopup.template = 'Ionic Deploy: Update available: ' + hasUpdate;
            }, function(err) {
                alertPopup.template = 'Ionic Deploy: Unable to check for updates ' + err;
            });
        }
    })
    .controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
        $scope.data = {};
        Ionic.Auth.logout();
        $scope.login = function() {
            LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
                $state.go('app.acctsumm');
            }).error(function(data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your Username Or Password!'
                });
            });
        }
    })
    .controller('userprofileCtrl', function($scope, $rootScope, $ionicPopup) {
        $scope.update = function() {
            updateIonicUser($rootScope);
            var alertPopup = $ionicPopup.alert({
                template: 'Profile Updated Successfuly !'
            });
        }
    })
    .controller('allfundsCtrl', function($rootScope, $scope, $ionicModal, $ionicLoading, $window, allfunds, allfundsmodel) {
        $scope.fundapproach = "All";
        $scope.graphCurr = 0;
        $scope.material = '/data/HedgeFundSummary.pdf';
        $scope.pdfUrl = $scope.material;

        // get all funds data
        $scope.allfundsmodel = allfundsmodel.get();
        $scope.data = allfunds.getSortedFunds();
        $ionicLoading.show({
            template: 'Loading the awesome...'
        });
        $scope.data.$promise.then(function(data) {
            $scope.allfundsmodel.$promise.then(function(model) {
                createAllFundsViz($scope, $window, model, data);
                $ionicLoading.hide();
            });
            // modal stuff
            $ionicModal.fromTemplateUrl('templates/allfunds-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.allfundsModal = modal;
            });
            $ionicModal.fromTemplateUrl('templates/docs-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.alldocsModal = modal;
            });
            $ionicModal.fromTemplateUrl('templates/pdfview-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.pdfview = modal;
            });
            // ...
            $scope.openFndVizModal = function() {
                $scope.allfundsModal.show();
                renderDataVizModal($scope);
            };
            $scope.openDocs = function(docName) {
                $scope.pdfview.show();
                $scope.docName = docName;
            };
            cleanupModal($scope, [$scope.allfundsModal, $scope.alldocsModal]);
            // graph corousal
            $scope.openGraph = function openGraph(key) {
                    if (key == "NETRET") {
                        showContGraph("Comparing Net Returns", "% Returns", $scope, $scope.graphdata.HistoricalDates, $scope.graphdata.NetReturn);
                    } else if (key == "TOTEXP") {
                        showContGraph("Comparing Total Exposure", "Aum million $", $scope, $scope.graphdata.HistoricalDates, $scope.graphdata.TotalExposure);
                    } else if (key == "GRSSRET") {
                        showContGraph("Comparing Gross Returns", "% Returns", $scope, $scope.graphdata.HistoricalDates, $scope.graphdata.GrossReturn);
                    } else if (key == "GLEXP") {
                        showContGraph("Comparing Gross Long Exposure", "Aum million $", $scope, $scope.graphdata.HistoricalDates, $scope.graphdata.GrossLongExposure);
                    } else if (key == "NETEXP") {
                        showContGraph("Comparing Long Positions", "Aum million $", $scope, $scope.graphdata.HistoricalDates, $scope.graphdata.LongPositions);
                    } else if (key == "GRSSRET") {
                        showContGraph("Comparing Gross Returns", "% Returns", $scope, $scope.graphdata.HistoricalDates, $scope.graphdata.GrossReturn);
                    } else if (key == "LNGPSN") {
                        showContGraph("Comparing Long Positions", "Aum million $", $scope, $scope.graphdata.HistoricalDates, $scope.graphdata.LongPositions);
                    } else if (key == "MTDYTD") {
                        $scope.rangeDisp = false;
                        var series = [{
                            name: 'YTD',
                            data: $scope.graphdata.YTD
                        }, {
                            name: 'MTD',
                            data: $scope.graphdata.MTD
                        }];
                        showBarGph('#graph', 'YTD MTD Comparison', series, $scope.graphdata.fundnames);
                    } else if (key == "SAUM") {
                        $scope.rangeDisp = false;
                        var series = [{
                            name: 'Strategic AUM (million $)',
                            data: $scope.graphdata.AUM
                        }];
                        showBarGph('#graph', 'Strategic AUM Comparison', series, $scope.graphdata.fundnames);
                    } else if (key == "SHRTPSN") {
                        showContGraph("Comparing Short Positions", "% Returns", $scope, $scope.graphdata.HistoricalDates, $scope.graphdata.ShortPositions);
                    } else if (key == "HAUM") {
                        showContGraph("Comparing Historical AUM", "Aum million $", $scope, $scope.graphdata.HistoricalDates, $scope.graphdata.HistoricalAUM);
                    }
                }
                // watch range change
            $scope.translateGraph = function translateGraph(graphCurr) {
                $scope.chart.yAxis[0].setExtremes(graphCurr, $scope.graphMax);
                $scope.chart.showResetZoom();
                console.log("Translate -- " + graphCurr);
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
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

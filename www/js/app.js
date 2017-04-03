// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginController'
                    }
                }
            })

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppController'
            })

            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeController'
                    }
                }
            })
            .state('app.activerace', {
                cache: false,
                url: '/activerace/:raceId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/activeRace.html',
                        controller: 'ActiveRaceController'
                    }
                }
            })
            .state('app.participaterace', {
                cache: false,
                url: '/activerace/:raceId/participate',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/participateRace.html',
                        controller: 'ParticipateRaceController'
                    }
                }
            })

            .state('app.races', {
                url: '/races',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/races.html',
                        controller: 'RaceController'
                    }
                }
            })

            .state('app.newrace', {
                url: '/races/newrace',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/newRace.html',
                        controller: 'NewRaceController'
                    }
                }
            })

            .state('app.singlerace', {
                cache: false,
                url: '/races/:raceId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/singleRace.html',
                        controller: 'RaceDetailController'
                    }
                }
            })

            .state('app.team', {
                cache: false,
                url: '/team/:teamId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/team.html',
                        controller: 'TeamDetailController'
                    }
                }
            })

            .state('app.pub', {
                url: '/pub/:pubId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pub.html',
                        controller: 'PubDetailController'
                    }
                }
            })





        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });

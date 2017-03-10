angular.module('starter.controllers', [])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('HomeController', function($scope) {

    })

    .controller('RaceController', function($scope, RaceFactory) {
        $scope.races = RaceFactory.races;

        RaceFactory.getAll();
    })

    .controller("RaceDetailController", function($stateParams, $scope, RaceFactory, $ionicHistory){
        var raceId = $stateParams.raceId;
        $scope.race = RaceFactory.getSingle(raceId);
        $scope.deleteRace = function(){
            RaceFactory.deleteRace(raceId)
            $ionicHistory.goBack();
        }
    })

    .controller('NewRaceController', function($scope, RaceFactory, $ionicHistory) {
        $scope.race = RaceFactory.newRace;
        $scope.addTeamName = function () {
            RaceFactory.addNewTeam();
        }
        $scope.deleteTeam = function (name) {
            RaceFactory.deleteNewTeam(name)
        }
        $scope.saveRace = function () {
            console.log("saving race")
            RaceFactory.saveNewRace();
            $ionicHistory.goBack();
        }
    })

    .controller("TeamDetailController", function($stateParams, $scope, TeamFactory, $ionicHistory, UserFactory){
        var teamId = $stateParams.teamId;
        $scope.team = TeamFactory.team;
        $scope.searchUsers = UserFactory.searchUsers;
        $scope.formdata = UserFactory.formdata;
        TeamFactory.getSingle(teamId);
        $scope.deleteTeam = function(){
            TeamFactory.deleteTeam(teamId)
            $ionicHistory.goBack();
        }
        $scope.searchUser = function(){
            UserFactory.search(TeamFactory.team.users);
        }
        $scope.addUser = function($userId){
            TeamFactory.addUser($stateParams.teamId, $userId);
        }
        $scope.removeUser = function($userId){
            TeamFactory.removeUser($stateParams.teamId, $userId);
        }
    })

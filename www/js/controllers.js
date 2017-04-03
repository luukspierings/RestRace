angular.module('starter.controllers', [])




    .controller('AppController', function($state, $ionicHistory, $rootScope, $ionicSideMenuDelegate, $scope, $ionicNavBarDelegate) {

        $scope.$root.showMenuIcon = true;

        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
            if (!localStorage.getItem('userToken')) {
                if (!next || next.name !== 'app.login') {
                    console.log('must login!');
                    event.preventDefault();
                    $state.go('app.login');
                    $ionicSideMenuDelegate.canDragContent(false);
                    $scope.$root.showMenuIcon = false;
                    $ionicNavBarDelegate.showBackButton(false);
                }
            }
        });

        $rootScope.$broadcast('$stateChangeStart');

        $scope.logOut = function () {
            localStorage.removeItem('userToken');
            $rootScope.$broadcast('$stateChangeStart');
        }

    })

    .controller('LoginController', function($scope, LoginFactory, $ionicSideMenuDelegate, $ionicNavBarDelegate) {

        $scope.loginData = LoginFactory.loginData;

        $scope.doLogin = function() {
            console.log(LoginFactory.loginData);
            LoginFactory.login();
        };

        $scope.$on('$ionicView.leave', function () {
            $ionicSideMenuDelegate.canDragContent(true);
            $scope.$root.showMenuIcon = true;
            $ionicNavBarDelegate.showBackButton(true);
        });
    })

    .controller('HomeController', function($scope, RaceFactory) {
        $scope.races = RaceFactory.races;
        RaceFactory.getAll();

        $scope.loadMoreRaces = function () {
            console.log("loadmore");
            $scope.$broadcast('scroll.infiniteScrollComplete');
            RaceFactory.loadMoreRaces();
        }
        $scope.isMoreRaces = function () {
            return !!RaceFactory.nextRaces();
        }

    })
    .controller("ActiveRaceController", function($stateParams, $scope, RaceFactory){
        var raceId = $stateParams.raceId;
        $scope.race = RaceFactory.singleRace;
        RaceFactory.getSingle(raceId);

    })
    .controller("ParticipateRaceController", function($stateParams, $scope, RaceFactory, $cordovaGeolocation, $ionicPlatform){
        var raceId = $stateParams.raceId;
        $scope.race = RaceFactory.singleRace;
        $scope.participatingTeam = RaceFactory.participatingTeam;
        $scope.position = {lat:50, lon:50}


        RaceFactory.getSingle(raceId);
        RaceFactory.getParticipatingTeam(raceId)

        $scope.checkLocation = function () {
            // only for browser development:
            console.log("Check location")
            RaceFactory.checkLocation(5.1653826, 51.36193349)


            // $ionicPlatform.ready(function () {
            //     console.log("ready")
            //     $scope.position = {lat:20, lon:20}
            //
            //
            //
            //
            //     $cordovaGeolocation.getCurrentPosition({enableHighAccuracy: false})
            //         .then(function (position) {
            //             console.log("test")
            //             $scope.position = {lat:position.coords.latitude, lon:position.coords.longitude}
            //             console.log(position.coords.latitude)
            //             console.log(position.coords.longitude)
            //
            //             RaceFactory.checkLocation(position.coords.longitude, position.coords.latitude)
            //         })
            // })
        }


    })

    .controller('RaceController', function($scope, RaceFactory) {
        $scope.races = RaceFactory.races;
        RaceFactory.getAll();

        $scope.loadMoreRaces = function () {
            console.log("loadmore");
            $scope.$broadcast('scroll.infiniteScrollComplete');
            RaceFactory.loadMoreRaces();
        }
        $scope.isMoreRaces = function () {
            return !!RaceFactory.nextRaces();
        }

    })

    .controller("RaceDetailController", function($stateParams, $scope, RaceFactory, $ionicHistory){
        var raceId = $stateParams.raceId;
        $scope.race = RaceFactory.singleRace;
        RaceFactory.getSingle(raceId);

        $scope.deleteRace = function(){
            RaceFactory.deleteRace(raceId)
            $ionicHistory.goBack();
        }
        $scope.addTeam = function () {
            RaceFactory.addTeam();
        }

    })

    .controller('NewRaceController', function($scope, RaceFactory, $ionicHistory, PubFactory) {
        $scope.race = RaceFactory.newRace;
        $scope.formdata = PubFactory.formdata;
        $scope.searchPubs = PubFactory.searchPubs;
        $scope.searchPub = function(){
            if(PubFactory.formdata.searchText){
                PubFactory.search(RaceFactory.newRace.pubs);
            }
            else{
                PubFactory.searchPubs.length = 0;
            }
        }
        $scope.addPub = function (pub) {
            console.log(pub);
            if(RaceFactory.addNewPub(pub)){
                PubFactory.formdata.searchText = "";
                PubFactory.searchPubs.length = 0;
            }
        }
        $scope.removePub = function (pub) {
            RaceFactory.removeNewPub(pub)
        }
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
        UserFactory.refreshData();
        $scope.searchUsers = UserFactory.searchUsers;
        $scope.formdata = UserFactory.formdata;
        TeamFactory.getSingle(teamId);
        $scope.deleteTeam = function(){
            TeamFactory.deleteTeam().then(() => $ionicHistory.goBack())

        }
        $scope.searchUser = function(){
            if(UserFactory.formdata.searchText){
                UserFactory.search(TeamFactory.team.users);
            }
            else{
                UserFactory.searchUsers.length = 0;
            }
        }
        $scope.addUser = function($userId){
            TeamFactory.addUser($stateParams.teamId, $userId);

            var result = UserFactory.searchUsers.filter(function( obj ) {
                return obj._id == $userId;
            });

            if(UserFactory.searchUsers.indexOf(result[0]) !== -1){
                UserFactory.searchUsers.splice(UserFactory.searchUsers.indexOf(result[0]), 1);
            }

        }
        $scope.removeUser = function($userId){
            TeamFactory.removeUser($stateParams.teamId, $userId);
        }
        $scope.deleteTeam = function(){
            TeamFactory.deleteTeam();
            $ionicHistory.goBack();
        }
    })

    .controller("PubDetailController", function($stateParams, $scope, PubFactory, $ionicHistory){
        var pubId = $stateParams.pubId;
        $scope.pub = PubFactory.pub;
        PubFactory.getSingle(pubId);
        $scope.deletePub = function(){
            // TeamFactory.deleteTeam().then(() => $ionicHistory.goBack())
        }

    })


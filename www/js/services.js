
angular.module('starter.services', [])


    .factory('LoginFactory', function($http, $state, $ionicHistory) {

        var loginData = {
            username: "",
            password: ""
        }

        return {
            userToken: localStorage.getItem('userToken'),
            loginData: loginData,
            login: function () {
                $http.post(getAPIurl("/auth/token"), loginData).then(
                    function(response){
                        console.log(response);
                        if(response.status == 200){
                            localStorage.setItem('userToken', response.data.token);
                            $ionicHistory.nextViewOptions({
                                historyRoot: true
                            });
                            $state.go('app.home');
                        }
                    }
                )
            }
        }
    })

    .factory('RaceFactory', function($http) {

        var races = [];
        var nextRaces = "";
        var newRace = {
            name:"",
            description:"",
            newTeamName:"",
            starttime:null,
            teams: [],
            pubs: []
        };
        var singleRace = {};
        var participatingTeam = {};

        return {
            races: parseRaceTimeDesc(races),
            newRace: newRace,
            singleRace: parseRaceTimeDesc([singleRace])[0],
            nextRaces: function(){return nextRaces},
            participatingTeam: participatingTeam,
            getAll: function () {
                races.$promise = $http({
                    method: 'GET',
                    url: getAPIurl("/api/races?limit=8"),
                    headers: getUserTokenHeader()
                }).then(
                    function(response){
                        console.log(response.data);
                        angular.copy(response.data.items, races);
                        nextRaces = response.data.next;
                        console.log(nextRaces);


                        return parseRaceTimeDesc(races);
                    }
                )
            },
            loadMoreRaces: function () {
                if(nextRaces){
                    $http.get(getAPIurl(nextRaces), {}, {headers: getUserTokenHeader()})
                        .then(function(response){
                            console.log(response.data);
                            response.data.items.forEach(function (item, index) {
                                races.push(item);
                            })

                            nextRaces = response.data.next;
                            console.log(nextRaces);

                            return parseRaceTimeDesc(races);
                        }
                    )
                }
            },
            getSingle: function(raceId){

                singleRace.$promise = $http({
                    method: 'GET',
                    url: getAPIurl("/api/races/"+raceId),
                    headers: getUserTokenHeader()
                }).then(
                    function(response){
                        angular.copy(response.data, singleRace);
                        console.log(singleRace);

                        return parseRaceTimeDesc([singleRace]);
                    }
                )

            },
            getParticipatingTeam: function (raceId) {

                participatingTeam.$promise = $http({
                    method: 'GET',
                    url: getAPIurl("/api/races/"+raceId+"/getuserteam"),
                    headers: getUserTokenHeader()
                }).then(
                    function(response){
                        console.log(response)
                        angular.copy(response.data, participatingTeam);
                        addRankingMapSource()

                    }
                )


            },
            addTeam: function () {
                if (singleRace.newTeamName && singleRace.teams.indexOf(singleRace.newTeamName) == -1) {

                    // /api/races/:raceId/addteam

                    $http.post(getAPIurl("/api/races/"+singleRace._id+"/addteam"), {name:singleRace.newTeamName}, {headers:getUserTokenHeader()}).then(
                        function(response){
                            console.log(response.data);
                            singleRace.teams.push(response.data);
                            singleRace.newTeamName = "";

                        }
                    )


                }
            },
            addNewTeam: function () {
                if (newRace.newTeamName && newRace.teams.indexOf(newRace.newTeamName) == -1) {
                    newRace.teams.push(newRace.newTeamName);
                    newRace.newTeamName = "";
                }
            },
            deleteNewTeam: function (name) {
                if(newRace.teams.indexOf(name) !== -1){
                    newRace.teams.splice(newRace.teams.indexOf(name), 1);
                }

            },
            saveNewRace: function () {
                newRace.starttime = new Date()
                $http.post(getAPIurl("/api/races"), newRace, {headers:getUserTokenHeader()}).then(
                    function(response){
                        console.log(response.data);
                        response.data.status = "notstarted";
                        races.push(response.data);
                        parseRaceTimeDesc(races);
                    }
                )
            },
            deleteRace: function (_id) {
                $http.delete(getAPIurl("http://localhost:3000/api/races/"+_id), {}, {headers:getUserTokenHeader()}).then(
                    function(response){
                        console.log(response.data);

                        var result = races.filter(function( obj ) {
                            return obj._id == _id;
                        });

                        if(races.indexOf(result[0]) !== -1){
                            races.splice(newRace.teams.indexOf(result[0]), 1);
                        }
                    }
                )
            },

            addNewPub: function (pub) {
                console.log(pub);
                if (pub) {
                    newRace.pubs.push(pub);
                    return true;
                }
                return false;
            },
            removeNewPub: function (pub) {

                if(newRace.pubs.indexOf(pub) !== -1){
                    newRace.pubs.splice(newRace.pubs.indexOf(pub), 1);
                }

            },
            checkLocation: function (lon, lat) {
                $http.post(getAPIurl("/api/races/"+singleRace._id+"/checklocation"), {teamId: participatingTeam._id, lon:lon, lat:lat}, {headers:getUserTokenHeader()}).then(
                    function(response){
                        console.log(response);


                        if(response.status == 201){
                            console.log("success")
                            angular.copy(response.data, participatingTeam);



                            // Only add when something changed
                            if(true){
                                addRankingMapSource();
                            }



                        }





                    }
                )
            },



        }


        function addRankingMapSource() {
            if(singleRace && participatingTeam){
                participatingTeam.rankingMap = getAPIurl("/api/races/"+singleRace._id+"/getrankingimage/"+participatingTeam._id+"?refresh="+(new Date()).toString())
            }
        }

        function parseRaceTimeDesc(races) {
            // console.log(races);

            if(Object.keys(races).length > 0 && races.length != 0){
                console.log(races);

                races.forEach(function (item, index) {
                    switch (item.status){
                        case "notstarted":

                            var date = new Date(item.starttime);
                            var deltaDay = parseInt((date-new Date())/(24*3600*1000))
                            var deltaHours = parseInt((date-new Date())/(3600*1000))
                            var deltaMinutes = parseInt((date-new Date())/(60*1000))

                            if(deltaDay < 0 || deltaHours < 0 || deltaMinutes < 0){
                                item.statusDesc = "De startdatum is voorbij, zeg tegen de beheerder dat hij de race start of aflast"
                                break;
                            }

                            if(deltaDay > 1){
                                item.statusDesc = "Begint over " + deltaDay + " dagen";
                            }
                            else if(deltaDay == 1){
                                item.statusDesc = "Begint over " + deltaDay + " dag";
                            }
                            else{
                                if(deltaHours > 0){
                                    item.statusDesc = "Begint over " + deltaHours + " uur";
                                }
                                else{
                                    if(deltaMinutes > 1){
                                        item.statusDesc = "Begint over " + deltaMinutes + " minuten";
                                    }
                                    else if (deltaMinutes == 1){
                                        item.statusDesc = "Begint over " + deltaMinutes + " minuut";
                                    }
                                    else{
                                        item.statusDesc = "Begint over een moment";
                                    }
                                }
                            }

                            break;
                        case "started":
                            item.statusDesc = "Bezig";
                            break;
                        case "ended":
                            item.statusDesc = "Geëindigd";
                            break;
                        default:
                            item.statusDesc = "Geen informatie beschikbaar";
                    }
                })

            }




            return races;
        }

    })

    .factory('TeamFactory', function($http) {

        var team = {
            name: ""
        };

        return {
            team: team,
            getSingle: function ($teamId) {
                team.$promise = $http({
                    method: 'GET',
                    url: getAPIurl("/api/teams/"+$teamId),
                    headers: getUserTokenHeader()
                }).then(
                    function(response){
                        angular.copy(response.data, team);
                        console.log(team);

                        return team;
                    }
                )
            },
            deleteTeam: function () {
                return $http.delete(getAPIurl("/api/teams/"+team._id), {},{headers:getUserTokenHeader()})
            },
            addUser: function ($teamId, $userId) {

                $http.post(getAPIurl("/api/teams/"+$teamId+"/adduser"), {userId: $userId}, {headers:getUserTokenHeader()}).then(
                    function(response){
                        console.log(response.data);
                        angular.copy(response.data.users, team.users);
                        console.log(team.users);
                    }
                )

            },
            removeUser: function ($teamId, $userId) {

                $http.post(getAPIurl("/api/teams/"+$teamId+"/removeuser"), {userId: $userId}, {headers:getUserTokenHeader()}).then(
                    function(response){
                        console.log(response.data);
                        angular.copy(response.data.users, team.users);
                        console.log(team.users);
                    }
                )
            }

        }
    })

    .factory('UserFactory', function($http) {

        var formdata = {
            searchText: ""
        }

        var searchUsers = [

        ]

        return {
            searchUsers: searchUsers,
            formdata: formdata,

            refreshData: function () {

                formdata.searchText = "";
                angular.copy([], searchUsers);


            },
            search: function (userFilter) {

                searchUsers.$promise = $http.get(getAPIurl("/api/users/search/"+formdata.searchText), {}, {headers:getUserTokenHeader()}).then(
                    function(response){
                        console.log(response.data);

                        var userIds = [];
                        userFilter.forEach(function (item, index) {
                            userIds.push(item._id);
                        })

                        console.log(userIds);
                        var result = response.data.filter(function( obj ) {
                            return (userIds.indexOf(obj._id) == -1);
                        });

                        console.log(result);

                        angular.copy(result, searchUsers);

                        return searchUsers;
                    }
                )

            }
        }
    })

    .factory('PubFactory', function($http) {

        var formdata = {
            searchText: ""
        }

        var searchPubs = [

        ]

        var pub = {
            name:""
        }

        return {
            searchPubs: searchPubs,
            formdata: formdata,
            pub: pub,
            getSingle: function ($pubId) {
                pub.$promise = $http({
                    method: 'GET',
                    url: getAPIurl("/api/pubs/"+$pubId),
                    headers: getUserTokenHeader()
                }).then(
                    function(response){
                        console.log(pub);
                        angular.copy(response.data[0], pub);

                        return pub;
                    }
                )
            },

            refreshData: function () {
                formdata.searchText = "";
                angular.copy([], searchPubs);
            },
            search: function (pubFilter) {
                searchPubs.$promise = $http.post(getAPIurl("/api/pubs/search"), formdata, {headers:getUserTokenHeader()}).then(
                    function(response){
                        console.log(response);

                        response.data.forEach(function (item, index) {

                            var inArray = pubFilter.filter(function( obj ) {
                                return obj.place_id == item.place_id;
                            });

                            item.isAdded = (inArray.length > 0);
                        })

                        angular.copy(response.data, searchPubs);

                    }
                )
            }
        }
    });


function getUserTokenHeader() {
    var header = {"Authorization": "JWT "+localStorage.getItem('userToken')};
    return header;
}


function getAPIurl(url) {

    return "http://localhost:3000" + url;
    return "https://damp-sierra-83365.herokuapp.com" + url;
}
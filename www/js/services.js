
angular.module('starter.services', [])

    .factory('RaceFactory', function($http) {

        var races = [];
        var newRace = {
            name:"",
            description:"",
            newTeamName:"",
            starttime:null,
            teams: []
        };

        return {
            races: getRaces(),
            newRace: newRace,
            getAll: function () {
                races.$promise = $http({
                    method: 'GET',
                    url: "http://localhost:3000/api/races",
                }).then(
                    function(response){
                        angular.copy(response.data, races);
                        console.log(races);


                        return getRaces();
                    }
                )
            },
            getSingle: function(raceId){
                var races = getRaces();
                for(var i=0;i<races.length;i++){
                    if(races[i]._id == raceId){
                        return races[i];
                    }
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
                $http.post("http://localhost:3000/api/races", newRace).then(
                    function(response){
                        console.log(response.data);
                        response.data.status = "notstarted";
                        races.push(response.data);
                        getRaces();
                    }
                )
            },
            deleteRace: function (_id) {
                $http.delete("http://localhost:3000/api/races/"+_id).then(
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
            }
        }



        function getRaces() {

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
                    url: "http://localhost:3000/api/teams/"+$teamId,
                }).then(
                    function(response){
                        angular.copy(response.data[0], team);
                        console.log(team);

                        return team;
                    }
                )
            },
            deleteTeam: function () {
                $http.delete("http://localhost:3000/api/teams/"+team._id).then(
                    function(response){
                        console.log(response.data);

                    }
                )
            },
            addUser: function ($teamId, $userId) {

                $http.post("http://localhost:3000/api/teams/"+$teamId+"/adduser", {userId: $userId}).then(
                    function(response){
                        console.log(response.data);
                        angular.copy(response.data.users, team.users);
                        console.log(team.users);
                    }
                )

            },
            removeUser: function ($teamId, $userId) {

                $http.post("http://localhost:3000/api/teams/"+$teamId+"/removeuser", {userId: $userId}).then(
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
            search: function (userFilter) {

                searchUsers.$promise = $http.get("http://localhost:3000/api/users/search/"+formdata.searchText).then(
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
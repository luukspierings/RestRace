
angular.module('starter.services', [])

    .factory('RaceFactory', function($http) {

        var baseUrl = "http://192.168.1.237:3000/api/races";
        var secondUrl = "";
        var races = [];


        return {
            races: getRaces(),
            getAll: function () {
                races.$promise = $http({
                    method: 'GET',
                    url: baseUrl,
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




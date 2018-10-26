(function () {
    loc8rData.$inject = ['$http'];
    function loc8rData($http) {

        var locationByCoords = (lat, lng) => {
            var config = {
                method: 'GET',
                url: '/api/locations',
                params: {
                    lng: lng,
                    lat: lat
                }
            }
            return $http(config)
        }

        var locationById = (locationId) => {
            var config = {
                method: 'GET',
                url: '/api/locations/' + locationId
            }
            return $http(config)
        }

        return {
            locationByCoords: locationByCoords,
            locationById: locationById
        }
    }

    angular
        .module('loc8rApp')
        .factory('loc8rData', loc8rData)
}) ();

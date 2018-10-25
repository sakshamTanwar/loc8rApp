(function () {
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

        return {
            locationByCoords: locationByCoords
        }
    }

    angular
        .module('loc8rApp')
        .factory('loc8rData', loc8rData)
}) ();

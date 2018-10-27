(function () {
    loc8rData.$inject = ['$http', 'authentication'];
    function loc8rData($http, authentication) {

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

        var addReviewById = (locationId, data) => {
            var config = {
                method: 'POST',
                url: '/api/locations/' + locationId + '/reviews',
                data: data,
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            }
            return $http(config)
        }

        return {
            locationByCoords: locationByCoords,
            locationById: locationById,
            addReviewById: addReviewById
        }
    }

    angular
        .module('loc8rApp')
        .factory('loc8rData', loc8rData)
}) ();

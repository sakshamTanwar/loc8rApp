var _isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};
var formatDistance = function() {
    return function(distance) {
        var numDistance, unit;
        if (distance != null && _isNumeric(distance)) {
            if (distance > 1) {
                numDistance = parseFloat(distance).toFixed(1);
                unit = 'km';
            } else {
                numDistance = parseInt(distance * 1000, 10);
                unit = 'm';
            }
            return numDistance + unit;
        } else {
            return "?";
        }
    };
};

var ratingStars = () => {
    return {
        scope: {
            thisRating: '=rating'
        },
        templateUrl: '/angular/rating-stars.html'
    };
};

var loc8rData = ($http) => {

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


};

var locationListCtrl = ($scope, loc8rData, geolocation) => {
    $scope.message = "Checking your location";

    $scope.getData = (position) => {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        loc8rData.locationByCoords(lat, lng).then(
            (res) => {
                var data = res.data;
                $scope.message = data.length > 0 ? "" : "No locations found";
                $scope.data = {
                    locations: data
                }
            },
            (err) => {
                $scope.message = "Sorry, something gone wrong"
                console.log(err);
            }
        )
    };

    $scope.showError = (error) => {
        $scope.$apply(() => {
            $scope.message = error.message;
        })
    };

    $scope.noGeo = () => {
        $scope.$apply(() => {
            $scope.message = "Geolocation not supported by browser"
        })
    };

    geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);



};

var geolocation = () => {
    var getPosition = (cbSuccess, cbError, cbNoGeo) => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
        }
        else {
            cbNoGeo();
        }
    }
    return {
        getPosition: getPosition
    };
}

angular
    .module('loc8rApp', [])
    .factory('loc8rData', loc8rData)
    .factory('geolocation', geolocation)
    .controller('locationListCtrl', locationListCtrl)
    .filter('formatDistance', formatDistance)
    .directive('ratingStars', ratingStars)

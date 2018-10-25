(function () {
    function geolocation() {
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
        .module('loc8rApp')
        .factory('geolocation', geolocation);
}) ();

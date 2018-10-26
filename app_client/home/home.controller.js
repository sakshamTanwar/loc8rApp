(function () {
    homeCtrl.$inject = ['$scope', 'loc8rData', 'geolocation'];
    function homeCtrl($scope, loc8rData, geolocation) {
        var vm = this;
        vm.pageHeader = {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        };
        vm.sidebar = {
            content: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.'
        };
        vm.message = "Checking your location";

        vm.getData = function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            loc8rData.locationByCoords(lat, lng).then(
                (res) => {
                    var data = res.data;
                    vm.message = data.length > 0 ? "" : "No locations found";
                    vm.data = {
                        locations: data
                    }
                },
                (err) => {
                    vm.message = "Sorry, something gone wrong"
                    console.log(err);
                }
            )
        }

        vm.showError = function (error) {
            $scope.$apply(() => {
                vm.message = error.message;
            })
        }

        vm.noGeo = function () {
            $scope.$apply(() => {
                vm.message = "Geolocation is not supported by browser";
            })
        }

        geolocation.getPosition(vm.getData, vm.showError, vm.noGeo);
    };

    angular
        .module('loc8rApp')
        .controller('homeCtrl', homeCtrl)
}) ();

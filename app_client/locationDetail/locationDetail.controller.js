(function () {
    angular
        .module('loc8rApp')
        .controller('locationDetailCtrl', locationDetailCtrl)

    locationDetailCtrl.$inject = ['$routeParams', '$location', '$uibModal', 'loc8rData', 'authentication'];
    function locationDetailCtrl($routeParams, $location, $uibModal, loc8rData, authentication) {
        var vm = this;
        vm.locationId = $routeParams.locationId;

        vm.isLoggedIn = authentication.isLoggedIn();
        vm.currentPath = $location.path();

        loc8rData.locationById(vm.locationId).then(
            (data) => {
                vm.data = {
                    location: data.data
                }
                vm.pageHeader = {
                    title: vm.data.location.name
                };
            },
            (err) => {
                console.log(err);
            }
        )

        vm.popupReviewForm = function() {
            var modalOptions = {
                templateUrl: '/reviewModal/reviewModal.view.html',
                controller: 'reviewModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    locationData: function() {
                        return {
                            locationId: vm.locationId,
                            locationName: vm.data.location.name
                        };
                    }
                }
            }
            var modalInstance = $uibModal.open(modalOptions)

            modalInstance.result
                .then((data) => {
                    vm.data.location.reviews.push(data);
                })
                .catch((err) => {
                    if(['cancel', 'backdrop click', 'escape key press'].indexOf(err) === -1) {
                        throw err;
                    }
                })
        }
    }
}) ();

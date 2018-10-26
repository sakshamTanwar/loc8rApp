(function () {
    angular
        .module('loc8rApp')
        .controller('locationDetailCtrl', locationDetailCtrl)

    locationDetailCtrl.$inject = ['$routeParams', '$uibModal', 'loc8rData'];
    function locationDetailCtrl($routeParams, $uibModal, loc8rData) {
        var vm = this;
        vm.locationId = $routeParams.locationId;

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

            modalInstance.result.then((data) => {
                vm.data.location.reviews.push(data);
            })
        }
    }
}) ();

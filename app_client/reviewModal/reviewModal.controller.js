(function() {
    angular
        .module('loc8rApp')
        .controller('reviewModalCtrl', reviewModalCtrl)

    reviewModalCtrl.$inject = ['$uibModalInstance', 'loc8rData', 'locationData'];
    function reviewModalCtrl($uibModalInstance, loc8rData, locationData) {
        var vm = this;
        vm.modal = {
            close: function(result) {
                $uibModalInstance.close(result);
            },
            cancel: function() {
                $uibModalInstance.dismiss('cancel');
            }
        }
        vm.locationData = locationData;
        vm.onSubmit = function() {
            vm.formError = "";
            if(!vm.formData.name || !vm.formData.rating || !vm.formData.reviewText) {
                vm.formError = "All fields required, please try again."
                return false;
            }
            else {
                vm.doAddReview(vm.locationData.locationId, vm.formData);
            }
        }

        vm.doAddReview = function(locationId, formData) {
            loc8rData.addReviewById(locationId, {
                author: formData.name,
                rating: formData.rating,
                reviewText: formData.reviewText
            }).then(
                (data) => {
                    vm.modal.close(data.data);
                },
                (err) => {
                    vm.formError = "Your review has not been saved, try again"
                }
            )
            return false;
        }


    }

}) ();

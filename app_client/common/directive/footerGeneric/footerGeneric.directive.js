(function() {
    angular
        .module('loc8rApp')
        .directive('footerGeneric', footerGeneric)

    function footerGeneric() {
        return {
            templateUrl: 'common/directive/footerGeneric/footerGeneric.template.html'
        }
    }
}) ();

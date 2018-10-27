(function () {
    angular
        .module('loc8rApp')
        .directive('navigation', navigation)

    function navigation() {
        return {
            templateUrl: 'common/directive/navigation/navigation.template.html',
            controller: 'navigationCtrl',
            controllerAs: 'navvm'
        }
    }
}) ();

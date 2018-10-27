(function () {
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .when('/about', {
                templateUrl: 'common/views/genericText.view.html',
                controller: 'aboutCtrl',
                controllerAs: 'vm'
            })
            .when('/location/:locationId', {
                templateUrl: '/locationDetail/locationDetail.view.html',
                controller: 'locationDetailCtrl',
                controllerAs: 'vm'
            })
            .when('/register', {
                templateUrl: '/auth/register/register.view.html',
                controller: 'registerCtrl',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'})

        $locationProvider.html5Mode({
            enabled: true,
        });
    }

    angular
        .module('loc8rApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap'])
        .config(['$routeProvider', '$locationProvider', config])
}) ();

/**
 * @name app
 * @description  main app object
 * @author Carlos Justiniano
 */
//angular.module('app', ['ngRoute', 'mgcrea.ngStrap'])
angular.module('app', ['ngRoute', 'ui.bootstrap'])
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            'use strict';

            $locationProvider.html5Mode(true);

            $routeProvider
                .when('/', {
                    templateUrl: 'app/components/login/loginView.html',
                    controller: 'LoginController'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }]);

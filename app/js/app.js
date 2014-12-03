'use strict';


// Declare app level module which depends on filters, and services
var module = angular.module('ufvApp', [
        'ngRoute',
        'ufvApp.filters',
        'ufvApp.services',
        'ufvApp.directives',
        'ufvApp.controllers'
    ]);

module.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/index', {templateUrl: 'partials/index.html', controller: 'PrettyLogsController'});
  $routeProvider.when('/userpreferences',
      {templateUrl: 'partials/userpreferences.html', controller: 'UserPreferencesController'});
  $routeProvider.otherwise({redirectTo: '/index'});
}]);

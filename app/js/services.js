'use strict';

/* Services */
var module = angular.module('ufvApp.services', ['ngResource']);
module.factory('FieldsInput', ['$resource', function ($resource) {
    return $resource('fields/input.json', {}, {
        query: {method: 'GET', isArray: true}
    });
}]);

module.factory('FieldsStatistic', ['$resource', function ($resource) {
    return $resource('fields/statistic.json', {}, {
        query: {method: 'GET', isArray: true}
    });
}]);




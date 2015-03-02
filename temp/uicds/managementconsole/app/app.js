'use strict';

if (typeof console == "undefined") {
    this.console = { log: function() {} };
}

// Declare app level module which depends on filters, and services
angular.module('consoleApp', [
  'ngRoute', 'ngSanitize',
  'consoleApp.filters',
  'consoleApp.services',
  'consoleApp.directives',
  'consoleApp.controllers'
]).

config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/status', {templateUrl: 'app/partials/statusTemplate.html', controller: 'StatusController'});
  $routeProvider.when('/workproducts', {templateUrl: 'app/partials/workproductsTemplate.html', controller: 'WorkProductsController'});
  $routeProvider.when('/agreements', {templateUrl: 'app/partials/agreementsTemplate.html', controller: 'AgreementsController'});
  $routeProvider.when('/users', {templateUrl: 'app/partials/usersTemplate.html', controller: 'UsersController'});  
  $routeProvider.when('/instances', {templateUrl: 'app/partials/instancesTemplate.html', controller: 'InstancesController'});  
  $routeProvider.when('/docs', {templateUrl: 'app/partials/documentationTemplate.html', controller: 'DocumentationController'});      
  $routeProvider.otherwise({redirectTo: '/status'});
}]);
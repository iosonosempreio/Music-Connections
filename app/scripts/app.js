'use strict';

/**
 * @ngdoc overview
 * @name artistsLinkApp
 * @description
 * # artistsLinkApp
 *
 * Main module of the application.
 */
angular
  .module('artistsLinkApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider,$locationProvider) {

    $routeProvider
      .when('/connections', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/myAccess', {
        templateUrl: 'views/access.html',
        controller: 'AccessCtrl',
        controllerAs: 'main'
      })
      // .otherwise({
      //   redirectTo: '/connections'
      // });

  });

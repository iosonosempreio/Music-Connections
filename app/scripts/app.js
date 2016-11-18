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
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider, $locationProvider, storeAccessProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'main'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/perform', {
        templateUrl: 'views/perform.html',
        controller: 'PerformCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: function (routeParams, path, search) {
          // console.log('routeParams',routeParams);
          // console.log('path',path);
          // console.log('search',search);
          storeAccessProvider.setToken(path);
          return "/";
        }
      });

  });

'use strict';

/**
 * @ngdoc function
 * @name artistsLinkApp.controller:AccessCtrl
 * @description
 * # AccessCtrl
 * Controller of the artistsLinkApp
 */
angular.module('artistsLinkApp')
  .controller('AccessCtrl', function ($scope,$location,getAccess) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    console.log(getAccess.clientId())

    console.log(Math.random().toString(36).substring(7))

  });

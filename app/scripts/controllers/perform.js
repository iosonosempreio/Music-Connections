'use strict';

/**
 * @ngdoc function
 * @name artistsLinkApp.controller:PerformCtrl
 * @description
 * # PerformCtrl
 * Controller of the artistsLinkApp
 */
angular.module('artistsLinkApp')
  .controller('PerformCtrl', function ($scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.artistLeft = {};
	$scope.artistRight = {};

	$scope.$watch('artistLeft',function(){
		// if($scope.artistLeft.images) {
		// 	console.log($scope.artistLeft.images[0].url)
		// }
	})
  });

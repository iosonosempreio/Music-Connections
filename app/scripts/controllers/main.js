'use strict';

/**
 * @ngdoc function
 * @name artistsLinkApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the artistsLinkApp
 */
angular.module('artistsLinkApp')
  .controller('MainCtrl', function ($scope, apiService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    // sdamon albarn spotify:artist:0O98jlCaPzvsoei6U5jfEL

    // the subways spotify:artist:4BntNFyiN3VGG4hhRRZt9d

    var urlLeft = 'https://api.spotify.com/v1/artists/0O98jlCaPzvsoei6U5jfEL/related-artists'

    var urlRight = 'https://api.spotify.com/v1/artists/4BntNFyiN3VGG4hhRRZt9d/related-artists'

    apiService.getRelated(urlLeft).then(
		function(data){
			console.log(data)
		},
		function(error){
			console.log(error)
		}
	);

	apiService.getRelated(urlRight).then(
		function(data){
			console.log(data)
		},
		function(error){
			console.log(error)
		}
	);

  });

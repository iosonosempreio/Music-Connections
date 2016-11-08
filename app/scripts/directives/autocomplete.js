'use strict';

/**
 * @ngdoc directive
 * @name artistsLinkApp.directive:autoComplete
 * @description
 * # autoComplete
 */
angular.module('artistsLinkApp')
  .directive('autoComplete', function (apiService) {
    return {
      templateUrl: './views/auto-complete.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the autoComplete directive');

        scope.$watch('leftQuery', function(){
        	if(scope.leftQuery && scope.leftQuery.length >= 3 ){
        		apiService.queryArtist(scope.leftQuery).then(
	        		function(data){
	        			// console.log(data)
	        			var results = data.artists.items
	        			scope.leftQueryResults = results
	        		},
	        		function(error){
	        			console.log(error)
	        		}
	        	)
        	}
        })

        scope.$watch('rightQuery', function(){
        	if(scope.rightQuery && scope.rightQuery.length >= 3 ){
        		apiService.queryArtist(scope.rightQuery).then(
	        		function(data){
	        			// console.log(data)
	        			var results = data.artists.items
	        			scope.rightQueryResults = results
	        		},
	        		function(error){
	        			console.log(error)
	        		}
	        	)
        	}
        })

        scope.setArtist = function(container, content) {
        	if (container == 'left'){
        		scope.artistLeft = content
                console.log(content)
        		scope.leftQueryResults = []
        		scope.leftQuery = scope.artistLeft.name
        	} else if (container == 'right') {
        		scope.artistRight = content
                console.log(content)
        		scope.rightQueryResults = []
        		scope.rightQuery = scope.artistRight.name
        	}
        	// console.log(content)
        }


      }
    };
  });

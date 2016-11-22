'use strict';

/**
 * @ngdoc directive
 * @name artistsLinkApp.directive:artistsChain
 * @description
 * # artistsChain
 */
angular.module('artistsLinkApp')
  .directive('artistsChain', function (apiService) {
    return {
      template: '',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the artistsChain directive');
        // console.log(element,element.height(),element.width())

        // console.log("drawing chain")

      	var margin = {top: 0, right: element.width()*0.1, bottom: 0, left: element.width()*0.1},
      			width = element.width() - margin.left - margin.right,
      			height = 400 - margin.top - margin.bottom

        var chain = d3.select(element[0]).append('div').attr('id','chain')

        function drawChain(data) {
        	// console.log(data)
        	var x = d3.scaleLinear().domain([0,data.length-1]).range([0,width])

      		var artists = chain.selectAll('.artist')
      				.data(data)
      			.enter().append('div')
      				.attr('class','artist')

      		artists.append('div')
      				.attr('class','thumb')
      				.style('background-image', function(d){
      					if (d.images.length > 0){
      						return 'url("'+d.images[d.images.length-1].url+'")'
      					}
      				})

      		artists.append('h4')
      				.html(function(d){ return d.name })

        }

        scope.$on("draw",function(){
        	var myData = []
        	var n = 0;
        	function getArtist(counter) {
	        	apiService.getArtist(scope.conductiveNodes[counter].id).then(
	        		function(data) {
	        			myData.push(data);
	        			counter ++;
	        			if (counter < scope.conductiveNodes.length) {
	        				getArtist(counter)
	        			} else {
	        				drawChain(myData);
	        			}
	        		}
	        	);
        	}
        	getArtist(n);
        })

        




      }
      

    };
  });

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
        console.log(element,element.height(),element.width())

        console.log("drawing chain")

      	var margin = {top: 0, right: element.width()*0.1, bottom: 0, left: element.width()*0.1},
      			width = element.width() - margin.left - margin.right,
      			height = 400 - margin.top - margin.bottom
      			
      	var chain = d3.select(element[0]).append('svg')
        		.attr('id','chain')
        		.attr('width',width + margin.left + margin.right)
        		.attr('height',height + margin.top + margin.bottom)
        	.append('g')
        		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        function drawChain() {
        	

        	var x = d3.scaleLinear().domain([0,scope.conductiveNodes.length-1]).range([0,width])

        	// chain.selectAll('.circle')
        	// 		.data(scope.conductiveNodes)
        	// 	.enter().append('circle')
        	// 		.attr('r',10)
        	// 		.attr("cx", function(d,i) { return x(i); })
      			// 	.attr("cy", function() { return height/2; });

      		var artists = chain.selectAll('.artist')
      				.data(scope.conductiveNodes)
      			.enter().append('g')

      		artists.append('circle')
      				.attr('r',10)
        			.attr("cx", function(d,i) { return x(i); })
      				.attr("cy", function() { return height/2; });

      		artists.append('text')
      				.attr('x', function(d,i) { return x(i); })
      				.attr('y', function() { return height/2 + 25; })
      				.attr('text-anchor','middle')
      				.text(function(d){ return d.label; })

      	// 	artists.append("svg:image")
							// .attr('x', function(d,i) { return x(i); })
							// .attr('y', function() { return height/2; })
							// .attr('width', 20)
							// .attr('height', 24)
							// .attr("xlink:href",function(d){
							// 	console.log(d)
							// 	if (d.id) {
							// 		apiService.getArtist(d.id).then(
							// 			function(data){
							// 				console.log(data)
							// 				return data.images[0].url
							// 			},
							// 			function(error){
							// 				console.log(error)
							// 			}
							// 		)
							// 	}
								
							// })






        }

        scope.$on("draw",function(){
          drawChain();
        })

        




      }
      

    };
  });

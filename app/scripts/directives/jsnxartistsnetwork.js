'use strict';

/**
 * @ngdoc directive
 * @name artistsLinkApp.directive:jsnxArtistsNetwork
 * @description
 * # jsnxArtistsNetwork
 */
angular.module('artistsLinkApp')
  .directive('jsnxArtistsNetwork', function () {
    return {
      template: '<svg id="demo-canvas"></svg>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the jsnxArtistsNetwork directive');
        console.log(jsnx)

        var G = new jsnx.Graph();
		G.addNode(1, {count: 12});
		G.addNode(2, {count: 8});
		G.addNode(3, {count: 15});
		G.addEdgesFrom([[1,2],[2,3]]);

        var drawGraph = function(){
	        jsnx.draw(G, {
			  element: '#demo-canvas',
			  withLabels: true,
			  nodeAttr: {
			    r: function(d) {
			      // `d` has the properties `node`, `data` and `G`
			      return d.data.count;
			    }
			  }
			});	
        }

        drawGraph()

  //       scope.$watch('scope.jsnxGraph', function() {
  //       	if(scope.jsnxGraph) {
  //       		drawGraph();
  //       	}
		// });
        
      }
    };
  });

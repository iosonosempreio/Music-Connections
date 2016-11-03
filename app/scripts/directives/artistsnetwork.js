'use strict';

/**
 * @ngdoc directive
 * @name artistsLinkApp.directive:artistsNetwork
 * @description
 * # artistsNetwork
 */
angular.module('artistsLinkApp')
  .directive('artistsNetwork', function () {
    return {
      restrict: 'E',
      templateUrl: './views/artists-network.html',
      link: function postLink(scope, element, attrs) {

		scope.$watch('jsnxGraph', function(){
			if (scope.conductiveNodes) {
				// console.log('info', jsnx.info(scope.jsnxGraph))
				var networkData = {'nodes':[],'links':[]}
				scope.jsnxGraph.nodes(true).forEach(function(n){
					var _node = {
						'id': n[0],
						'label':n[1].label
					}
					networkData.nodes.push(_node)
				})
				scope.jsnxGraph.edges(true).forEach(function(l){
					var _link = {
						'source':l[0],
						'target':l[1]
					}
					networkData.links.push(_link)
				})
				scope.drawGraph(networkData)
				scope.network = networkData
			}
		})

        scope.drawGraph = function(data) {
        			
        			// var graph = _.cloneDeep(data)
        			var graph = data
					console.log('draw graph', graph)
					function dragstarted(d) {
					  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
					  d.fx = d.x;
					  d.fy = d.y;
					}

					function dragged(d) {
					  d.fx = d3.event.x;
					  d.fy = d3.event.y;
					}

					function dragended(d) {
					  if (!d3.event.active) simulation.alphaTarget(0);
					  d.fx = null;
					  d.fy = null;
					}

					var svg = d3.select("#svg-graph"),
					    width = +svg.attr("width"),
					    height = +svg.attr("height");

					svg.html('')

					// console.log( parseInt(d3.select('artists-network').style('width')) )

					svg.append("rect")
					    .attr("width", parseInt(d3.select('artists-network').style('width')) )
					    .attr("height", parseInt(d3.select('artists-network').style('width'))*0.75 )
					    .style("fill", "none")
					    .style("pointer-events", "all")
					    .call(d3.zoom()
					        .scaleExtent([1 / 10, 4])
					        .on("zoom", zoomed));

					var color = d3.scaleOrdinal(d3.schemeCategory20);

					var simulation = d3.forceSimulation()
					    .force("link", d3.forceLink().id(function(d) { return d.id; }))
					    .force("charge", d3.forceManyBody())
					    .force("center", d3.forceCenter(width / 2, height / 2));

					var g = svg.append("g")
						.attr("class","graph")

					var link = g.append("g")
				    	.attr("class", "links")
				    .selectAll("line")
			    	.data(graph.links)
				    .enter().append("line")
					    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

					var node = g.append("g")
					      .attr("class", "nodes")
					    .selectAll("circle")
					    .data(graph.nodes)
					    .enter().append("g")
					    	.attr("class", function(d){
					    		if(d.id == scope.artistLeft.id || d.id == scope.artistRight.id){
					    			d.group = 1
					    			return "node starting-point"
					    		} else {
					    			d.group = 2
					    			return "node"
					    		}
					    	})

				    node.append("circle")
					    .attr("r", 5)
					    .attr("fill", function(d) { return color(d.group); })
					    .call(d3.drag()
					        .on("start", dragstarted)
					        .on("drag", dragged)
					        .on("end", dragended));

					node.append("text")
					  		.attr("dx", 12)
	      				.attr("dy", ".35em")
					    	.text(function(d) { return d.label; });

					simulation
					    .nodes(graph.nodes)
					    .on("tick", ticked);

					simulation.force("link")
					    .links(graph.links);

					function ticked() {
					    link
					        .attr("x1", function(d) { return d.source.x; })
					        .attr("y1", function(d) { return d.source.y; })
					        .attr("x2", function(d) { return d.target.x; })
					        .attr("y2", function(d) { return d.target.y; });

					    // node
					    //     .attr("cx", function(d) { return d.x; })
					    //     .attr("cy", function(d) { return d.y; });

					    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


					  }

					

					function zoomed() {
					  g.attr("transform", d3.event.transform);
					}

        }

      }
    };
  });

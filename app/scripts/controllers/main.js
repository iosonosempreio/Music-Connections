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



    $scope.$watch('artistLeft.id', function() {
    	if ($scope.artistLeft.id == $scope.artistRight.id) {
	    	console.log('same artist')
    	}
	});

	$scope.$watch('artistRight.id', function() {
    	if ($scope.artistLeft.id == $scope.artistRight.id) {
	    	console.log('same artist')
    	}
	});

    // damon albarn 	spotify:artist:0O98jlCaPzvsoei6U5jfEL
    // the subways		spotify:artist:4BntNFyiN3VGG4hhRRZt9d
	// metallica		spotify:artist:2ye2Wgw4gimLv2eAKyk1NB
	// queen			spotify:artist:1dfeR4HaWDbWqFHLkxsg1d
	// area				spotify:artist:6o2PxnpsrQ352kwYlEwjvR
	// powerman 5000	spotify:artist:5imUS9dQyCbAjUEJJ9QyWC
	// ministri			spotify:artist:6an9YCv0S0Mj3rsaD9Ahpz
	// elthon john		spotify:artist:3PhoLpVuITZKcymswpck5b
	// Madonna			spotify:artist:6tbjWDEIzxoDsBA1FuhfPW
	// destruction		spotify:artist:5d6KI8frPEo3qGsIL8Sak2

    $scope.artistLeft = {
    	'id':'2ye2Wgw4gimLv2eAKyk1NB',
    	'label':'Metallica',
    	'level': 0
    }

    // $scope.artistLeft = {
    // 	'id':'1dfeR4HaWDbWqFHLkxsg1d',
    // 	'label':'Queen',
    // 	'level': 0
    // }

    $scope.artistRight = {
    	'id':'5imUS9dQyCbAjUEJJ9QyWC',
    	'label':'Powerman 5000',
    	'level': 0
    }

    $scope.artistRight = {
    	'id':'5d6KI8frPEo3qGsIL8Sak2',
    	'label':'Destruction',
    	'level': 0
    }

    // $scope.artistLeft = {
    // 	'id':'6tbjWDEIzxoDsBA1FuhfPW',
    // 	'label':'Madonna',
    // 	'level': 0
    // }

    $scope.artistRight = {
    	'id':'1dfeR4HaWDbWqFHLkxsg1d',
    	'label':'Queen',
    	'level': 0
    }

    // $scope.artistRight = {
    // 	'id':'6o2PxnpsrQ352kwYlEwjvR',
    // 	'label':'Area',
    // 	'level': 0
    // }

    // $scope.artistRight = {
    // 	'id':'6an9YCv0S0Mj3rsaD9Ahpz',
    // 	'label':'Ministri',
    // 	'level': 0
    // }

    // $scope.artistRight = {
    // 	'id':'3PhoLpVuITZKcymswpck5b',
    // 	'label':'Elthon John',
    // 	'level': 0
    // }

	$scope.reset = function() {
	    $scope.toFetch = [$scope.artistLeft,$scope.artistRight]
	    // $scope.toFetch.push($scope.artistLeft)
	    // $scope.toFetch.push($scope.artistRight)
	    $scope.network = { 'nodes':[], 'links': [] }
	    $scope.network.nodes.push($scope.artistLeft)
	    $scope.network.nodes.push($scope.artistRight)
	    $scope.path;
	    $scope._nodes = [];
	}
	$scope.reset()

	$scope.findPath = function() {
		var cy;
		cy = cytoscape();

		$scope.network.nodes.forEach(function(n){
			// myGraph.add(n.id, {'label':n.label})
			cy.add({
			    group: "nodes",
			    data: { id:n.id },
			});
		})

		$scope.network.links.forEach(function(e){
			// myGraph.ensureEdge(e.source, e.target, {'label': e.id})
			cy.add({
			    group: "edges",
			    data: { id: e.source+'-'+e.target, source: e.source, target: e.target },
			});
		})

		// console.log('nodes', cy.elements('node'))
		// console.log('edges', cy.elements('edge'))

		var aStar = cy.elements().aStar({ root: '#'+$scope.artistLeft.id, goal: '#'+$scope.artistRight.id });

		//Define the options var with your preferences
		    var options = {
		      root : '#'+$scope.artistLeft.id,
		      weight : function (){
		        return this.data('weight');
		      },
		      directed : false //this is not necessary
		    }
		//And execute he algorithm with these options
		// elements.dijkstra(options);



		var dijkstra = cy.elements().dijkstra(options);

		var path = dijkstra.pathTo( cy.$('#'+$scope.artistRight.id) );
		var dist = dijkstra.distanceTo( cy.$('#'+$scope.artistRight.id) );


		// console.log('dist',dist)
		console.log('path',path['length'])

		if (dist == 'Infinity' || path['length'] < 1) {
			// $scope.fetchRelated()
			console.log('NO path', path,dist)
		} else {
			console.log(path,dist)
		}


	}
    
    $scope.fetchRelated = function() {
    	console.log('to fetch',$scope.toFetch.length)

    	var discoveredArtists = []

    	var newNodes = []
		var newEdges = []

    	$scope.toFetch.forEach(function(artist, index){
    		
    		var url = 'https://api.spotify.com/v1/artists/{id}/related-artists'
	    	url = url.replace('{id}',artist.id)

	    	apiService.getRelated(url).then(
				function(data){
					
					data.artists.forEach(function(a, i){
						var thisNode = {
							'id':a.id,
							'label':a.name
						}
						newNodes.push(thisNode)

						var thisEdge = {
							'id':artist.id+'-'+a.id,
							'source':artist.id,
							'target':a.id
						}
						newEdges.push(thisEdge)

						discoveredArtists.push(a)

						if (i+1 == data.artists.length) {
							// console.log('discoveredArtists pushed',i)
							
							if (index+1 == $scope.toFetch.length) {
								console.log('fetched all', index+1, discoveredArtists.length)
								$scope.network.nodes = _.unionWith($scope.network.nodes, newNodes, _.isEqual);
								console.log('nodes',newNodes.length,$scope.network.nodes.length)
								$scope.network.links = _.unionWith($scope.network.links, newEdges, _.isEqual)
								console.log('edges',newEdges.length,$scope.network.links.length)
								console.log('discoveredArtists',discoveredArtists.length)

								$scope.toFetch = _.differenceWith(discoveredArtists, $scope.network.edges, function(arrVal,othVal){
									if(arrVal.id == othVal.source) {
										return true
									} else {
										return false
									}
								})

								console.log('to fetch', $scope.toFetch.length)

								// $scope.findPath();

							}
						}
					})
				},
				function(error){
					console.log(error)
				}
			);
    	})
    }


  });

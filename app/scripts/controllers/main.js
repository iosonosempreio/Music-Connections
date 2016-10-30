'use strict';

/**
 * @ngdoc function
 * @name artistsLinkApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the artistsLinkApp
 */
angular.module('artistsLinkApp')
  .controller('MainCtrl', function ($scope, apiService, getAccess, $location) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

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
	// led zeppelin		spotify:artist:36QJpDe2go2KgaRleHCDTp
	// lucio dalla		spotify:artist:25MkkfEousyfp2eyh38FUl

	$scope.reset = function() {
		$scope.artistLeft = {};
		$scope.artistRight = {};

		apiService.getArtist('6an9YCv0S0Mj3rsaD9Ahpz').then(
			function(data){
				$scope.artistLeft.id = data.id
				$scope.artistLeft.label = data.name
			},
			function(error){
				console.log(error)
			}
		);

		apiService.getArtist('25MkkfEousyfp2eyh38FUl').then(
			function(data){
				$scope.artistRight.id = data.id
				$scope.artistRight.label = data.name
			},
			function(error){
				console.log(error)
			}
		);

	    $scope.toFetch = [$scope.artistLeft,$scope.artistRight]
	    $scope.network = { 'nodes':[], 'links': [] }
	    $scope.network.nodes.push($scope.artistLeft)
	    $scope.network.nodes.push($scope.artistRight)

	    // console.log($scope.toFetch)
	}

	$scope.reset()

	$scope.implicitGrant = getAccess.implicitGrant()

	console.log('after hash',$location.hash())

    $scope.fetchRelated = function() {
    	// console.log('to fetch',$scope.toFetch.length)

    	var discoveredArtists = []

    	var newNodes = []
		var newEdges = []

    	$scope.toFetch.forEach(function(artist, index){
    		
    		var url = 'https://api.spotify.com/v1/artists/{id}/related-artists'
	    	url = url.replace('{id}',artist.id)

	    	setTimeout(function(){ 

	    		apiService.getRelated(url).then(
					function(data){
						
						data.artists.forEach(function(a, i){

							// if (artist.id == '7Ey4PD4MYsKc5I2dolUwbH'){
							// 	console.log(artist.name)
							// }
							
							var thisNode = {
								'id':a.id,
								'label':a.name
							}
							
							var thisEdge = {
								'id':artist.id+'-'+a.id,
								'source':artist.id,
								'target':a.id
							}

							// newNodes.push(thisNode)
							// newEdges.push(thisEdge)

							if( !_.find($scope.network.nodes, { 'id': thisNode.id}) ) {
								newNodes.push(thisNode)
							}

							if( !_.find($scope.network.links, { 'id': thisEdge.id}) ) {
								newEdges.push(thisEdge)
							}

							discoveredArtists.push(a)

							if (i+1 == data.artists.length) {
								
								if (index+1 == $scope.toFetch.length) {

									$scope.network.nodes = _.unionWith($scope.network.nodes, newNodes, _.isEqual);
									$scope.network.links = _.unionWith($scope.network.links, newEdges, _.isEqual);
									
									// console.log('nodes',newNodes.length,$scope.network.nodes.length)
									// console.log('edges',newEdges.length,$scope.network.links.length)

									$scope.toFetch = []

									$scope.toFetch = _.differenceWith(discoveredArtists, $scope.network.links, function(arrVal,othVal){
										// console.log(arrVal.id, othVal.source)
										if(arrVal.id == othVal.source) {
											// console.log('presente', arrVal.id, othVal.source)
											return true
										} else {
											// console.log('assente', arrVal.id, othVal.source)
											return false
										}
									})


									console.log('to fetch', $scope.toFetch.length, '/', discoveredArtists.length)
									// console.log('network', $scope.network)

									$scope.getShortestPath();

								}
							}
						})
					},
					function(error){
						console.log(error)
					}
				);

	    	}, index*25);

	    	
    	})
    }

    $scope.$watch('artistLeft.id', function() {
    	if ($scope.artistLeft.id == $scope.artistRight.id && $scope.artistLeft.id) {
	    	console.log('same artist')
    	}
	});

	$scope.$watch('artistRight.id', function() {
    	if ($scope.artistLeft.id == $scope.artistRight.id && $scope.artistRight.id) {
	    	console.log('same artist')
    	}
	});

	$scope.saveData = function(format){
		if (format == 'json'){			
			var string = JSON.stringify($scope.network,null,2)
			var blob = new Blob([string], {type: "text/plain;charset=utf-8"});
			saveAs(blob, "data.json");
		}
	}

	$scope.getShortestPath = function() {
		var G = new jsnx.Graph();
		$scope.network.nodes.forEach(function(n){
			G.addNode(n.id)
		})
		$scope.network.links.forEach(function(l){
			G.addEdge(l.source,l.target);
		})
		
		try {
			var path = jsnx.bidirectionalShortestPath(G, $scope.artistLeft.id, $scope.artistRight.id);
			console.log(path)
		}
		catch(err){
			console.log(err)
			var error = err
		}
		if(!path&&error.name == 'JSNetworkXNoPath'){
			setTimeout($scope.fetchRelated(),2000)
		}
	}

  });

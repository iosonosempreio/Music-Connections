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
	// lorde			spotify:artist:163tK9Wjr9P9DmM0AVK7lm
	// cesare cremonini	spotify:artist:396Jr76018oUMR6QBnqT8T

	$scope.reset = function() {
		$scope.artistLeft = {};
		$scope.artistRight = {};

		apiService.getArtist('25MkkfEousyfp2eyh38FUl').then(
			function(data){
				$scope.artistLeft.id = data.id
				$scope.artistLeft.label = data.name
			},
			function(error){
				console.log(error)
			}
		);

		apiService.getArtist('6tbjWDEIzxoDsBA1FuhfPW').then(
			function(data){
				$scope.artistRight.id = data.id
				$scope.artistRight.label = data.name
			},
			function(error){
				console.log(error)
			}
		);

	    $scope.toFetch = [$scope.artistLeft,$scope.artistRight]
	    // $scope.network = { 'nodes':[], 'links': [] }
	    // $scope.network.nodes.push($scope.artistLeft)
	    // $scope.network.nodes.push($scope.artistRight)

	    $scope.jsnxGraph = new jsnx.Graph()
	    $scope.fetched = []
	}

	$scope.reset()

	$scope.implicitGrant = getAccess.implicitGrant()

    $scope.fetchRelated = function() {

    	var discoveredArtists = []
    	var discovered = []
    	// old way for calculating network
  //   	var newNodes = []
		// var newEdges = []

		// not perform the _.find on the collected nodes
		var newNodesRaw = []
		var newEdgesRaw = []

    	$scope.toFetch.forEach(function(artist, index){

    		$scope.fetched.push(artist.id)
    		
    		var url = 'https://api.spotify.com/v1/artists/{id}/related-artists'
	    	url = url.replace('{id}',artist.id)

	    	console.log('starting calls')
	    	setTimeout(function(){ 

	    		apiService.getRelated(url).then(
					function(data){
						
						data.artists.forEach(function(a, i){
							
							var thisNode = {
								'id':a.id,
								'label':a.name
							}
							var thisEdge = {
								'id':artist.id+'-'+a.id,
								'source':artist.id,
								'target':a.id
							}

							// old way for calculating network
							// if( !_.find($scope.network.nodes, { 'id': thisNode.id}) ) {
							// 	newNodes.push(thisNode)
							// }
							// if( !_.find($scope.network.links, { 'id': thisEdge.id}) ) {
							// 	newEdges.push(thisEdge)
							// }

							newNodesRaw.push(thisNode)
							newEdgesRaw.push(thisEdge)

							discoveredArtists.push(a)
							discovered.push(a.id)

							if (i+1 == data.artists.length) {
								
								if (index+1 == $scope.toFetch.length) {
									
									// old way for calculating network
									// console.log('newNodesRaw: ',newNodesRaw)
									// console.log('newEdgesRaw: ',newEdgesRaw)
									// create network manually, not the best
									// console.log('calculating network')
									// $scope.network.nodes = _.unionWith($scope.network.nodes, newNodes, _.isEqual);
									// $scope.network.links = _.unionWith($scope.network.links, newEdges, _.isEqual);

									// create network in jsnx
									console.log('calculating network with jnsx')
									var subG = new jsnx.Graph();
									newNodesRaw.forEach(function(n){
										subG.addNode(n.id,{'label':n.label});
									})
									newEdgesRaw.forEach(function(l){
										subG.addEdge(l.source,l.target,{'id':l.id});
									})
									$scope.jsnxGraph = jsnx.compose($scope.jsnxGraph, subG)
									$scope.jsnxGraphInfo = jsnx.info($scope.jsnxGraph)
									// console.log('info', jsnx.info($scope.jsnxGraph))
									// console.log('number of nodes: ',$scope.jsnxGraph.numberOfNodes())
									// console.log($scope.jsnxGraph.nodes(true));
									// console.log('jsnx',$scope.jsnxGraph.edges(true).length);
									// console.log('links',$scope.network.links.length);


									$scope.toFetch = []

									console.log('calculating next search')
									// old way for calculating next calls
									// $scope.toFetch = _.differenceWith(discoveredArtists, $scope.network.links, function(arrVal,othVal){
									// 	if(arrVal.id == othVal.source) {
									// 		return true
									// 	} else {
									// 		return false
									// 	}
									// })

									var newToFetch = _.pullAll(discovered,$scope.fetched);
									newToFetch.forEach(function(a){
										var _new = {'id':a}
										$scope.toFetch.push(_new)
									})
									// console.log('new to fetch',newToFetch.length)

									// $scope.toFetch = _.pullAll(discovered,$scope.fetched);

									console.log('to fetch', $scope.toFetch.length, '/', discoveredArtists.length)
									// console.log('network', $scope.network)
									// console.log('calculating shortest path (if exists)')
									$scope.getShortestPath();

								}
							}
						})
					},
					function(error){
						console.log(error)
					}
				);

	    	}, index*1);

	    	
    	})
    }

	$scope.getShortestPath = function() {
		try {
			var path = jsnx.bidirectionalShortestPath($scope.jsnxGraph, $scope.artistLeft.id, $scope.artistRight.id);
			$scope.conductiveNodes = []

			path.forEach(function(n){
				$scope.conductiveNodes.push($scope.jsnxGraph.node.get(n))
			})
			console.log($scope.conductiveNodes)

		}
		catch(err) {
			if(err.name != 'JSNetworkXNoPath'){
				console.log(err)
			}
			var error = err
			if(!path&&error.name == 'JSNetworkXNoPath'){
				setTimeout($scope.fetchRelated(),2000)
			}
		}
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

  });

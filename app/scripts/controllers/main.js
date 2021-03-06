'use strict';

/**
 * @ngdoc function
 * @name artistsLinkApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the artistsLinkApp
 */
angular.module('artistsLinkApp')
  .controller('MainCtrl', function ($scope, apiService, getAccess, $location,storeAccess, $timeout, $q, $log) {
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
	// afterhours		spotify:artist:4LAGemASxODFta2tWSAucy
	// CCCP				spotify:artist:18cezosJ2J9c3XZ7uVmMf0


	$scope.reset = function() {
		$scope.artistLeft = {};
		$scope.artistRight = {};

		// apiService.getArtist('1dfeR4HaWDbWqFHLkxsg1d').then(
		// 	function(data){
		// 		$scope.artistLeft.id = data.id
		// 		$scope.artistLeft.label = data.name
		// 	},
		// 	function(error){
		// 		console.log(error)
		// 	}
		// );

		// apiService.getArtist('25MkkfEousyfp2eyh38FUl').then(
		// 	function(data){
		// 		$scope.artistRight.id = data.id
		// 		$scope.artistRight.label = data.name
		// 	},
		// 	function(error){
		// 		console.log(error)
		// 	}
		// );

	    $scope.toFetch = [$scope.artistLeft,$scope.artistRight]
	    // $scope.network = { 'nodes':[], 'links': [] }
	    // $scope.network.nodes.push($scope.artistLeft)
	    // $scope.network.nodes.push($scope.artistRight)

	    $scope.jsnxGraph = new jsnx.Graph()
	    $scope.fetched = []
	    $scope.conductiveNodes = undefined;

	    $scope.implicitGrantLink = getAccess.implicitGrant()
	    $scope.accessToken = storeAccess.returnToken()
	    console.log($scope.accessToken)
	}

	$scope.reset()

	$scope.$watch('artistLeft',function(){
		$scope.toFetch = [$scope.artistLeft,$scope.artistRight]
		console.log($scope.toFetch)
	})

	$scope.$watch('artistRight',function(){
		$scope.toFetch = [$scope.artistLeft,$scope.artistRight]
		console.log($scope.toFetch)
	})

    $scope.fetchRelated = function() {



    	var discoveredArtists = []
    	var discovered = []
		var newNodesRaw = []
		var newEdgesRaw = []

		var counter = 0

		function fetchingSync(index){
			// console.log($scope.toFetch[index])
			var thisArtist = $scope.toFetch[index]
			$scope.fetched.push(thisArtist.id)
			var url = 'https://api.spotify.com/v1/artists/{id}/related-artists'.replace('{id}',thisArtist.id)

			// console.log('start call')
			apiService.getRelated(url).then(
				function(data){
					// save data and make calculations
					data.artists.forEach(function(a,i){
						var thisNode = {
							'id':a.id,
							'label':a.name
						}
						var thisEdge = {
							'id':thisArtist.id+'-'+a.id,
							'source':thisArtist.id,
							'target':a.id
						}

						newNodesRaw.push(thisNode)
						newEdgesRaw.push(thisEdge)

						discoveredArtists.push(a)
						discovered.push(a.id)
					});

					// console.log('Done', counter+1,'/',$scope.toFetch.length)
					counter++
					$scope.progress = ((counter+1)*100)/$scope.toFetch.length
					if (counter<$scope.toFetch.length){
						fetchingSync(counter)
					} else {
						// do stuff
						console.log('All done, ', counter)

						// create network in jsnx
						// console.log('calculating network with jnsx')
						var subG = new jsnx.Graph();
						newNodesRaw.forEach(function(n){
							subG.addNode(n.id,{'label':n.label});
						})
						newEdgesRaw.forEach(function(l){
							subG.addEdge(l.source,l.target,{'id':l.id});
						})
						$scope.jsnxGraph = jsnx.compose($scope.jsnxGraph, subG)
						$scope.jsnxGraphInfo = jsnx.info($scope.jsnxGraph)
						console.log(jsnx.degreeHistogram($scope.jsnxGraph))

						// console.log('calculating next search')
						counter = 0;
						$scope.toFetch = []
						var newToFetch = _.pullAll(discovered,$scope.fetched);
						newToFetch.forEach(function(a){
							var _new = {'id':a}
							$scope.toFetch.push(_new)
						})

						console.log('to fetch', $scope.toFetch.length, '/', discoveredArtists.length)
						// console.log('network', $scope.network)
						// console.log('calculating shortest path (if exists)')
						$scope.getShortestPath(true);

					}

				},
				function(error){
					console.log('Error', error)
			});
		}

		fetchingSync(counter);

    }

	$scope.getShortestPath = function(proceed) {
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
			if(!path&&error.name == 'JSNetworkXNoPath'&&proceed==true){
				setTimeout($scope.fetchRelated(),2000)
			} else {
				console.log('no path found at this stage')
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

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

    $scope.artistLeft = {
    	'id':'2ye2Wgw4gimLv2eAKyk1NB',
    	'name':'Metallica',
    	'level': 0
    }

    // $scope.artistLeft = {
    // 	'id':'1dfeR4HaWDbWqFHLkxsg1d',
    // 	'name':'Queen',
    // 	'level': 0
    // }

    // $scope.artistRight = {
    // 	'id':'5imUS9dQyCbAjUEJJ9QyWC',
    // 	'name':'Powerman 5000',
    // 	'level': 0
    // }

    // $scope.artistLeft = {
    // 	'id':'6tbjWDEIzxoDsBA1FuhfPW',
    // 	'name':'Madonna',
    // 	'level': 0
    // }

    $scope.artistRight = {
    	'id':'1dfeR4HaWDbWqFHLkxsg1d',
    	'name':'Queen',
    	'level': 0
    }

    // $scope.artistRight = {
    // 	'id':'6o2PxnpsrQ352kwYlEwjvR',
    // 	'name':'Area',
    // 	'level': 0
    // }

    // $scope.artistRight = {
    // 	'id':'6an9YCv0S0Mj3rsaD9Ahpz',
    // 	'name':'Ministri',
    // 	'level': 0
    // }

    // $scope.artistRight = {
    // 	'id':'3PhoLpVuITZKcymswpck5b',
    // 	'name':'Elthon John',
    // 	'level': 0
    // }

	$scope.reset = function() {
		$scope.related = {'left':[],'right':[]}
	    $scope.related.left.push($scope.artistLeft)
	    $scope.related.right.push($scope.artistRight)
	    $scope.commonRelated = []
	    $scope.toFetch = []

	    $scope.toFetch.push($scope.artistLeft)
	    $scope.toFetch.push($scope.artistRight)

	    $scope.network = { 'nodes':[], 'edges': [] }
	    $scope.network.nodes.push($scope.artistLeft)
	    $scope.network.nodes.push($scope.artistRight)

	    $scope.level = -1
	}

	$scope.drawChart = function(rel, com){
		console.log('drawChart')
	}


    $scope.compareRelated = function(){
    	var inCommon = _.intersectionWith($scope.related.left, $scope.related.right, _.isEqual)
    	inCommon.forEach(function(item){
    		if(item.id == $scope.artistLeft.id || item.id == $scope.artistRight.id){
    			var indexToCut = inCommon.indexOf(item);
    			if (indexToCut > -1) {
				    inCommon.splice(indexToCut, 1);
				}
    		}
    	})
    	if (inCommon.length > 0) {
    		$scope.commonRelated.push(inCommon)
    		console.log('>>>>> found related in common')
    		var stringa = ''
    		inCommon.forEach(function(art){
    			stringa+=art.name + ' ('+art.level+')'
    			stringa+=', '
    		})
    		console.log(stringa)		
    		$scope.drawChart($scope.related, $scope.commonRelated)

    		$scope.reset()
    	} else {
    		console.log('go on')
    		$scope.fetchRelated()	
    	}
    }

    $scope.reset()
    $scope.fetchRelated = function(){
    	
    	$scope.level++

    	var artists = $scope.related['left'].filter(function(a){
    		return a.level == $scope.level
    	})

    	artists.forEach(function(a,index){

    		$scope.related['left'].forEach(function(rel){
    			if(rel.id == a.id) {
    				console.log('cè già', a.name, rel.name)
    				// rel.level =  

    			}
    		})

			var url = 'https://api.spotify.com/v1/artists/{id}/related-artists'
	    	url = url.replace('{id}',a.id)

	    	setTimeout(function() {
			    console.log('call with delay')

				apiService.getRelated(url,{cache: true}).then(
					function(data){
						data.artists.forEach(function(aa){
							aa.level = $scope.level+1
							$scope.related['left'].push(aa)
						})
						if (index+1 == artists.length) {

							var artistsRight = $scope.related['right'].filter(function(b){
								return b.level == $scope.level
							})

							artistsRight.forEach(function(b,indexB){
								var urlB = 'https://api.spotify.com/v1/artists/{id}/related-artists'
								urlB = urlB.replace('{id}',b.id)
								
								setTimeout(function() {
								    console.log('call with delay2')
								    apiService.getRelated(urlB,{cache: true}).then(
										function(data){
											data.artists.forEach(function(bb){
												bb.level = $scope.level+1
												$scope.related['right'].push(bb)
											})
											if (indexB+1 == artistsRight.length){
												console.log($scope.related)
												$scope.compareRelated()
											}
										},
										function(error,data){
											console.log(error,data)
										}
									);
								}, indexB*50);
								

							})
						}
					},
					function(error,data){
						console.log(error,data)
					}
				);

			}, index*50);


		})

    }

    $scope.fetchRelated = function() {
    	console.log('to fetch',$scope.toFetch)

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
								$scope.network.edges = _.unionWith($scope.network.edges, newEdges, _.isEqual)
								console.log('edges',newEdges.length,$scope.network.edges.length)
								console.log('discoveredArtists',discoveredArtists.length)

								$scope.toFetch = _.differenceWith(discoveredArtists, $scope.network.edges, function(arrVal,othVal){
									if(arrVal.id == othVal.source) {
										return true
									} else {
										return false
									}
								})

								console.log($scope.toFetch.length)

								console.log(sigma)

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

    //not used
    $scope.getRelated = function(artist,arrBox){
    	var url = 'https://api.spotify.com/v1/artists/{id}/related-artists'
    	url = url.replace('{id}',artist.id)

    	apiService.getRelated(url).then(
			function(data){

				data.artists.forEach(function(a){
					a.level = $scope.level
					arrBox.push(a)
				})
			},
			function(error){
				console.log(error)
			}
		);
    }


  });

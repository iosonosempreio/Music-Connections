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

    $scope.artistLeft = {
    	'id':'2ye2Wgw4gimLv2eAKyk1NB',
    	'name':'Metallica',
    	'level': 0
    }

    $scope.artistRight = {
    	'id':'5imUS9dQyCbAjUEJJ9QyWC',
    	'name':'Powerman 5000',
    	'level': 0
    }

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

    $scope.related = {'left':[],'right':[]}

    $scope.related.left.push($scope.artistLeft)
    $scope.related.right.push($scope.artistRight)


	$scope.commonRelated = []
	
	// $scope.matchFound = false


	$scope.drawChart = function(){
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
    		console.log('>>>>> found related in common', inCommon)
    		$scope.drawChart()
    	} else {
    		console.log('go on')
    		$scope.fetchRelated()	
    	}
    }

    $scope.level = -1
    $scope.fetchRelated = function(){
    	
    	$scope.level++

    	// console.log('filter level', $scope.level)
    	var artists = $scope.related['left'].filter(function(a){
    		return a.level == $scope.level
    	})
    	// console.log('arr length', artists.length)

    	artists.forEach(function(a,index){
			var url = 'https://api.spotify.com/v1/artists/{id}/related-artists'
	    	url = url.replace('{id}',a.id)
	    	// console.log('get',a.name, index, artists.length)

	    	apiService.getRelated(url).then(
				function(data){
					// console.log($scope.level)
					data.artists.forEach(function(aa){
						aa.level = $scope.level+1
						$scope.related['left'].push(aa)
					})
					if (index+1 == artists.length) {
						// console.log($scope.related)


						// console.log('filter level', $scope.level)
						var artistsRight = $scope.related['right'].filter(function(b){
							return b.level == $scope.level
						})
						// console.log('arr b length', artistsRight.length)

						artistsRight.forEach(function(b,indexB){
							var urlB = 'https://api.spotify.com/v1/artists/{id}/related-artists'
							urlB = urlB.replace('{id}',b.id)
							// console.log('get',b.name, indexB, artistsRight.length)

							apiService.getRelated(urlB).then(
								function(data){
									console.log($scope.level)
									data.artists.forEach(function(bb){
										bb.level = $scope.level+1
										$scope.related['right'].push(bb)
									})
									if (indexB+1 == artistsRight.length){
										console.log($scope.related)
										$scope.compareRelated()
									}
								},
								function(error){
									console.log(error,data)
								}
							);

						})
					}
				},
				function(error){
					console.log(error,data)
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

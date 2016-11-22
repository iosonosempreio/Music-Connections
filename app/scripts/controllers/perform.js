'use strict';

/**
 * @ngdoc function
 * @name artistsLinkApp.controller:PerformCtrl
 * @description
 * # PerformCtrl
 * Controller of the artistsLinkApp
 */
angular.module('artistsLinkApp')
  .controller('PerformCtrl', function ($scope, apiService, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.artistLeft, $scope.artistRight;

    $scope.show = {

    }

    $scope.disable = {
      'go-btn':false,
      'graph':false
    }

    $scope.searchArtist = function(query){
      return apiService.queryArtist(query).then(
        function(data){
          // console.log(data.artists.items)
          return data.artists.items
        },
        function(error){
          console.log(error)
        }
      )
    }

    $scope.reset = function() {
      console.log('reset')
      $scope.toFetch = [$scope.artistLeft,$scope.artistRight]
      $scope.jsnxGraph = new jsnx.Graph()
      $scope.fetched = []
      $scope.conductiveNodes = undefined;
      $scope.leftSelected = null;
      $scope.rightSelected = null;
      $scope.progress = 0;
      d3.select('#svg-graph').selectAll('*').remove();
    }

    $scope.$watchGroup(['artistLeft', 'artistRight'], function(newValues, oldValues) {
      if(newValues[0] != oldValues[0] && newValues[1] != oldValues[1]) {
        console.log('ready')
        $scope.toFetch = [$scope.artistLeft,$scope.artistRight]
        $scope.jsnxGraph = new jsnx.Graph()
        $scope.fetched = []
        $scope.conductiveNodes = undefined;
      }
    });

    $scope.getShortestPath = function(proceed) {
      try {
        var path = jsnx.bidirectionalShortestPath($scope.jsnxGraph, $scope.artistLeft.id, $scope.artistRight.id);
        $scope.conductiveNodes = []

        path.forEach(function(n){
          $scope.conductiveNodes.push($scope.jsnxGraph.node.get(n))
        })
        console.log($scope.conductiveNodes)
        $scope.$broadcast("draw")

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

    $scope.fetchRelated = function() {

      $scope.disable['go-btn'] = true;

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
            }
            else {
              // do stuff
              counter--;
              $scope.progress = ((counter+1)*100)/$scope.toFetch.length
              console.log('All done, ', counter)

              // create network in jsnx
              // console.log('calculating network with jnsx')
              var subG = new jsnx.Graph();
              newNodesRaw.forEach(function(n){
                subG.addNode(n.id,{'label':n.label,'id':n.id});
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

    $scope.saveData = function(format){
      if (format == 'json'){      
        var string = JSON.stringify($scope.network,null,2)
        var blob = new Blob([string], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "data.json");
      }
    }

  });

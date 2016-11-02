'use strict';

/**
 * @ngdoc service
 * @name artistsLinkApp.apiService
 * @description
 * # apiService
 * Factory in the artistsLinkApp.
 */
angular.module('artistsLinkApp')
  .factory('apiService', function ($q, $http, getAccess, storeAccess) {

    // Public API here
    return {
      getRelated : function(url){
        var deferred = $q.defer();
        var headers = {}
        // console.log(storeAccess.returnToken())
        if(storeAccess.returnToken() != 'no access token'){
          headers['Authorization'] = 'Bearer ' + storeAccess.returnToken()
        }
        $http.get(url, headers).success(function(data){
          deferred.resolve(data);
        }).error(function(error){
          deferred.reject("An error occured while fetching file",error);
        });

         return deferred.promise;
       },
      getArtist : function(id){
        var url = 'https://api.spotify.com/v1/artists/{id}/'
        url = url.replace('{id}',id)
        var deferred = $q.defer();
        $http.get(url).success(function(data){
          deferred.resolve(data);
        }).error(function(error){
          deferred.reject("An error occured while fetching file",error);
        });

         return deferred.promise;
       }
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name artistsLinkApp.apiService
 * @description
 * # apiService
 * Factory in the artistsLinkApp.
 */
angular.module('artistsLinkApp')
  .factory('apiService', function ($q, $http, getAccess) {

    // Public API here
    return {
      getRelated : function(url){
        var deferred = $q.defer();
        var headers = {}
        if(getAccess.accessToken()){
          headers['Authorization'] = 'Bearer ' + getAccess.accessToken()
          console.log(getAccess.accessToken())
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

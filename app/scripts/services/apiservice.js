'use strict';

/**
 * @ngdoc service
 * @name artistsLinkApp.apiService
 * @description
 * # apiService
 * Factory in the artistsLinkApp.
 */
angular.module('artistsLinkApp')
  .factory('apiService', function ($q, $http) {

    // Public API here
    return {
      getRelated : function(url){
         var deferred = $q.defer();
         $http.get(url).success(function(data){
           deferred.resolve(data);
         }).error(function(error){
           deferred.reject("An error occured while fetching file",error);
         });

         return deferred.promise;
       },
    };
  });

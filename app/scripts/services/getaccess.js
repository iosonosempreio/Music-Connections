'use strict';

/**
 * @ngdoc service
 * @name artistsLinkApp.getAccess
 * @description
 * # getAccess
 * Factory in the artistsLinkApp.
 */
angular.module('artistsLinkApp')
  .factory('getAccess', function () {

    var accessToken;

    // Public API here
    return {
      implicitGrant : function(){
        var url = 'https://accounts.spotify.com/authorize'
        url += '?' 
        var data = {
          'client_id' : '1ba0be6d44454d2190c97a418d18edef',
          'redirect_uri' : 'http://localhost:9000/#/connections',
          'scope' : '',
          'response_type' : 'token',
          'state' : '123'
        };
        for (var param in data){
          url += param + '=' + data[param] + '&'
        }
        url = url.slice(0, -1)
        return url
      },
      clientId : function(){
        return clientId;
      },
      accessToken : function(){
        return accessToken;
      }
    };
  });

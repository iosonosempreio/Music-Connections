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

    var clientId = '76a9da4794ac46fcb3f5923c2bc10dd3';
    var redirectURI = 'http:%2F%2Flocalhost:9000%2F%2F#%2F%2F';
    var accessToken;

    // Public API here
    return {
      implicitGrant : function(){
        var url = 'https://accounts.spotify.com/authorize'
        url += '?' 
        var data = {
          'client_id': clientId,
          'redirect_uri':redirectURI,
          'response_type':'token'
        };
        var parameters = ''
        for (var param in data){
          parameters += param + '=' + data[param] + '&'
        }
        parameters = parameters.slice(0, -1)
        url += parameters
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

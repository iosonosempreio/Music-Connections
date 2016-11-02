'use strict';

/**
 * @ngdoc service
 * @name artistsLinkApp.storeAccess
 * @description
 * # storeAccess
 * Provider in the artistsLinkApp.
 */
angular.module('artistsLinkApp')
  .provider('storeAccess', function () {

    // Private variables
    this.token = 'no access token';

    this.$get = function() {
        var thisToken = this.token;
        return {
            returnToken: function() {
                return thisToken;
            }
        }
    };

    this.setToken = function(rawPath) {
        this.token = /access_token=(.*)&token_type/.exec(rawPath)[0].replace(/access_token=/,'').replace('&token_type','');
    };


  });

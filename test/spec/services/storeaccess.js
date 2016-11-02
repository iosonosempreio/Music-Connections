'use strict';

describe('Service: storeAccess', function () {

  // instantiate service
  var storeAccess,
    init = function () {
      inject(function (_storeAccess_) {
        storeAccess = _storeAccess_;
      });
    };

  // load the service's module
  beforeEach(module('artistsLinkApp'));

  it('should do something', function () {
    init();

    expect(!!storeAccess).toBe(true);
  });

  it('should be configurable', function () {
    module(function (storeAccessProvider) {
      storeAccessProvider.setSalutation('Lorem ipsum');
    });

    init();

    expect(storeAccess.greet()).toEqual('Lorem ipsum');
  });

});

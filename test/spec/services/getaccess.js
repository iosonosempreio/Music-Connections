'use strict';

describe('Service: getAccess', function () {

  // load the service's module
  beforeEach(module('artistsLinkApp'));

  // instantiate service
  var getAccess;
  beforeEach(inject(function (_getAccess_) {
    getAccess = _getAccess_;
  }));

  it('should do something', function () {
    expect(!!getAccess).toBe(true);
  });

});

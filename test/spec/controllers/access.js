'use strict';

describe('Controller: AccessCtrl', function () {

  // load the controller's module
  beforeEach(module('artistsLinkApp'));

  var AccessCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccessCtrl = $controller('AccessCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AccessCtrl.awesomeThings.length).toBe(3);
  });
});

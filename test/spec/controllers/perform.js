'use strict';

describe('Controller: PerformCtrl', function () {

  // load the controller's module
  beforeEach(module('artistsLinkApp'));

  var PerformCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PerformCtrl = $controller('PerformCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PerformCtrl.awesomeThings.length).toBe(3);
  });
});

'use strict';

describe('Directive: jsnxArtistsNetwork', function () {

  // load the directive's module
  beforeEach(module('artistsLinkApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<jsnx-artists-network></jsnx-artists-network>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the jsnxArtistsNetwork directive');
  }));
});

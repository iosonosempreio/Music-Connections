'use strict';

describe('Directive: artistsChain', function () {

  // load the directive's module
  beforeEach(module('artistsLinkApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<artists-chain></artists-chain>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the artistsChain directive');
  }));
});

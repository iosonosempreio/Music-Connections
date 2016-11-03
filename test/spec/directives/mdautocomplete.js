'use strict';

describe('Directive: mdAutocomplete', function () {

  // load the directive's module
  beforeEach(module('artistsLinkApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<md-autocomplete></md-autocomplete>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mdAutocomplete directive');
  }));
});

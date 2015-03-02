'use strict';

/* Filters */

angular.module('consoleApp.filters', []).
  
  filter('interpolate', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  })

  .filter('byType',  function() {
    return function( workproducts, value ) {
	   	var filtered = [];
	    angular.forEach(workproducts, function(workproduct) {
	      if( workproduct.PackageMetadata[0].WorkProductIdentification[0].Type[0].text === value) {
	        filtered.push(workproduct);
	      }
	    });
	    return filtered;
    }
  })

  .filter('byInterestGroup',  function() {
    return function( workproducts, value ) {
      var filtered = [];
      angular.forEach(workproducts, function(workproduct) {
        if( workproduct.PackageMetadata[0].WorkProductProperties[0].AssociatedGroups[0].Identifier[0].text === value) {
          filtered.push(workproduct);
          console.debug('adding workproduct')
        }
      });
      return filtered;
    }
  })



  ;

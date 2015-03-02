function WorkProductController($scope, $http) {

	$scope.endpoint = '/uicds/pub/search?format=xml';

	$scope.workproducts = [];

	function getBasicAuth(username, password) {
		var tok = username + ':' + password;
		var hash = Base64.encode(tok);
		return "Basic " + hash;
	};

};
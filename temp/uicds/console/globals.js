var globals = (function () {

	// core identification
	var coreUser = 'uicds';
	var coreAddress = '%FQDN%';
	var servicePath = '/uicds/core/ws/services';

	// service namespaces
	var agreementNS = 'http://uicds.org/AgreementService';

	// make them public
	return {
		coreUser: coreUser,
		coreAddress: coreAddress,
		servicePath: servicePath,
		agreementNS: agreementNS,

    };
}());


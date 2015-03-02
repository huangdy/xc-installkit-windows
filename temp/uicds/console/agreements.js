function AgreementController($scope, $http) {

	$scope.agreementNS = globals.agreementNS;

    var section = 1;

    $scope.section = function (id) {
        section = id;
    };

    $scope.is = function (id) {
        return section == id;
    };

	$scope.agreements = [];
	$scope.currentAgreement = 0;

	$scope.incidentTypeOptions = [];
	$scope.exMetadataOptions = [];


	function getBasicAuth(username, password) {
		var tok = username + ':' + password;
		var hash = Base64.encode(tok);
		return "Basic " + hash;
	};

	$scope.endpoint = globals.servicePath;

  $scope.init = function() {
			// load incident type options
			$http({
					method: 'GET',
					url: 'codelists/incidentTypes.js'
				}).success(function (result) {
					$scope.incidentTypeOptions = result;
			});

			// load extended metadata options
			$http({
					method: 'GET',
					url: 'codelists/extendedMetadata.js'
				}).success(function (result) {
					$scope.exMetadataOptions = result;
			});

			$scope.refresh();

  };

	// initialize template object for new agreements
	$scope.createNew = function() {
		$scope.agreements.push(
			{
				"__new" : true,
				"Principals": [
					{
						"LocalCore" : [
                                                        {"text" : ""}],
		                         	"RemoteCore" : [
							{"text" : ""}
						]
					}
				],
				"ShareRules": [
					{
						"attr": {
							"enabled": {
								"value": true
							}
						},
						"ShareRule": []
					}
				]
			});

			$scope.section($scope.agreements.length-1);

	};

	// refresh list of agreements from core
	$scope.refresh = function() {

		// render request
		var xml = Mustache.render(xmlGetAgreementListTmpl, $scope);

		// load agreement list
		$http({
			method: 'POST',
			url: $scope.endpoint,
			headers: {"Content-Type": "text/xml"},
			data: xml }).
			success(function(data, status, headers, config) {

				// clear existing agreements object
				$scope.agreements = [];

				// this callback will be called asynchronously
				// when the response is available
				var result = xmlToJSON.parseString(data);
				console.debug(JSON.stringify(result));

				// test to see if any agreements were returned
				var agreementList = avail(result, 'Envelope[0].Body[0].GetAgreementListResponse[0].AgreementList[0]');

				// add them to local array of agreements
				if (agreementList.Agreement && agreementList.Agreement.length > 0) {
					for (i = 0; i < agreementList.Agreement.length; i++ ) {
						agreement = agreementList.Agreement[i];
						$scope.agreements.push(agreement);
					}
					$scope.section($scope.currentAgreement);
				}

				if ($scope.agreements.length == 0) {
					$scope.createNew();
				};

			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					alert('An error occured while attempting to load the agreement list from the core.  Error code: ' + status);
			});
	};

	// update the interest group sub type when a new one is selected
	$scope.updateIncidentType = function(interestGroup) {
		// look up object in incident types list
		for (i = 0; i < $scope.incidentTypeOptions.length; i++) {
			try {
				if (interestGroup.attr.label.value == $scope.incidentTypeOptions[i].label) {
					//augment object
					interestGroup.attr.code = {};
					interestGroup.attr.codespace = {};

					interestGroup.attr.code.value = $scope.incidentTypeOptions[i].code;
					interestGroup.attr.codespace.value = $scope.incidentTypeOptions[i].codespace;
					interestGroup.text = $scope.incidentTypeOptions[i].code;
				}
			} catch (err) {
			}
		}

	};

	// update the extended metadata when a new one is selected
	$scope.updateExMetadata = function(extendedMetadata) {
		// look up object in extended metadata options list
		for (i = 0; i < $scope.exMetadataOptions.length; i++) {
			try {
				if (extendedMetadata.attr.label.value == $scope.exMetadataOptions[i].label) {
					//augment object
					extendedMetadata.attr.code = {};
					extendedMetadata.attr.codespace = {};

					extendedMetadata.attr.code.value = $scope.exMetadataOptions[i].code;
					extendedMetadata.attr.codespace.value = $scope.exMetadataOptions[i].codespace;
				}
			} catch (err) {
			}
		}

	};

	$scope.rescind = function(agreement) {
		// enrich object selected agreement object
		agreement.agreementNS = $scope.agreementNS;
		agreement.localCore = globals.coreUser + '@' + globals.coreAddress;
		agreement.guid = function() { return  guid() };

		xml = Mustache.render(xmlRescindAgreementTmpl, agreement);

		if (!agreement.Principals[0].RemoteCore[0].text) {
			alert('Please select an existing agreement.  Click "Refresh" to load agreements from the core.');
			return;
		}

		$http({
			method: 'POST',
			url: $scope.endpoint,
			headers: {"Content-Type": "text/xml"},
			data: xml }).

			success(function(data, status, headers, config) {
				alert("Successfully rescinded the agreement with " + agreement.Principals[0].RemoteCore[0].text);
							$scope.refresh();
						}).
						error(function(data, status, headers, config) {
							// called asynchronously if an error occurs
							// or server returns response with an error status.
								alert('An error occured while attempting to rescind the agreement.  Error code: ' + status);
			});
	};

	$scope.submit = function(agreement) {
			// enrich object selected agreement object
			agreement.agreementNS = $scope.agreementNS;
			//agreement.localCore = globals.coreUser + '@' + globals.coreAddress;
			agreement.guid = function() { return  guid() };

			$scope.currentAgreement = $scope.agreements.indexOf(agreement);

			var partials = {agreementPartial: xmlAgreementTmpl };

			if (!agreement.Principals[0].RemoteCore[0].text || (agreement.Principals[0].RemoteCore[0].text.indexOf('@') == -1) ) {
				alert('Please enter a remote core address in the form uicds@remotecore.com');
				return;
			}

			if (agreement['__new'] == true) {
				xml = Mustache.render(xmlCreateAgreementTmpl, agreement, partials);
			} else {
				xml = Mustache.render(xmlUpdateAgreementTmpl, agreement, partials);
			}

			$http({
				method: 'POST',
				url: $scope.endpoint,
				headers: {"Content-Type": "text/xml"},
				data: xml }).
				success(function(data, status, headers, config) {
					alert("Successfully created agreement with " + agreement.Principals[0].RemoteCore[0].text);
							}).
							error(function(data, status, headers, config) {
								// called asynchronously if an error occurs
								// or server returns response with an error status.
									alert('An error occured while attempting to create or update the agreement.  Error code: ' + status);
				});

			agreement['__new'] = false;

	};

	$scope.viewXML = function(agreement) {
		agreement.agreementNS = $scope.agreementNS;
		//agreement.localCore = globals.coreUser + '@' + globals.coreAddress;
		agreement.guid = function() { return  guid() };
		viewRawXML(Mustache.render(xmlAgreementTmpl, agreement));
	};

	$scope.debug = function(agreement) {

		// enrich object selected agreement object
		agreement.agreementNS = $scope.agreementNS;
		//agreement.localCore = globals.coreUser + '@' + globals.coreAddress;
		agreement.guid = function() { return  guid() };

		// render xml
		var partials = {agreementPartial: xmlAgreementTmpl };

		//get list
		//console.debug("---- get list");
		//console.debug(Mustache.render(xmlGetAgreementListTmpl, $scope));


		//get specifc
		//console.debug("---- get specifc");
		//console.debug(Mustache.render(xmlGetAgreementTmpl, agreement));

		//create
		//console.debug("---- create");
		//console.debug(Mustache.render(xmlCreateAgreementTmpl, agreement, partials));

		//update
		//console.debug("---- update");
		//console.debug(Mustache.render(xmlUpdateAgreementTmpl, agreement, partials));

		//rescind
		//console.debug("---- rescind");
		//console.debug(Mustache.render(xmlRescindAgreementTmpl, agreement));

	};

	$scope.addShareRule = function(agreement) {
		if (!agreement.ShareRules[0].ShareRule) { agreement.ShareRules[0].ShareRule = new Array(); };
		agreement.ShareRules[0].ShareRule.push(
			{"attr": {
				"enabled": {
						"value": true
				}
             },"Condition": [	{"InterestGroup": [{ "attr": {"label" : {"value":"All Incident Types"}, "code" : {"value":"*"}}, "text": "*"}],"RemoteCoreProximity": [],	"ExtendedMetadata": []}	]}
		);
	};

	$scope.removeShareRule = function(agreement, shareRule) {
			var index = agreement.ShareRules[0].ShareRule.indexOf(shareRule);
			agreement.ShareRules[0].ShareRule.splice(index, 1);
	};

	$scope.removeInterestGroup = function(condition, interestGroup) {
		var index = condition.InterestGroup.indexOf(interestGroup);
		condition.InterestGroup.splice(index, 1);
	};

	$scope.clearInterestGroup = function(interestGroup) {
		interestGroup.attr.codespace.value = '';
		interestGroup.text = '';
	};

	$scope.addExtendedMetadata = function(condition) {
		if (!condition.ExtendedMetadata) { condition.ExtendedMetadata = new Array(); };
		condition.ExtendedMetadata[0] ={};
	};

	$scope.removeExtendedMetadata = function(condition, extendedMetadata) {
		var index = condition.ExtendedMetadata.indexOf(extendedMetadata);
		condition.ExtendedMetadata.splice(index, 1);
	};

	$scope.clearExtendedMetadata = function(extendedMetadata) {
		extendedMetadata.attr.codespace.value = '';
		extendedMetadata.attr.code.value = '';
		extendedMetadata.text = '';
	};

	$scope.addRemoteCoreProximity = function(condition) {
		condition.RemoteCoreProximity = new Array();
		condition.RemoteCoreProximity[0] = { "attr": {"shareOnNoLoc": {"value": false} }, "text": 10 } ;
	};

	$scope.removeRemoteCoreProximity = function(condition) {
		condition.RemoteCoreProximity = [];
	};
}


	// XML Templates for the Agreement Service

	var xmlAgreementTmpl =
		['<as:Agreement xmlns:precisb="http://www.saic.com/precis/2009/06/base" xmlns:as="{{{agreementNS}}}">',
		'<as:Principals>',
		'<as:LocalCore precisb:label="Local Core">{{{Principals.0.LocalCore.0.text}}}</as:LocalCore>',
		'<as:RemoteCore precisb:label="Remote Core">{{{Principals.0.RemoteCore.0.text}}}</as:RemoteCore>',
		'</as:Principals>',
		'<as:ShareRules enabled="{{ShareRules.0.attr.enabled.value}}">',
		'{{#ShareRules.0.ShareRule}}',
			'<as:ShareRule enabled="{{attr.enabled.value}}" {{^attr.id.value}}id="id-{{guid}}"{{/attr.id.value}} {{#attr.id.value}}id="{{attr.id.value}}"{{/attr.id.value}}>',
			'{{#Condition}}',
				'<as:Condition>',
				'{{#InterestGroup}}',
					'<as:InterestGroup precisb:label="{{attr.label.value}}" precisb:codespace="{{{attr.codespace.value}}}" code="{{attr.code.value}}">{{text}}</as:InterestGroup>',
				'{{/InterestGroup}}',
				'{{#ExtendedMetadata}}',
						'<as:ExtendedMetadata label="{{attr.label.value}}" codespace="{{{attr.codespace.value}}}" code="{{attr.code.value}}">{{text}}</as:ExtendedMetadata>',
				'{{/ExtendedMetadata}}',
				'{{#RemoteCoreProximity.0.text}}',
						'<as:RemoteCoreProximity shareOnNoLoc="{{RemoteCoreProximity.0.attr.shareOnNoLoc.value}}">{{RemoteCoreProximity.0.text}}</as:RemoteCoreProximity >',
				'{{/RemoteCoreProximity.0.text}}',
				'</as:Condition>',
			'{{/Condition}}',
			'</as:ShareRule>',
			'{{/ShareRules.0.ShareRule}}',
		'</as:ShareRules>',
		'</as:Agreement>'
		].join('\n');

	var xmlCreateAgreementTmpl =
		['<?xml version="1.0" encoding="UTF-8"?>',
		'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">',
		'<SOAP-ENV:Header/>',
		'<SOAP-ENV:Body>',
		'<as:CreateAgreementRequest xmlns:as="{{{agreementNS}}}">',
		'{{> agreementPartial}}',
		'</as:CreateAgreementRequest>',
		'</SOAP-ENV:Body>',
		'</SOAP-ENV:Envelope>'
		].join('\n');

	var xmlUpdateAgreementTmpl =
		['<?xml version="1.0" encoding="UTF-8"?>',
		'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">',
		'<SOAP-ENV:Header/>',
		'<SOAP-ENV:Body>',
		'<as:UpdateAgreementRequest xmlns:as="{{{agreementNS}}}">',
		'{{> agreementPartial}}',
		'</as:UpdateAgreementRequest>',
		'</SOAP-ENV:Body>',
		'</SOAP-ENV:Envelope>'
		].join('\n');

	var xmlGetAgreementListTmpl =
		['<?xml version="1.0" encoding="UTF-8"?>',
		'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">',
		'<SOAP-ENV:Header/>',
		'<SOAP-ENV:Body>',
		'<as:GetAgreementListRequest xmlns:as="{{{agreementNS}}}" />',
		'</SOAP-ENV:Body>',
		'</SOAP-ENV:Envelope>'
		].join('\n');

	var xmlGetAgreementTmpl =
		['<?xml version="1.0" encoding="UTF-8"?>',
		'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">',
		'<SOAP-ENV:Header/>',
		'<SOAP-ENV:Body>',
		'<as:GetAgreementRequest xmlns:as="{{{agreementNS}}}">',
		'<as:CoreID>{{{Principals.0.RemoteCore.0.text}}}</as:CoreID>',
		'</as:GetAgreementRequest>',
		'</SOAP-ENV:Body>',
		'</SOAP-ENV:Envelope>'
		].join('\n');

	var xmlRescindAgreementTmpl =
		['<?xml version="1.0" encoding="UTF-8"?>',
		'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">',
		'<SOAP-ENV:Header/>',
		'<SOAP-ENV:Body>',
		'<as:RescindAgreementRequest xmlns:as="{{{agreementNS}}}">',
		'<as:CoreID>{{{Principals.0.RemoteCore.0.text}}}</as:CoreID>',
		'</as:RescindAgreementRequest>',
		'</SOAP-ENV:Body>',
		'</SOAP-ENV:Envelope>'
		].join('\n');

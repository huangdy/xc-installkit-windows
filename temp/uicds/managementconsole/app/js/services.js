'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('consoleApp.services', []).
value('version', '0.5')

.factory('corePropertiesAPIService', function ($http) {
    var corePropertiesAPI = {};

    corePropertiesAPI.getProperties = function () {
        var serviceURL = '/uicds/core.properties'
        var value = "UNKNOWN";
        //var expression = /console\.title=/g;

        console.log("Fetching core properties object. ")

        return $http.get(serviceURL);

    }

    return corePropertiesAPI;
})

.factory('rosterAPIService', function ($http) {
    var rosterAPI = {};

    rosterAPI.getRosterStatus = function () {
        var serviceURL = '/uicds/core/ws/services'

        var xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">',
                '<soapenv:Header/>',
                '<soapenv:Body>',
                '   <dir:GetCoreListRequest xmlns:dir="http://uicds.org/DirectoryService">',
                '   </dir:GetCoreListRequest>',
                '</soapenv:Body>',
                '</soapenv:Envelope>'
            ].join('\n');            
        
        console.log("Fetching roster status ")

        return $http({
            method: 'POST',
            url: serviceURL,
            headers: {
                "Content-Type": "text/xml"
            },
            data: xmlRequest
        });

    }

    return rosterAPI;
})

.factory('instancesAPIService', function ($http) {
    var instancesAPI = {};

    instancesAPI.getProfileList = function () {

        var serviceURL = '/uicds/core/ws/services'

        var xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">',
                '<soapenv:Header/>',
                '<soapenv:Body>',
                '   <res:GetProfileListRequest xmlns:res="http://uicds.org/ResourceProfileService">',
                '   </res:GetProfileListRequest>',
                '</soapenv:Body>',
                '</soapenv:Envelope>'
            ].join('\n');            
        
        console.log("Fetching Profile List ")

        return $http({
            method: 'POST',
            url: serviceURL,
            headers: {
                "Content-Type": "text/xml"
            },
            data: xmlRequest
        });
    }

    instancesAPI.getProfile = function (profileID) {

        var serviceURL = '/uicds/core/ws/services'

        if (profileID) {
            var xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
                    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">',
                    '<soapenv:Header/>',
                    '<soapenv:Body>',
                    '   <res:GetProfileRequest xmlns:res="http://uicds.org/ResourceProfileService">',
                    '       <res:ID>'+ profileID +'</res:ID>',                
                    '   </res:GetProfileRequest>',
                    '</soapenv:Body>',
                    '</soapenv:Envelope>'
                ].join('\n');

            console.log("Fetching Profile: " + profileID)

            return $http({
                method: 'POST',
                url: serviceURL,
                headers: {
                    "Content-Type": "text/xml"
                },
                data: xmlRequest
            });
        }
    }

    instancesAPI.getInstanceList = function () {

        var serviceURL = '/uicds/core/ws/services'

        var xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">',
                '<soapenv:Header/>',
                '<soapenv:Body>',
                '   <ris:GetResourceInstanceListRequest xmlns:ris="http://uicds.org/ResourceInstanceService">',
                '   </ris:GetResourceInstanceListRequest>',
                '</soapenv:Body>',
                '</soapenv:Envelope>'
            ].join('\n');

        console.log("Fetching Instance List ")

        return $http({
            method: 'POST',
            url: serviceURL,
            headers: {
                "Content-Type": "text/xml"
            },
            data: xmlRequest
        });
    }

    instancesAPI.getInstance = function (instanceID) {

        var serviceURL = '/uicds/core/ws/services'

        var xmlRequest;
        if (instanceID) {
            xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">',
                '<soapenv:Header/>',
                '<soapenv:Body>',
                '   <ris:GetResourceInstanceRequest xmlns:ris="http://uicds.org/ResourceInstanceService">',
                '       <ris:ID>'+ instanceID +'</ris:ID>',
                '   </ris:GetResourceInstanceRequest>',
                '</soapenv:Body>',
                '</soapenv:Envelope>'
            ].join('\n');

            console.log("Fetching Instance: " + instanceID)

            return $http({
                method: 'POST',
                url: serviceURL,
                headers: {
                    "Content-Type": "text/xml"
                },
                data: xmlRequest
            });
        }
    }

    instancesAPI.createProfile = function (profile) {

        var serviceURL = '/uicds/core/ws/services'

        var xmlRequest;
        if (profile) {
             xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">',
                '<soapenv:Header/>',
                '<soapenv:Body>',
                '   <res:CreateProfileRequest xmlns:res="http://uicds.org/ResourceProfileService">',
                '      <res:Profile>',
                '         <res:ID>'+ profile.ID[0].text +'</res:ID>',
                '         <res:Description>'+ profile.Description[0].text +'</res:Description>',
                '         <res:Interests><res:Interest><res:TopicExpression>'+ profile.Interests[0].Interest[0].TopicExpression[0].text +'</res:TopicExpression></res:Interest></res:Interests>',
                '      </res:Profile>',
                '   </res:CreateProfileRequest>',
                '</soapenv:Body>',
                '</soapenv:Envelope>'
            ].join('\n');

            console.log("Creating Profile: " + profile.ID[0].text)

            return $http({
                method: 'POST',
                url: serviceURL,
                headers: {
                    "Content-Type": "text/xml"
                },
                data: xmlRequest
            });
        }
    }

    instancesAPI.deleteProfile = function (profileID) {

        var serviceURL = '/uicds/core/ws/services'

        var xmlRequest;
        if (profileID) {
             xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">',
                '<soapenv:Header/>',
                '<soapenv:Body>',
                '   <res:DeleteProfileRequest xmlns:res="http://uicds.org/ResourceProfileService">',
                '         <res:ID>'+ profileID +'</res:ID>',
                '   </res:DeleteProfileRequest>',
                '</soapenv:Body>',
                '</soapenv:Envelope>'
            ].join('\n');

            console.log("Deleting Profile: " + profileID)

            return $http({
                method: 'POST',
                url: serviceURL,
                headers: {
                    "Content-Type": "text/xml"
                },
                data: xmlRequest
            });
        }
    }

    instancesAPI.deleteInterest = function (profileID, interest) {

        var serviceURL = '/uicds/core/ws/services'

        var xmlRequest;
        if (profileID && interest) {
             xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">',
                '<soapenv:Header/>',
                '<soapenv:Body>',
                '   <res:RemoveInterestRequest xmlns:res="http://uicds.org/ResourceProfileService">',
                '         <res:ID>'+ profileID +'</res:ID>',
                '         <res:Interest><res:TopicExpression>'+ interest +'</res:TopicExpression></res:Interest>',
                '   </res:RemoveInterestRequest>',
                '</soapenv:Body>',
                '</soapenv:Envelope>'
            ].join('\n');

            console.log("Removing Interest: " + interest)

            return $http({
                method: 'POST',
                url: serviceURL,
                headers: {
                    "Content-Type": "text/xml"
                },
                data: xmlRequest
            });
        }
    }    

    instancesAPI.addInterest = function (profileID, interest) {

        var serviceURL = '/uicds/core/ws/services'

        var xmlRequest;
        if (profileID && interest) {
             xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">',
                '<soapenv:Header/>',
                '<soapenv:Body>',
                '   <res:AddInterestRequest xmlns:res="http://uicds.org/ResourceProfileService">',
                '         <res:ID>'+ profileID +'</res:ID>',
                '         <res:Interest><res:TopicExpression>'+ interest +'</res:TopicExpression></res:Interest>',
                '   </res:AddInterestRequest>',
                '</soapenv:Body>',
                '</soapenv:Envelope>'
            ].join('\n');

            console.log("Adding Interest: " + interest)

            return $http({
                method: 'POST',
                url: serviceURL,
                headers: {
                    "Content-Type": "text/xml"
                },
                data: xmlRequest
            });
        }
    } 

    instancesAPI.createInstance = function (instance) {

        var serviceURL = '/uicds/core/ws/services'

        var xmlRequest;
        if (instance) {
             xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">',
                '<soapenv:Header/>',
                '<soapenv:Body>',
                '   <ris:RegisterRequest xmlns:ris="http://uicds.org/ResourceInstanceService">',
                '         <ris:ID>'+ instance.ID[0].text +'</ris:ID>',
                '         <ris:LocalResourceID>'+ instance.ID[0].text +'</ris:LocalResourceID>',
                '         <ris:ResourceProfileID>'+ instance.ProfileIDs[0].ProfileID[0].text+'</ris:ResourceProfileID>',
                '   </ris:RegisterRequest>',
                '</soapenv:Body>',
                '</soapenv:Envelope>'
            ].join('\n');

            console.log("Creating Instance: " + instance.ID[0].text)

            return $http({
                method: 'POST',
                url: serviceURL,
                headers: {
                    "Content-Type": "text/xml"
                },
                data: xmlRequest
            });
        }
    }

    instancesAPI.deleteInstance = function (instanceID) {

        var serviceURL = '/uicds/core/ws/services'

        var xmlRequest;
        if (instanceID) {
             xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">',
                '<soapenv:Header/>',
                '<soapenv:Body>',
                '   <ris:UnregisterRequest xmlns:ris="http://uicds.org/ResourceInstanceService">',
                '         <ris:ID>'+ instanceID +'</ris:ID>',
                '   </ris:UnregisterRequest>',
                '</soapenv:Body>',
                '</soapenv:Envelope>'
            ].join('\n');

            console.log("Deleting Instance: " + instanceID)

            return $http({
                method: 'POST',
                url: serviceURL,
                headers: {
                    "Content-Type": "text/xml"
                },
                data: xmlRequest
            });
        }
    }       
 

    return instancesAPI;
})

.factory('usersAPIService', function ($http) {

    var usersAPI = {};

    usersAPI.createUser = function (user) {

        var serviceURL = '/manage/users?_action=create&_prettyPrint=true';

        if (user) {
            var jsonRequest = {
                "_id": user.displayName,
                "displayName": user.displayName,
                "name": {
                    "familyName": user.displayName
                },
                "_password" : user.password
            };

            if (user.latitude != '' && user.longitude != '') {
                jsonRequest.latitude = user.latitude;
                jsonRequest.longitude = user.longitude;
            }

                console.log("Creating User " + user.displayName)


            return $http({
                method: 'POST',
                url: serviceURL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: jsonRequest
            });

        }
    }

    usersAPI.createGroup = function (group) {
        var serviceURL = '/manage/groups?_action=create&_prettyPrint=true';

        if (group) {
            var jsonRequest = {
                "_id": group.displayName,
                "displayName": group.displayName,
            };

            if (group.latitude != '' && group.longitude != '') {
                jsonRequest.latitude = group.latitude;
                jsonRequest.longitude = group.longitude;
            }

            console.log("Creating group " + group.displayName)

            return $http({
                method: 'POST',
                url: serviceURL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: jsonRequest
            });
        }
    }

    usersAPI.updateUser = function (user, updates) {
        var serviceURL = '/manage/users';

        if (updates.length > 0) {
            serviceURL = serviceURL + '/' + user.displayName + '?_prettyPrint=true';
            var jsonRequest = updates;

            console.log("Updating user " + user.displayName)

            return $http({
                method: 'PATCH',
                url: serviceURL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: jsonRequest
            });
        }
    }

    usersAPI.updateGroup = function (group, updates) {
        var serviceURL = '/manage/groups';

        if (updates.length > 0) {
            serviceURL = serviceURL + '/' + group.displayName + '?_prettyPrint=true';
            var jsonRequest = updates;

                    console.log("Updating group " + group.displayName)


            return $http({
                method: 'PATCH',
                url: serviceURL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: jsonRequest
            });
        }
    }

    usersAPI.deleteUser = function (user) {
        var serviceURL = '/manage/users';

        console.log("Deleting user " + user.displayName)


        if (user) {
            serviceURL = serviceURL + '/' + user.displayName + '?_prettyPrint=true';
            return $http({
                method: 'DELETE',
                url: serviceURL,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {}
    }

    usersAPI.deleteGroup = function (group) {
        var serviceURL = '/manage/groups';

        console.log("Deleting group " + group.displayName)

        if (group) {
            serviceURL = serviceURL + '/' + group.displayName + '?_prettyPrint=true';
            return $http({
                method: 'DELETE',
                url: serviceURL,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {}
    }

    usersAPI.getUsers = function (userid) {

        var serviceURL = '/manage/users';

        if (userid) {
            serviceURL = serviceURL + '/' + userid + '?_prettyPrint=true';
        } else {
            // else get all users
            serviceURL = serviceURL + '?_queryFilter=_type+eq+"inetOrgPerson"&_prettyPrint=true';
        }

        console.log("Fetching users ")

        return $http({
            method: 'GET',
            url: serviceURL
        });
    }

    usersAPI.getGroups = function (group) {

        var serviceURL = '/manage/groups';

        if (group) {
            serviceURL = serviceURL + '/' + group + '?_prettyPrint=true';
        } else {
            // else get all users
            serviceURL = serviceURL + '?_queryFilter=_type+eq+"groupOfUniqueNames"&_prettyPrint=true';
        }

        console.log("Fetching groups ")


        return $http({
            method: 'GET',
            url: serviceURL
        });
    }

    return usersAPI;
})

.factory('searchAPIService', function ($http) {

    var searchAPI = {};

    searchAPI.getWorkProducts = function (params) {

        var serviceURL = '/uicds/pub/search?'
        if (params) {
            for (var i = 0; i < params.length; i++) {
                for (var key in params[i]) {
                    serviceURL = serviceURL + key + '=' + params[i][key] + '&';
                }
            }
        } // else get everything (unassociated)

        serviceURL = serviceURL + 'format=xml';

        console.log('serviceURL: ' + serviceURL)

        return $http({
            method: 'GET',
            url: serviceURL
        });
    }

    return searchAPI;
})

.factory('workProductAPIService', function ($http, $q) {

    var workProductAPI = {};

    workProductAPI.closeWorkProduct = function (workproduct) {

        var serviceURL = '/uicds/core/ws/services'

        var id = workproduct.PackageMetadata[0].WorkProductIdentification[0].Identifier[0].text;
        var version = workproduct.PackageMetadata[0].WorkProductIdentification[0].Version[0].text;
        var type = workproduct.PackageMetadata[0].WorkProductIdentification[0].Type[0].text;
        var checksum = workproduct.PackageMetadata[0].WorkProductIdentification[0].Checksum[0].text;
        var state = workproduct.PackageMetadata[0].WorkProductIdentification[0].State[0].text;

        var xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">',
            '<SOAP-ENV:Header/>',
            '<SOAP-ENV:Body>',
            '<CloseProductRequest xmlns="http://uicds.org/WorkProductService" xmlns:base="http://www.saic.com/precis/2009/06/base"',
            '		xmlns:str="http://www.saic.com/precis/2009/06/structures">',
            '<str:WorkProductIdentification>',
            '<base:Identifier xmlns:base="http://www.saic.com/precis/2009/06/base">' + id + '</base:Identifier>',
            '<base:Version xmlns:base="http://www.saic.com/precis/2009/06/base">' + version + '</base:Version>',
            '<base:Type xmlns:base="http://www.saic.com/precis/2009/06/base">' + type + '</base:Type>',
            '<base:Checksum xmlns:base="http://www.saic.com/precis/2009/06/base">' + checksum + '</base:Checksum>',
            '<base:State xmlns:base="http://www.saic.com/precis/2009/06/base">' + state + '</base:State>',
            '</str:WorkProductIdentification>',
            '</CloseProductRequest>',
            '</SOAP-ENV:Body>',
            '</SOAP-ENV:Envelope>'
        ].join('\n');

        console.log("Closing product: " + id)

        return $http({
            method: 'POST',
            url: serviceURL,
            headers: {
                "Content-Type": "text/xml"
            },
            data: xmlRequest
        });
    }

    workProductAPI.archiveWorkProduct = function (workproduct) {

        var serviceURL = '/uicds/core/ws/services'

        var id = workproduct.PackageMetadata[0].WorkProductIdentification[0].Identifier[0].text;
        var version = workproduct.PackageMetadata[0].WorkProductIdentification[0].Version[0].text;
        var type = workproduct.PackageMetadata[0].WorkProductIdentification[0].Type[0].text;
        var checksum = workproduct.PackageMetadata[0].WorkProductIdentification[0].Checksum[0].text;
        var state = workproduct.PackageMetadata[0].WorkProductIdentification[0].State[0].text;

        var xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">',
            '<SOAP-ENV:Header/>',
            '<SOAP-ENV:Body>',
            '<ArchiveProductRequest xmlns="http://uicds.org/WorkProductService" xmlns:base="http://www.saic.com/precis/2009/06/base"',
            '		xmlns:str="http://www.saic.com/precis/2009/06/structures">',
            '<str:WorkProductIdentification>',
            '	<base:Identifier xmlns:base="http://www.saic.com/precis/2009/06/base">' + id + '</base:Identifier>',
            '	<base:Version xmlns:base="http://www.saic.com/precis/2009/06/base">' + version + '</base:Version>',
            '	<base:Type xmlns:base="http://www.saic.com/precis/2009/06/base">' + type + '</base:Type>',
            '	<base:Checksum xmlns:base="http://www.saic.com/precis/2009/06/base">' + checksum + '</base:Checksum>',
            '	<base:State xmlns:base="http://www.saic.com/precis/2009/06/base">' + state + '</base:State>',
            '</str:WorkProductIdentification>',
            '</ArchiveProductRequest>',
            '</SOAP-ENV:Body>',
            '</SOAP-ENV:Envelope>'
        ].join('\n');

        console.log("Archiving product: " + id)

        return $http({
            method: 'POST',
            url: serviceURL,
            headers: {
                "Content-Type": "text/xml"
            },
            data: xmlRequest
        });
    }   

    return workProductAPI;
})


.factory('incidentAPIService', function ($http, $q) {

    var incidentAPI = {};

    incidentAPI.closeAndArchiveIncident = function (igID) {
        return $q.all([
            incidentAPI.closeIncident(igID)
        ]).then(function (results) {
            incidentAPI.archiveIncident(igID);
        })
    }

    incidentAPI.closeIncident = function (igID) {

        var serviceURL = '/uicds/core/ws/services'

        var xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">',
            '<SOAP-ENV:Header/>',
            '<SOAP-ENV:Body>',
            '<CloseIncidentRequest xmlns="http://uicds.org/IncidentManagementService">',
            '   <IncidentID>' + igID + '</IncidentID>',
            '</CloseIncidentRequest>',
            '</SOAP-ENV:Body>',
            '</SOAP-ENV:Envelope>'
        ].join('\n');

        console.log("Closing incident: " + igID)

        return $http({
            method: 'POST',
            url: serviceURL,
            headers: {
                "Content-Type": "text/xml"
            },
            data: xmlRequest
        });
    }

    incidentAPI.archiveIncident = function (igID) {

        var serviceURL = '/uicds/core/ws/services'

        var xmlRequest = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">',
            '<SOAP-ENV:Header/>',
            '<SOAP-ENV:Body>',
            '<ArchiveIncidentRequest xmlns="http://uicds.org/IncidentManagementService">',
            '   <IncidentID>' + igID + '</IncidentID>',
            '</ArchiveIncidentRequest>',
            '</SOAP-ENV:Body>',
            '</SOAP-ENV:Envelope>'
        ].join('\n');

        console.log("Archiving incident: " + igID)

        return $http({
            method: 'POST',
            url: serviceURL,
            headers: {
                "Content-Type": "text/xml"
            },
            data: xmlRequest
        });
    }

    return incidentAPI;
})

.factory('agreementsAPIService', function ($http) {
    var agreementsAPI = {};

    agreementsAPI.getAgreementsList = function (xmlRequest) {
        var serviceURL = '/uicds/core/ws/services'

        console.log("Fetching agreements ")

        return $http({
            method: 'POST',
            url: serviceURL,
            headers: {
                "Content-Type": "text/xml"
            },
            data: xmlRequest
        });
    }

    agreementsAPI.rescindAgreement = function (xmlRequest) {
        var serviceURL = '/uicds/core/ws/services'

        console.log("Rescinding agreement ")

        return $http({
            method: 'POST',
            url: serviceURL,
            headers: {
                "Content-Type": "text/xml"
            },
            data: xmlRequest
        });
    }

    agreementsAPI.createAgreement = function (xmlRequest) {
        var serviceURL = '/uicds/core/ws/services'        
        
        console.log("Creating new agreement ")

        return $http({
            method: 'POST',
            url: serviceURL,
            headers: {
                "Content-Type": "text/xml"
            },
            data: xmlRequest
        });
    }

    agreementsAPI.updateAgreement = function (xmlRequest) {
        var serviceURL = '/uicds/core/ws/services'        
        
        console.log("Updating agreement ")

        return $http({
            method: 'POST',
            url: serviceURL,
            headers: {
                "Content-Type": "text/xml"
            },
            data: xmlRequest
        });
    }    

    return agreementsAPI;
})

;
'use strict';

/* Controllers */

angular.module('consoleApp.controllers', [])

.controller('DocumentationController', function ($rootScope, $scope) {
    $rootScope.pageTitle = "Documentation";
})

.controller('StatusController', function ($rootScope, $scope, $http, rosterAPIService) {
    $rootScope.pageTitle = "Core Health and Status";

    $scope.coreList = [];

    $scope.refresh = function() {
        rosterAPIService.getRosterStatus().success(function (response) {
            $scope.coreList = (xmlToJSON.parseString(response)).Envelope[0].Body[0].GetCoreListResponse[0].coreList[0].Core
        });
    }

    $scope.refresh();

})

.controller('InstancesController', function ($rootScope, $scope, $http, instancesAPIService) {
    $rootScope.pageTitle = "Resource Profiles and Instances"

    $scope.selectedItem;
    $scope.profiles = [];
    $scope.instances = [];

    // selection model
    $scope.selectedID = 'none';
    $scope.multiSelected = [];

    $scope.productTypes = [];

    $scope.showNewProfileForm = function () {
        $scope.selectedItem = {
            "type": "profile",
            "action": "create",
            "ID": [{
                "text": ""
            }],
            "Description": [{
                "text": ""
            }],
            "ResourceTyping": [{
                "Type": [{
                    "attr": {
                        "xmlns:base": {
                            "value": "http://www.saic.com/precis/2009/06/base"
                        },
                        "codespace": {
                            "value": "http://www.fema.gov/emergency/nims"
                        },
                        "label": {
                            "value": "Category"
                        }
                    }
                }]
            }],
            "Interests": [{
                "Interest": [{
                    "TopicExpression": [{
                        "attr": {},
                        "text": ""
                    }]
                }]
            }],
        };
    }

    $scope.showNewInstanceForm = function () {
        $scope.selectedItem = {
            "type": "instance",
            "action": "create",
            "ID": [{
                "text": ""
            }],
            "Description": [{
                "text": ""
            }],
            "SourceIdentification": [{
                "LocalResourceID": [{
                    "attr": {},
                    "text": ""
                }]
            }],
            "ProfileIDs": [{
                "ProfileID": [{
                    "text": "",
                }]
            }],
        };
    }

    $scope.createProfile = function (profile) {
        instancesAPIService.createProfile(profile).success(function (response) {
            $scope.refresh();
            $scope.selectedItem.action = '';
        });
    }

    $scope.deleteProfile = function (profileID) {
        instancesAPIService.deleteProfile(profileID).success(function (response) {
            $scope.refresh();
            $scope.selectedItem = {};
        });
    }

    $scope.deleteInterest = function (profileID, interest) {
        instancesAPIService.deleteInterest(profileID, interest).success(function (response) {
            $scope.selectItem = $scope.selectProfileByID(profileID);
        });
    }  

    $scope.addInterest = function (profileID, interest) {
        instancesAPIService.addInterest(profileID, interest).success(function (response) {
            $scope.selectItem = $scope.selectProfileByID(profileID);
        });
    } 

    $scope.createInstance = function (instance) {
        instancesAPIService.createInstance(instance).success(function (response) {
            $scope.refresh();
        });
    }

    $scope.deleteInstance = function (instanceID) {
        instancesAPIService.deleteInstance(instanceID).success(function (response) {
            $scope.refresh();
            $scope.selectedItem = {};
        });
    }    

   // controller functions (scoped)
    $scope.refresh = function () {
        $scope.profiles = [];
        $scope.instances = [];

        $scope.multiSelected = [];

        instancesAPIService.getProfileList().success(function (response) {
            if (xmlToJSON.parseString(response).Envelope[0].Body[0].GetProfileListResponse[0].ProfileList.length > 0) {
                $scope.profiles = xmlToJSON.parseString(response).Envelope[0].Body[0].GetProfileListResponse[0].ProfileList[0].ResourceProfile;
            } else {
                $scope.profiles = [];
            }
        });

        instancesAPIService.getInstanceList().success(function (response) {
            if (xmlToJSON.parseString(response).Envelope[0].Body[0].GetResourceInstanceListResponse[0].ResourceInstanceList.length > 0) {
                $scope.instances = xmlToJSON.parseString(response).Envelope[0].Body[0].GetResourceInstanceListResponse[0].ResourceInstanceList[0].ResourceInstance;
            } else {
                $scope.instances = [];
            }
        });       

    };

    $scope.selectProfileByID = function(itemID) {
        if (itemID) {
            instancesAPIService.getProfile(itemID).success(function (response) {
                if (xmlToJSON.parseString(response).Envelope[0].Body[0].GetProfileResponse[0]) {
                    $scope.selectedItem = xmlToJSON.parseString(response).Envelope[0].Body[0].GetProfileResponse[0].Profile[0];
                    $scope.selectedItem.type="profile";
                } else {
                   $scope.selectedItem = {};
                }
            });  
        } else {
            $scope.selectedItem = {};
        } 
    }

    $scope.selectInstanceByID = function(itemID) {
        if (itemID) {
            instancesAPIService.getInstance(itemID).success(function (response) {
                if (xmlToJSON.parseString(response).Envelope[0].Body[0].GetResourceInstanceResponse[0]) {
                    $scope.selectedItem = xmlToJSON.parseString(response).Envelope[0].Body[0].GetResourceInstanceResponse[0].ResourceInstance[0];
                    $scope.selectedItem.type="instance";
                } else {
                   $scope.selectedItem = {};
                }
            });  
        } else {
            $scope.selectedItem = {};
        } 
    }

    // seclection model functions (scoped)
    $scope.selectItem = function (item) {
        if (item) {
            $scope.selectedItem = item;
        } else {
            $scope.selectedItem = {};
        }
    };

    $scope.multiSelect = function (item) {
        $scope.selectedItem = item;
        var index = $scope.multiSelected.indexOf(item);
        if (index < 0) {
            $scope.multiSelected.push(item);
            item.checked = true;
        } else {
            $scope.multiSelected.splice(index, 1);
            item.checked = false;
        }

    };

    // initialize the controller

    // load extended metadata options
    $http({
        method: 'GET',
        url: 'app/codelists/productTypes.js'
    }).success(function (result) {
        $scope.productTypes = result;
    });

    $scope.refresh();

})


.controller('UsersController', function ($rootScope, $scope, usersAPIService) {
    $rootScope.pageTitle = "Groups and Users"

    $scope.selectedItem;
    $scope.users = [];
    $scope.groups = [];

    $scope.selectedUsers = [];

    // selection model
    $scope.selectedID = 'none';
    $scope.multiSelected = [];

    $scope.showNewUserForm = function () {

        $scope.selectedItem = {
            "action": "create",
            "_type": "inetOrgPerson",
            "longitude": "",
            "latitude": "",
            "displayName": "",
            "groups": [{
                "displayName": "uicds-users"
            }]
        };

    }

    $scope.createUser = function (user) {
        usersAPIService.createUser(user).success(function (response) {
            $scope.refresh();
        });
    }

    $scope.updateUser = function (user) {

        var updates = [];
        if (user.latitude && user.longitude && user.latitude != '' && user.longitude != '') {
            updates.push({
                "operation": "add",
                "field": "/latitude",
                "value": user.latitude
            }, {
                "operation": "add",
                "field": "/longitude",
                "value": user.longitude
            });
        } else {
            updates.push({
                "operation": "remove",
                "field": "/latitude"
            }, {
                "operation": "remove",
                "field": "/longitude"
            });
        }

        if (user.password && user.password != '') {
	        updates.push({
	        	"operation" : "replace",
	        	"field" : "/_password",
	        	"value" : user.password
	        })
		}

        usersAPIService.updateUser(user, updates).success(function (response) {
            $scope.refresh();
            $scope.selectUser($scope.selectedItem)
        });

    }

    $scope.toggleUser = function (userName) {

        if ($scope.selectedUsers && $scope.selectedUsers.length > 0) {
            var idx = $scope.selectedUsers.indexOf(userName);

            // is currently selected
            if (idx > -1) {
                $scope.selectedUsers.splice(idx, 1);
            }

            // is newly selected
            else {
                $scope.selectedUsers.push(userName);
            }
        } else {
            $scope.selectedUsers = [userName];
        }

    }

    $scope.showNewGroupForm = function () {
        $scope.selectedItem = {
            "action": "create",
            "schemas": ["urn:scim:schemas:core:1.0"],
            "_type": "groupOfUniqueNames",
            "longitude": "",
            "latitude": "",
            "displayName": "",
        };

        $scope.selectedUsers = [];
    }

    $scope.createGroup = function (group) {
        usersAPIService.createGroup(group).success(function (response) {
        	$scope.updateGroup(group);
            $scope.refresh();        		
        });
    }

    $scope.updateGroup = function (group) {

        var updates = [];
        if (group.latitude && group.longitude && group.latitude != '' && group.longitude != '') {
            updates.push({
                "operation": "add",
                "field": "/latitude",
                "value": group.latitude
            }, {
                "operation": "add",
                "field": "/longitude",
                "value": group.longitude
            });
        } else {
            updates.push({
                "operation": "remove",
                "field": "/latitude"
            }, {
                "operation": "remove",
                "field": "/longitude"
            });
        }

        if ($scope.selectedUsers) {
            var usersArray = [];
            for (var i = 0; i < $scope.selectedUsers.length; i++) {
                usersArray.push({
                    "_id": $scope.selectedUsers[i]
                })
            }
            updates.push({
                "operation": "replace",
                "field": "/members",
                "value": usersArray
            });
        }

        usersAPIService.updateGroup(group, updates).success(function (response) {
            $scope.refresh();
            $scope.selectGroup($scope.selectedItem)
        });

    }
    $scope.deleteUser = function (user) {
        if (user) {
            usersAPIService.deleteUser(user).success(function (response) {
                $scope.refresh();
                $scope.selectedItem = {};
            });
        }
    };

    $scope.deleteGroup = function (group) {
        if (group) {
            usersAPIService.deleteGroup(group).success(function (response) {
                $scope.refresh();
                $scope.selectedItem = {};
            });
        }
    };

    $scope.deleteSelectedGroups = function () {
        for (var i = 0; i < $scope.multiSelected.length; i++) {
            usersAPIService.deleteGroup($scope.multiSelected[i]).success(function (response) {
                $scope.refresh();
                $scope.selectedItem = {};
            });
        }
    };


    // controller functions (scoped)
    $scope.refresh = function () {

        $scope.users = [];
        $scope.groups = [];
        $scope.multiSelected = [];
        $scope.selectedUsers = [];

        usersAPIService.getGroups().success(function (response) {
            $scope.groups = response.result;
        });
        usersAPIService.getUsers().success(function (response) {
            $scope.users = response.result;
        });

    };

    // seclection model functions (scoped)
    $scope.selectUser = function (user) {
        if (user) {
            usersAPIService.getUsers(user.displayName).success(function (response) {
                $scope.selectedItem = response;
                $scope.selectedItem.password = '';                
            });
            //$scope.multiSelect(idx);
        } else {
            $scope.selectedItem = {};
        }
    };

    // seclection model functions (scoped)
    $scope.selectGroup = function (group) {
        if (group) {
            usersAPIService.getGroups(group.displayName).success(function (response) {
                $scope.selectedItem = response;
                $scope.selectedUsers = [];
                if ($scope.selectedItem.members) {
                    for (var i = 0; i < $scope.selectedItem.members.length; i++) {
                        $scope.selectedUsers.push($scope.selectedItem.members[i]._id);
                    }
                }
            });
        } else {
            $scope.selectedItem = {};
        }
    };

    $scope.multiSelect = function (group) {
        $scope.selectedItem = group;
        var index = $scope.multiSelected.indexOf(group);
        if (index < 0) {
            $scope.multiSelected.push(group);
            group.checked = true;
        } else {
            $scope.multiSelected.splice(index, 1);
            group.checked = false;
        }

    };

    // initialize the controller
    $scope.refresh();

})

.controller('WorkProductsController', function ($rootScope, $scope, searchAPIService, workProductAPIService, incidentAPIService) {

    $rootScope.pageTitle = "Incidents and Workproducts"
    // items
    $scope.interestGroupIDs = {};
    $scope.productTypes = [];
    $scope.workproducts = {};

    // selection model
    $scope.selectedID = '';
    $scope.multiSelected = [];
    $scope.incidentWPid = '';

    // view options
    $scope.viewType = 'byInterestGroup';
    $scope.unassociated = false;

    // define params as an array of objects (1 param per object)
    var incidentParams = [{
        productType: 'Incident'
    }];

    // controller functions (scoped)
    $scope.refresh = function () {

        $scope.interestGroupIDs = {};
        $scope.productTypes = ['Incident'];
        $scope.workproducts = {};
        $scope.multiSelected = [];

        searchAPIService.getWorkProducts(incidentParams).success(function (response) {

            var jsonResponse = xmlToJSON.parseString(response);

            var workProductList = [];
            if (jsonResponse.WorkProduct) {
                // there is only one, but stored in a differently named array
                workProductList.push(jsonResponse.WorkProduct[0]);
            } else if (jsonResponse.WorkProductList) {
                // there is either zero or more than one...nice
                if (jsonResponse.WorkProductList[0].WorkProduct) {
                    workProductList = jsonResponse.WorkProductList[0].WorkProduct;
                } else {
                    // there are none (but in an array)
                    workProductList = []
                }
            } else {
                // there are none
            }
            // add them to local array of workproducts
            if (workProductList.length > 0) {
                for (var i = 0; i < workProductList.length; i++) {

                    var type = workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Type[0].text;
                    var wpid = workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Identifier[0].text;
                    var igID = workProductList[i].PackageMetadata[0].WorkProductProperties[0].AssociatedGroups[0].Identifier[0].text;

                    if (type == 'Incident') {
                        if (! $scope.interestGroupIDs[igID] ) {
                            $scope.interestGroupIDs[igID] = {};
                            $scope.interestGroupIDs[igID].name = workProductList[i].Digest[0].Event[0].Identifier[0].text;
                        }                       
                    } 

                    $scope.workproducts[wpid] = workProductList[i];

                }

                $scope.refreshWorkProducts();
            }
        });
    };


    $scope.refreshWorkProducts = function () {

        // create params object of IGs
        var igParams = []
        if (!$scope.unassociated) {
            for (var igID in $scope.interestGroupIDs) {
                igParams.push({
                    interestGroupID: igID
                })
            }
        }

        // fetch workproducts
        searchAPIService.getWorkProducts(igParams).success(function (response) {
            var jsonResponse = xmlToJSON.parseString(response);

            var workProductList = [];
            if (jsonResponse.WorkProduct) {
                // there is only one, but stored in a differently named array
                workProductList.push(jsonResponse.WorkProduct[0]);
            } else if (jsonResponse.WorkProductList) {
                workProductList = jsonResponse.WorkProductList[0].WorkProduct;

                if (workProductList.length > 0) {
                    for (var i = 0; i < workProductList.length; i++) {
                        var wpid = workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Identifier[0].text;
                        $scope.workproducts[wpid] = workProductList[i];

                        if (workProductList[i].PackageMetadata[0].WorkProductProperties[0].AssociatedGroups[0].Identifier[0].text) {
                            $scope.workproducts[wpid].name = $scope.interestGroupIDs[workProductList[i].PackageMetadata[0].WorkProductProperties[0].AssociatedGroups[0].Identifier[0].text].name;
                        }

                        if ($scope.productTypes.indexOf(workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Type[0].text) == -1) {
                            $scope.productTypes.push(workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Type[0].text);
                        }
                    }
                }
            } else {
                // there are none
            }
        });
    };

    $scope.closeWorkProduct = function (workproduct) {
        workProductAPIService.closeWorkProduct(workproduct).success(function (response) {
            $scope.refresh();
        });
    };

    $scope.archiveWorkProduct = function (workproduct) {
        workProductAPIService.archiveWorkProduct(workproduct).success(function (response) {
            $scope.refresh();
        });
    };

    // doesnt work, need to catch the response's updated WP ID
    // $scope.closeAndArchiveWorkProduct = function(workproduct) {
    // 	workProductAPIService.closeWorkProduct(workproduct);
    // 	// this is a work around until the closeAndArchiveWorkProduct service call is fixed.
    // 	var wpID = workproduct.PackageMetadata[0].WorkProductIdentification[0].Identifier[0].text
    // 	$scope.refresh();
    // };

    $scope.closeSelectedIncidents = function () {
        for (var i = 0; i < $scope.multiSelected.length; i++) {
            if ($scope.workproducts[$scope.multiSelected[i]].PackageMetadata[0].WorkProductIdentification[0].State[0].text == 'Active') {
                var igID = $scope.workproducts[$scope.multiSelected[i]].PackageMetadata[0].WorkProductProperties[0].AssociatedGroups[0].Identifier[0].text;
                incidentAPIService.closeIncident(igID);
            }
        }
    }

    $scope.closeAndArchiveSelectedIncidents = function () {
        for (var i = 0; i < $scope.multiSelected.length; i++) {
            var igID = $scope.workproducts[$scope.multiSelected[i]].PackageMetadata[0].WorkProductProperties[0].AssociatedGroups[0].Identifier[0].text;
            if ($scope.workproducts[$scope.multiSelected[i]].PackageMetadata[0].WorkProductIdentification[0].State[0].text == 'Active') {
                incidentAPIService.closeAndArchiveIncident(igID);
            } else if ($scope.workproducts[$scope.multiSelected[i]].PackageMetadata[0].WorkProductIdentification[0].State[0].text == 'Inactive') {
                incidentAPIService.archiveIncident(igID);
            }
            delete $scope.workproducts[$scope.multiSelected[i]];
        }
    }

    // seclection model functions (scoped)
    $scope.select = function (wpid) {
        if (wpid) {
            $scope.selectedID = wpid;
            if ($scope.workproducts[wpid].PackageMetadata[0].WorkProductIdentification[0].Type[0].text == 'Incident') {
                $scope.incidentWPid = wpid;
            }
            //$scope.multiSelect(idx);
        } else {
            $scope.selectedID = 'none';
            $scope.incidentWPid = 'none';
        }
    };

    $scope.isSelected = function (wpid) {
        return $scope.selectedID == wpid;
    };

    $scope.multiSelect = function (wpid) {
        var index = $scope.multiSelected.indexOf(wpid);
        if (index < 0) {
            $scope.multiSelected.push(wpid);
            $scope.workproducts[wpid].checked = true;
            $scope.select(wpid);
        } else {
            $scope.multiSelected.splice(index, 1);
            $scope.workproducts[wpid].checked = false;
        }

    };

    $scope.viewJSON = function () {
        var windowSpec = "menubar=yes,resizable=yes,scrollbars=yes,status=yes,left=100,top=100,width=600,height=600";
        var windowName = $scope.workproducts[$scope.selectedID].PackageMetadata[0].WorkProductIdentification[0].Identifier[0].text;
        var wnd = window.open('', windowName, windowSpec);
        wnd.document.open("text/html", "replace");
        wnd.document.write('<html><head><title>' + windowName + '</title></head><body><pre>' + JSON.stringify($scope.workproducts[$scope.selectedID], undefined, 2) + '</pre></body>');
        wnd.document.close();
    }

    // initialize the controller
    $scope.refresh();

})

.controller('AgreementsController', function ($rootScope, $scope, $http) {

    $rootScope.pageTitle = "Sharing Agreements"

    $scope.agreementNS = 'http://uicds.org/AgreementService';

    $scope.selected = -1;
    $scope.multiSelected = [];

    $scope.agreements = [];

    $scope.incidentTypeOptions = [];
    $scope.exMetadataOptions = [];

    $scope.endpoint = globals.servicePath;

    // seclection model functions (scoped)
    $scope.select = function (idx) {
        $scope.selected = idx;
        //$scope.multiSelect(idx);
    };

    $scope.isSelected = function (idx) {
        return $scope.selected == idx;
    };

    $scope.multiSelect = function (idx) {
        var index = $scope.multiSelected.indexOf(idx);
        if (index < 0) {
            $scope.multiSelected.push(idx);
            $scope.agreements[idx].checked = true;
        } else {
            $scope.multiSelected.splice(index, 1);
            $scope.agreements[idx].checked = false;
        }
    };

    // initialize template object for new agreements
    $scope.createNew = function () {
        $scope.agreements.push({
            "__new": true,
            "Principals": [{
                "LocalCore": [{
                    "text": ""
                }],
                "RemoteCore": [{
                    "text": ""
                }]
            }],
            "ShareRules": [{
                "attr": {
                    "enabled": {
                        "value": true
                    }
                },
                "ShareRule": []
            }]
        });

        $scope.select($scope.agreements.length - 1);

    };

    // refresh list of agreements from core
    $scope.refresh = function () {

        // render request
        var xml = Mustache.render(xmlGetAgreementListTmpl, $scope);

        // load agreement list
        $http({
            method: 'POST',
            url: $scope.endpoint,
            headers: {
                "Content-Type": "text/xml"
            },
            data: xml
        }).
        success(function (data, status, headers, config) {

            // clear existing agreements object
            $scope.agreements = [];

            // this callback will be called asynchronously
            // when the response is available
            var result = xmlToJSON.parseString(data);

            // test to see if any agreements were returned
            var agreementList = avail(result, 'Envelope[0].Body[0].GetAgreementListResponse[0].AgreementList[0]');

            // add them to local array of agreements
            if (agreementList.Agreement && agreementList.Agreement.length > 0) {
                for (i = 0; i < agreementList.Agreement.length; i++) {
                    var agreement = agreementList.Agreement[i];
                    $scope.agreements.push(agreement);
                }
                $scope.select($scope.selected);
            }

            // if ($scope.agreements.length == 0) {
            // 	$scope.createNew();
            // };

        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('An error occured while attempting to load the agreement list from the core.  Error code: ' + status);
        });
    };

    // update the interest group sub type when a new one is selected
    $scope.updateIncidentType = function (interestGroup) {
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
            } catch (err) {}
        }

    };

    // update the extended metadata when a new one is selected
    $scope.updateExMetadata = function (extendedMetadata) {
        // look up object in extended metadata options list
        for (var i = 0; i < $scope.exMetadataOptions.length; i++) {
            try {
                if (extendedMetadata.attr.label.value == $scope.exMetadataOptions[i].label) {
                    //augment object
                    extendedMetadata.attr.code = {};
                    extendedMetadata.attr.codespace = {};

                    extendedMetadata.attr.code.value = $scope.exMetadataOptions[i].code;
                    extendedMetadata.attr.codespace.value = $scope.exMetadataOptions[i].codespace;
                }
            } catch (err) {}
        }

    };

    $scope.rescind = function () {

        for (var i = 0; i < $scope.multiSelected.length; i++) {

            var agreement = $scope.agreements[$scope.multiSelected[i]];

            // enrich object selected agreement object
            agreement.agreementNS = $scope.agreementNS;
            agreement.localCore = globals.coreUser + '@' + globals.coreAddress;
            agreement.guid = function () {
                return guid()
            };

            var xml = Mustache.render(xmlRescindAgreementTmpl, agreement);

            if (!agreement.Principals[0].RemoteCore[0].text) {
                alert('Please select an existing agreement.  Click "Refresh" to load agreements from the core.');
                return;
            }

            $http({
                method: 'POST',
                url: $scope.endpoint,
                headers: {
                    "Content-Type": "text/xml"
                },
                data: xml
            }).

            success(function (data, status, headers, config) {
                alert("Successfully rescinded the agreement");
                $scope.refresh();
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert('An error occured while attempting to rescind the agreement.  Error code: ' + status);
            });
        }
    };

    $scope.submit = function (agreement) {
        // enrich object selected agreement object
        agreement.agreementNS = $scope.agreementNS;
        //agreement.localCore = globals.coreUser + '@' + globals.coreAddress;
        agreement.guid = function () {
            return guid()
        };

        $scope.selected = $scope.agreements.indexOf(agreement);

        var partials = {
            agreementPartial: xmlAgreementTmpl
        };

        if (!agreement.Principals[0].RemoteCore[0].text || (agreement.Principals[0].RemoteCore[0].text.indexOf('@') == -1)) {
            alert('Please enter a remote core address in the form uicds@remotecore.com');
            return;
        }

        var xml;

        if (agreement['__new'] == true) {
            xml = Mustache.render(xmlCreateAgreementTmpl, agreement, partials);
        } else {
            xml = Mustache.render(xmlUpdateAgreementTmpl, agreement, partials);
        }

        $http({
            method: 'POST',
            url: $scope.endpoint,
            headers: {
                "Content-Type": "text/xml"
            },
            data: xml
        }).
        success(function (data, status, headers, config) {
            alert("Successfully created agreement with " + agreement.Principals[0].RemoteCore[0].text);
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('An error occured while attempting to create or update the agreement.  Error code: ' + status);
        });

        agreement['__new'] = false;

    };

    $scope.viewXML = function () {
        var agreement = $scope.agreements[$scope.selected]
        agreement.agreementNS = $scope.agreementNS;
        //agreement.localCore = globals.coreUser + '@' + globals.coreAddress;
        agreement.guid = function () {
            return guid()
        };
        viewRawXML(Mustache.render(xmlAgreementTmpl, agreement));
    };

    $scope.addShareRule = function (agreement) {
        if (!agreement.ShareRules[0].ShareRule) {
            agreement.ShareRules[0].ShareRule = new Array();
        };
        agreement.ShareRules[0].ShareRule.push({
            "attr": {
                "enabled": {
                    "value": true
                }
            },
            "Condition": [{
                "InterestGroup": [{
                    "attr": {
                        "label": {
                            "value": "All Incident Types"
                        },
                        "code": {
                            "value": "*"
                        }
                    },
                    "text": "*"
                }],
                "RemoteCoreProximity": [],
                "ExtendedMetadata": []
            }]
        });
    };

    $scope.removeShareRule = function (agreement, shareRule) {
        var index = agreement.ShareRules[0].ShareRule.indexOf(shareRule);
        agreement.ShareRules[0].ShareRule.splice(index, 1);
    };

    $scope.removeInterestGroup = function (condition, interestGroup) {
        var index = condition.InterestGroup.indexOf(interestGroup);
        condition.InterestGroup.splice(index, 1);
    };

    $scope.clearInterestGroup = function (interestGroup) {
        interestGroup.attr.codespace.value = '';
        interestGroup.text = '';
    };

    $scope.addExtendedMetadata = function (condition) {
        if (!condition.ExtendedMetadata) {
            condition.ExtendedMetadata = new Array();
        }
        condition.ExtendedMetadata.push({});
    };

    $scope.removeExtendedMetadata = function (condition, extendedMetadata) {
        var index = condition.ExtendedMetadata.indexOf(extendedMetadata);
        condition.ExtendedMetadata.splice(index, 1);
    };

    $scope.clearExtendedMetadata = function (extendedMetadata) {
        extendedMetadata.attr.codespace.value = '';
        extendedMetadata.attr.code.value = '';
        extendedMetadata.text = '';
    };

    $scope.addRemoteCoreProximity = function (condition) {
        condition.RemoteCoreProximity = new Array();
        condition.RemoteCoreProximity[0] = {
            "attr": {
                "shareOnNoLoc": {
                    "value": false
                }
            },
            "text": 10
        };
    };

    $scope.removeRemoteCoreProximity = function (condition) {
        condition.RemoteCoreProximity = [];
    };

    // XML Templates for the Agreement Service

    var xmlAgreementTmpl = ['<as:Agreement xmlns:precisb="http://www.saic.com/precis/2009/06/base" xmlns:as="{{{agreementNS}}}">',
        '<as:Principals>',
        '<as:LocalCore precisb:label="Local Core">{{{Principals.0.LocalCore.0.text}}}</as:LocalCore>',
        '<as:RemoteCore precisb:label="Remote Core">{{{Principals.0.RemoteCore.0.text}}}</as:RemoteCore>',
        '</as:Principals>',
        '<as:ShareRules enabled="{{ShareRules.0.attr.enabled.value}}">',
        '{{#ShareRules.0.ShareRule}}',
        '<as:ShareRule enabled="{{attr.enabled.value}}" {{^attr.id.value}}id="id-{{guid}}"{{/attr.id.value}} {{#attr.id.value}}id="{{attr.id.value}}"{{/attr.id.value}} {{#attr.name.value}}name="{{attr.name.value}}"{{/attr.name.value}}>',
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

    var xmlCreateAgreementTmpl = ['<?xml version="1.0" encoding="UTF-8"?>',
        '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">',
        '<SOAP-ENV:Header/>',
        '<SOAP-ENV:Body>',
        '<as:CreateAgreementRequest xmlns:as="{{{agreementNS}}}">',
        '{{> agreementPartial}}',
        '</as:CreateAgreementRequest>',
        '</SOAP-ENV:Body>',
        '</SOAP-ENV:Envelope>'
    ].join('\n');

    var xmlUpdateAgreementTmpl = ['<?xml version="1.0" encoding="UTF-8"?>',
        '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">',
        '<SOAP-ENV:Header/>',
        '<SOAP-ENV:Body>',
        '<as:UpdateAgreementRequest xmlns:as="{{{agreementNS}}}">',
        '{{> agreementPartial}}',
        '</as:UpdateAgreementRequest>',
        '</SOAP-ENV:Body>',
        '</SOAP-ENV:Envelope>'
    ].join('\n');

    var xmlGetAgreementListTmpl = ['<?xml version="1.0" encoding="UTF-8"?>',
        '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">',
        '<SOAP-ENV:Header/>',
        '<SOAP-ENV:Body>',
        '<as:GetAgreementListRequest xmlns:as="{{{agreementNS}}}" />',
        '</SOAP-ENV:Body>',
        '</SOAP-ENV:Envelope>'
    ].join('\n');

    var xmlGetAgreementTmpl = ['<?xml version="1.0" encoding="UTF-8"?>',
        '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">',
        '<SOAP-ENV:Header/>',
        '<SOAP-ENV:Body>',
        '<as:GetAgreementRequest xmlns:as="{{{agreementNS}}}">',
        '<as:CoreID>{{{Principals.0.RemoteCore.0.text}}}</as:CoreID>',
        '</as:GetAgreementRequest>',
        '</SOAP-ENV:Body>',
        '</SOAP-ENV:Envelope>'
    ].join('\n');

    var xmlRescindAgreementTmpl = ['<?xml version="1.0" encoding="UTF-8"?>',
        '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">',
        '<SOAP-ENV:Header/>',
        '<SOAP-ENV:Body>',
        '<as:RescindAgreementRequest xmlns:as="{{{agreementNS}}}">',
        '<as:CoreID>{{{Principals.0.RemoteCore.0.text}}}</as:CoreID>',
        '</as:RescindAgreementRequest>',
        '</SOAP-ENV:Body>',
        '</SOAP-ENV:Envelope>'
    ].join('\n');


    // intialize
    // load incident type options
    $http({
        method: 'GET',
        url: 'app/codelists/incidentTypes.js'
    }).success(function (result) {
        $scope.incidentTypeOptions = result;
    });

    // load extended metadata options
    $http({
        method: 'GET',
        url: 'app/codelists/extendedMetadata.js'
    }).success(function (result) {
        $scope.exMetadataOptions = result;
    });

    $scope.refresh();


})

;
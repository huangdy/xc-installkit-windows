'use strict';

/* Controllers */

angular.module('consoleApp.controllers', [])

.run(function($rootScope, $http, corePropertiesAPIService) {
    corePropertiesAPIService.getProperties().success(function (response) {
        var consoleTitle = /[\n\r].*console\.title=\s*([^\n\r]*)/g
        var fqdn = /[\n\r].*xmpp\.fqdn=\s*([^\n\r]*)/g

        $rootScope.consoleTitle = consoleTitle.exec(response)[1]
        $rootScope.fqdn = fqdn.exec(response)[1]

    })
})

.controller('DocumentationController', function ($rootScope, $scope) {
    $rootScope.pageTitle = "Documentation";
})

.controller('StatusController', function ($rootScope, $scope, $http, rosterAPIService) {
    $rootScope.pageTitle = "Core Health and Status";

    $scope.coreList = [];

    $scope.refresh = function() {
        rosterAPIService.getRosterStatus().success(function (response) {
            $scope.coreList = (xmlToJSON.parseString(response)).Envelope[0].Body[0].GetCoreListResponse[0].coreList[0].Core
        }).
        error(function (response) {
            alert("Failed to fetch the core roster." + "\n\n" + "Check the Core logs.")
        });;
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

    $scope.rAlphanumericNoSpaces = /^[a-zA-Z0-9\-_]*$/;


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

    $scope.createProfile = function (isValid) {
        if (isValid) {
            var profile = $scope.selectedItem;
            instancesAPIService.createProfile(profile).success(function (response) {
                $scope.refresh();
                $scope.selectedItem.action = '';
                alert("Successfully created profile " + profile.ID[0].text)
            })
            .error(function (response) {
                alert("Failed to create profile " + profile.ID[0].text + ".\n\n" + "Does this entry already exist?  Check the core logs.")
            });
        }
    }

    $scope.deleteProfile = function (profileID) {
        instancesAPIService.deleteProfile(profileID).success(function (response) {
            $scope.refresh();
            $scope.selectedItem = {};
                alert("Successfully deleted profile " + profileID)
            })
            .error(function (response) {
                alert("Failed to delete profile " + profileID + ".\n\n" + "Check the core logs.")
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

    $scope.createInstance = function (isValid) {
        if (isValid) {
            var instance = $scope.selectedItem;
            instancesAPIService.createInstance(instance).success(function (response) {
                $scope.refresh();
                $scope.selectedItem.action = '';
                alert("Successfully created instance " + instance.ID[0].text)
            })
            .error(function (response) {
                alert("Failed to create instance " + instance.ID[0].text + ".\n\n" + "Does this entry already exist?  Check the core logs.")
            });
        }   
    }    

    $scope.deleteInstance = function (instanceID) {
        instancesAPIService.deleteInstance(instanceID).success(function (response) {
            $scope.refresh();
            $scope.selectedItem = {};
                alert("Successfully deleted instance " + instanceID)
            })
            .error(function (response) {
                alert("Failed to delete instance " + instanceID + ".\n\n" + "Check the core logs.")
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

    $scope.rAlphanumericNoSpaces = /^[a-zA-Z0-9\-_]*$/;

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

    $scope.createUser = function (isValid) {
        if (isValid) {
            var user = $scope.selectedItem;
            usersAPIService.createUser(user).success(function (response) {
                $scope.refresh();
                $scope.selectedItem.action = '';
                alert("Successfully created user account" + user.displayName)
            })
            .error(function (response) {
                alert("Failed to create user account " + user.displayName + ".\n\n" + response.message)
            });
        }
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
            alert("Successfully updated user account " + user.displayName)
        })
        .error(function (response) {
            alert("Failed to update user account " + user.displayName + ".\n\n" + response.message)
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

    $scope.createGroup = function (isValid) {
        if (isValid) {
            var group = $scope.selectedItem;
            usersAPIService.createGroup(group).success(function (response) {
            	$scope.updateGroup(group);
                $scope.refresh();   
                $scope.selectedItem.action = '';     		
                alert("Successfully created group " + group.displayName)
                })
                .error(function (response) {
                    alert("Failed to create group " + group.displayName + ".\n\n" + response.message)
            });
        }
    }

    $scope.createUser = function (isValid) {
        if (isValid) {
            var user = $scope.selectedItem;
            usersAPIService.createUser(user).success(function (response) {
                $scope.refresh();
                $scope.selectedItem.action = '';
                alert("Successfully created user account " + user.displayName)
            })
            .error(function (response) {
                alert("Failed to create user account " + user.displayName + ".\n\n" + response.message)
            });
        }
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
            alert("Successfully updated group " + group.displayName)
            })
            .error(function (response) {
                alert("Failed to update group " + group.displayName + ".\n\n" + response.message)
        });

    }
    $scope.deleteUser = function (user) {
        if (user) {
            usersAPIService.deleteUser(user).success(function (response) {
                $scope.refresh();
                $scope.selectedItem = {};
                alert("Successfully deleted user account " + user.displayName)
            })
            .error(function (response) {
                alert("Failed to delete user account " + user.displayName + ".\n\n" + response.message)
            });
        }
    };

    $scope.deleteGroup = function (group) {
        if (group) {
            usersAPIService.deleteGroup(group).success(function (response) {
                $scope.refresh();
                $scope.selectedItem = {};
                alert("Successfully deleted group " + group.displayName)
            })
            .error(function (response) {
                alert("Failed to delete group " + group.displayName + ".\n\n" + response.message)
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
        }).
        error(function (response) {
            alert("Failed to fetch the groups list." + "\n\n" + "Check the Core logs.")
        });
        usersAPIService.getUsers().success(function (response) {
            $scope.users = response.result;
        }).
        error(function (response) {
            alert("Failed to fetch the users list." + "\n\n" + "Check the Core logs.")
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
    $scope.viewType = '';
    $scope.limit = 10;
    $scope.startIndex = 0;
    $scope.prevView = '';
    $scope.refreshDirty = false;

    $scope.prev = function() {
        if ($scope.viewType == $scope.prevView) {
            if ($scope.startIndex > $scope.limit) {
                $scope.startIndex = parseInt($scope.startIndex) - parseInt($scope.limit);
            } else {
                $scope.startIndex = 0;
            }
            $scope.refresh($scope.viewType)
        } else {
            $scope.startIndex = 0;
            $scope.refresh($scope.viewType)            
        }
    }

    $scope.next = function() {
        if ($scope.viewType == $scope.prevView) {
            $scope.startIndex = parseInt($scope.startIndex) + parseInt($scope.limit);
            $scope.refresh($scope.viewType)
        } else {
            $scope.startIndex = 0;
            $scope.refresh($scope.viewType)            
        }
    }

    // controller functions (scoped)
    $scope.refresh = function (view) {

        // clear selections
        $scope.interestGroupIDs = {};
        
        $scope.workproducts = {};
        $scope.multiSelected = [];

        var params = [];

        if (view == 'byInterestGroup') {
            $scope.prevView = 'byInterestGroup';
            params = [{"productType" : "Incident"}, {"count" : $scope.limit}, {"startIndex" : $scope.startIndex}];
            searchAPIService.getWorkProducts(params).success(function (response) {
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
                     $scope.startIndex = 0
                }
                // add them to local array of workproducts
                if (workProductList.length > 0) {
                    for (var i = 0; i < workProductList.length; i++) {

                        var version = workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Version[0].text;
                        var type = workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Type[0].text;
                        var wpid = workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Identifier[0].text;

                        var igID = avail(workProductList[i], 'PackageMetadata[0].WorkProductProperties[0].AssociatedGroups[0].Identifier[0].text');

                        // if this wp is assocaited with an interest group
                        if (igID) {
                            if (type == 'Incident') {
                                if (! $scope.interestGroupIDs[igID] ) {
                                    $scope.interestGroupIDs[igID] = {};
                                    $scope.interestGroupIDs[igID].name = workProductList[i].Digest[0].Event[0].Identifier[0].text;
                                }                       
                            }
                        } 
                         $scope.workproducts[wpid] = workProductList[i];
                         $scope.workproducts[wpid].name = $scope.interestGroupIDs[igID].name;

                    }

                    $scope.getAssociatedWorkProducts();
                }                
                $scope.viewType = 'byInterestGroup';
            });

        } else if (view == 'byAlert') {
            $scope.prevView = 'byAlert';
            params = [{"productType" : "Alert"}, {"full":"true"}, {"count" : $scope.limit}, {"startIndex" : $scope.startIndex}];
            searchAPIService.getWorkProducts(params).success(function (response) {
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
                    // there are none, 
                     $scope.startIndex = 0
                }
                // add them to local array of workproducts
                if (workProductList.length > 0) {
                    for (var i = 0; i < workProductList.length; i++) {

                        var type = workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Type[0].text;
                        var wpid = workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Identifier[0].text;
                        workProductList[i].name = workProductList[i].Digest[0].Event[0].Identifier[0].text;
                        $scope.workproducts[wpid] = workProductList[i];
                        if ($scope.productTypes.indexOf(type) == -1) {
                            $scope.productTypes.push(type);
                        }                        
                    }
                }                
                $scope.viewType = 'byAlert';
            });

        } else {
            $scope.prevView = 'byType';
            params = [{"count" : $scope.limit}, {"startIndex" : $scope.startIndex}];
            searchAPIService.getWorkProducts(params).success(function (response) {
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
                    // there are none, reset counter
                    $scope.startIndex = 0
                }
                // add them to local array of workproducts
                if (workProductList.length > 0) {
                    $scope.productTypes = []
                    for (var i = 0; i < workProductList.length; i++) {

                        var type = workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Type[0].text;
                        var wpid = workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Identifier[0].text;
                        workProductList[i].name = workProductList[i].Digest[0].Event[0].Identifier[0].text;
                        $scope.workproducts[wpid] = workProductList[i];
                        if ($scope.productTypes.indexOf(type) == -1) {
                            $scope.productTypes.push(type);
                        }                        
                    }
                }                
                $scope.viewType = 'byType';
            });
        }
    };

    $scope.getAssociatedWorkProducts = function () {
        // create params object of IGs
        var params = []

        for (var igID in $scope.interestGroupIDs) {
            params.push({
                "interestGroup": igID
            })
        }

        // fetch workproducts
        searchAPIService.getWorkProducts(params).success(function (response) {
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
                        var type = workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Type[0].text;

                        if (type !== "Incident") {
                            $scope.workproducts[wpid] = workProductList[i];

                            var assoc = avail(workProductList[i], 'PackageMetadata[0].WorkProductProperties[0].AssociatedGroups[0].Identifier[0].text')
                            if (assoc) {
                                if ($scope.interestGroupIDs[assoc].name) {
                                    $scope.workproducts[wpid].name = $scope.interestGroupIDs[assoc].name;
                                }
                            }

                            if ($scope.productTypes.indexOf(workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Type[0].text) == -1) {
                                $scope.productTypes.push(workProductList[i].PackageMetadata[0].WorkProductIdentification[0].Type[0].text);
                            }
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
                $scope.refresh($scope.viewType);
                alert("Successfully closed workproduct.")
            })
            .error(function (response) {
                alert("Failed to close workproduct." + ".\n\n" + "Check the core logs.")
            });
    };

    $scope.archiveWorkProduct = function (workproduct) {
        workProductAPIService.archiveWorkProduct(workproduct).success(function (response) {
                $scope.refresh($scope.viewType);
                alert("Successfully archived workproduct.")
            })
            .error(function (response) {
                alert("Failed to archive workproduct." + ".\n\n" + "Check the core logs.")
            });
    };

    $scope.closeSelectedIncidents = function () {
        for (var i = 0; i < $scope.multiSelected.length; i++) {
            if ($scope.workproducts[$scope.multiSelected[i]].PackageMetadata[0].WorkProductIdentification[0].State[0].text == 'Active') {
                var igID = $scope.workproducts[$scope.multiSelected[i]].PackageMetadata[0].WorkProductProperties[0].AssociatedGroups[0].Identifier[0].text;
                incidentAPIService.closeIncident(igID).success(function (response) {
                    alert("Successfully closed incident " + igID)
                })
                .error(function (response) {
                    alert("Failed to close incident " + igID + ".\n\n" + "Check the core logs.")
                });
            }
        }
        $scope.refresh($scope.viewType);
    }

    $scope.closeAndArchiveSelectedIncidents = function () {
        for (var i = 0; i < $scope.multiSelected.length; i++) {
            var igID = $scope.workproducts[$scope.multiSelected[i]].PackageMetadata[0].WorkProductProperties[0].AssociatedGroups[0].Identifier[0].text;
            if ($scope.workproducts[$scope.multiSelected[i]].PackageMetadata[0].WorkProductIdentification[0].State[0].text == 'Active') {

                var promise = incidentAPIService.closeAndArchiveIncident(igID);
                promise.then( function () {
                    alert("Successfully archived incident " + igID)
                }, (function () {
                    alert("Failed to archive incident " + igID + ".\n\n" + "Check the core logs.")
                }));

            } else if ($scope.workproducts[$scope.multiSelected[i]].PackageMetadata[0].WorkProductIdentification[0].State[0].text == 'Inactive') {
                incidentAPIService.archiveIncident(igID).success(function (response) {
                    alert("Successfully archived incident " + igID)
                })
                .error(function (response) {
                    alert("Failed to archive incident " + igID + ".\n\n" + "Check the core logs.")
                });
            }
            // delete $scope.workproducts[$scope.multiSelected[i]];
        }
        
        $scope.refresh($scope.viewType);

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
    $scope.refresh('byInterestGroup');

})

.controller('AgreementsController', function ($rootScope, $scope, $http, agreementsAPIService) {

    $rootScope.pageTitle = "Sharing Agreements"

    $scope.agreementNS = 'http://uicds.org/AgreementService';

    $scope.selected = -1;
    $scope.multiSelected = [];

    $scope.agreements = [];

    $scope.incidentTypeOptions = [];
    $scope.exMetadataOptions = [];

    $scope.rAlphanumericNoSpaces = /^[a-zA-Z0-9\-_]*$/;
    $scope.rQualifiedJID = /.+@.+/;


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
            "action": "create",
            "description" : [{
                "text" : ""
            }],
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

        agreementsAPIService.getAgreementsList(xml).success(function (response) { 
            // clear existing agreements object
            $scope.agreements = [];

            var result = xmlToJSON.parseString(response);

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

            if ($scope.agreements.length == 0) {
                $scope.createNew();
            };             
        }).
        error(function (response) {
            alert("Failed to fetch the agreements list." + "\n\n" + "Check the Core logs.")
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
            agreement.localCore = 'uicds@' + $scope.fqdn;
            
            agreement.guid = function () {
                return guid()
            };

            var xml = Mustache.render(xmlRescindAgreementTmpl, agreement);

            if (!agreement.Principals[0].RemoteCore[0].text) {
                alert('Please select an existing agreement.  Click "Refresh" to load agreements from the core.');
                return;
            }

            agreementsAPIService.rescindAgreement(xml).success(function (response) {
                alert("Successfully rescinded the agreement");
                $scope.refresh();
            }).
            error(function (response) {
                alert("Failed to rescind the agreement." + "\n\n" + "Check the Core logs.");
            });
        }
    };

    $scope.submit = function (isValid, agreement) {
        if (isValid) {
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

            var xml;

            if (agreement.action == 'create') {
                xml = Mustache.render(xmlCreateAgreementTmpl, agreement, partials);
                agreementsAPIService.createAgreement(xml).success(function (response) {
                    alert("Successfully created agreement with " + agreement.Principals[0].RemoteCore[0].text);
                     $scope.refresh();
                    agreement.action = '';
                }).error(function (response) {
                    alert("Failed to create agreement with " + agreement.Principals[0].RemoteCore[0].text);
                });     
            } else {
                xml = Mustache.render(xmlUpdateAgreementTmpl, agreement, partials);
                agreementsAPIService.updateAgreement(xml).success(function (response) {
                    alert("Successfully updated agreement with " + agreement.Principals[0].RemoteCore[0].text);
                     $scope.refresh();
                     agreement.action = '';
                }).error(function (response) {
                    alert("Failed to update agreement with " + agreement.Principals[0].RemoteCore[0].text);
                });                 
            }
        }

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
        '<as:id>{{{id.0.text}}}</as:id>',
        '<as:description>{{{description.0.text}}}</as:description>',
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
        '<as:agreementID>{{{id.0.text}}}</as:agreementID>',
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


});
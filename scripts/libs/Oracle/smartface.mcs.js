/* globals mcs mcs_config Analytics AnalyticsEvent Deferred getCollection postObject readObject*/
// Based on MCS Jquery plugin at http://www.ateam-oracle.com/hybrid-mobile-apps-using-the-mobile-cloud-service-javascript-sdk-with-oracle-jet/

include("libs/Oracle/mcs.js");
include("libs/Oracle/oracle_mobile_cloud_config.js");
include("libs/utils/deferred.js");

// namespace pattern
(function() {
    function namespace(ns_string) {
        var parts = ns_string.split('.'),
            parent = global,
            i;

        for (i = 0; i < parts.length; i += 1) {
            // create a property if it doesn't exist
            if (typeof parent[parts[i]] === "undefined") {
                parent[parts[i]] = {};
            }

            parent = parent[parts[i]];
        }
        return parent;
    }

    namespace("SMF.Oracle");
})();


/**
 * Creates a new Oracle MCS mobile backend layer.
 */

SMF.Oracle.MobileCloudService = function MobileCloudService(backendName) {
    var self = this;

    self.mobileBackend;
    self.authAnonymous;
    self.authenticate;
    self.getCurrentUser;
    self.updateCurrentUser;
    self.isOracleMCSAuthenticated = false;
    self.getCollection;
    self.getObject;
    self.registerNotification;
    /**
     * inits mcs mobile backend
     */
    function init() {

        // setting platform properties
        console.log('setting platform values');
        mcs.MobileBackendManager.platform.model = Device.brandModel;
        mcs.MobileBackendManager.platform.manufacturer = Device.brandName;
        mcs.MobileBackendManager.platform.osName = Device.deviceOS;
        mcs.MobileBackendManager.platform.osVersion = Device.deviceOSVersion;
        // mcs.MobileBackendManager.platform.osBuild = '<unknown>';
        mcs.MobileBackendManager.platform.carrier = Device.carrierName;

        console.log('setting mcs_config');
        // setting mcs config
        mcs.MobileBackendManager.setConfig(mcs_config);

        // Setting MCS backend name
        console.log('setting mobileBackend:' + backendName);
        self.mobileBackend = mcs.MobileBackendManager.getMobileBackend(backendName);

        //Smartface supports OAuth so we're setting our auth type to OAuth.
        console.log('setting setAuthenticationType to oAuth');
        self.mobileBackend.setAuthenticationType(mcs.AuthenticationTypeOAuth);

        console.log('creating new Analytics object');
        self.Analytics = new Analytics(self.mobileBackend);
    }

    //Handles the success and failure callbacks defined here
    //Not using anonymous login for this example but including here. 
    self.authAnonymous = function() {
        console.log("Authenticating anonymously");
        self.mobileBackend.Authorization.authenticateAnonymous(
            function(response, data) {
                console.log("Success authenticating against mobile backend");
                self.isOracleMCSAuthenticated = true;
            },
            function(statusCode, data) {
                console.log("Failure authenticating against mobile backend");
                self.isOracleMCSAuthenticated = false;
            }
        );
    };

    //This handles success and failure callbacks using parameters (unlike the authAnonymous example)
    self.authenticate = function(username, password, successCallback, failureCallback) {
        self.mobileBackend.Authorization.authenticate(username, password, successCallback, failureCallback);
    };

    /**
   * Returns the user resource associated with the logged in user.
   * @param successCallback {Authorization~userSuccessCallback} Optional callback invoked on success.
   * @param errorCallback {Authorization~errorCallback} Optional callback invoked on failure.
   * @returns {Object} returns the user with all the properties associated with that user.
   * @example <caption>Example usage of mcs.MobileBackend.Authorization.getCurrentUser()</caption>
   * mcs.MobileBackend.Authorization.getCurrentUser(
   * function(statusCode, data){
   * },
   * function(statusCode, data){
   * });
   * // returns statusCode, and the user object on successCallback function from the data parameter.
   {
     "id": "c9a5fdc5-737d-4e93-b292-d258ba334149",
     "username": "DwainDRob",
     "email": "js_sdk@mcs.com",
     "firstName": "Mobile",
     "lastName": "User",
     "properties": {}
   }
   */
    self.getCurrentUser = function(successCallback, failureCallback) {
        self.mobileBackend.Authorization.getCurrentUser(successCallback, failureCallback);
    }

    /**
     * Updates the user resource for the currently logged in user.
     * @param user {Authorization~User} The user resource to update
     * @param successCallback {Authorization~userSuccessCallback} Optional callback invoked on success.
     * @param errorCallback {Authorization~errorCallback} Optional callback invoked on failure.
     */
    self.updateCurrentUser = function(user, successCallback, failureCallback) {
        self.mobileBackend.Authorization.updateCurrentUser(user, successCallback, failureCallback);
    }

    //this handles success and failure callbacks using parameters
    self.logout = function(successCallback, failureCallback) {
        self.mobileBackend.Authorization.logout();
    };

    self.isAuthorized = function() {
        return self.mobileBackend.Authorization.IsAuthorized;
    };

    // This creates an event, adds it to MCS Analytics queue. Dont forget to flush it!
    self.logAnalytics = function(name) {
        var event = new AnalyticsEvent(name);
        self.Analytics.logEvent(event);
        console.log('logged event ' + name);
    };

    //This creates an event, adds it to MCS Analytics queue and immideately flushes it/
    self.logAndFlushAnalytics = function(name) {
        self.logAnalytics(name);
        self.flushAnalytics();
    };

    // Sends all collected event logs to the server
    self.flushAnalytics = function() {
        if (self.isOracleMCSAuthenticated) {
            var onAnalyticsSuccess = function(e) {
                console.log('onAnalyticsSuccess');
            };

            var onAnalyticsError = function(e) {
                console.log('onAnalyticsError: ' + JSON.stringify(e));
            };

            self.Analytics.flush(onAnalyticsSuccess, onAnalyticsError);
        }
        else {
            console.log('You should authenticate first.');
            console.log('self.isAuthorized : ' + self.isAuthorized());
            console.log('self.isOracleMCSAuthenticated : ' + self.isOracleMCSAuthenticated);
        }
    };

    // Gets storage collection for a given collection name
    // getCollection taken from official documentation example at site https://docs.oracle.com/cloud/latest/mobilecs_gs/MCSUA/GUID-7DF6C234-8DFE-4143-B138-FA4EB1EC9958.htm#MCSUA-GUID-7A62C080-C2C4-4014-9590-382152E33B24
    // modified to use custom deferred function instead of $q as shown in documentaion
    self.getCollection = function(collectionName) {
        var deferred = new Deferred();

        //return a storage collection with the name assigned to the collection_id variable.
        self.mobileBackend.Storage.getCollection(collectionName, null, onGetCollectionSuccess, onGetCollectionFailed);

        return deferred.promise();

        function onGetCollectionSuccess(response, storageCollection) {
            deferred.resolve(storageCollection);
        }

        function onGetCollectionFailed(statusCode, data) {
            if (statusCode == 404) {
                console.log('Storage collection not found, it may not be associated with the backend. Please check your MCS Storage settings.');
            }
            else {
                console.log("Failed to download storage collection: " + collectionName + ", statusCode: " + statusCode);
            }
            deferred.reject(statusCode);
        }
    };

    // Returns storage objects as JSON for a collection
    self.getStorageObjects = function(collection, successCallback, failureCallback) {
        // Getting objects from our named MCS Storage

        // will return deferred.promise()
        console.log('getting getCollection -> ' + collection);
        var myStorageCollection = self.getCollection(collection);

        myStorageCollection.then(
            function(collection) {
                //promise resolve

                //returns both objecst array and collection itself for further usage 
                function onGetObjectsSuccess(collectionObjects) {
                    console.log('objects ready to be processed');
                    successCallback(collection, collectionObjects)
                }

                //getting objects from the storage
                console.log('getting collection objects -> ' + collection);
                collection.getObjects(0, 100, onGetObjectsSuccess, failureCallback);

            },
            function(e) {
                //promise reject
                console.log("self.getCollection failed:" + e);
                failureCallback(e);
            }
        );


    }

    // Downloads an object from given storage for a given id, saves it to a temp file and returns file.path
    self.getStorageObject = function(storage, id, successCallback, failureCallback) {
        // Retrieving object for given id
        console.log('getting object -> ' + id);

        var onGetStorageObjectSuccess = function(storageObject) {

            /*
            {
            	"id": "e7e8bb86-2fcc-475e-aa8c-27dd3814d4ed",
            	"name": "camera_dwnMx_04102016204742741.jpeg",
            	"_eTag": "\"1\"",
            	"contentLength": 2928479,
            	"contentType": "image/jpeg",
            	"createdBy": "oracle",
            	"createdOn": "2016-10-05T00:47:49Z",
            	"modifiedBy": "oracle",
            	"modifiedOn": "2016-10-05T00:47:49Z"
            }
            */

            var blobData = storageObject.getPayload();

            var f = new SMF.IO.File(storageObject.name);
            if (!f.exists)
                f.createFile();
            var s = f.openStream(SMF.IO.StreamType.WRITE);
            s.write(blobData);
            s.close();

            successCallback(f.path);

        };

        var onGetStorageObjectFailed = function(e) {
            console.log(id + ' cant retrieved ' + e);
            failureCallback(e);
        }

        storage.getObject(id, onGetStorageObjectSuccess, onGetStorageObjectFailed, "blob")

    }

    // Deletes an object from given collection for a given id
    self.deleteStorageObject = function(collection, id, successCallback, failureCallback) {
        console.log('deleting object -> ' + id);

        var onDeleteStorageObjectSuccess = function(e) {
            console.log('file is deleted' + JSON.prune(e));
            successCallback()
        };

        var onDeleteStorageObjectFailed = function(e) {
            console.log(id + ' could not be deleted ' + e);
            failureCallback(e);
        }

        collection.deleteObject(id, successCallback, failureCallback);
    }


    // postObject taken from official documentation example at site https://docs.oracle.com/cloud/latest/mobilecs_gs/MCSUA/GUID-7DF6C234-8DFE-4143-B138-FA4EB1EC9958.htm#MCSUA-GUID-7A62C080-C2C4-4014-9590-382152E33B24
    // modified to use custom deferred function instead of $q as shown in documentation
    self.postObject = function(collection, obj) {
        var deferred = Deferred();

        //post an object to the collection
        collection.postObject(obj, onPostObjectSuccess, onPostObjectFailed);

        return deferred.promise();

        function onPostObjectSuccess(status, object) {
            console.log("Posted storage object, id: " + object.id);
            deferred.resolve(object.id);
        }

        function onPostObjectFailed(statusCode, headers, data) {
            console.log("Failed to post storage object: " + statusCode);
            deferred.reject(statusCode);
        }
    };

    /**
     * Creates an object with given fileName and contentType and load given payload in it. Returns created file as StorageObject.
     * @param collection {String} The name of the StorageCollection.
     * @example collection: "SmartfaceMCSSampleStorage"
     * @param fileName {String} Filename of the object to be created.
     * @example fileName: "readme.txt"
     * @param payload {Object} The object to load from.
     * @example payload: "Hello my name is Mia and this is a sample payload".
     * @param contentType {String} The media-type to associate with the content.
     * @example contentType: "application/json,text/plain".
     */
    self.uploadFile = function(collectionName, fileName, payload, contentType, successCallback, failureCallback) {
        return self.getCollection(collectionName)
            .then(success);

        function success(collection) {
            //create new Storage object and set its name and payload
            var obj = new mcs.StorageObject(collection);
            obj.setDisplayName(fileName);
            obj.loadPayload(payload, contentType);

            self.postObject(collection, obj).then(function(object) {
                console.log("post object " + object.id);
                //return object.id; //readObject(collection, object.id);
                successCallback(object.id);
            }, function(e) {
                failureCallback(e);
            });
        }
    }


    /** Registers the current app running on the device for receiving push notifications.
     * After you register your device against Google & Apple with using Notifications.remote.registerForPushNotifications
     * You need to register it against Oracle MCS.
     * @param registrationID {String} Device specific token comes from Notifications.remote.token if you registered.
     * @example deviceToken: "AxdkfjfDfkfkfkfjfFdjfjjf=", deviceToken is sent from device.
     * @param appId {String} Platform specific application reverse domain identifier.
     * @example appId: "com.yourcompany.project"
     * @param appVersion {String} Platform specific application version.
     * @example appVersion: "1.0.2"
     * @param callback {Notifications~callback} callback uses errorFirst pattern invoked after execution.
     */

    self.registerNotification = function(registrationID, appId, appVersion, callback) {
        self.mobileBackend.Notifications.registerForNotifications(registrationID, appId, appVersion,
            function(statusCode, headers, data) {
                var success_msg = "sucess:statusCode=" + statusCode + ",data=" + data + "headers=" + headers;
                console.log(success_msg);
                callback && callback(null);
            },
            function(statusCode, data) {
                var failure_msg = "failure:statusCode=" + statusCode + ",data=" + data;
                console.log(failure_msg);
                callback && callback(failure_msg);
            }
        );
    };

    /** Registers the current app running on the device for receiving push notifications.
     * After you register your device against Google & Apple with using Notifications.remote.registerForPushNotifications
     * You need to register it against Oracle MCS.
     * @example deviceToken: "AxdkfjfDfkfkfkfjfFdjfjjf=", deviceToken is sent from device.
     * @param appId {String} Platform specific application reverse domain identifier.
     */
    self.deRegisterNotification = function(deviceToken, appId) {
        self.mobileBackend.Notifications.deRegisterForNotifications(deviceToken, appId,
            function(data) {
                var success_msg = "deRegisterNotification sucess:data=" + data;
                console.log(success_msg);
            },
            function(statusCode, data) {
                var failure_msg = "deRegisterNotification failure:statusCode=" + statusCode + ",data=" + data;
                console.log(failure_msg);
            }
        );

    };



    init();
    return self;
};
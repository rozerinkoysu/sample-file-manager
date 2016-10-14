# Smartface Helper JS Libraries for Oracle Mobile Cloud Service (aka MCS)

## What is it?

Smartface supports most of the JS libraries out there which doesn't require DOM by design.
In general we're putting main vendors' libraries under their seperate folders.

Oracle MCS lib is created by Oracle itself. We've made a few changes on it to be sure it will work in Smartface apps seamlessly.

## What is Oracle MCS?

Oracle has released the much anticipated Mobile Cloud Service (or MCS for short). Unlike other cloud offerings, MCS is focused not only on providing enterprise quality Mobile Backend as a Service (MBaaS), but also providing easy to use tools for business professionals to analyze and mine data about the usage of the MBaaS.

You can read more at https://blogs.oracle.com/mobile/entry/introducing_oracle_mobile_cloud_service

## What APIS does MCS Provide?

To help simplify mobile app development, Mobile Cloud Service provides these built-in APIs:

* Push Notification
* Data Offline / Sync
* Mobile User Management
* Analytics
* Mobile Storage
* Device Management

You can call these APIs directly from your apps via straight REST calls, or with the help of Mobile Cloud Service's SDKs for the iOS and Android platforms. MCS also provides a robust API Designer tool, so you can create your own custom APIs to go after the data you need.

## What is Smartface MCS JavaScript library?
Oracle MCS team releases Javascript  a few months behind of their REST API. We're continuously updating Smartface implementation of Oracle MCS JS SDK as soon as they release a new one. Also we're adding ready-to-use functions within a separate file named smartface.mcs.js.
These functions reflects MCS SDK and makes life easier for a Javascript developer. Some of the functions are developed by Cordova and used with a reference in our side.

* `Authentication`
 * `authAnonymous` Anonymous authentication (for Analytics events)
 * `authenticate` User and password based authentication against Oracle MCS Mobile User Management. (A user has to be authenticated before using permission based applications like Storage)
* `Analytics`
 * `logAnalytics` to Log an event
 * `flushAnalytics` to send your Analytics event queue to Oracle servers. All events will be logged locally until they are flushed.
 * `logAndFlushAnalytics` to immediately logs and flushes it.
* `Storage`
 * `getCollection` to get a named storage collection
 * `getStorageObjects` to get storage objects as JSON for a collection
 * `getStorageObject` to download an object from given storage for a given id.
 * `deleteStorageObject` to delete an object from given collection for a given id
 * `postObject` to upload a StorageObject to your storage
 * `uploadFile` to upload a file to your storage. (handles StorageObject itself)
* `Notifications` (Push Notification)
 * `registerNotification` to register the current app running on the device for receiving push notifications.
 * `deRegisterNotification` to deregister the app from Oracle MCS Notification system

## How to use?

There 3 main .js files in Oracle MCS library.
* `libs/Oracle/mcs.js` mcs main library developed by Oracle
* `libs/Oracle/oracle_mobile_cloud_config` mcs config file for your API keys and tokens provided by Oracle
* `libs/Oracle/smartface.mcs.js` Smartface Oracle backend library maintained by Smartface

First; you have to add your keys and tokens in config file. After configuration is done, you can simply include your `libs/Oracle/smartface.mcs.js` library to start using Oracle MCS. It will automatically load other necessary MCS lib modules during runtime.

```javascript
include("libs/Oracle/smartface.mcs.js");

function Application_OnStart(e) {
  // add your on start codes here include("pages/index.js");

	// Creating a new Oracle MCS instance
	smfOracle = new SMF.Oracle.MobileCloudService('YOUR_BACKEND_NAME');

	// logging in as anonymous user to log Analytics events
	// if you need you can auth user with .authenticate
	smfOracle.authAnonymous();

	// logging an event
	smfOracle.logAnalytics('Application_OnStart');


  // Sends all collected event logs to the server
	smfOracle.flushAnalytics();
}
```

Please refer to our Oracle MCS guide to get detailed usage examples:   https://smartface.atlassian.net/wiki/display/GUIDE/Using+Oracle+Mobile+Cloud+Service+%28MCS%29+to+Develop+Native+iOS+and+Android+Apps+with+Smartface

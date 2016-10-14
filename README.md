# File Manager from Smartface
File Manager from Smartface is a sample app to demonstrate Smartface and Oracle MCS integration. You can freely use the code in your apps.

# How to Use
To use all functionality in this app, please follow these steps;
* If you dont have, setup an account on [Oracle Cloud](https://cloud.oracle.com). 
* Create a new mobile backend for your project
* Create separate mobile backend clients for your target platforms (Android and iOS)
* Get tokens and keys for that backend from Oracle MCS dashboard
* Write down them into [`libs/Oracle/oracle_mobile_cloud_config.js`](https://github.com/smartface/sample-file-manager/blob/master/scripts/libs/Oracle/oracle_mobile_cloud_config.js)
* If you want to use Push Notifications, update `googleCloudMessaging` value in [`config/project.json`] (https://github.com/smartface/sample-file-manager/blob/master/config/project.json). You need to get your Sender ID from your Google GCM / Firebase account. It is recommended to read our detailed [Push Notification Services Guide](https://smartface.atlassian.net/wiki/display/GUIDE/Push+Notification+Services)
* To use Remote App Update feature update your [`config/project.rau.json`](https://github.com/smartface/sample-file-manager/blob/master/config/project.rau.json) You can unleash your app's power by reading [Remote App Update Guides](https://smartface.atlassian.net/wiki/display/GUIDE/Remote+App+Update+Guides)


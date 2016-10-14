/* globals lang defaultPageAnimation*/
include('i18n/i18n.js');
Application.onStart = Application_OnStart;
Application.onUnhandledError = Application_OnError;
Application.onMaximize = Application_onMaximize;

var smfOracle;
var mcsCollectionName = "YOUR_ORACLE_MCS_COLLECTION";
var mcsUser, mcsPassword;

//Doruk global variables begin
var cntAccountUpdate;
var cntActivityLog;
// Doruk global variables end

/*
These sample username and passwords created in Smartace app domain on Oracle MCS
Testing purposes only!

Username = 'smf-test';
Password = 'Sf123123';

Username = 'oracle';
Password = 'Open2016';
*/

/**
 * Triggered when application is started.
 * @param {EventArguments} e Returns some attributes about the specified functions
 * @this Application
 */
function Application_OnStart(e) {
	SMF.UI.statusBar.visible = true;
	SMF.UI.statusBar.color = "#00A1F1";
	SMF.UI.statusBar.style = SMF.UI.StatusBarStyle.LIGHTCONTENT;

	include("pages/index.js");

	//Update check for RaU
	if (Device.deviceOS == "Android") {
		global.checkPermission("WRITE_EXTERNAL_STORAGE", function(err) {
			if (!err) checkforUpdate();
		});
	}
	else {
		checkforUpdate();
	}

	// Creating a new Oracle MCS instance 
	smfOracle = new SMF.Oracle.MobileCloudService('smartfaceOracleMCS');

	// logging in as anonymous user to log Analytics events
	// if you need you can auth user with .authenticate
	smfOracle.authAnonymous();

	// logging an event
	smfOracle.logAnalytics('Application_OnStart');

	Pages.pgLogin.show(defaultPageAnimation);
}

function Application_onMaximize(e) {
	//do nothing	
}

function Application_OnError(e) {
	switch (e.type) {
		case "Server Error":
		case "Size Overflow":
			alert(lang.networkError);
			break;
		default:
			//change the following code for desired generic error messsage
			alert({
				title: lang.applicationError,
				message: e.message + "\n\n*" + e.sourceURL + "\n*" + e.line + "\n*" + e.stack
			});
			break;
	}
}


//RAU Update check
function checkforUpdate() {
	//Checks if there is a valid update. If yes returns result object.     
	Application.checkUpdate(function(err, result) {
		if (err) {
			//Checking for update is failed. It is not necessary to show an alert about the error to user.
			//alert("check update error: " + err);
		}
		else {
			//Update is successful. We can show the meta info to inform our app user.
			if (result.meta) {
				var isMandatory = (result.meta.isMandatory && result.meta.isMandatory === true) ? true : false;

				var updateTitle = (result.meta.title) ? result.meta.title : 'A new update is ready!';

				var updateMessage = "Version " + result.newVersion + " is ready to install.\n\n" +
					"What's new?:\n" + JSON.stringify(result.meta.update) +
					"\n\n"

				//adding mandatory status	
				updateMessage += (isMandatory) ? "This update is mandatory!" : "Do you want to update?";

				//Function will run on users' approve
				function onFirstButtonPressed() {
					if (result.meta.redirectURL && result.meta.redirectURL.length != 0) {
						//RaU wants us to open a URL, most probably core/player updated and binary changed. 
						SMF.Net.browseOut(result.meta.redirectURL);
					}
					else {
						Dialog.showWait();
						//There is an update waiting to be downloaded. Let's download it.
						result.download(function(err, result) {
							if (err) {
								//Download failed
								Dialog.removeWait();
								alert("Autoupdate download failed: " + err);
							}
							else {
								//All files are received, we'll trigger an update.
								result.updateAll(function(err) {
									if (err) {
										//Updating the app with downloaded files failed
										Dialog.removeWait();
										alert("Autoupdate update failed: " + err);
									}
									else {
										//After that the app will be restarted automatically to apply the new updates
										Application.restart();
									}
								});
							}
						});
					}
				}

				//We will do nothing on cancel for the timebeing.
				function onSecondButtonPressed() {
					//do nothing
				}

				//if Update is mandatory we will show only Update now button.
				if (isMandatory) {
					alert({
						title: updateTitle,
						message: updateMessage,
						firstButtonText: "Update now",
						onFirstButtonPressed: onFirstButtonPressed
					});
				}
				else {
					alert({
						title: updateTitle,
						message: updateMessage,
						firstButtonText: "Update now",
						secondButtonText: "Later",
						onFirstButtonPressed: onFirstButtonPressed,
						onSecondButtonPressed: onSecondButtonPressed

					});
				}
			}

		}
	});
}
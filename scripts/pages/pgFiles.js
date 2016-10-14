/* globals mcs Analytics AnalyticsEvent smfOracle mcsUser mcsPassword formatBytes Dialog defaultPageAnimation*/

var myStorage;

(function() {
    var arrayFiles = [];

    //Creating the page
    var pgFiles = Pages.pgFiles = new SMF.UI.Page({
        name: "pgFiles",
        onKeyPress: pgFiles_onKeyPress,
        onShow: pgFiles_onShow,
        backgroundImage: 'stripe.png',
        myObjects: [],
        myStorageCollection: []
    });

    //adding swipe gesture to page 
    pgFiles.addGesture({
        id: "2",
        type: "swipe",
        direction: "right",
        requiredTouches: 1,
        callback: function(e) {
            Pages.back(defaultPageAnimation);
        }
    });

    //creating a repeatbox to show our files
    var rptBoxObjects = new SMF.UI.RepeatBox({
        top: "0%",
        left: '0%',
        width: '100%',
        height: '100%',
        borderWidth: 0,
        useActiveItem: false,
        showScrollbar: true,
        autoSize: false,
        touchEnabled: true,
        enableScroll: true,
        backgroundTransparent: false,
        fillColor: "#FFFFFF",
        enablePullUpToRefresh: false,
        enablePullDownToRefresh: true,
        useActiveItem: true,
        allowDeletingItem: true,
        onSelectedItem: function(e) {
            getStorageObject(arrayFiles[e.rowIndex].id);
        },
        onPullDown: function(e) {
            Dialog.showWait();
            getStorageObjects();
        },
        onLongTouch: function(e) {
            //Since Android doesn't have a swipe gesture we're adding a long touch for "delete item" functionality
            if (Device.deviceOS == 'Android') {
                alert({
                    title: 'Warning!',
                    message: 'Do you want to delete this file?',
                    firstButtonText: "Delete",
                    secondButtonText: "Cancel",
                    onFirstButtonPressed: function() {
                        deleteStorageObject(arrayFiles[e.rowIndex].id);
                    },
                    onSecondButtonPressed: function() {}
                });
            }
        }
    });

    // Addigin swipe gesture for iOS devices to delete items.
    if (Device.deviceOS == 'iOS') {
        // alert(Device.brandModel.toLowerCase());
        var myFont = new SMF.UI.Font({
            name: "FontAwesome",
            size: (Device.brandModel.toLowerCase().includes("plus")) ? 80 : 40
        });

        var itemDelete = new SMF.UI.RepeatBoxSwipeItem({
            width: "16%",
            height: "100%",
            left: "84%",
            top: "0%",
            text: JSON.parse('""'), //FontAwesome "uf08b",
            font: myFont,
            fontColor: "#FFFFFF",
            pressedFontColor: "#ffffff",
            fillColor: "#ff0000",
            onSelected: function(e) {
                Dialog.showWait();
                deleteStorageObject(arrayFiles[e.rowIndex].id);
            },
            roundedEdge: 0
        });

        var itemRead = new SMF.UI.RepeatBoxSwipeItem({
            width: "16%",
            height: "100%",
            left: "68%",
            top: "0%",
            text: JSON.parse('""'), //FontAwesome "f002",
            font: myFont,
            fontColor: "#FFFFFF",
            pressedFontColor: "#ffffff",
            fillColor: "#00A1F1",
            onSelected: function(e) {
                Dialog.showWait();
                getStorageObject(arrayFiles[e.rowIndex].id);
            },
            roundedEdge: 0
        });

        var items = [itemRead, itemDelete];
        rptBoxObjects.setSwipeItems(items);

        //Setting pull-to-refresh props.
        //an activity indicator for pulldown action on file repeatbox
        var aiPullDown = new SMF.UI.ActivityIndicator({
            top: "0%",
            left: "45%",
            widht: "10%",
            height: "10%",
            style: SMF.UI.ActivityIndicatorStyle.GRAY,
        });
        rptBoxObjects.pullDownItem.add(aiPullDown);
        rptBoxObjects.pullDownItemTemplate.fillColor = "#FFFFFF";
    }

    //thumb icon
    var imgFileIcon = new SMF.UI.Image({
        top: '0%',
        left: '3%',
        width: '10%',
        height: '100%',
        imageFillType: SMF.UI.ImageFillType.ASPECTFIT,
        touchEnabled: false
    });


    //File Name
    var lblFileName = new SMF.UI.Label({
        top: '20%',
        left: '16%',
        width: '68%',
        height: '32%',
        multipleLine: false,
        touchEnabled: false,
        font: new SMF.UI.Font({
            size: '7pt',
            bold: false
        })
    });

    //file size
    var lblContentInfo = new SMF.UI.Label({
        top: '51%',
        left: '16%',
        width: '80%',
        height: '20%',
        multipleLine: false,
        touchEnabled: false,
        font: new SMF.UI.Font({
            size: '5pt',
            bold: false,
        }),
        fontColor: SMF.UI.Color.GRAY
    });

    var imgFileIcon2 = imgFileIcon.clone();
    var lblFileName2 = lblFileName.clone();
    var lblContentInfo2 = lblContentInfo.clone();


    //adding files to repeatbox's itemtemplate
    rptBoxObjects.itemTemplate.height = Device.screenHeight / 10;
    rptBoxObjects.itemTemplate.add(imgFileIcon);
    rptBoxObjects.itemTemplate.add(lblFileName);
    rptBoxObjects.itemTemplate.add(lblContentInfo);
    rptBoxObjects.itemTemplate.fillColor = SMF.UI.Color.WHITE

    rptBoxObjects.activeItemTemplate.height = Device.screenHeight / 10;
    rptBoxObjects.activeItemTemplate.add(imgFileIcon2);
    rptBoxObjects.activeItemTemplate.add(lblFileName2);
    rptBoxObjects.activeItemTemplate.add(lblContentInfo2);
    rptBoxObjects.activeItemTemplate.fillColor = SMF.UI.Color.ALICEBLUE;


    rptBoxObjects.pullDownItem.height = "8%";

    //onRowRender will work for each item bound
    rptBoxObjects.onRowRender = function(e) {
        this.controls[0].image = arrayFiles[e.rowIndex].fileIcon;
        this.controls[1].text = arrayFiles[e.rowIndex].name;
        this.controls[2].text = arrayFiles[e.rowIndex].contentLength + ', created on ' + arrayFiles[e.rowIndex].createdOn;

        this.controls[3].image = arrayFiles[e.rowIndex].fileIcon;
        this.controls[4].text = arrayFiles[e.rowIndex].name;
        this.controls[5].text = arrayFiles[e.rowIndex].contentLength + ', created on ' + arrayFiles[e.rowIndex].createdOn;

    };


    //adding repeatbox to the page
    pgFiles.add(rptBoxObjects);

    /**
     * Creates action(s) that are run when the user press the key of the devices.
     * @param {KeyCodeEventArguments} e Uses to for key code argument. It returns e.keyCode parameter.
     * @this Pages.pgFiles
     */
    function pgFiles_onKeyPress(e) {
        if (e.keyCode === 4) {
            Pages.back();
        }
    }

    /**
     * Creates action(s) that are run when the page is appeared
     * @param {EventArguments} e Returns some attributes about the specified functions
     * @this Pages.pgFiles
     */
    function pgFiles_onShow() {
        smfOracle.logAndFlushAnalytics('pgFiles_onShow');

        addHeaderBar();

        displayStorageObjects();
    }



    //Parsing storage objects 
    function displayStorageObjects() {

        /*
        Sample item 

       [{
        	"id": "6f0b3ae0-981f-4bba-b052-384c0f3557c5",
        	"name": "sf-logo.png",
        	"contentLength": 37800,
        	"contentType": "image/png",
        	"_eTag": "\"1\"",
        	"createdBy": "atakan.eser@smartface.io",
        	"createdOn": "2016-06-28T08:50:54Z",
        	"modifiedBy": "atakan.eser@smartface.io",
        	"modifiedOn": "2016-06-28T08:50:54Z"
        }]

        */

        var parsedResponse = Pages.pgFiles.myObjects;
        arrayFiles = [];

        for (var i = 0; i < parsedResponse.length; i++) {
            var objStorageObject = {};

            objStorageObject.id = parsedResponse[i].id;
            objStorageObject.name = parsedResponse[i].name;
            objStorageObject.contentLength = formatBytes(parsedResponse[i].contentLength, 2);
            objStorageObject.contentType = parsedResponse[i].contentType;
            objStorageObject.createdBy = parsedResponse[i].createdBy;
            objStorageObject.createdOn = new Date(parsedResponse[i].createdOn).format("ddd d MMM yyyy h:mmtt"); //parsedResponse[i].createdOn;
            objStorageObject.modifiedBy = parsedResponse[i].modifiedBy;
            objStorageObject.modifiedOn = parsedResponse[i].modifiedOn;
            objStorageObject.sortDate = parsedResponse[i].createdOn;

            //getting icon
            objStorageObject.fileIcon = getFileTypeIcon(parsedResponse[i].contentType);

            arrayFiles.push(objStorageObject);
            arrayFiles.sort(function(a, b) {
                return new Date(b.sortDate) - new Date(a.sortDate);
            });
        }


        //binding objects array
        rptBoxObjects.pullDownItemTemplate.visible = true;
        rptBoxObjects.closePullItems();
        rptBoxObjects.dataSource = arrayFiles;
        rptBoxObjects.refresh();
        Dialog.removeWait();
    }

    function addHeaderBar() {

        var headerBar = new HeaderBar();
        headerBar.init(Pages.currentPage);
        headerBar.setTitleView(Pages.currentPage, "My Files", SMF.UI.Color.WHITE, null, 40, 0, 200, 44);

   

        // Preparing left items 

        /*
        FontAwesome codes
        logout = "\uf08b"
        add = "\uf067"
        profile = "\uf007"
        */

        if (Device.deviceOS !== "Android") {
            var itemLogout = new SMF.UI.iOS.BarButtonItem({
                title: JSON.parse('""'), //FontAwesome "uf08b",
                fontName: "FontAwesome",
                fontSize: 22, 
                tintColor: "#FFFFFF",
                onSelected: function() {
                    Dialog.showWait();
                    Pages.back();
                }
            });

            //headerBar.leftItems.add(itemLogout);

            var itemAdd = new SMF.UI.iOS.BarButtonItem({
                title: JSON.parse('""'), //FontAwesome uf067
                fontName: "FontAwesome",
                fontSize: 22,
                tintColor: "#FFFFFF",
                onSelected: function() {
                    addNewFile();
                }
            });

            var itemProfile = new SMF.UI.iOS.BarButtonItem({
                title: JSON.parse('""'), //FontAwesome uf007
                fontName: "FontAwesome",
                fontSize: 22,
                tintColor: "#FFFFFF",
                onSelected: function() {
                    getCurrenUserData();
                }
            });
            Pages.currentPage.navigationItem.leftBarButtonItems = [itemLogout];
            Pages.currentPage.navigationItem.rightBarButtonItems = [itemAdd, itemProfile];
        }
        else {

            var itemAdd = new SMF.UI.Android.MenuItem({
                id: "1",
                title: "Add File",
                showAsAction: SMF.UI.Android.ShowAsAction.WITHTEXT,
                onSelected: function(e) {
                    addNewFile();
                }
            });

            var itemProfile = new SMF.UI.Android.MenuItem({
                id: "2",
                title: "My Account",
                showAsAction: SMF.UI.Android.ShowAsAction.WITHTEXT,
                onSelected: function(e) {
                    getCurrenUserData();
                }
            });

            Pages.currentPage.actionBar.itemTextColor = SMF.UI.Color.WHITE;

            Pages.currentPage.actionBar.menuItems = [itemAdd, itemProfile];
        }
    }

    function addNewFile(e) {
        var item1 = {
            title: "Select from Gallery",
            icon: "icon.png", // Andrid 3.0- only
            onSelected: function(e) {
                getImage(e, false)
            }
        };
        var item2 = {
            title: "Capture a Photo",
            icon: "icon.png", // Andrid 3.0- only
            onSelected: function(e) {
                getImage(e, true);
            }
        }

        var item3 = {
            title: "Cancel",
            itemType: SMF.UI.MenuItemType.cancel, // iOS Only
            onSelected: function(e) {}
        };
        var myItems = [item1, item2, item3]; //assume that items are predefined
        var menu1 = new SMF.UI.Menu({
            menuStyle: SMF.UI.MenuStyle.OPTIONALMENU,
            icon: "menu_icon.png", // Android Context Menu Only
            items: myItems
        });
        menu1.show();
    }

    // gets image from camera or gallery
    function getImage(e, getFromCamera) {

        // Callback function for getting image from camera/gallery
        function getImageSuccessCallback(selectedFile) {
            // console.log("myfile:" + JSON.prune(selectedFile));
            Dialog.showWait();

            function uploadFileSuccessCallback(e) {
                Dialog.showWait();
                getStorageObjects();
            }
            //failure callback for smfOracle.deleteStorageObject function
            var failureCallback = function(e) {
                alert('Cant  upload the file ' + JSON.stringify(e));
            }

            smfOracle.uploadFile(mcsCollectionName, selectedFile.fileName, selectedFile.blobData, selectedFile.type, uploadFileSuccessCallback, failureCallback);
        }

        if (getFromCamera) {
            getImageFromCamera(getImageSuccessCallback);
        }
        else {
            getImageFromGallery(getImageSuccessCallback);
        }
    }

    //gets logged in User's info from MCS
    function getCurrenUserData() {
        // Getting current user info from the cloud
        Dialog.showWait();

        smfOracle.logAndFlushAnalytics('pgFiles_itemProfile_clicked');

        var successCallback = function(statusCode, data) {
            Dialog.showWait();
            Pages.pgAccount.myUserData = data;
            Pages.pgAccount.show(defaultPageAnimation);
        };

        var failureCallback = function(e) {
            Dialog.removeWait();
            alert('Get get the current user info from the Cloud. Please try again later!');
        }

        smfOracle.getCurrentUser(successCallback, failureCallback);

    }

    //Downloads collection objects and assign them to repeatbox
    function getStorageObjects() {

        var successCallback = function(collection, collectionObjects) {

            Dialog.removeWait();

            // passing objects to pgFiles
            Pages.pgFiles.myObjects = collectionObjects;
            Pages.pgFiles.myStorageCollection = collection;
            displayStorageObjects();
        };

        var failureCallback = function(e) {
            Dialog.removeWait();
            alert(e);
        }

        smfOracle.getStorageObjects(mcsCollectionName, successCallback, failureCallback);
    }

    // Download file from the Storage and get file's path.
    function getStorageObject(id) {
        // Retrieving object for given id
        if (id) {
            Dialog.showWait();
            var successCallback = function(filePath) {

                var fileViewer = new SMF.Utils.Fileviewer();
                fileViewer.openDocument(filePath);

                Dialog.removeWait();
            };

            var failureCallback = function(e) {
                console.log(id + ' cant retrieved ' + e);
                Dialog.removeWait();
                alert(e);
            }

            smfOracle.getStorageObject(Pages.pgFiles.myStorageCollection, id, successCallback, failureCallback)
        }
        else {
            Dialog.removeWait();
            alert('Please select a file to view');
        }
    }

    // Delete file from collection
    function deleteStorageObject(id) {
        Dialog.showWait();

        if (id) {

            var successCallback = function(e) {
                getStorageObjects();
            };

            var failureCallback = function(e) {
                Dialog.removeWait();
                alert(e);
            }

            smfOracle.deleteStorageObject(Pages.pgFiles.myStorageCollection, id, successCallback, failureCallback);
        }
    }

})();
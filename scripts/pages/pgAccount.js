/* globals Dialog smfOracle*/
include("libs/utils/tabbar.js");

//TODO: include this file in onStart in pages/index.js Use the code below:
//include("pages/pgAccount.js");
(function() {
    var pgAccount = Pages.pgAccount = new SMF.UI.Page({
        name: "pgAccount",
        onKeyPress: pgAccount_onKeyPress,
        onShow: pgAccount_onShow,
        backgroundImage: 'stripe.png',
        myUserData: []
    });


    var cntTop_top = "0%";
    var cntTop_left = "0%";
    var cntTop_height = "40%";
    var cntTop_width = "100%";


    var cntTop = new SMF.UI.Container({
        top: cntTop_top,
        left: cntTop_left,
        width: cntTop_width,
        height: cntTop_height,
        borderWidth: 0,
        borderColor: "#ffffff"
    });

    var myRect = new SMF.UI.Rectangle({
        top: "0%",
        left: "0%",
        width: "100%",
        height: "100%",
        borderWidth: 0,
        borderColor: SMF.UI.Color.WHITE,
        fillColor: SMF.UI.Color.WHITE,
    })
    cntTop.add(myRect);

    var imgProfile = new SMF.UI.Image({
        name: "imgProfile",
        image: "profile.png",
        left: "10%",
        top: "10%",
        width: "80%",
        height: "80%",
        imageFillType: SMF.UI.ImageFillType.ASPECTFIT
    });

    cntTop.add(imgProfile);

    var cntBottom = new SMF.UI.Container({
        top: "40%",
        left: "0%",
        width: "100%",
        height: "60%",
        borderWidth: 0,
        borderColor: "#ffffff"
    });

    var myRect2 = new SMF.UI.Rectangle({
        top: "0%",
        left: "0%",
        width: "100%",
        height: "15%",
        borderWidth: 0,
        borderColor: SMF.UI.Color.WHITE,
        fillColor: SMF.UI.Color.WHITE,
    })
    cntBottom.add(myRect2);

    var cntAccountUpdate = new SMF.UI.Container({
        top: "15%",
        left: "0%",
        width: "100%",
        height: "85%",
        borderWidth: 0,
        borderColor: "red"
    });

    var txtFirstName = new SMF.UI.TextBox({
        top: "14%",
        left: "10%",
        width: "80%",
        height: "17%",
        placeHolder: "Firstname",
        text: "",
        horizontalGap: 15,
        roundedEdge: 1
    });

    var txtLastName = new SMF.UI.TextBox({
        top: "32%",
        left: "10%",
        width: "80%",
        height: "17%",
        placeHolder: "Lastname",
        text: "",
        horizontalGap: 15,
        roundedEdge: 1
    });

    var txtEmail = new SMF.UI.TextBox({
        top: "50%",
        left: "10%",
        width: "80%",
        height: "17%",
        placeHolder: "Email",
        text: "",
        horizontalGap: 15,
        touchEnabled: false,
        fontColor: SMF.UI.Color.GRAY,
        roundedEdge: 1
    });

    var btnUpdate = new SMF.UI.TextButton({
        top: "68%",
        left: "10%",
        width: "80%",
        height: "17%",
        text: "Update",
        textAlignment: SMF.UI.TextAlignment.CENTER,
        onPressed: pgAccount_btnUpdate_onPressed
    });

    var lblInfoText = new SMF.UI.Label({
        top: "86%",
        left: "10%",
        width: "80%",
        height: "8%",
        text: "Please use MCS dashboard to update your Email",
        textAlignment: SMF.UI.TextAlignment.TOP,
        font: new SMF.UI.Font({
            size: "6pt"
        })
    });
    cntAccountUpdate.add(txtFirstName);
    cntAccountUpdate.add(txtLastName);
    cntAccountUpdate.add(txtEmail);

    cntAccountUpdate.add(btnUpdate);
    cntAccountUpdate.add(lblInfoText);

    //Doruk cntActivityLog Begin
    var cntActivityLog = new SMF.UI.Container({
        top: "15%",
        left: "100%",
        width: "100%",
        height: "85%",
        borderWidth: 0,
        borderColor: "red",
        fillColor: "red",
        backgroundTransparent: false
    });


    var dataActivity = [
            {
                date: "10/09/2016 03:44 AM",
                summary: "Login"
        },
            {
                date: "10/07/2016 10:11 AM",
                summary: "Logout"
        },
            {
                date: "10/07/2016 1:17 PM",
                summary: "Login"
        },
            {
                date: "09/27/2016 2:43 PM",
                summary: "Logout"
        },
            {
                date: "09/29/2016 9:15 AM",
                summary: "Login"
        },
            {
                date: "09/29/2016 9:55 AM",
                summary: "Login"
        },
            {
                date: "09/30/2016 11:42 AM",
                summary: "Login"
        }
    ]
        // dataActivity.reverse();

    var rbActivity = new SMF.UI.RepeatBox({
        top: '0%',
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
        enablePullDownToRefresh: false,

    });

    //adding files to repeatbox's itemtemplate
    var lblActivityLog = new SMF.UI.Label({
        top: "20%",
        left: "10%",
        width: "80%",
        height: "60%",
        text: "",
        textAlignment: SMF.UI.TextAlignment.TOP,
        font: new SMF.UI.Font({
            size: "6pt"
        })
    });

    rbActivity.itemTemplate.height = Device.screenHeight / 12;
    rbActivity.itemTemplate.add(lblActivityLog);
    rbActivity.itemTemplate.fillColor = "#FFFFFF";

    //onRowRender will work for each item bound
    rbActivity.onRowRender = function(e) {
        this.controls[0].text = dataActivity[e.rowIndex].summary + " - " + dataActivity[e.rowIndex].date;
    };

    rbActivity.dataSource = dataActivity;
    rbActivity.refresh();
    cntActivityLog.add(rbActivity);


    //Doruk cntActivityLog End

    cntBottom.add(cntAccountUpdate);
    cntBottom.add(cntActivityLog);

    pgAccount.add(cntTop);
    pgAccount.add(cntBottom);

    const tabBar = new TabBar(cntBottom, cntAccountUpdate, cntActivityLog);

    /**
     * Creates action(s) that are run when the user press the key of the devices.
     * @param {KeyCodeEventArguments} e Uses to for key code argument. It returns e.keyCode parameter.
     * @this Pages.pgProfile
     */
    function pgAccount_onKeyPress(e) {
        if (e.keyCode === 4) {
            Pages.back();
        }
    }

    /**
     * Creates action(s) that are run when the page is appeared
     * @param {EventArguments} e Returns some attributes about the specified functions
     * @this Pages.pgProfile
     */
    function pgAccount_onShow() {
        //type your here code

        console.log("left:" + cntTop.left + ", top:" + cntTop.top + ", width:" + cntTop.width + ", height:" + cntTop.height);

        txtFirstName.text = pgAccount.myUserData.getFirstName();
        txtLastName.text = pgAccount.myUserData.getLastName();
        txtEmail.text = pgAccount.myUserData.getEmail();

        var headerBar = new HeaderBar();
        headerBar.init(Pages.currentPage);
        headerBar.setTitleView(Pages.currentPage, "Account", SMF.UI.Color.WHITE, null, 0, 0, 240, 44);

        if (Device.deviceOS !== "Android") {
            var itemBack = new SMF.UI.iOS.BarButtonItem({
                title: "Back",
                tintColor: "#FFFFFF",
                onSelected: function() {
                    Pages.back();
                }
            });

            Pages.currentPage.navigationItem.leftBarButtonItems = [itemBack]
        }

        if (Device.deviceOS == "iOS") {
            if (SMF.UI.iOS.NavigationBar.translucent == true) {
                cntTop.top = "64px";
                cntTop.left = "0px";
                cntTop.width = Device.screenWidth;
                cntTop.height = ((Device.screenHeight - 64) * 0.4);
            }
        }
    }

    function pgAccount_btnUpdate_onPressed(e) {
        Dialog.showWait();

        smfOracle.logAnalytics('pgAccount_btnUpdate_onPressed');

        if ((mcsUser) && (mcsPassword)) {
            var successCallback = function(e) {
                console.log(mcsUser + ' is authenticated');
                Dialog.showWait();

                var mcsFirstName = txtFirstName.text;
                var mcsLastName = txtEmail.text;

                if ((mcsFirstName) && (mcsLastName)) {
                    pgAccount.myUserData.setFirstName(mcsFirstName);
                    pgAccount.myUserData.setLastName(mcsLastName);

                    console.log('update starting -> ' + JSON.prune(pgAccount.myUserData));

                    var successCallback = function(e) {
                        smfOracle.logAndFlushAnalytics("user info updated for " + mcsUser)
                        Dialog.removeWait();
                        alert('User info updated');
                    };

                    var failureCallback = function(e) {
                        console.log('Update failed ');
                        Dialog.removeWait();
                        // alert(e);
                    }

                    smfOracle.updateCurrentUser(pgAccount.myUserData, successCallback, failureCallback)
                }
                else {
                    Dialog.removeWait();
                    alert('Please enter your first and lastname.');
                }
            };

            var failureCallback = function(e) {
                console.log(mcsUser + ' authentication failed ' + e);
                Dialog.removeWait();
                alert('Username or Password is incorrect, please try again');
            }

            smfOracle.authenticate(mcsUser, mcsPassword, successCallback, failureCallback)
        }
        else {
            Dialog.removeWait();
            alert('Your session is expired!');
            Pages.pgLogin.show(defaultPageAnimation);
        }

    }

})();
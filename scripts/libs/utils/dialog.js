/* globals*/
(function() {
    function Dialog() {
        if (!(this instanceof Dialog)) {
            return new Dialog();
        }
        var me = this;
        var pg;
        var cntAll = new SMF.UI.Container({
            top: "35%",
            left: "10%",
            height: "30%", //Device.screenHeight,
            width: "80%", // Device.screenWidth,
            borderWidth: 0,
            backgroundTransparent: true
        });

        var rectBg = new SMF.UI.Rectangle({
            alpha: 0.7,
            top: 0,
            left: 0,
            height: Device.screenHeight,
            width: Device.screenWidth,
            borderWidth: 0,
            backgroundTransparent: false,
            fillColor: "#000000",
            roundedEdge: 0,
            onTouchEnded: function(e) {
                //me.hide();
            }
        });
        cntAll.add(rectBg);

        this.show = function show(page) {
            page = page || new SMF.UI.Page();
            pg = page;
            page.add(cntAll);
            old_onKeyPressed_isSet = true;
            old_onKeyPressed = page.onKeyPress;
            page.onKeyPress = onKeyPressed;
        };

        function onKeyPressed(e) {
            if (e.keyCode === 4) {
                me.hide();
            }
            else {
                if (typeof old_onKeyPressed === "function")
                    old_onKeyPressed(e);
            }
        }

        this.hide = function hide() {
            if (!pg)
                return;
            pg.remove(cntAll);
            old_onKeyPressed_isSet = false;
            pg.onKeyPress = old_onKeyPressed;
        };

        this.overlay = new SMF.UI.Container({
            top: "15%",
            left: "30%",
            height: "70%",
            width: "40%",
            backgroundTransparent: false,
            fillColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#000000"
        });
        this.overlay.z = 10;

        cntAll.add(this.overlay);

        var old_onKeyPressed;
        var old_onKeyPressed_isSet = false;
    }

    global.Dialog = Dialog;

    var waitDialog = new SMF.UI.Container({
        top: "38.75565%",
        left: "16.66666%",
        height: "22.4887%",
        width: "66.66668%",
        borderWidth: 0,
        backgroundTransparent: true
    });
    
    var waitRectangle = new SMF.UI.Rectangle({
        alpha: 0.8,
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        borderWidth: 0,
        backgroundTransparent: false,
        fillColor: "#000000",
        roundedEdge: 10
    })
    waitDialog.add(waitRectangle);
    
    var waitActivityIndicator = new SMF.UI.ActivityIndicator({
        style: SMF.UI.ActivityIndicatorStyle.WHITELARGE,
    });
    
    waitActivityIndicator.z = 10;
    waitActivityIndicator.top = (waitDialog.height - waitActivityIndicator.height) / 2;
    waitActivityIndicator.left = (waitDialog.width - waitActivityIndicator.width) / 2;
    waitDialog.add(waitActivityIndicator);


    Dialog.showWait = function showWait(page) {
        page = page || Pages.currentPage;
        Dialog.removeWait(page);
        page.add(waitDialog);
        page.old_onKeyPress = page.onKeyPress;
        page.onKeyPress = nothing;
        //page.actionBar._enabled = page.actionBar.enabled;
        //page.navigationItem._enabled = page.navigationItem.enabled;
        //page.actionBar.enabled = page.navigationItem.enabled = false;
    };

    function nothing() {}

    Dialog.removeWait = function removeWait() {
        var parent = null;
        parent = waitDialog.parent;

        if (parent) {
            parent.remove(waitDialog);
            if (parent.old_onKeyPress) {
                parent.onKeyPress = parent.old_onKeyPress;
                parent.old_onKeyPress = null;
            }
            //parent.actionBar.enabled = parent.actionBar._enabled;
            //parent.navigationItem.enabled = parent.navigationItem._enabled;
        }
    };


})();
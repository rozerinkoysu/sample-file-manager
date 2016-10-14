/* globals */
(function() {
    function HeaderBar() {
        if (!(this instanceof HeaderBar)) {
            return new HeaderBar();
        }

        this.navigationItem = null;
        this.actionBar = null;
        this.isAndroid = Device.deviceOS == "Android" ? true : false; //A control variable to check the environment is Android Operating System
        this.leftItems = [];
        this.rightItems = [];
        
        //Initilaizes actionbar / navigation item for the page which is provided with the parameter
        this.init = function(page) {
            //Sets ActctionBar for Android
            if (this.isAndroid == true) {
                this.actionBar = page.actionBar;
                this.actionBar.visible = true;
                this.actionBar.backgroundColor = "#00a1f1";
                this.actionBar.alpha = "0.5";
            }
            else {
                //Sets NavigationITem for iOS
                this.navigationItem = page.navigationItem;
                SMF.UI.iOS.NavigationBar.visible = true;
                SMF.UI.iOS.NavigationBar.translucent = false;
                SMF.UI.iOS.NavigationBar.backgroundColor = "#00a1f1";
            }
        }


        this.initWithTitleAndBackground = function(page, image, color, titleText) {
            SMF.UI.statusBar.color = color;
            if (this.isAndroid == true) {
                this.actionBar = page.actionBar;
                this.actionBar.visible = true;
                this.actionBar.backgroundImage = image;
                this.actionBar.alpha = 1;
                this.actionBar.titleView = {
                    type: SMF.UI.TitleViewType.TEXT,
                    text: titleText,
                    textSize: 16,
                    textColor: "#FFFFFF",
                    alignment: SMF.UI.Alignment.CENTER,
                };
            }
            else {
                //Sets NavigationITem for iOS 
                this.navigationItem = page.navigationItem;

                this.navigationItem.titleView = {
                    type: SMF.UI.TitleViewType.TEXT,
                    frame: [0, 0, 320, 44], // left, top, width, height
                    text: titleText,
                    textColor: "#FFFFFF",
                    fontName: "Helvetica-Bold",
                    fontSize: 16,
                    alignment: SMF.UI.TextAlignment.CENTER
                }

                SMF.UI.iOS.NavigationBar.visible = true;
                SMF.UI.iOS.NavigationBar.backgroundImage = image;
                SMF.UI.iOS.NavigationBar.tintColor = "#FFFFFF";
                SMF.UI.iOS.NavigationBar.translucent = false;
            }
        }

        this.initWithBackground = function(page, bgImage) {
            SMF.UI.statusBar.color = "#C1392D";
            //Sets ActctionBar for Android
            if (this.isAndroid == true) {
                this.actionBar = page.actionBar;
                this.actionBar.visible = true;
                this.actionBar.backgroundImage = bgImage;
                this.actionBar.alpha = 1;

            }
            else {
                //Sets NavigationITem for iOS
                this.navigationItem = page.navigationItem;
                SMF.UI.iOS.NavigationBar.visible = true;
                SMF.UI.iOS.NavigationBar.backgroundImage = bgImage;
                SMF.UI.iOS.NavigationBar.tintColor = "#FFFFFF";
                SMF.UI.iOS.NavigationBar.translucent = false;
            }
        }

        //Sets the visitble Title text in ActibonBar/NavigationItem
        this.setTitle = function(title,textColor) {
            if (this.isAndroid == true) {
                this.actionBar.titleView = {
                    type: SMF.UI.TitleViewType.TEXT,
                    text: title,
                    textSize: 16,
                    textColor: textColor,
                    alignment: SMF.UI.Alignment.CENTER
                };
            }
            else {
                this.navigationItem.title = title;
            }
        }

        //sets headerbar's title text
        this.setTitleView = function(page, titleText, textColor, backgroundImage, left, top, width, height) {
            var _left = (left) ? left : 0;
            var _top = (top) ? top : 0;
            var _width = (width) ? width : 320;
            var _height = (height) ? height : 44;
            
            if (this.isAndroid == true) {
                this.actionBar = page.actionBar;
                this.actionBar.visible = true;
                if (backgroundImage)
                    this.actionBar.backgroundImage = backgroundImage;
                this.actionBar.alpha = 1;
                this.actionBar.titleView = {
                    type: SMF.UI.TitleViewType.TEXT,
                    text: titleText,
                    textSize: 16,
                    textColor: textColor,
                    alignment: SMF.UI.Alignment.CENTER,
                };
            }
            else {
                //Sets NavigationITem for iOS 
                this.navigationItem = page.navigationItem;

                this.navigationItem.titleView = {
                    type: SMF.UI.TitleViewType.TEXT,
                    frame: [_left, _top, _width, _height], // left, top, width, height
                    text: titleText,
                    textColor: textColor,
                    fontSize: 16,
                    alignment: SMF.UI.TextAlignment.CENTER
                }

                if (backgroundImage)
                    SMF.UI.iOS.NavigationBar.backgroundImage = backgroundImage;
                SMF.UI.iOS.NavigationBar.translucent = false;
            }
        }


        //Sets the button on right side of the title with the provided text
        this.setRightItemWithImageAndListener = function(image, onClicklistener) {
            if (Device.deviceOS == "iOS") {
                var rightItem = new SMF.UI.iOS.BarButtonItem({
                    image: image,
                    onSelected: onClicklistener
                });
                this.navigationItem.rightBarButtonItems = [rightItem];
            }
            else {
                var item = new SMF.UI.Android.MenuItem({
                    id: "1",
                    icon: image,
                    showAsAction: SMF.UI.Android.ShowAsAction.ALWAYS,
                    onSelected: onClicklistener,
                });
                this.actionBar.menuItems = [item];
            }
        }

        this.setRightItemText = function(_text, clickListener) {

            if (Device.deviceOS == "iOS") {
                var rightItem = new SMF.UI.iOS.BarButtonItem({
                    title: _text,
                    onSelected: clickListener
                });
                this.navigationItem.rightBarButtonItems = [rightItem];
            }
            else {
                var item = new SMF.UI.Android.MenuItem({
                    id: "1", // unique id for the item
                    title: _text,
                    showAsAction: SMF.UI.Android.ShowAsAction.ALWAYS,
                    onSelected: clickListener
                });
                this.actionBar.menuItems = [item];
            }
        }

        // Sets a pressible item to the left of the title
        this.setLeftItemImage = function(image, OnPressListener) {

            if (this.isAndroid == true) {


                this.actionBar.displayShowTitleEnabled = true;
                this.actionBar.title = "";
                this.actionBar.subtitle = "";
                this.actionBar.displayShowHomeEnabled = false;
                this.actionBar.homeAsUpIndicator = image;
                this.actionBar.displayHomeAsUpEnabled = true;
                this.actionBar.onHomeIconItemSelected = OnPressListener;


                /*
                this.actionBar.displayHomeAsUpEnabled = true;
                this.actionBar.displayShowHomeEnabled = false;
                this.actionBar.icon = image;
                this.actionBar.onHomeIconItemSelected = OnPressListener;
                */
            }
            else {
                var item1 = new SMF.UI.iOS.BarButtonItem({
                    image: image,
                    onSelected: OnPressListener
                });
                this.navigationItem.leftBarButtonItems = [item1];
            }
        }

        this.setLeftItem = function(func1, leftIcon, backOkVisible) {
            var key = {
                id: 0,
                image: leftIcon,
                // showAsAction : SMF.UI.Android.ShowAsAction.always, //Always place this item in the Action Bar. Avoid using this unless it's critical that the item always appear in the action bar. Setting multiple items to always appear as action items can result in them overlapping with other UI in the action bar.
                onSelected: func1
            };
            if (this.isAndroid == true) {
                this.actionBar.icon = leftIcon; //"back_ok.png";
                this.actionBar.displayHomeAsUpEnabled = backOkVisible; //false;
                this.actionBar.displayShowHomeEnabled = true;
                this.actionBar.onHomeIconItemSelected = func1;
            }
            else {
                var leftItem = new SMF.UI.iOS.BarButtonItem(key);
                this.navigationItem.leftBarButtonItems = [leftItem];
            }
        }
        this.setLeftItem2 = function(func2, leftIcon, backOkVisible) {
            var key = {
                id: 0,
                image: 'menu.png',
                // showAsAction : SMF.UI.Android.ShowAsAction.always, //Always place this item in the Action Bar. Avoid using this unless it's critical that the item always appear in the action bar. Setting multiple items to always appear as action items can result in them overlapping with other UI in the action bar.
                onSelected: func2
            };
            if (this.isAndroid == true) {
                this.actionBar.icon = leftIcon; //"back_ok.png";
                this.actionBar.displayHomeAsUpEnabled = backOkVisible; //false;
                this.actionBar.displayShowHomeEnabled = true;
                this.actionBar.onHomeIconItemSelected = func2;
            }
            else {
                var leftItem = new SMF.UI.iOS.BarButtonItem(key);
                this.navigationItem.leftBarButtonItems = [leftItem];
            }
        }

        // Sets a pressible item to the left of the title
        this.setLeftItem = function(func) {

            if (this.isAndroid == false) {
                var leftItem = new SMF.UI.iOS.BarButtonItem({
                    image: "navbar_back.png",
                    onSelected: func
                });
                this.navigationItem.leftBarButtonItems = [leftItem];
            }
            else {

                this.actionBar.icon = "navbar_back.png";
                this.actionBar.displayShowTitleEnabled = true;
                this.actionBar.title = "";
                this.actionBar.subtitle = "";
                this.actionBar.displayShowHomeEnabled = false;
                this.actionBar.displayHomeAsUpEnabled = true;
                this.actionBar.onHomeIconItemSelected = function() {
                    Pages.back();
                }

            }
        }

        // Sets a pressible item to the left of the title
        this.setLeftItemText = function(_text, func) {

            if (this.isAndroid == false) {
                this.actionBar.displayShowTitleEnabled = true;
                this.actionBar.title = _text;
                this.actionBar.displayHomeAsUpEnabled = false;
                this.actionBar.onHomeIconItemSelected = func
            }
            else {
                var item1 = new SMF.UI.iOS.BarButtonItem({
                    title: _text,
                    onSelected: func
                });
                this.navigationItem.leftBarButtonItems = [item1];

            }
        }

        // Sets a pressible item to the left of the title
        this.setLeftOnlyItemImage = function(image) {

            if (this.isAndroid == true) {
                this.actionBar.displayHomeAsUpEnabled = false;
                this.actionBar.displayShowHomeEnabled = true;
                this.actionBar.onHomeIconItemSelected = function() {}
                this.actionBar.icon = image;
            }
            else {
                var item1 = new SMF.UI.iOS.BarButtonItem({
                    image: image,
                });
                this.navigationItem.leftBarButtonItems = [item1];
            }
        }


    }

    global.HeaderBar = HeaderBar;
})();
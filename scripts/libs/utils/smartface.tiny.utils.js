/* globals */
(function() {
    String.prototype.left = function(n) {
        return this.substring(0, n);
    }
})();

function formatBytes(bytes, decimals) {
    if (bytes == 0) return '0 Byte';
    var k = 1000; // or 1024 for binary
    var dm = decimals || 2;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function createDialogBox() {
    var dialogBox = new SMF.UI.Container({
        name: "LoadingDialog",
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        fillColor: '#BBBBBB',
        backgroundTransparent: true,
        visible: false,

        onShow: function(e) {}
    });

    var rectBackground = new SMF.UI.Container({
        name: "mye",
        width: 0,
        height: 0,
        top: 0,
        left: 0,
    });

    rectBackground.top = "0%";
    rectBackground.left = "0%";
    rectBackground.width = "100%";
    rectBackground.height = "100%";
    rectBackground.fillColor = "#222222";
    rectBackground.backgroundTransparent = false;
    rectBackground.alpha = "90%";
    rectBackground.borderWidth = 0;


    var ai = new SMF.UI.ActivityIndicator();
    ai.style = SMF.UI.ActivityIndicatorStyle.WHITE;
    var ai_top = Device.screenHeight / 2 - ai.height / 2;
    var ai_left = Device.screenWidth / 2 - ai.width / 2;
    ai.left = ai_left;
    ai.top = ai_top;

    dialogBox.add(rectBackground);
    dialogBox.add(ai);

    return dialogBox;
}

function showDialogBox(targetPage, onDialogShow) {
    console.log('showDialogBox')
    if (targetPage.hasDialogBox !== true) {
        console.log('showDialogBox 2')
        var myDialogBox = createDialogBox();
        myDialogBox.visible = true;
        myDialogBox.onShow = onDialogShow;
        // prototype
        targetPage.add(myDialogBox);
        targetPage.hasDialogBox = true;
        targetPage.dialogBox = myDialogBox;
    }
    else {
        console.log('showDialogBox 3')
        var myDialogBox = targetPage.dialogBox;
        if (myDialogBox) {
            console.log('showDialogBox 4')
            myDialogBox.visible = true;
            myDialogBox.onShow = onDialogShow;
        }
    }
}

function hideDialogToBox(targetPage, onDialogBoxHide) {
    if (targetPage.hasDialogBox) {
        var myDialogBox = targetPage.dialogBox;
        if (onDialogBoxHide)
            myDialogBox.onHide = onDialogBoxHide;
        myDialogBox.visible = false;
    }
}

/* Animations */
var animationPush = {
    motionEase: SMF.UI.MotionEase.ACCELERATING,
    transitionEffect: SMF.UI.TransitionEffect.RIGHTTOLEFT,
    transitionEffectType: SMF.UI.TransitionEffectType.PUSH,
    fade: false,
    reset: false
};
var animationReveal = {
    motionEase: SMF.UI.MotionEase.ACCELERATING,
    transitionEffect: SMF.UI.TransitionEffect.RIGHTTOLEFT,
    transitionEffectType: SMF.UI.TransitionEffectType.REVEAL,
    fade: false,
    reset: false
};
var animationCover = {
    motionEase: SMF.UI.MotionEase.ACCELERATING,
    transitionEffect: SMF.UI.TransitionEffect.RIGHTTOLEFT,
    transitionEffectType: SMF.UI.TransitionEffectType.COVER,
    fade: false,
    reset: false
};

var defaultPageAnimation = {
    motionEase: SMF.UI.MotionEase.ACCELERATEANDDECELERATE,
    transitionEffect: SMF.UI.TransitionEffect.RIGHTTOLEFT,
    transitionEffectType: SMF.UI.TransitionEffectType.PUSH,
    fade: true,
    reset: false,
    duration: 300 //Device.deviceOS === "iOS" ? 300 : 600

}


function getFileTypeIcon(fileType) {

    if (fileType.left(5) == 'image') fileType = 'image';
    var imageFile = 'icon_generic.png';

    switch (fileType) {
        case 'application/pdf':
            imageFile = 'icon_pdf.png';
            break;
        case 'image':
            imageFile = 'icon_image.png';
            break;
        case 'text/plain':
            imageFile = 'icon_txt.png';
            break;
    }

    return imageFile;
}

//Captures an image from the Camera. It uses permissions.lib to handle permissions.
function getImageFromCamera(successCallback) {
    global.startCamera({
        cameraType: SMF.Multimedia.CameraType.REAR,
        resolution: SMF.Multimedia.Resolution.LARGE,
        autoFocus: true,
        onStart: function() {},
        onCapture: function(e) {

            //iOS "photoUri:/private/var/mobile/Containers/Data/Application/006D90C8-6E85-4AF8-8744-11419ACD4D8E/tmp/Camera/temp_dwnMx_04102016192352171.jpeg"
            //Android "content://io.smartface.SmartfaceApp.provider/external_files/Android/data/io.smartface.SmartfaceApp/cache/_tmp/Camera/1475789593626.jpg"

            var myPath = SMF.IO.applicationTemporaryData + SMF.IO.pathSeparator + "Camera/" + e.photoUri.replace(/^.*[\\\/]/, '');
            var bitmap = new SMF.Bitmap(myPath);
            var blobData = bitmap.getBlob();

            var selectedFile = {};
            selectedFile.file = e.photoUri;
            selectedFile.fileName = e.photoUri.replace(/^.*[\\\/]/, '').replace('temp', 'camera');

            selectedFile.type = "image/jpeg";
            selectedFile.size = 0;
            selectedFile.width = 0;
            selectedFile.height = 0;

            // console.log(blobData.toBase64String());
            selectedFile.blobData = blobData;

            // console.log("selectedFile" + JSON.prune(selectedFile));
            var localNotification = new Notifications.LocalNotification({
                id: 2,
                fireDate: Date.now() + 3000,
                alertTitle: "Upload started",
                alertBody: "We're uploading your file at background.",
                alertAction: "We're uploading your file at background.", //ios
                smallIcon: "icon16.png",
            });

            Notifications.local.presentNotification(localNotification);

            successCallback(selectedFile);

        },
        onCancel: function() {},
        onFailure: function() {},
        done: function(err) {
            if (err) return alert(err);
        }
    });
}

//Gets a picture from OS Gallery. It uses permissions.lib to handle permissions.
function getImageFromGallery(successCallback) {
    global.pickFromGallery({
        type: [SMF.Multimedia.MediaType.IMAGE, SMF.Multimedia.MediaType.MOVIE, SMF.Multimedia.MediaType.SOUND],
        onSuccess: function(e) {
            console.log("file from gallery:" + JSON.prune(e));
            var selectedFile = {};
            selectedFile.file = e.file;
            selectedFile.fileName = Device.deviceOS == "Android" ? e.filename : "gallery_" + Date.now() + ".jpg";

            if (Device.deviceOS == 'Android') {
                var ext = e.file.substr(e.file.lastIndexOf('.') + 1);
                switch (ext) {
                    case 'jpg':
                        selectedFile.type = "image/jpg";
                        break;
                    case 'jpeg':
                        selectedFile.type = "image/jpeg";
                        break;
                    case 'png':
                        selectedFile.type = "image/png";
                }
            }
            else {
                selectedFile.type = e.type == null ? "image/jpeg" : e.type;
            }
            
            selectedFile.size = e.size == null ? 0 : e.size;
            selectedFile.width = e.width == null ? 0 : e.width;
            selectedFile.height = e.height == null ? 0 : e.height;

            //Android "{"file":"/storage/emulated/0/DCIM/Camera/IMG_20160911_222446.jpg","filename":"IMG_20160911_222446.jpg","size":4088710,"type":0,"width":"","height":""}"
            //iOS "{"filename":"assets-library://asset/asset.PNG?id=30E36AE5-C652-401C-8C2B-5829CCCABC3C&ext=PNG","file":"assets-library://asset/asset.PNG?id=30E36AE5-C652-401C-8C2B-5829CCCABC3C&ext=PNG"}"

            // var file = Device.deviceOS == "Android" ? new SMF.IO.File(e.filename) : new SMF.IO.File(SMF.IO.applicationDataDirectory,  e.filename);
            console.log("File to be opened: " + selectedFile.file);

            var blobData;
            if (Device.deviceOS == "Android") {
                var galFile = new SMF.IO.File(selectedFile.file);
                var streamReader = galFile.openStream(SMF.IO.StreamType.READ);
                blobData = streamReader.readBlob();
                streamReader.close();

                selectedFile.blobData = blobData;

                successCallback(selectedFile);
            }
            else {
                var bitmap = new SMF.Bitmap({
                    imageUri: e.file,
                    onSuccess: function(e) {
                        blobData = e.getBlob();

                        //console.log(blobData.toBase64String());
                        selectedFile.blobData = blobData;

                        //"selectedFile{"file":"assets-library://asset/asset.JPG?id=E90C7CC7-BE69-4DA4-8F56-0269F2D38279&ext=JPG","fileName":"image.png"}"
                        // "selectedFile{"file":"/storage/emulated/0/DCIM/Camera/IMG_20160910_215129.jpg","fileName":"IMG_20160910_215129.jpg","type":0,"size":3188475,"width":"","height":"","blobData":{"size":3188475,"type":""}}"
                        // console.log("selectedFile" + JSON.prune(selectedFile));

                        // return selectedFile;
                        var localNotification = new Notifications.LocalNotification({
                            id: 1,
                            fireDate: Date.now() + 3000,
                            alertTitle: "Upload started",
                            alertBody: "We're uploading your file at background.",
                            alertAction: "We're uploading your file at background.", //ios
                            smallIcon: "icon16.png",
                        });

                        Notifications.local.presentNotification(localNotification);

                        successCallback(selectedFile);
                    },
                    onError: function(e) {
                        alert("There was an error while picking from gallery. Please try again.");
                    }
                });
            }
        },
        onCancel: function(e) {
            // alert("cancelled");
        },
        onError: function(e) {
            alert("There was an error while picking from gallery. Please try again.");
        },
        done: function(err) {
            if (err) return alert(err);
        }
    });
}

//http://stackoverflow.com/a/14638191
Date.prototype.format = function (format, utc){
    return formatDate(this, format, utc);
};
function formatDate(date, format, utc) {
    var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    function ii(i, len) {
        var s = i + "";
        len = len || 2;
        while (s.length < len) s = "0" + s;
        return s;
    }

    var y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
    format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, "$1" + y);

    var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
    format = format.replace(/(^|[^\\])M/g, "$1" + M);

    var d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
    format = format.replace(/(^|[^\\])d/g, "$1" + d);

    var H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
    format = format.replace(/(^|[^\\])H/g, "$1" + H);

    var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
    format = format.replace(/(^|[^\\])h/g, "$1" + h);

    var m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
    format = format.replace(/(^|[^\\])m/g, "$1" + m);

    var s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
    format = format.replace(/(^|[^\\])s/g, "$1" + s);

    var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, "$1" + f);

    var T = H < 12 ? "AM" : "PM";
    format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
    format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

    var t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
    format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

    var tz = -date.getTimezoneOffset();
    var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
    if (!utc) {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, "$1" + K);

    var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
    format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

    format = format.replace(/\\(.)/g, "$1");

    return format;
};
/* globals HeaderBar*/
/*
Smartface Fileviewer lib.
You can easily pass your file path to the openDocument() and see it in a viewer.
Fileviewer will dynamically create a new viewer page and will show the file according to extension.
*/

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

	namespace("SMF.Utils");
})();


SMF.Utils.Fileviewer = function() {
	var self = this;

	self.openDocument = function(filePath) {
		var ext = filePath.substr(filePath.lastIndexOf('.') + 1);
		console.log(ext);
		if ((Device.deviceOS == "Android") && (ext == "pdf"))
			ext = "pdf.android";
		switch (ext) {
			case 'doc':
			case 'docx':
			case 'ppt':
			case 'pptx':
			case 'xls':
			case 'xlsx':
			case 'doc':
			case 'pdf':
				console.log("self.showOfficeFile(filePath);");
				self.showOfficeFile(filePath);
				break;
			case 'tif':
			case 'tiff':
			case 'jpg':
			case 'jpeg':
			case 'png':
			case 'bmp':
				console.log("self.showImageFile(filePath);");
				self.showImageFile(filePath);
				break;
			case 'txt':
			case 'pdf.android':
				self.showWebBasedFile(filePath);
				break;
			default:
				alert("Can't open the file. File type is not supported.");
		}
	}

	self.showImageFile = function(filePath) {
		var img = new SMF.UI.Image({
			image: filePath,
			top: '0%',
			left: '0%',
			width: '100%',
			height: '100%',
			imageFillType: SMF.UI.ImageFillType.ASPECTFIT,
			enableZoom: true,
			enableScroll: true,
			enableCache: true
		});

		var pgImageViewer = new SMF.UI.Page({
			name: "pgImageViewer",
			onKeyPress: pageKeyPress,
			onShow: pageOnShow,
			backgroundImage: 'stripe.png'
		});

		pgImageViewer.add(img);
		pgImageViewer.show(defaultPageAnimation);
	}

	self.showOfficeFile = function(filePath) {
		if (Device.deviceOS == 'iOS') {
			var quickLook = new SMF.UI.iOS.QuickLook();
			quickLook.document = filePath;
			quickLook.navigationBarImage = "00a1f1.png";
			quickLook.show();
		}
		else {
			alert("Viewing office documents are not supported in Android");
		}
	}

	self.showWebBasedFile = function(filePath) {
		console.log(filePath);
		var wvWebBasedViewer = new SMF.UI.WebView({
			url: filePath,
			top: '0%',
			left: '0%',
			width: '100%',
			height: '100%'
		});

		var pgWebBasedViewer = new SMF.UI.Page({
			name: "pgWebBasedViewer",
			onKeyPress: pageKeyPress,
			onShow: pageOnShow,
			backgroundImage: 'stripe.png'
		});
		pgWebBasedViewer.add(wvWebBasedViewer);
		pgWebBasedViewer.show(defaultPageAnimation);
	}

	return self;

	function pageKeyPress(e) {
		if (e.keyCode === 4) {
			Pages.back();
		}
	}

	function pageOnShow(e) {
		var headerBar = new HeaderBar();
		headerBar.init(Pages.currentPage);
		headerBar.setTitleView(Pages.currentPage, "Viewer", SMF.UI.Color.WHITE, null, 0, 0, 240, 44);

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
	}
};

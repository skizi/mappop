
/****************************************************************/
//UserAgent
/****************************************************************/

export default class UserAgent{

	constructor(){

		var ua = navigator.userAgent.toLowerCase();
		var ver = window.navigator.appVersion.toLowerCase();
		var browser = '';
		var ieVer = 9999;
		if (ua.indexOf("msie") != -1){
			browser = 'ie';
	        if (ver.indexOf("msie 6.") != -1){
	            ieVer = 6;
	        }else if (ver.indexOf("msie 7.") != -1){
	            ieVer = 7;
	        }else if (ver.indexOf("msie 8.") != -1){
	            ieVer = 8;
	        }else if (ver.indexOf("msie 9.") != -1){
	            ieVer = 9;
	        }else if (ver.indexOf("msie 10.") != -1){
	            ieVer = 10;
	        }
	    }else if(ua.indexOf('trident/7') != -1){
	        browser = 'ie';
	        ieVer = 11;
	    }else if (ua.indexOf('chrome') != -1) {
		    browser = 'chrome';
		} else if (ua.indexOf('safari') != -1) {
		    browser = 'safari';
		} else if (ua.indexOf('firefox') != -1) {
		    browser = 'firefox';
		} else if (ua.indexOf('opera') != -1) {
		    browser = 'opera';
		}

		ua = navigator.userAgent;
		var twitterFlag = false;
		if (ua.search(/Twitter/) != -1)
		    twitterFlag = true;
		var platform = 'pc';
		if (ua.search(/iPhone/) != -1) {
		    platform = "sp";
		} else if ((ua.search(/Android/) != -1) && (ua.search(/Mobile/) != -1)) {
		    platform = "sp";
		} else if ((ua.search(/iPad/) != -1) || (ua.search(/Android/) != -1)) {
		    platform = "ipad";
		}

		this.browser = browser;
		this.ieVer = ieVer;
		this.platform = platform;
	
	

		this.isAndroid = (navigator.userAgent.search(/Android/)> 0)?true:false;
		this.androidVersion = -1;
		if( this.isAndroid ) this.androidVersion = parseFloat(ua.slice(ua.indexOf("Android")+8));
		
		this.is_iOS = (navigator.userAgent.search(/iPhone/)> 0 || navigator.userAgent.search(/iPod/)> 0 || navigator.userAgent.search(/iPad/)> 0)?true:false;
		this.iosVersion = -1;
		if( this.is_iOS ){
			var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);  
	        this.iosVersion = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
		}
	}


}





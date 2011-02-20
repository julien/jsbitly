/**
 * bitly.js: a simple script to utilize the 
 * http://bit.ly service in your HTML/JavaScript code
 *
 * free to use, distribute, modify ... 
 * comes with no waranty or license.
 *
 * @author: jcastelain <jcastelain@gmail.com>
 * @version: 0.0.1 
 **/
var BITLY;
if(!BITLY) {
	BITLY = {};
}

(function() {
	"use strict";
	
	var _login;
	var _apiKey;
	var _validated = false;
	
	var createRequest = function () {
		var xhr;
		if(window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else if(window.ActiveXObject) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
		return xhr;
	}
	
	var load = function(url, handler) {
		var xhr = createRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange =  function() {
			if(xhr.readyState == 4) {  
				if(xhr.status == 200) {
					if(handler == undefined) {
						return;
					} else {
						handler.apply(null, [this]);
					}
				}
			 }   
		};
		xhr.send();
	}
	
	var validResponse = function(obj) {
		if(obj.status_code === 200 && obj.status_txt === "OK")
			return true;
		else
			return false;
	}
	
	// public  
	
	
	if(typeof BITLY.FORMAT_JSON === "undefined") {
		BITLY.FORMAT_JSON = "json";
	}
	if(typeof BITLY.FORMAT_XML === "undefined") {
		BITLY.FORMAT_XML = "json";
	}
	
	if(typeof BITLY.validated !== "function") {
		BITLY.validated = function() {
			return _validated;
		}
	}
	
	if(typeof BITLY.initialize !== "function") {
		BITLY.initialize = function(login, apiKey) {
			_login = login;
			_apiKey = apiKey; 
		}
	}
	
	// api methods
	if(typeof BITLY.validate !== "function") {
		BITLY.validate = function(login, apiKey) {
			_login = login;
			_apiKey = apiKey; 
			var url = "http://api.bitly.com/v3/validate";
			url = url.concat("?format=").concat(BITLY.FORMAT_JSON);
			url = url.concat("&x_login=").concat(_login);
			url = url.concat("&login=").concat(_login);
			url = url.concat("&x_apiKey=").concat(_apiKey);
			url = url.concat("&apiKey=").concat(_apiKey);
			load(url, function(xhr) {
				var obj = new Function("return" + xhr.responseText)();
			    if(validResponse(obj)) {
					if(obj.data && obj.data.valid)	{
						if(obj.data.valid == 1) {
							_validated = true;
						} else {
							_validated = false;
						}
					}
				}
			});
		}
	}
	
	if(typeof BITLY.shorten !== "function") {
		BITLY.shorten = function(longUrl, handler) {
			if(!_login || !_apiKey) 
				throw new Error("Please set a login and apiKey before using bit.ly");
			
			var url = "http://api.bitly.com/v3/shorten";
		    url = url.concat("?login=").concat(_login);
		    url = url.concat("&apiKey=").concat(_apiKey);
		    url = url.concat("&format=").concat(BITLY.FORMAT_JSON);
		    url = url.concat("&longUrl=").concat(longUrl);
		
			load(url, function(xhr) {
				var obj = new Function("return" + xhr.responseText)();
			    if(validResponse(obj)) {
					console.log(obj.data);
					if(handler !== undefined) {
						handler.apply(null, [obj.data]);
					}
				}
			});
		}
	}
	
	// ["http://bit.ly/hFJFb5", "http://bit.ly/hXEEpS"];
	if(typeof BITLY.expand !== "function") {
		BITLY.expand = function(shortUrl, handler) {
			if(!_login || !_apiKey) 
				throw new Error("Please set a login and apiKey before using bit.ly");
			
			var url = "http://api.bitly.com/v3/expand";
		    url = url.concat("?login=").concat(_login);
		    url = url.concat("&apiKey=").concat(_apiKey);
		    url = url.concat("&format=").concat(BITLY.FORMAT_JSON);
		
			if(typeof shortUrl === "string") {
				url = url.concat("&shortUrl=").concat(shortUrl); 
			} else if(typeof shortUrl === "object" && shortUrl.constructor === Array) {
				for(var i = 0; i < 15; i++) {
					if(shortUrl[i])
						url = url.concat("&shortUrl=").concat(shortUrl[i]);
				}
			}
			
			load(url, function(xhr) {
				var obj = new Function("return" + xhr.responseText)();
			    if(validResponse(obj)) {
					console.log(obj);
					var results = [];       
					
					if(!obj.hasOwnProperty("data"))
						return;
					
					if(!obj.data.hasOwnProperty("expand"))
						return;
					
					for(var i = 0; i < obj.data.expand.length; i++){
						if(obj.data.expand[i]) {
							results[i] = obj.data.expand[i];
						}
					}
					if(handler !== undefined) {
						handler.apply(null, [results]);
					}
				}
			});
		}
	} 
	
	if(typeof BITLY.clicks !== "function") {
		BITLY.clicks = function(shortUrl, handler) {
			if(!_login || !_apiKey) 
				throw new Error("Please set a login and apiKey before using bit.ly");
			
			var url = "http://api.bitly.com/v3/clicks";
		    url = url.concat("?login=").concat(_login);
		    url = url.concat("&apiKey=").concat(_apiKey);
		    url = url.concat("&format=").concat(BITLY.FORMAT_JSON);
		
			if(typeof shortUrl === "string") {
				url = url.concat("&shortUrl=").concat(shortUrl); 
			} else if(typeof shortUrl === "object" && shortUrl.constructor === Array) {
				for(var i = 0; i < 15; i++) {
					if(shortUrl[i])
						url = url.concat("&shortUrl=").concat(shortUrl[i]);
				}
			}
			
			load(url, function(xhr) {
				var obj = new Function("return" + xhr.responseText)();
			    if(validResponse(obj)) {
					console.log(obj);
					var results = [];       
					
					if(!obj.hasOwnProperty("data"))
						return;
					
					if(!obj.data.hasOwnProperty("clicks"))
						return;
					
					for(var i = 0; i < obj.data.clicks.length; i++){
						if(obj.data.clicks[i]) {
							results[i] = obj.data.clicks[i];
						}
					}
					if(handler !== undefined) {
						handler.apply(null, [results]);
					}
				}
			});
			
		}
	}
	
	if(typeof BITLY.referrers !== "function") {
		BITLY.referrers = function(shortUrl, handler) {
			if(!_login || !_apiKey) 
				throw new Error("Please set a login and apiKey before using bit.ly");
			
			var url = "http://api.bitly.com/v3/referrers";
		    url = url.concat("?login=").concat(_login);
		    url = url.concat("&apiKey=").concat(_apiKey);
		    url = url.concat("&format=").concat(BITLY.FORMAT_JSON);
		
			if(typeof shortUrl === "string") {
				url = url.concat("&shortUrl=").concat(shortUrl); 
			} else if(typeof shortUrl === "object" && shortUrl.constructor === Array) {
				for(var i = 0; i < 15; i++) {
					if(shortUrl[i])
						url = url.concat("&shortUrl=").concat(shortUrl[i]);
				}
			}
			
			load(url, function(xhr) {
				var obj = new Function("return" + xhr.responseText)();
			    if(validResponse(obj)) {
					if(!obj.hasOwnProperty("data"))
						return;
					if(handler !== undefined) {
						handler.apply(null, [obj.data]);
					}
				}
			});
			
		}
	}
	
	if(typeof BITLY.countries !== "function") {
		BITLY.countries = function(shortUrl, handler) {
			if(!_login || !_apiKey) 
				throw new Error("Please set a login and apiKey before using bit.ly");
			
			var url = "http://api.bitly.com/v3/countries";
		    url = url.concat("?login=").concat(_login);
		    url = url.concat("&apiKey=").concat(_apiKey);
		    url = url.concat("&format=").concat(BITLY.FORMAT_JSON);
		
			if(typeof shortUrl === "string") {
				url = url.concat("&shortUrl=").concat(shortUrl); 
			} else if(typeof shortUrl === "object" && shortUrl.constructor === Array) {
				for(var i = 0; i < 15; i++) {
					if(shortUrl[i])
						url = url.concat("&shortUrl=").concat(shortUrl[i]);
				}
			}
			
			load(url, function(xhr) {
				var obj = new Function("return" + xhr.responseText)();
			    if(validResponse(obj)) {
					if(!obj.hasOwnProperty("data"))
						return;
					if(handler !== undefined) {
						handler.apply(null, [obj.data]);
					}
				}
			});
			
		}
	}

	if(typeof BITLY.clicksByMinute !== "function") {
		BITLY.clicksByMinute = function(shortUrl, handler) {
			if(!_login || !_apiKey) 
				throw new Error("Please set a login and apiKey before using bit.ly");
			
			var url = "http://api.bitly.com/v3/clicks_by_minute";
		    url = url.concat("?login=").concat(_login);
		    url = url.concat("&apiKey=").concat(_apiKey);
		    url = url.concat("&format=").concat(BITLY.FORMAT_JSON);
		
			if(typeof shortUrl === "string") {
				url = url.concat("&shortUrl=").concat(shortUrl); 
			} else if(typeof shortUrl === "object" && shortUrl.constructor === Array) {
				for(var i = 0; i < 15; i++) {
					if(shortUrl[i])
						url = url.concat("&shortUrl=").concat(shortUrl[i]);
				}
			}
			
			load(url, function(xhr) {
				var obj = new Function("return" + xhr.responseText)();
			    if(validResponse(obj)) {
					if(!obj.hasOwnProperty("data"))
						return;
					if(handler !== undefined) {
						handler.apply(null, [obj.data]);
					}
				}
			});
			
		}
	}
	
	if(typeof BITLY.clicksByDay !== "function") {
		BITLY.clicksByDay = function(shortUrl, days, handler) {
			if(!_login || !_apiKey) 
				throw new Error("Please set a login and apiKey before using bit.ly");
			
			if(days === undefined)
				days = 0;
			
			if(days > 30)
				days = 30;
			
			var url = "http://api.bitly.com/v3/clicks_by_day";
		    url = url.concat("?login=").concat(_login);
		    url = url.concat("&apiKey=").concat(_apiKey);
		    url = url.concat("&days=").concat(days);
		    url = url.concat("&format=").concat(BITLY.FORMAT_JSON);
		
			if(typeof shortUrl === "string") {
				url = url.concat("&shortUrl=").concat(shortUrl); 
			} else if(typeof shortUrl === "object" && shortUrl.constructor === Array) {
				for(var i = 0; i < 15; i++) {
					if(shortUrl[i])
						url = url.concat("&shortUrl=").concat(shortUrl[i]);
				}
			}
			
			load(url, function(xhr) {
				var obj = new Function("return" + xhr.responseText)();
			    if(validResponse(obj)) {
					if(!obj.hasOwnProperty("data"))
						return;
					if(handler !== undefined) {
						handler.apply(null, [obj.data]);
					}
				}
			});
			
		}
	}
	
	// utility methods
	if(typeof BITLY.printExpanded !== "function") {
		BITLY.printExpanded = function(results) {
			if(typeof results !== "object" || results.constructor !== Array)
				throw new Error("Expected an Array got " + results.constructor);
			
			var s = "";
			for(var i = 0; i < results.length; i++) {
				s += BITLY.expandedToString(results[i]);
			}   
			return s;
		}
	}
	
	if(typeof BITLY.expandedToString !== "function") {
		BITLY.expandedToString = function(obj) {
			if(typeof results !== "object")
				throw new Error("Expected an Object got " + results.constructor);
			
			var s = "";
			for(var i in obj) {
				s += i + " : " + obj[i] + " \n";
			}
			return s;
		}
	}
}());

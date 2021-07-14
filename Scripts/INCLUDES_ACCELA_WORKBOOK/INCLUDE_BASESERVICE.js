/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_BASESERVICE.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: YTITI
| Created at	: 22/07/2018 17:21:57
|
/------------------------------------------------------------------------------------------------------*/

function run() {
	try {
		var action = param("action", true);
		
		aa.print("action: " + action);
		java.lang.System.out.println("action: " + action);
		
		// source can be mobile or admin
//		var source = param("source", true);
//		var lang = param("lang");
//		if (!lang) {
//			lang = "en_US";
//		}
//		
//		var mobileUserId = "";
//		
//		if (source == "mobile") {
//			var token = param("token", true);
//			mobileUserId = getUserId(token);
//		}
//		var content = eval("cmd_" + action + "('" + mobileUserId + "','" + lang + "')");
	
		var content = eval("cmd_" + action + "()");
		
		aa.env.setValue("success", true);
		aa.env.setValue("message", action + " executed successfully");
		if (content) {
			aa.env.setValue("content", buildResponseStructure(content));
		} else {
			aa.env.setValue("content", "Success");
		}
		aa.env.setValue("ScriptReturnCode", "0");
	} catch (e) {
		aa.print("ERRR# " + e);
		java.lang.System.out.println("ERRR# " + e);
		aa.env.setValue("success", false);
		aa.env.setValue("message", String(e));
		aa.env.setValue("ScriptReturnCode", "-1");
	}
}

function param(param, isRequired, getNative) {
	var val = aa.env.getValue(param);
	if (!val || String(val) == "") {
		val = aa.env.getValue('"'+param+'"');
	}
	if (!val || String(val) == "") {
		if (isRequired) {
			throw "Missing required parameter " + param;
		}
		return "";
	}
	
	return toJson(getNative?val:getRequestStructure(val));
}

function logDebug(msg){
	aa.print(msg);
	java.lang.System.out.println(msg);
}

function printJson(title, json){
	try{
		logDebug(title + ": " + JSON.stringify(json));
	}catch(e){
		logDebug(title + ": " + json);
	}
}

function toJson(obj) {
    try {
        return JSON.parse(obj);
    } catch (e) {
        return obj;
    }
}


// returns the result as proper JSON structure when called by construct API
function buildResponseStructure(value) {
	if (value) {
		if (Object.prototype.toString.call(value) == "[object Object]") {
			value = buildObjectResponse(value);
		} else if (Object.prototype.toString.call(value) === '[object Array]') {
			value = buildArrayResponse(value);
		} else {
			value = String(value);
		}
	}
	return value;
}

function buildObjectResponse(obj) {
	var table = aa.util.newHashMap();
	for ( var p in obj) {
		if (obj.hasOwnProperty(p)) {
			var value = obj[p];
			table.put(obj[p], buildResponseStructure(value));
		}
	}
	return obj;
}

function buildArrayResponse(arr) {
	var arrList = aa.util.newArrayList();
	for (var i = 0; i < arr.length; i++) {
		arrList.add(buildResponseStructure(arr[i]));
	}
	return arrList;
}

// the request structure is received as Java LinkedHashMap and ArrayList, this functions converts them into Javascript objects and arrays for easier access
function getRequestStructure(mp) {
	if (mp == null) {
		return "";
	}
	if (mp.getClass().toString().equals("class java.util.LinkedHashMap") || mp.getClass().toString().equals("class java.util.HashMap")) {
		return hashMapToObject(mp);		
	} else if (mp.getClass().toString().equals("class java.util.ArrayList")) {
		return arrayListToArr(mp);
	} else {
		return String(mp);
	}
}

function hashMapToObject(mp) {
	var obj = {
	};
	var it = mp.entrySet().iterator();
    while (it.hasNext()) {
        var pair = it.next();
        obj[String(pair.getKey())] = getRequestStructure(pair.getValue());
    }
    return obj;
}

function arrayListToArr(mp) {
	var arr = [];
	for (var i = 0; i < mp.size(); i++) {
		arr.push(getRequestStructure(mp.get(i)));
	}
	
	return arr;
}

function getUserId(token) {
	var ssoSystemId = com.accela.util.AVProperties.getProperty("sso.system.id");
	var authBusiness = aa.proxyInvoker.newInstance("com.accela.security.AuthenticationBusiness", [ssoSystemId]).getOutput();

	var authObj;
	try {
		authObj = authBusiness.authenticate("", token);
	} catch (e) {
		throw "Invalid mobile user token";
	}
	
	if (!authObj) {
		throw "Invalid mobile user token";
	}
	
	if (authObj.getUserOrganizationId() != aa.getServiceProviderCode()) {
		throw "Invalid mobile user token. Agency mismatch " + authObj.getUserOrganizationId() + "/" + aa.getServiceProviderCode();
	}
	
	return authObj.getUserId();
}
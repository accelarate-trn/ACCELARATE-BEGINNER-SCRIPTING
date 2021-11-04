/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_GITHUB.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MHASHAIKEH
| Created at	: 07/10/2021 15:02:49
|
/------------------------------------------------------------------------------------------------------*/
function HTTPAPI() {
}

HTTPAPI.post = function(url, body, headers, responseType) {
	return HTTPAPI.send("POST", url, body, headers, responseType);
}

HTTPAPI.put = function(url, body, headers, responseType) {
	return HTTPAPI.send("PUT", url, body, headers, responseType);
}

HTTPAPI.get = function(url, headers, responseType) {
	return HTTPAPI.send("GET", url, "", headers, responseType);
}

HTTPAPI.send = function(operation, url, body, headers, responseType) {
	var output = {};
	var conn = null;
	if (HTTPAPI.isBlankOrNull(url)) {
		throw "Failed to send HTTP request, url is missing";
	}

	if (HTTPAPI.isBlankOrNull(operation)) {
		throw "Failed to send HTTP request, operation type is missing";
	}

	if (HTTPAPI.isBlankOrNull(body)) {
		body = "";
	}

	try {
		conn = new Packages.java.net.URL(url).openConnection();
		conn.setRequestMethod(operation);
		
		conn.setRequestProperty("Accept-Charset", "UTF-8");
		conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

		if (headers) {
			for ( var key in headers) {
				if (headers.hasOwnProperty(key)) {
					conn.setRequestProperty(key, headers[key]);
				}
			}
		}

		if (operation === "POST" || operation === "PUT") {
			conn.setDoOutput(true);
			
			if (typeof body == "string") {
				body = new java.lang.String(body);
			}
			var os = conn.getOutputStream();
			os.write(body.getBytes());
			os.flush();
		}
		

		output["status"] = conn.getResponseCode();
		output["headers"] = HTTPAPI.hashMapToObject(conn.getHeaderFields())

		var inputStream;
		if (output["status"] >= 200 && output["status"] < 300) {
			inputStream = conn.getInputStream();
		} else {
			inputStream = conn.getErrorStream();
		}

		if (responseType == "bytes") {
			output["response"] = HTTPAPI.readInputStream(inputStream);
		} else {

			var br = new Packages.java.io.BufferedReader(new Packages.java.io.InputStreamReader((inputStream)));
			var response = "";
			var line;
			while ((line = br.readLine()) != null) {
				response += line;
			}
			output["response"] = response;
		}
	} catch (e) {
		throw e;
	} finally {
		if (conn) {
			conn.disconnect();
		}
		
	}
	return output;

}

HTTPAPI.readInputStream = function(is) {
	var byteRead;
	var output = new Packages.java.io.ByteArrayOutputStream();
	while ((byteRead = is.read()) != -1) {
		output.write(byteRead);
	}
	return output.toByteArray();
}

HTTPAPI.hashMapToObject = function(mp) {
	var obj = {
	};
	var it = mp.entrySet().iterator();
    while (it.hasNext()) {
        var pair = it.next();
        obj[String(pair.getKey())] = String(pair.getValue());
    }
    return obj;
}

HTTPAPI.isBlankOrNull = function(object) {
	return (object == null || object == "");
}

function GitHub(username, password, repo) {
	javaLog("...............GitHub...............");
	
	if(!username || !password || !repo){
		return
	}else{
		java.lang.System.setProperty("https.protocols", "TLSv1,TLSv1.1,TLSv1.2");
		this.username = username;
		this.password = password;
		this.repo = repo;
		this.auth = "Basic " + GitHub.base64Encode(username + ":" + password);
	}
}

GitHub.prototype.constructor = GitHub;

GitHub.base64Encode = function(str) {
	return javax.xml.bind.DatatypeConverter.printBase64Binary(new java.lang.String(str).getBytes(java.nio.charset.StandardCharsets.UTF_8));
}

GitHub.prototype.readFile = function(path) {
	try{
		aa.print('URI: \n' + "https://api.github.com/repos/" + this.repo + "/contents/" + path);
		var res = HTTPAPI.get("https://api.github.com/repos/" + this.repo + "/contents/" + path, {"Authorization": this.auth})
		res["response"] = JSON.parse(res["response"]);
		return res;
	}catch(e){
		javaLog("ERRREE: " + e);
		return null;
	}
}

GitHub.prototype.readFileBySHA = function(path, sha) {
	try{
		aa.print('URI: \n' + "https://api.github.com/repos/" + this.repo + "/contents/" + path + "?ref=" + sha);
		var res = HTTPAPI.get("https://api.github.com/repos/" + this.repo + "/contents/" + path + "?ref=" + sha, {"Authorization": this.auth})
		res["response"] = JSON.parse(res["response"]);
		return res;
	}catch(e){
		javaLog("ERRREE: " + e);
		return null;
	}
}

GitHub.prototype.readFileComments = function(path) {
	try{
		aa.print('URI: \n' + "https://api.github.com/repos/" + this.repo + "/commits?path=" + path);
		var res = HTTPAPI.get("https://api.github.com/repos/" + this.repo + "/commits?path=" + path, {"Authorization": this.auth})
		res["response"] = JSON.parse(res["response"]);
		
		var result = [];
		
		for(var r in res["response"]){
			var item = {};
			item["sha"] =  res["response"][r]["sha"];
			item["date"] =  res["response"][r]["commit"]["author"]["date"];
			item["message"] =  res["response"][r]["commit"]["message"];
			
			result.push(item);
		}
		
		return result;
		
//		return res;
	}catch(e){
		javaLog("ERRREE: " + e);
		return null;
	}
}


GitHub.prototype.writeFile = function(path, message, committer, comitterEmail, sha, content) {
	var input = {
		"message": String(message),
		"committer": {
			"name": String(committer),
			"email": String(comitterEmail)
		},
		"content": String(GitHub.base64Encode(content))
	};
	
	if (sha) {
		input["sha"] = sha;
	}
	return HTTPAPI.put("https://api.github.com/repos/" + this.repo + "/contents/" + path, JSON.stringify(input), {"Authorization": this.auth});
}

GitHub.prototype.updateFile = function(path, message, committer, comitterEmail, content) {
	javaLog("updateFile:Path: " + path);
	var res = github.readFile(path);

	var sha = "";
	if(res == null || res == undefined){
		sha = null;
	}else{
		if (res["response"]["message"] == "Not Found") {
			sha = null;
		} else {
			sha = res["response"]["sha"];
		}
	}
	
	javaLog("sha: " + sha);
	
	return github.writeFile(path, message, committer, comitterEmail, sha, content);
}

function base64Decode(str) {
	return new java.lang.String(Packages.javax.xml.bind.DatatypeConverter.parseBase64Binary(str), "UTF-8");
}

function getLookupVal(sControl, sValue) {
	var desc = "";
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(sControl, sValue);
	if (bizDomScriptResult.getSuccess()) {
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		desc = "" + bizDomScriptObj.getDescription();
	}
	return desc;
}

function isEmpty(val) {
	return val == null || !val || val == undefined || val == NaN || val == 'NaN' || val == '';
}

var github;// = new GitHub();
function archive_GITHUB(entity, primaryKey, json, result, overrideExisting){
	javaLog("archive_GITHUB..........................");
	javaLog("overrideExisting: " + overrideExisting);
	javaLog('result["success"]: ' + result["success"]);

	if(overrideExisting && result["success"] == true){
		json = JSON.stringify(json, null, "\t");
		javaLog("json: " + JSON.stringify(json));
		var username = getLookupVal('WORKBOOK_CONFIGURATIONS', 'GIT_REPOSITORY_USERNAME');
		var password = getLookupVal('WORKBOOK_CONFIGURATIONS', 'GIT_REPOSITORY_PASSWORD');
		var repo = getLookupVal('WORKBOOK_CONFIGURATIONS', 'GIT_REPOSITORY_URL');
		
		if(!isEmpty(username) && !isEmpty(password) && !isEmpty(repo)){
			github = new GitHub(username, password, repo);
			
			try{
				entity = encodeURIComponent(entity + "/" + primaryKey + ".json");
				
				var user = aa.person.getUser(aa.getAuditID()).getOutput();
				var email = user.getEmail();
				if(email == null || email == undefined){
					email = "admin@accela.com";
				}
				
				var updateResult = github.updateFile(entity, "Auto Commit By EMSE - " + aa.getAuditID().toUpperCase(), aa.getAuditID(), email, json);
				javaLog("updateResult: " + JSON.stringify(updateResult));
			}catch(e){
				javaLog("Error while calling GIT Repository: " + e);
			}
		}
	}
}

function getFileComments_GITHUB(modelName, fileName){
	javaLog("GITHUB:getFileComments..........................");
	
	javaLog("modelName: " + modelName);
	
	javaLog("fileName: " + fileName);
	
	var entityTracker = [];
	
	var username = getLookupVal('WORKBOOK_CONFIGURATIONS', 'GIT_REPOSITORY_USERNAME');
	var password = getLookupVal('WORKBOOK_CONFIGURATIONS', 'GIT_REPOSITORY_PASSWORD');
	var repo = getLookupVal('WORKBOOK_CONFIGURATIONS', 'GIT_REPOSITORY_URL');
	
	if(!isEmpty(username) && !isEmpty(password) && !isEmpty(repo)){
		github = new GitHub(username, password, repo);
		
		fileName = encodeURIComponent(modelName + "/" + fileName + ".json");
		entityTracker = github.readFileComments(fileName);
	}else{
		entityTracker = "GITHUB_NOT_CONFIGURED";
	}
	
	return entityTracker;
}

function getFileBySHA_GITHUB(modelName, fileName, SHA){
	javaLog("GITHUB:getFileBySHA_GITHUB..........................");
	
	javaLog("modelName: " + modelName);
	
	javaLog("fileName: " + fileName);
	
	javaLog("SHA: " + SHA);
	
	var entityTracker = [];
	
	var username = getLookupVal('WORKBOOK_CONFIGURATIONS', 'GIT_REPOSITORY_USERNAME');
	var password = getLookupVal('WORKBOOK_CONFIGURATIONS', 'GIT_REPOSITORY_PASSWORD');
	var repo = getLookupVal('WORKBOOK_CONFIGURATIONS', 'GIT_REPOSITORY_URL');
	
	var content = [];
	
	if(!isEmpty(username) && !isEmpty(password) && !isEmpty(repo)){
		github = new GitHub(username, password, repo);
		
		fileName = encodeURIComponent(modelName + "/" + fileName + ".json");
		entityTracker = github.readFileBySHA(fileName, SHA);
		aa.print("entityTracker: " + JSON.stringify(entityTracker));
		
		if (entityTracker["response"]["message"] != "Not Found") {
			content = entityTracker["response"]["content"];
			content = base64Decode(content);
			content = JSON.parse(content);
			
			javaLog("content: " + content);
		}
	}
	
	return content;
}

function replaceAll(target, search, replacement) {
	var res = "";
	var idx = target.indexOf(search);

	while (idx >= 0) {
		res += target.substring(0, idx) + replacement;
		target = target.substring(idx + search.length)
		idx = target.indexOf(search);
	}
	return res + target;
}

function javaLog(msg){
	java.lang.System.out.println("GITHUB>> " + msg);
	aa.print("GITHUB>> " + msg);
}

//try {
//	var username = getLookupVal('WORKBOOK_CONFIGURATIONS', 'GIT_REPOSITORY_USERNAME');
//	var password = getLookupVal('WORKBOOK_CONFIGURATIONS', 'GIT_REPOSITORY_PASSWORD');
//	var repo = getLookupVal('WORKBOOK_CONFIGURATIONS', 'GIT_REPOSITORY_URL');
//	
//	var github = new GitHub(username, password, repo);
	
//	var fileName = encodeURIComponent("Custom Tables/HASH_ASIT3.json");
//	var fileName = encodeURIComponent("Custom Fields/HASH_ASI.json");
//	var fileName = "64da5348d4fc6529a978a36f37ef8aa77bec2233";
//	var fileName = "875c6990274abdd8d9be49e0028f9eee49b8bb4b";
//	var fileName = encodeURIComponent("Custom Fields/HASH_ASI") + ".json?ref=875c6990274abdd8d9be49e0028f9eee49b8bb4b";
	
//	var entityTracker = github.readFile(fileName);
////	var entityTracker = github.readFileComments(fileName);
////	var entityTracker = github.readFileBySHA(fileName);
//	
//	aa.print('entityTracker: ' + JSON.stringify(entityTracker));
//
//	var customFormLastUpdated = null;
//	if (entityTracker["response"]["message"] != "Not Found") {
//		var content = entityTracker["response"]["content"];
//		content = base64Decode(content);
//		aa.print("content: " + content);
////		aa.print("content: " + JSON.stringify(content));
////		content = JSON.parse(content);
////		aa.print("content: " + JSON.stringify(content));
//	}
	
//	for(var j in entityTracker){
//		aa.print("");
//		aa.print("..............................");
//		aa.print("sha: " + entityTracker[j]["sha"]);
//		aa.print("date: " + entityTracker[j]["date"]);
//		aa.print("message: " + entityTracker[j]["message"]);
//		aa.print("..............................");
//		aa.print("");
//	}
	
	
	////////////////////////////////////
	
//	var json = {"Test 1": "val 1", "Test 2": "val 2", "Test 3": "val 3", "Test 4": "val 4"};
//	var updateResult = github.updateFile("customfields/test1.json", "Auto Configuration Update", aa.getAuditID(), "mhashaikeh@accela.com", JSON.stringify(json));
////	aa.print("updateResult: " + updateResult);
//	aa.print("updateResult: " + JSON.stringify(updateResult));
	
	
//	var result = getFileBySHA_GITHUB("Custom Fields", "HASH_ASI", "875c6990274abdd8d9be49e0028f9eee49b8bb4b");
//	var result = getFileComments_GITHUB("Drilldown", "HASH2");
//	aa.print("result: " + result);
//	aa.print("result: " + JSON.stringify(result));
	
//} catch (e) {
//	aa.print("Error while calling GIT Repository: " + e);
//}

/////////////////////////////////////

//var entity = 'customfields';
//var primaryKey = 'HASH_ASI2';
//var json = [{"FIELD_ALIAS_ENGLISH":"City Label EN","FIELD_ALIAS_SECLANG":"City Label AR","DEFAULT_APO_GIS_LAYER":null,"DISPLAY_LENGTH":"50","LOCATION_QUERY_FLAG":null,"MAX_LENGTH":"100","R1_ALIGNMENT":null,"R1_ATTRIBUTE_UNIT_TYPE":"a","R1_ATTRIBUTE_VALUE":"A","R1_ATTRIBUTE_VALUE_REQ_FLAG":"N","R1_CHECKBOX_CODE":"HASH_ASI2","R1_CHECKBOX_DESC":"City1","R1_CHECKBOX_DESC_ALT":"City","R1_CHECKBOX_GROUP":"APPLICATION","R1_CHECKBOX_IND":"5","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","R1_DEFAULT_SELECTED":null,"R1_DISABLE_SORT_TABLE":null,"R1_DISPLAY_LIC_VERIF_ACA":null,"R1_DISPLAY_ORDER":"20","R1_FEE_INDICATOR":"1","R1_GROUP_DISPLAY_ORDER":"10","R1_REQ_FEE_CALC":"N","R1_SEARCHABLE_FLAG":"N","R1_SEARCHABLE_FOR_ACA":"N","R1_SHARED_DDLIST_ID":null,"R1_SUPERVISOR_EDIT_ONLY_FLAG":"N","R1_TABLE_GROUP_NAME":"HASH_ASI2","R1_TASK_STATUS_REQ_FLAG":null,"R1_VALIDATION_SCRIPT_NAME":null,"RES_ID":null,"SERV_PROV_CODE":"ADMA","VCH_DISP_FLAG":"H","refAppSpecInfoFieldI18NModels":[{"LANG_ID":"ar_AE","R1_ATTRIBUTE_VALUE":"عمان","R1_CHECKBOX_DESC":"City1","R1_CHECKBOX_DESC_ALT":"City1","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","RES_ID":null,"SERV_PROV_CODE":"ADMA"},{"LANG_ID":"en_US","R1_ATTRIBUTE_VALUE":"A","R1_CHECKBOX_DESC":"City1","R1_CHECKBOX_DESC_ALT":"City1","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","RES_ID":null,"SERV_PROV_CODE":"ADMA"}],"sharedDropDownModel":{"BIZDOMAIN":"City","BIZDOMAIN_DDLIST_SEQ":null,"LEVEL1":"HASH_ASI2","LEVEL2":"APPLICATION INFORMATION","LEVEL3":"APPLICATION","LEVEL4":"City1","SDDL_RELATION_TYPE":"APPLICATION_SPECIFIC_INFO","SERV_PROV_CODE":"ADMA"}},{"FIELD_ALIAS_ENGLISH":"Country Label En","FIELD_ALIAS_SECLANG":"Country Label Ar","DEFAULT_APO_GIS_LAYER":null,"DISPLAY_LENGTH":"50","LOCATION_QUERY_FLAG":null,"MAX_LENGTH":"100","R1_ALIGNMENT":null,"R1_ATTRIBUTE_UNIT_TYPE":"m","R1_ATTRIBUTE_VALUE":"JOR","R1_ATTRIBUTE_VALUE_REQ_FLAG":"N","R1_CHECKBOX_CODE":"HASH_ASI2","R1_CHECKBOX_DESC":"Country","R1_CHECKBOX_DESC_ALT":"Country","R1_CHECKBOX_GROUP":"APPLICATION","R1_CHECKBOX_IND":"5","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","R1_DEFAULT_SELECTED":null,"R1_DISABLE_SORT_TABLE":null,"R1_DISPLAY_LIC_VERIF_ACA":null,"R1_DISPLAY_ORDER":"10","R1_FEE_INDICATOR":"1","R1_GROUP_DISPLAY_ORDER":"10","R1_REQ_FEE_CALC":"N","R1_SEARCHABLE_FLAG":"N","R1_SEARCHABLE_FOR_ACA":"N","R1_SHARED_DDLIST_ID":null,"R1_SUPERVISOR_EDIT_ONLY_FLAG":"N","R1_TABLE_GROUP_NAME":"HASH_ASI2","R1_TASK_STATUS_REQ_FLAG":null,"R1_VALIDATION_SCRIPT_NAME":null,"RES_ID":null,"SERV_PROV_CODE":"ADMA","VCH_DISP_FLAG":"H","refAppSpecInfoFieldI18NModels":[{"LANG_ID":"ar_AE","R1_ATTRIBUTE_VALUE":"الأردن","R1_CHECKBOX_DESC":"Country","R1_CHECKBOX_DESC_ALT":"Country","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","RES_ID":null,"SERV_PROV_CODE":"ADMA"},{"LANG_ID":"en_US","R1_ATTRIBUTE_VALUE":"JOR","R1_CHECKBOX_DESC":"Country","R1_CHECKBOX_DESC_ALT":"Country","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","RES_ID":null,"SERV_PROV_CODE":"ADMA"}],"sharedDropDownModel":{"BIZDOMAIN":"Country","BIZDOMAIN_DDLIST_SEQ":null,"LEVEL1":"HASH_ASI2","LEVEL2":"APPLICATION INFORMATION","LEVEL3":"APPLICATION","LEVEL4":"Country","SDDL_RELATION_TYPE":"APPLICATION_SPECIFIC_INFO","SERV_PROV_CODE":"ADMA"}},{"FIELD_ALIAS_ENGLISH":"County Label En","FIELD_ALIAS_SECLANG":"County Label AR","DEFAULT_APO_GIS_LAYER":null,"DISPLAY_LENGTH":"50","LOCATION_QUERY_FLAG":null,"MAX_LENGTH":"100","R1_ALIGNMENT":null,"R1_ATTRIBUTE_UNIT_TYPE":"b","R1_ATTRIBUTE_VALUE":"P","R1_ATTRIBUTE_VALUE_REQ_FLAG":"N","R1_CHECKBOX_CODE":"HASH_ASI2","R1_CHECKBOX_DESC":"County","R1_CHECKBOX_DESC_ALT":"County","R1_CHECKBOX_GROUP":"APPLICATION","R1_CHECKBOX_IND":"5","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","R1_DEFAULT_SELECTED":null,"R1_DISABLE_SORT_TABLE":null,"R1_DISPLAY_LIC_VERIF_ACA":null,"R1_DISPLAY_ORDER":"30","R1_FEE_INDICATOR":"1","R1_GROUP_DISPLAY_ORDER":"10","R1_REQ_FEE_CALC":"N","R1_SEARCHABLE_FLAG":"N","R1_SEARCHABLE_FOR_ACA":"N","R1_SHARED_DDLIST_ID":null,"R1_SUPERVISOR_EDIT_ONLY_FLAG":"N","R1_TABLE_GROUP_NAME":"HASH_ASI2","R1_TASK_STATUS_REQ_FLAG":null,"R1_VALIDATION_SCRIPT_NAME":null,"RES_ID":null,"SERV_PROV_CODE":"ADMA","VCH_DISP_FLAG":"Y","refAppSpecInfoFieldI18NModels":[{"LANG_ID":"ar_AE","R1_ATTRIBUTE_VALUE":"الضاحية","R1_CHECKBOX_DESC":"County","R1_CHECKBOX_DESC_ALT":"County","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","RES_ID":null,"SERV_PROV_CODE":"ADMA"},{"LANG_ID":"en_US","R1_ATTRIBUTE_VALUE":"P","R1_CHECKBOX_DESC":"County","R1_CHECKBOX_DESC_ALT":"County","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","RES_ID":null,"SERV_PROV_CODE":"ADMA"}],"sharedDropDownModel":{"BIZDOMAIN":"County","BIZDOMAIN_DDLIST_SEQ":null,"LEVEL1":"HASH_ASI2","LEVEL2":"APPLICATION INFORMATION","LEVEL3":"APPLICATION","LEVEL4":"County","SDDL_RELATION_TYPE":"APPLICATION_SPECIFIC_INFO","SERV_PROV_CODE":"ADMA"}},{"FIELD_ALIAS_ENGLISH":"Street Label ENN","FIELD_ALIAS_SECLANG":"شارع","DEFAULT_APO_GIS_LAYER":null,"DISPLAY_LENGTH":"50","LOCATION_QUERY_FLAG":null,"MAX_LENGTH":"100","R1_ALIGNMENT":null,"R1_ATTRIBUTE_UNIT_TYPE":"c","R1_ATTRIBUTE_VALUE":"B","R1_ATTRIBUTE_VALUE_REQ_FLAG":"N","R1_CHECKBOX_CODE":"HASH_ASI2","R1_CHECKBOX_DESC":"Street","R1_CHECKBOX_DESC_ALT":"Street","R1_CHECKBOX_GROUP":"APPLICATION","R1_CHECKBOX_IND":"5","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","R1_DEFAULT_SELECTED":null,"R1_DISABLE_SORT_TABLE":null,"R1_DISPLAY_LIC_VERIF_ACA":null,"R1_DISPLAY_ORDER":"50","R1_FEE_INDICATOR":"1","R1_GROUP_DISPLAY_ORDER":"10","R1_REQ_FEE_CALC":"N","R1_SEARCHABLE_FLAG":"N","R1_SEARCHABLE_FOR_ACA":"N","R1_SHARED_DDLIST_ID":null,"R1_SUPERVISOR_EDIT_ONLY_FLAG":"N","R1_TABLE_GROUP_NAME":"HASH_ASI2","R1_TASK_STATUS_REQ_FLAG":null,"R1_VALIDATION_SCRIPT_NAME":null,"RES_ID":null,"SERV_PROV_CODE":"ADMA","VCH_DISP_FLAG":"Y","refAppSpecInfoFieldI18NModels":[{"LANG_ID":"ar_AE","R1_ATTRIBUTE_VALUE":"شارع 12","R1_CHECKBOX_DESC":"Street","R1_CHECKBOX_DESC_ALT":"Street","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","RES_ID":null,"SERV_PROV_CODE":"ADMA"},{"LANG_ID":"en_US","R1_ATTRIBUTE_VALUE":"B","R1_CHECKBOX_DESC":"Street","R1_CHECKBOX_DESC_ALT":"Street","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","RES_ID":null,"SERV_PROV_CODE":"ADMA"}],"sharedDropDownModel":{"BIZDOMAIN":"Street","BIZDOMAIN_DDLIST_SEQ":null,"LEVEL1":"HASH_ASI2","LEVEL2":"APPLICATION INFORMATION","LEVEL3":"APPLICATION","LEVEL4":"Street","SDDL_RELATION_TYPE":"APPLICATION_SPECIFIC_INFO","SERV_PROV_CODE":"ADMA"}},{"FIELD_ALIAS_ENGLISH":"test En 1","FIELD_ALIAS_SECLANG":"Test AR 1","DEFAULT_APO_GIS_LAYER":null,"DISPLAY_LENGTH":"50","LOCATION_QUERY_FLAG":null,"MAX_LENGTH":"100","R1_ALIGNMENT":null,"R1_ATTRIBUTE_UNIT_TYPE":"d","R1_ATTRIBUTE_VALUE":"T","R1_ATTRIBUTE_VALUE_REQ_FLAG":"Y","R1_CHECKBOX_CODE":"HASH_ASI2","R1_CHECKBOX_DESC":"Test","R1_CHECKBOX_DESC_ALT":"Test","R1_CHECKBOX_GROUP":"APPLICATION","R1_CHECKBOX_IND":"1","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","R1_DEFAULT_SELECTED":null,"R1_DISABLE_SORT_TABLE":null,"R1_DISPLAY_LIC_VERIF_ACA":null,"R1_DISPLAY_ORDER":"60","R1_FEE_INDICATOR":"1","R1_GROUP_DISPLAY_ORDER":"10","R1_REQ_FEE_CALC":"N","R1_SEARCHABLE_FLAG":"N","R1_SEARCHABLE_FOR_ACA":"N","R1_SHARED_DDLIST_ID":null,"R1_SUPERVISOR_EDIT_ONLY_FLAG":"N","R1_TABLE_GROUP_NAME":"HASH_ASI2","R1_TASK_STATUS_REQ_FLAG":null,"R1_VALIDATION_SCRIPT_NAME":null,"RES_ID":null,"SERV_PROV_CODE":"ADMA","VCH_DISP_FLAG":"Y","refAppSpecInfoFieldI18NModels":[{"LANG_ID":"ar_AE","R1_ATTRIBUTE_VALUE":"ت ج","R1_CHECKBOX_DESC":"Test","R1_CHECKBOX_DESC_ALT":"Test","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","RES_ID":null,"SERV_PROV_CODE":"ADMA"},{"LANG_ID":"en_US","R1_ATTRIBUTE_VALUE":"T","R1_CHECKBOX_DESC":"Test","R1_CHECKBOX_DESC_ALT":"Test","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION","RES_ID":null,"SERV_PROV_CODE":"ADMA"}],"sharedDropDownModel":null},{"FIELD_ALIAS_ENGLISH":"test En 2","FIELD_ALIAS_SECLANG":"Test AR 2","DEFAULT_APO_GIS_LAYER":null,"DISPLAY_LENGTH":"50","LOCATION_QUERY_FLAG":null,"MAX_LENGTH":"100","R1_ALIGNMENT":null,"R1_ATTRIBUTE_UNIT_TYPE":"e","R1_ATTRIBUTE_VALUE":"C","R1_ATTRIBUTE_VALUE_REQ_FLAG":"Y","R1_CHECKBOX_CODE":"HASH_ASI2","R1_CHECKBOX_DESC":"Test 2","R1_CHECKBOX_DESC_ALT":"Test 2","R1_CHECKBOX_GROUP":"APPLICATION","R1_CHECKBOX_IND":"1","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION 2","R1_DEFAULT_SELECTED":null,"R1_DISABLE_SORT_TABLE":null,"R1_DISPLAY_LIC_VERIF_ACA":null,"R1_DISPLAY_ORDER":"10","R1_FEE_INDICATOR":"1","R1_GROUP_DISPLAY_ORDER":"20","R1_REQ_FEE_CALC":"N","R1_SEARCHABLE_FLAG":"N","R1_SEARCHABLE_FOR_ACA":"N","R1_SHARED_DDLIST_ID":null,"R1_SUPERVISOR_EDIT_ONLY_FLAG":"N","R1_TABLE_GROUP_NAME":"HASH_ASI2","R1_TASK_STATUS_REQ_FLAG":null,"R1_VALIDATION_SCRIPT_NAME":null,"RES_ID":null,"SERV_PROV_CODE":"ADMA","VCH_DISP_FLAG":"Y","refAppSpecInfoFieldI18NModels":[{"LANG_ID":"ar_AE","R1_ATTRIBUTE_VALUE":"إفتراضي 2","R1_CHECKBOX_DESC":"Test 2","R1_CHECKBOX_DESC_ALT":"Test 2","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION 2","RES_ID":null,"SERV_PROV_CODE":"ADMA"},{"LANG_ID":"en_US","R1_ATTRIBUTE_VALUE":"C","R1_CHECKBOX_DESC":"Test 2","R1_CHECKBOX_DESC_ALT":"Test 2","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION 2","RES_ID":null,"SERV_PROV_CODE":"ADMA"}],"sharedDropDownModel":null},{"FIELD_ALIAS_ENGLISH":"ListTest","FIELD_ALIAS_SECLANG":"مجموعة الشوارع ar","DEFAULT_APO_GIS_LAYER":null,"DISPLAY_LENGTH":"50","LOCATION_QUERY_FLAG":null,"MAX_LENGTH":"100","R1_ALIGNMENT":null,"R1_ATTRIBUTE_UNIT_TYPE":"g","R1_ATTRIBUTE_VALUE":"","R1_ATTRIBUTE_VALUE_REQ_FLAG":"N","R1_CHECKBOX_CODE":"HASH_ASI2","R1_CHECKBOX_DESC":"ListTest","R1_CHECKBOX_DESC_ALT":"label","R1_CHECKBOX_GROUP":"APPLICATION","R1_CHECKBOX_IND":"5","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION 3","R1_DEFAULT_SELECTED":null,"R1_DISABLE_SORT_TABLE":null,"R1_DISPLAY_LIC_VERIF_ACA":null,"R1_DISPLAY_ORDER":"20","R1_FEE_INDICATOR":"1","R1_GROUP_DISPLAY_ORDER":"30","R1_REQ_FEE_CALC":"N","R1_SEARCHABLE_FLAG":"N","R1_SEARCHABLE_FOR_ACA":"N","R1_SHARED_DDLIST_ID":null,"R1_SUPERVISOR_EDIT_ONLY_FLAG":"N","R1_TABLE_GROUP_NAME":"HASH_ASI2","R1_TASK_STATUS_REQ_FLAG":null,"R1_VALIDATION_SCRIPT_NAME":null,"RES_ID":null,"SERV_PROV_CODE":"ADMA","VCH_DISP_FLAG":"Y","refAppSpecInfoFieldI18NModels":[{"LANG_ID":"ar_AE","R1_ATTRIBUTE_VALUE":"مجموعة الشواع","R1_CHECKBOX_DESC":"ListTest","R1_CHECKBOX_DESC_ALT":"ListTest","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION 3","RES_ID":null,"SERV_PROV_CODE":"ADMA"},{"LANG_ID":"en_US","R1_ATTRIBUTE_VALUE":"","R1_CHECKBOX_DESC":"ListTest","R1_CHECKBOX_DESC_ALT":"ListTest","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION 3","RES_ID":null,"SERV_PROV_CODE":"ADMA"}],"sharedDropDownModel":{"BIZDOMAIN":"Street","BIZDOMAIN_DDLIST_SEQ":null,"LEVEL1":"HASH_ASI2","LEVEL2":"APPLICATION INFORMATION 3","LEVEL3":"APPLICATION","LEVEL4":"ListTest","SDDL_RELATION_TYPE":"APPLICATION_SPECIFIC_INFO","SERV_PROV_CODE":"ADMA"}},{"FIELD_ALIAS_ENGLISH":"test En 3","FIELD_ALIAS_SECLANG":"Test AR 3","DEFAULT_APO_GIS_LAYER":null,"DISPLAY_LENGTH":"50","LOCATION_QUERY_FLAG":null,"MAX_LENGTH":"100","R1_ALIGNMENT":null,"R1_ATTRIBUTE_UNIT_TYPE":"f","R1_ATTRIBUTE_VALUE":"D","R1_ATTRIBUTE_VALUE_REQ_FLAG":"N","R1_CHECKBOX_CODE":"HASH_ASI2","R1_CHECKBOX_DESC":"Test 3","R1_CHECKBOX_DESC_ALT":"Test 3","R1_CHECKBOX_GROUP":"APPLICATION","R1_CHECKBOX_IND":"6","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION 3","R1_DEFAULT_SELECTED":null,"R1_DISABLE_SORT_TABLE":null,"R1_DISPLAY_LIC_VERIF_ACA":null,"R1_DISPLAY_ORDER":"10","R1_FEE_INDICATOR":"1","R1_GROUP_DISPLAY_ORDER":"30","R1_REQ_FEE_CALC":"N","R1_SEARCHABLE_FLAG":"N","R1_SEARCHABLE_FOR_ACA":"N","R1_SHARED_DDLIST_ID":null,"R1_SUPERVISOR_EDIT_ONLY_FLAG":"N","R1_TABLE_GROUP_NAME":"HASH_ASI2","R1_TASK_STATUS_REQ_FLAG":null,"R1_VALIDATION_SCRIPT_NAME":null,"RES_ID":null,"SERV_PROV_CODE":"ADMA","VCH_DISP_FLAG":"Y","refAppSpecInfoFieldI18NModels":[{"LANG_ID":"ar_AE","R1_ATTRIBUTE_VALUE":"إفتراضي 3","R1_CHECKBOX_DESC":"Test 3","R1_CHECKBOX_DESC_ALT":"Test 3","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION 3","RES_ID":null,"SERV_PROV_CODE":"ADMA"},{"LANG_ID":"en_US","R1_ATTRIBUTE_VALUE":"D","R1_CHECKBOX_DESC":"Test 3","R1_CHECKBOX_DESC_ALT":"Test 3","R1_CHECKBOX_TYPE":"APPLICATION INFORMATION 3","RES_ID":null,"SERV_PROV_CODE":"ADMA"}],"sharedDropDownModel":null}];
//var result = {"success": true};
//var overrideExisting = true;
//archive_GITHUB(entity, primaryKey, json, result, overrideExisting);






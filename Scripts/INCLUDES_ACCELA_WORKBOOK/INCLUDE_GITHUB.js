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

//var entity = aa.env.getValue("entity");
//var primaryKey = aa.env.getValue("primaryKey");
//var json = aa.env.getValue("json");
//var result = aa.env.getValue("result");
//var overrideExisting = aa.env.getValue("overrideExisting");
//
//javaLog('GITHUB:entity: ' + entity);
//javaLog('GITHUB:primaryKey: ' + primaryKey);
//javaLog('GITHUB:json: ' + json);
//javaLog('GITHUB:result: ' + result);
//javaLog('GITHUB:overrideExisting: ' + overrideExisting);
//
//if(!isEmpty(entity) && !isEmpty(primaryKey) && !isEmpty(json) && !isEmpty(result) && !isEmpty(overrideExisting)){
//	json = JSON.parse(json);
//	result = JSON.parse(result);
//	overrideExisting = overrideExisting == "true" || overrideExisting == "TRUE" || overrideExisting == "True" ? true : false;
//	
//	archive_GITHUB(entity, primaryKey, json, result, overrideExisting);
//}

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
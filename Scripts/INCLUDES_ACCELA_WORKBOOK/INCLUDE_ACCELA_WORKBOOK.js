/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_ACCELA_WORKBOOK.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MHASHAIKEH
| Created at	: 22/07/2020 17:34:51
|
/------------------------------------------------------------------------------------------------------*/

eval(getScriptText("INCLUDE_CONFIG_API"));

var skipDelete = true;

function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
} 

function logDebug(msg){
	aa.print(msg);
	java.lang.System.out.println(msg);
}

function AccelaWorkBook() {
	
}

AccelaWorkBook.prototype = {}

eval(getScriptText("INCLUDE_BASESERVICE"));

function cmd_searchASI(){
	logDebug("cmd_searchASI.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchASI(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createASI(){
	logDebug("cmd_createASI.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var errorMessage = "";
	for(var j in json){
		if(json[j]["R1_TABLE_GROUP_NAME"].length > 12){
			errorMessage = "The R1_TABLE_GROUP_NAME exceeds the allowed limit (12 letters)";
			break;
		}
	}
	
	var result = "";
	
	if(errorMessage == ""){
		result = ConfigEngineAPI.createASI(json, override, false);
	}else{
		result = {
				"success": false,
				"displayerror": true,
				"message": errorMessage
				};
	}
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_createASISubGroup(){//Add new SubGroup Only
	logDebug("cmd_createASISubGroup.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var subGroups = [];
	for(var j in json){
		subGroups.push(json[j]["R1_CHECKBOX_TYPE"]);
	}
	subGroups = unique(subGroups);
	
	var err = null;
	
	for(var s in subGroups){
		logDebug('subGroups[s]: ' + subGroups[s]);
		var sArr = ConfigEngineAPI.searchASISubGroup(serviceCode[1], subGroups[s]);
		if(sArr != null && sArr.length > 0){
			logDebug('sArr.length: ' + sArr.length);
			if(err == null){
				err = 'The following Subgroup\s already exists: ';
				err += subGroups[s];
			}else{
				err += ', ' + subGroups[s];
			}
			logDebug('err: ' + err);
		}
	}
	
	var res;
	var result;
	
	if(err == null){
		logDebug('err == null');
		result = ConfigEngineAPI.createASI(json, override, true);
		
		res = {
				"message": "Success",
				"content": result
			};
	}else{
		logDebug('err != null');
		
		result = {
			"success": false,
			"exists": true,
			"displayerror": true,
			"message": err
		};
		
		res = {
				"message": "Failed",
				"content": result
			};
	}
	
	
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchASIT(){
	logDebug("cmd_searchASIT.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchASIT(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createASIT(){
	logDebug("cmd_createASIT.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var errorMessage = "";
	for(var j in json){
		if(!isEmpty(json[j]["R1_TABLE_GROUP_NAME"]) && json[j]["R1_TABLE_GROUP_NAME"].length > 12){
			errorMessage = "The R1_TABLE_GROUP_NAME exceeds the allowed limit (12 letters)";
			break;
		}
	}
	
	var result = "";
	
	if(errorMessage == ""){
		result = ConfigEngineAPI.createASIT(json, override);
	}else{
		result = {
				"success": false,
				"displayerror": true,
				"message": errorMessage
				};
	}
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchApplicationStatus(){
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchApplicationStatusGroup(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createApplicationStatus(){
	logDebug("cmd_createApplicationStatus.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createApplicationStatusGroup(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchFeesSchedule(){
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchFeesSchedule(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createFeesSchedule(){
	logDebug("cmd_createFeesSchedule.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createFeesSchedule(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchNotificationTemplate(){
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchNotificationTemplate(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createNotificationTemplate(){
	logDebug("cmd_createNotificationTemplate.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
//	var params2 = param("params2");
//	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createNotificationTemplate(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchDocuments(){
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchDocuments(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createDocuments(){
	logDebug("cmd_createDocuments.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createDocuments(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchSequences(){
	logDebug("cmd_searchSequences.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = [];
	
	var serviceCodes = [];
	if(serviceCode.indexOf("-") != -1){
		serviceCodes.push(serviceCode[1]);
	}else{
		serviceCodes.push(serviceCode[1]);
		serviceCodes.push(serviceCode[1] + "-EST");
		serviceCodes.push(serviceCode[1] + "-PTL");
		serviceCodes.push(serviceCode[1] + "-ID");
	}
	
	logDebug("serviceCodes.length: " + serviceCodes.length);
	
	for(var sc = 0; sc < serviceCodes.length; sc++){
		var jsonObjArr = ConfigEngineAPI.searchSequence(serviceCodes[sc], false);
		logDebug(JSON.stringify(stringifyJSType(jsonObjArr)));
		
		for (var w = 0; w < jsonObjArr.length; w++) {
			var mask = ConfigEngineAPI.searchMask(serviceCodes[sc], false);
			jsonObjArr[w]["maskModel"] = mask[0];
			result.push(jsonObjArr[w]);
		}
	}

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchSequencesList(){
	logDebug("cmd_searchSequencesList.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	params = toJson(params);
	
	var result = ConfigEngineAPI.searchSequenceList(params[0], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createSequences(){
	logDebug("cmd_createSequences.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var jsonInputOrg = JSON.parse(JSON.stringify(json));//Clone Object
	
	var result;
	
	if(override){
	
		var maskJson = [];
		
		for(var c in json){
			maskJson.push(json[c]['maskModel']);
			
			delete json[c]['maskModel'];
			
			logDebug("json After Removing maskModel: " + JSON.stringify(stringifyJSType(json[c])));
			
			result = ConfigEngineAPI.createSequence(json[c], override);
		}
		
		logDebug("maskJson: " + JSON.stringify(stringifyJSType(maskJson)));
		var resultMask = ConfigEngineAPI.createMask(maskJson, override);
		logDebug("resultMask:: " + JSON.stringify(stringifyJSType(resultMask)));
		
	}else{
		result = ConfigEngineAPI.createSequence(json, override);
	}
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	if(result["success"] == true){
		archive_GITHUB("Sequences", String(jsonInputOrg[0]["SEQ_NAME"]), jsonInputOrg, result, override);
	}
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchInspections(){
	logDebug("cmd_searchInspections.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchInspectionGroupModel(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchInspectionCheckListStatusGroupList(){
	logDebug("cmd_searchInspectionCheckListStatusGroupList.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	params = toJson(params);
	
	var result = ConfigEngineAPI.searchInspectionCheckListStatusGroupList(params[0], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchInspectionCodeList(){
	logDebug("cmd_searchInspectionCodeList.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	params = toJson(params);
	
	var result = ConfigEngineAPI.searchInspectionCodeList(params[0], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createInspections(){
	logDebug("cmd_createInspections.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createInspectionGroupModel(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchInspectionResultGroupList() {
	logDebug('cmd_searchInspectionResultGroupList..........................................');
	var params = param("params");
	var sql = param("sql");

	var paramsArr = toJson(params);
	var result = ConfigEngineAPI.searchInspectionResultGroupList(paramsArr[0], true);
	var res = {
		"message": "Success",
		"content": result
	};

	logDebug("searchOfficeList:Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchInspectionResultGroup_old(){
	logDebug("cmd_searchInspectionResultGroup.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var resultInspection = ConfigEngineAPI.searchInspectionGroupModel(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(resultInspection)));
	
	var result = [];
	var map = new java.util.HashMap();
	
	for(counter in resultInspection){
		var serviceCode = resultInspection[counter]['INSP_RESULT_GROUP'];
		
		if(map.get(serviceCode) == null){
			var inspResGrpMdl = ConfigEngineAPI.searchInspectionResultGroupModel(serviceCode, false);
			for(counter in inspResGrpMdl){
				result.push(inspResGrpMdl[counter]);
			}
			map.put(serviceCode, serviceCode);
		}
	}

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchInspectionResultGroup(){
	logDebug("cmd_searchInspectionResultGroup.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchInspectionResultGroupModel(serviceCode[1], false);

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createInspectionResultGroup(){
	logDebug("cmd_createInspectionResultGroup.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createInspectionResultGroupModel(serviceCode[1], json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchInspectionCheckListGroup_old(){
	logDebug("cmd_searchInspectionCheckListGroup.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var resultInspection = ConfigEngineAPI.searchInspectionGroupModel(serviceCode[1], true);
	logDebug('resultInspection: ' + JSON.stringify(stringifyJSType(resultInspection)));
	
	var result = [];
	var map = new java.util.HashMap();
	
	for(counter in resultInspection){
		var serviceCode = resultInspection[counter]['GUIDE_GROUP'];
		
		if(map.get(serviceCode) == null){
			var inspChckLstGrpMdl = ConfigEngineAPI.searchInspectionCheckListGroupModel(serviceCode, false);
			result.push(inspChckLstGrpMdl[0]);
			map.put(serviceCode, serviceCode);
		}
	}
	

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchInspectionCheckListGroupList(){
	logDebug("cmd_searchInspectionCheckListGroupList.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	params = toJson(params);
	
	var result = ConfigEngineAPI.searchInspectionCheckListGroupList(params[0], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}


function cmd_searchInspectionCheckListGroup(){
	logDebug("cmd_searchInspectionCheckListGroup.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	params = toJson(params);
	
	var result = ConfigEngineAPI.searchInspectionCheckListGroupModel(params[1], false);

	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("searchInspectionCheckListGroup:Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_createInspectionCheckListGroup(){
	logDebug("cmd_createInspectionCheckListGroup.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createInspectionCheckListGroupModel(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchInspectionCheckListStatusGroup(){
	logDebug("cmd_searchInspectionCheckListStatusGroup.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchInspectionCheckListStatusGroup(serviceCode[1], false);

	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchInspectionCheckListStatusGroup_OLD(){
	logDebug("cmd_searchInspectionCheckListStatusGroup.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var resultInspection = ConfigEngineAPI.searchInspectionGroupModel(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(resultInspection)));
	
	var result = [];
	var map = new java.util.HashMap();
	var mapInspResGrpMdl = new java.util.HashMap();
	var mapInspChckListItmMdl = new java.util.HashMap();

	for(counter in resultInspection){
		var serviceCode = resultInspection[counter]['GUIDE_GROUP'];
		
		if(map.get(serviceCode) == null){
			var inspResGrpMdl = ConfigEngineAPI.searchInspectionCheckListGroupModel(serviceCode, false);
			
			if(mapInspResGrpMdl.get(inspResGrpMdl[0]["GUIDE_TYPE"]) == null){
				var inspChckListItmMdl = ConfigEngineAPI.searchInspectionCheckListItemModel(inspResGrpMdl[0]["GUIDE_TYPE"], false);
				
				if(mapInspChckListItmMdl.get(inspChckListItmMdl[0]['GUIDE_ITEM_STATUS_GROUP_NAME']) == null){
					var inspChckLstStsGrp = ConfigEngineAPI.searchInspectionCheckListStatusGroup(inspChckListItmMdl[0]['GUIDE_ITEM_STATUS_GROUP_NAME'], false);
					result.push(inspChckLstStsGrp[0]);
					mapInspChckListItmMdl.put(inspChckListItmMdl[0]['GUIDE_ITEM_STATUS_GROUP_NAME'], inspChckListItmMdl[0]['GUIDE_ITEM_STATUS_GROUP_NAME']);
				}
				
				mapInspResGrpMdl.put(inspResGrpMdl[0]["GUIDE_TYPE"], inspResGrpMdl[0]["GUIDE_TYPE"]);
			}
			
			map.put(serviceCode, serviceCode);
		}
	}
	
//	var result = ConfigEngineAPI.searchInspectionCheckListStatusGroup(serviceCode[1], false);
//	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createInspectionCheckListStatusGroup(){
	logDebug("cmd_createInspectionCheckListStatusGroup.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createInspectionCheckListStatusGroup(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchInspectionCheckListItemList() {
	logDebug('cmd_searchInspectionCheckListItemList..........................................');
	var params = param("params");
	var sql = param("sql");

	var paramsArr = toJson(params);
	var result = ConfigEngineAPI.searchInspectionCheckListItemList(paramsArr[0], true);
	var res = {
		"message": "Success",
		"content": result
	};

	logDebug("searchOfficeList:Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchInspectionCheckListItemModelList(){
	logDebug("cmd_searchInspectionCheckListItemModelList.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	params = toJson(params);
	
	var result = ConfigEngineAPI.searchInspectionCheckListItemModelList(params[0], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchInspectionCheckListItemModel_OLD(){
	logDebug("cmd_searchInspectionCheckListItemModel.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var resultInspection = ConfigEngineAPI.searchInspectionGroupModel(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(resultInspection)));

	var result = [];
	var map = new java.util.HashMap();
	var mapInspResGrpMdl = new java.util.HashMap();
	
	for(counter in resultInspection){
		var serviceCode = resultInspection[counter]['GUIDE_GROUP'];
		
		if(map.get(serviceCode) == null){
			var inspResGrpMdl = ConfigEngineAPI.searchInspectionCheckListGroupModel(serviceCode, false);
			
			if(mapInspResGrpMdl.get(inspResGrpMdl[0]["GUIDE_TYPE"]) == null){
				var inspChckListItmMdl = ConfigEngineAPI.searchInspectionCheckListItemModel(inspResGrpMdl[0]["GUIDE_TYPE"], false);
				for(chckListCounter in inspChckListItmMdl){
					result.push(inspChckListItmMdl[chckListCounter]);
				}
				mapInspResGrpMdl.put(inspResGrpMdl[0]["GUIDE_TYPE"], inspResGrpMdl[0]["GUIDE_TYPE"]);
			}
			
			map.put(serviceCode, serviceCode);
		}
	}
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchInspectionCheckListItemModel(){
	logDebug("cmd_searchInspectionCheckListItemModel.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchInspectionCheckListItemModel(serviceCode[1], false);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createInspectionCheckListItemModel(){
	logDebug("cmd_createInspectionCheckListItemModel.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createInspectionCheckListItemModel(json, override);
//	var result = ConfigEngineAPI.createGuideSheetModel(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchApplicationType(){
	logDebug("cmd_searchApplicationType.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	
	var serviceCode = toJson(params);
	
	try{
		serviceCode = serviceCode[1] + '/' + serviceCode[2] + '/' + serviceCode[3] + '/' + serviceCode[4];
	}catch(e){
		serviceCode = 'NOF_FOUND';
	}
	
	logDebug("serviceCode: " + serviceCode);
	
	var result = ConfigEngineAPI.searchApplicationType(serviceCode, false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createApplicationType(){
	logDebug("cmd_createApplicationType.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var connectWithPF = false;
	try{
	logDebug("isEmpty(json[0]['R1_SMARTCHOICE_CODE_FOR_ACA'])::: " + isEmpty(json[0]['R1_SMARTCHOICE_CODE_FOR_ACA']));
	if(!isEmpty(json[0]['R1_SMARTCHOICE_CODE_FOR_ACA'])){
		connectWithPF = true;
	}
	}catch(e){
		logDebug("ERR:R1_SMARTCHOICE_CODE_FOR_ACA: " + e);
	}
	
	var result = ConfigEngineAPI.createApplicationType(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	if(override == true && connectWithPF == true && result['success'] == true && result['exists'] == false){
		logDebug("Going to connect the PageFlow with ApplicationType");
		ConfigEngineAPI.connectAppTypeWithPF(serviceCode[0], json[0]['R1_SMARTCHOICE_CODE_FOR_ACA'], json[0]['R1_PER_GROUP'], json[0]['R1_PER_TYPE'], json[0]['R1_PER_SUB_TYPE'], json[0]['R1_PER_CATEGORY']);
	}
	
	return res;
}

function cmd_searchSharedDropDown(){
	logDebug("cmd_searchSharedDropDown.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchSharedDropDown(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchSharedDropDownList(){
	logDebug("cmd_searchSharedDropDownList.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);
	
	var result = ConfigEngineAPI.searchSharedDropDownList(serviceProvidorCode);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchFeesUnitValues(){
	logDebug("cmd_searchFeesUnitValues.......................................");
	
	var result = ConfigEngineAPI.searchFeesUnitValues();
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createSharedDropDown(){
logDebug("cmd_createSharedDropDown.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = '';
	var oldMapping = [];
	
	json = toJson(json);
	
	
	
	if(override){
		var seriesIds = new java.util.HashMap();
		
		var standardChoices = ConfigEngineAPI.searchStandardChoiceValueModel(serviceCode[1], false);
		for(i in standardChoices){
			var drillDownMappingParents = ConfigEngineAPI.searchDrillDownMapping_BY_DDL_P(standardChoices[i]["BDV_SEQ_NBR"], false);
			var drillDownMappingChilds = ConfigEngineAPI.searchDrillDownMapping_BY_DDL_C(standardChoices[i]["BDV_SEQ_NBR"], false);
			
			for(cp in drillDownMappingParents){
				oldMapping.push(drillDownMappingParents[cp]);
			}
			
			for(cc in drillDownMappingChilds){
				oldMapping.push(drillDownMappingChilds[cc]);
			}
		}

		logDebug("oldMapping:: " + JSON.stringify(stringifyJSType(oldMapping)));
		
		if(override && oldMapping.length > 0){
			//Delete Old Mapping
			logDebug('Delete Old Mapping ......................');
			ConfigEngineAPI.deleteDrillDownMapping(oldMapping);
		}
		
		logDebug('After Deleting Old Mapping ......................');
		
//		var oldSeries = [];
//		for(omc in oldMapping){
//			if(!seriesIds.get(oldMapping[omc]["DRLLD_SERIES_ID"])){
//				try{
//					oldSeries.push(ConfigEngineAPI.searchdrillDownSeriesModelsByID(oldMapping[omc]["DRLLD_SERIES_ID"], false)[0]);
//				}catch(e){}
//			}
//		}
//		logDebug("oldSeries:: " + JSON.stringify(stringifyJSType(oldSeries)));
		
//		if(override && oldSeries.length > 0){
//			//Delete Old Series
//			logDebug('Delete Old Series ......................');
//			ConfigEngineAPI.deleteDrillDownSeries(oldSeries);
//		}
		
		result = ConfigEngineAPI.createSharedDropDown(json, override);
		
		var createdObject = ConfigEngineAPI.searchSharedDropDown(serviceCode[1], false);
		logDebug("createdObject:: " + JSON.stringify(stringifyJSType(createdObject)));
		
//		//Edit and insert the new SeriesModel 
//		for(ds in oldSeries){
//			oldSeries[ds]["DRLLD_SERIES_ID"] = null;
//		}
//		logDebug('##Going to Create oldSeries: ' + JSON.stringify(stringifyJSType(oldSeries)));
//		for(dsm in oldSeries){
//			var searchJSON = {};
//			searchJSON.ASITAB_GRP_NAM = oldSeries[dsm]["ASITAB_GRP_NAM"];
//			searchJSON.ASITAB_SUBGRP_NAM = oldSeries[dsm]["ASITAB_SUBGRP_NAM"];
//			searchJSON.CHILD_COL_NAME = oldSeries[dsm]["CHILD_COL_NAME"];
//			searchJSON.PARENT_COL_NAME = oldSeries[dsm]["PARENT_COL_NAME"];
//			
//			logDebug('##Going to Create oldSeries[dsm]: ' + JSON.stringify(stringifyJSType(oldSeries[dsm])));
////			var creatingDrillDownSeriesModelsResult = ConfigEngineAPI.createdrillDownSeriesModels(oldSeries[dsm], true, searchJSON);
////			logDebug('##creatingDrillDownSeriesModelsResult: ' + JSON.stringify(stringifyJSType(oldSeries)));
//		}
		
		var newMapping = [];
		for(om in oldMapping){
			var oldMappedParent = oldMapping[om]["parentValueStandardChoiceModel"];
			var oldMappedChild = oldMapping[om]["childValueStandardChoiceModel"];
			
			for(sc in createdObject[0]["sharedDropDownValueModels"]){
				var isfound = false;
				var createdObj =createdObject[0]["sharedDropDownValueModels"][sc];
				
				if(oldMappedParent["BIZDOMAIN"] == createdObj["BIZDOMAIN"] &&
						oldMappedParent["BIZDOMAIN_VALUE"] == createdObj["BIZDOMAIN_VALUE"]
				){
					oldMapping[om]["parentValueStandardChoiceModel"] = createdObj;
					oldMapping[om]["PARENT_VAL_ID"] = createdObj["BDV_SEQ_NBR"];
					
					isfound = true;
				}
				
				if(oldMappedChild["BIZDOMAIN"] == createdObj["BIZDOMAIN"] &&
						oldMappedChild["BIZDOMAIN_VALUE"] == createdObj["BIZDOMAIN_VALUE"]
				){
					oldMapping[om]["childValueStandardChoiceModel"] = createdObj;
					oldMapping[om]["CHILD_VAL_ID"] = createdObj["BDV_SEQ_NBR"];
					
					isfound = true;
				}
				
				if(isfound){
					oldMapping[om]["MAPPING_ID"] = null;
					
					oldMapping[om]["parentValueStandardChoiceModel"]["RES_ID"] = null;
					oldMapping[om]["childValueStandardChoiceModel"]["RES_ID"] = null;
					
					newMapping.push(oldMapping[om]);
				}
			}
		}
		
		logDebug("newMapping:: " + JSON.stringify(stringifyJSType(newMapping)));
		
		if(newMapping != null && newMapping.length > 0){
			try{
				var resultDrillDownMapping = ConfigEngineAPI.createDrillDownMapping(newMapping, true, skipDelete);
				logDebug("resultDrillDownMapping:: " + JSON.stringify(stringifyJSType(resultDrillDownMapping)));
			}catch(e){
				logDebug('Error Creating newMapping: ' + e);
				throw e;
			}
			
		}
		
	}else{
		result = ConfigEngineAPI.createSharedDropDown(json, override);
	}
	
	var res = {
			"message": "Success",
			"content": result
		};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchSmartChoice(){
	logDebug("cmd_searchSmartChoice.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchSmartChoice(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createSmartChoice(){
logDebug("cmd_createSmartChoice.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createSmartChoice(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchTaskSpecInfoGroup(){
	logDebug("cmd_searchTaskSpecInfoGroup.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchTaskSpecInfoGroup(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createTaskSpecInfoGroup(){
logDebug("cmd_createTaskSpecInfoGroup.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createTaskSpecInfoGroup(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchTimeAccountGroup() {
	logDebug("cmd_searchTimeAccountGroup.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);

	var groupCode = toJson(params);
	logDebug("groupCode: " + groupCode[1]);

	var result = ConfigEngineAPI.searchTimeAccountGroup(groupCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message" : "Success",
		"content" : result
	};

	return res;
}

function cmd_createTimeAccountGroup() {
	logDebug("cmd_createTimeAccountGroup.......................................");

	var params = param("params");
	logDebug("params: " + params);

	var json = param("json");
	printJson("json", json);

	var action = param("action");
	logDebug("action: " + action);

	var override = param("override");
	logDebug("override: " + override);

	var params2 = param("params2");
	logDebug("params2: " + params2);

	override = override == 'true' || override == 'TRUE' || override == 'True' ? true
			: false;

	var groupCode = toJson(params);
	logDebug("groupCode: " + groupCode[1]);

	json = toJson(json);

//	for(var i in json){
//		var xtypes = json[i]["xtimeGroupTypeModels"]
//		for(var j in xtypes){
//			var xtypeJson = xtypes[j]
//			var typeModels = ConfigEngineAPI.searchTimeTypeModel(xtypeJson["TIME_TYPE_NAME"], null, false);
//			if(typeModels.length > 0){
//				xtypeJson["TIME_TYPE_SEQ"] = typeModels[0]["TIME_TYPE_SEQ"]
//			}
//		}
//	}
//	
//	logDebug("json-xtimeGroupTypeModels: " + JSON.stringify(stringifyJSType(json)));
	
	var result = ConfigEngineAPI.createTimeAccountGroup(json, override);

	var res = {
		"message" : "Success",
		"content" : result
	};

	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_searchTimeGroupSecurityModel() {
	logDebug("cmd_searchTimeGroupSecurityModel.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);

	var groupCode = toJson(params);
	logDebug("groupCode: " + groupCode[1]);
	
	var resultTimeGroup = ConfigEngineAPI.searchTimeAccountGroup(groupCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(resultTimeGroup)));
	
	var result = [];
	var map = new java.util.HashMap();
	
	for(counter in resultTimeGroup){
		var seq = resultTimeGroup[counter]['TIME_GROUP_SEQ'];
		
		if(map.get(seq) == null){
			var securityModel = ConfigEngineAPI.searchSecurityModel('TimeGroupSec', seq, false);
			for(sCounter in securityModel){
				result.push(securityModel[sCounter]);
			}
			map.put(seq, seq);
		}
	}

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchTimeTypeModel(){
	logDebug("cmd_searchTimeTypeModel.......................................");
	
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);

	var groupCode = toJson(params);
	logDebug("groupCode: " + groupCode[1]);
	
	var resultTimeGroup = ConfigEngineAPI.searchTimeAccountGroup(groupCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(resultTimeGroup)));
	
	var result = [];
	
	for(counter in resultTimeGroup){
		var xTypeModels = resultTimeGroup[counter]['xtimeGroupTypeModels'];
		
		for(var t in xTypeModels){
			var typeModels = ConfigEngineAPI.searchTimeTypeModel(null, xTypeModels[t]["TIME_TYPE_SEQ"], false);
			result.push(typeModels[0]);
		}
	}

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchDrillDownList(){
	logDebug("cmd_searchDrillDownList.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchDrillDownList(serviceCode[1]);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchDrillDownModel(){
	logDebug("cmd_searchDrillDownModel.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchDrillDownModel(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createDrillDownModel(){
logDebug("cmd_createDrillDownModel.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var jsonInputOrg = JSON.parse(JSON.stringify(json));//Clone Object
	
	var result;
	
	if(override){
		var oldDrillDownModel = ConfigEngineAPI.searchDrillDownModel(serviceCode[1], false);
		logDebug('##oldDrillDownModel: ' + JSON.stringify(stringifyJSType(oldDrillDownModel)));
		
		var oldMapping = [];
		for(odmm in oldDrillDownModel[0]["drillDownSeriesModels"]){
			for(odmmZ in oldDrillDownModel[0]["drillDownSeriesModels"][odmm]["zipDrillDownValueMapModels"]){
				oldMapping.push(oldDrillDownModel[0]["drillDownSeriesModels"][odmm]["zipDrillDownValueMapModels"][odmmZ]);
			}
		}
		logDebug('##oldMapping: ' + JSON.stringify(stringifyJSType(oldMapping)));
		
		if(override && oldMapping.length > 0){
			//Delete Old Mapping
			logDebug('Delete Old Mapping ......................');
			ConfigEngineAPI.deleteDrillDownMapping(oldMapping);
		}
		
		//Deleting Current drillDownRelationModel
		var drillDownRelationModel = {};
		drillDownRelationModel.DRILLDOWN_TYPE = "APPLICATION";
		drillDownRelationModel.DRLLD_ID = oldDrillDownModel[0]["DRLLD_ID"];
		drillDownRelationModel.ENTITY_KEY1 = oldDrillDownModel[0]["ASITAB_GRP_NAM"];
		drillDownRelationModel.ENTITY_KEY2 = oldDrillDownModel[0]["ASITAB_SUBGRP_NAM"];
		drillDownRelationModel.PRIMARY_FLG = "Y";
		drillDownRelationModel.SERV_PROV_CODE = oldDrillDownModel[0]["SERV_PROV_CODE"];
		logDebug('##Going to delete drillDownRelationModel: ' + JSON.stringify(stringifyJSType(drillDownRelationModel)));
		ConfigEngineAPI.Delete([drillDownRelationModel], 'com.accela.orm.model.asi.DrillDownRelationModel');
		
		//Delete Current SeriesModel
		var drillDownSeriesModels = json[0]["drillDownSeriesModels"];
		logDebug('##Going to delete drillDownSeriesModels: ' + JSON.stringify(stringifyJSType(drillDownSeriesModels)));
		ConfigEngineAPI.Delete(drillDownSeriesModels, 'com.accela.orm.model.asi.DrillDownSeriesModel');
		json[0]["drillDownSeriesModels"] = null;
		
		//Creating New DrillDownModel
		logDebug('##Create New DrillDownModel ......................');
		logDebug('##json: ' + JSON.stringify(stringifyJSType(json)));
		result = ConfigEngineAPI.createDrillDownModel(json, override);//
		
		//Getting the new created DrillDownModel
		logDebug('##Getting New DrillDownModel ......................');
		var newDrillDownModel = ConfigEngineAPI.searchDrillDownModel(serviceCode[1], false);
		logDebug('##newDrillDownModel: ' + JSON.stringify(stringifyJSType(newDrillDownModel)));
		
		//Edit and insert the new SeriesModel 
		for(ds in drillDownSeriesModels){
			drillDownSeriesModels[ds]["DRLLD_ID"] = newDrillDownModel[0]["DRLLD_ID"];
			drillDownSeriesModels[ds]["DRLLD_SERIES_ID"] = null;
			drillDownSeriesModels[ds]["childSharedDropDownModel"]["LEVEL3"] = newDrillDownModel[0]["DRLLD_ID"];
			drillDownSeriesModels[ds]["parentSharedDropDownModel"]["LEVEL3"] = newDrillDownModel[0]["DRLLD_ID"];
			drillDownSeriesModels[ds]["zipDrillDownValueMapModels"] = null;
		}
		logDebug('##Going to Create drillDownSeriesModels: ' + JSON.stringify(stringifyJSType(drillDownSeriesModels)));
		for(dsm in drillDownSeriesModels){
			var searchJSON = {};
			searchJSON.ASITAB_GRP_NAM = drillDownSeriesModels[dsm]["ASITAB_GRP_NAM"];
			searchJSON.ASITAB_SUBGRP_NAM = drillDownSeriesModels[dsm]["ASITAB_SUBGRP_NAM"];
			searchJSON.CHILD_COL_NAME = drillDownSeriesModels[dsm]["CHILD_COL_NAME"];
			searchJSON.PARENT_COL_NAME = drillDownSeriesModels[dsm]["PARENT_COL_NAME"];
			
			logDebug('##Going to Create drillDownSeriesModel[dsm]: ' + JSON.stringify(stringifyJSType(drillDownSeriesModels[dsm])));
			var creatingDrillDownSeriesModelsResult = ConfigEngineAPI.createdrillDownSeriesModels(drillDownSeriesModels[dsm], true, searchJSON);
			logDebug('##creatingDrillDownSeriesModelsResult: ' + JSON.stringify(stringifyJSType(creatingDrillDownSeriesModelsResult)));
		}
		
		//Edit and create the new RelationalModel
		drillDownRelationModel.DRLLD_ID = newDrillDownModel[0]["DRLLD_ID"];
		logDebug('##Going to Create drillDownRelationModel: ' + JSON.stringify(stringifyJSType(drillDownRelationModel)));
		var creatingDrillDownRelationModelResult = ConfigEngineAPI.createDrillDownRelationModel(drillDownRelationModel, true, drillDownRelationModel);
		logDebug('##creatingDrillDownRelationModelResult: ' + JSON.stringify(stringifyJSType(creatingDrillDownRelationModelResult)));
		
		//Getting the new created DrillDownModel
		logDebug('##Getting New DrillDownModel ......................');
		newDrillDownModel = ConfigEngineAPI.searchDrillDownModel(serviceCode[1], false);
		logDebug('##newDrillDownModel: ' + JSON.stringify(stringifyJSType(newDrillDownModel)));
		
		//Preparing the new mapping
		var newMapping = [];
		for(om in oldMapping){
			for(odmm in newDrillDownModel[0]["drillDownSeriesModels"]){
				if(oldMapping[om]["childValueStandardChoiceModel"]["BIZDOMAIN"] == 
					newDrillDownModel[0]["drillDownSeriesModels"][odmm]["childSharedDropDownModel"]["BIZDOMAIN"] 
				&&
					oldMapping[om]["parentValueStandardChoiceModel"]["BIZDOMAIN"] ==
					newDrillDownModel[0]["drillDownSeriesModels"][odmm]["parentSharedDropDownModel"]["BIZDOMAIN"])
					{
						oldMapping[om]["DRLLD_SERIES_ID"] = newDrillDownModel[0]["drillDownSeriesModels"][odmm]["DRLLD_SERIES_ID"];
						oldMapping[om]["DRLLD_ID"] = newDrillDownModel[0]["drillDownSeriesModels"][odmm]["DRLLD_ID"];
						newMapping.push(oldMapping[om]);
					}
			}
		}
		logDebug('##newMapping: ' + JSON.stringify(stringifyJSType(newMapping)));
		
		//Creating teh new mapping
		if(newMapping != null && newMapping.length > 0){
			var resultDrillDownMapping = ConfigEngineAPI.createDrillDownMapping(newMapping, true);
			logDebug("##resultDrillDownMapping:: " + JSON.stringify(stringifyJSType(resultDrillDownMapping)));
		}
		
	}else{
		result = ConfigEngineAPI.createDrillDownModel(json, override);
	}
	
	var res = {
		"message": "Success",
		"content": result
	};
	if(result["success"] == true){
		archive_GITHUB("Drilldown", String(jsonInputOrg[0]["DRLLD_NAME"]), jsonInputOrg, result, override);
	}

	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchDrillDownMapping(){
	logDebug("cmd_searchDrillDownMapping.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var resultDrillDownModel = ConfigEngineAPI.searchDrillDownModel(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(resultDrillDownModel)));
	
	var drillDownID = resultDrillDownModel[0]["DRLLD_ID"];
	logDebug("drillDownID: " + drillDownID);
	
	var result = ConfigEngineAPI.searchDrillDownMapping(drillDownID, false);

	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

var sharedDropDownMap = new java.util.HashMap();

function cmd_createDrillDownMapping(){
	logDebug("cmd_createDrillDownMapping.......................................");
	
	var result = '';
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var resultDrillDownModel = ConfigEngineAPI.searchDrillDownModel(serviceCode[1], false);
	logDebug('resultDrillDownModel: ' + JSON.stringify(stringifyJSType(resultDrillDownModel)));
	
	var oldMapping = ConfigEngineAPI.searchDrillDownMapping(resultDrillDownModel[0]["DRLLD_ID"], false);
	logDebug('oldMapping: ' + JSON.stringify(stringifyJSType(oldMapping)));
	
	if(override && oldMapping.length > 0){
		//Delete Old Mapping
		logDebug('Delete Old Mapping ......................');
		ConfigEngineAPI.deleteDrillDownMapping(oldMapping);
	}
	
	for(c in json){
		json[c]["DRLLD_ID"] = resultDrillDownModel[0]["DRLLD_ID"];
		
		var seriesFound = false;
		for(cdrll in resultDrillDownModel[0]["drillDownSeriesModels"]){
			if(
				resultDrillDownModel[0]["drillDownSeriesModels"][cdrll]["childSharedDropDownModel"]["BIZDOMAIN"] == json[c]["childValueStandardChoiceModel"]["BIZDOMAIN"]
				&&
				resultDrillDownModel[0]["drillDownSeriesModels"][cdrll]["parentSharedDropDownModel"]["BIZDOMAIN"] == json[c]["parentValueStandardChoiceModel"]["BIZDOMAIN"]
			){
				json[c]["DRLLD_SERIES_ID"] = resultDrillDownModel[0]["drillDownSeriesModels"][cdrll]["DRLLD_SERIES_ID"];
				seriesFound = true;
			}
		}
		
		if(seriesFound == false){
			throw "No series mapping found for " + json[c]["parentValueStandardChoiceModel"]["BIZDOMAIN"] + " : " + json[c]["childValueStandardChoiceModel"]["BIZDOMAIN"];
		}
		
		var sharedDropdown = getSharedDropDown(json[c]["childValueStandardChoiceModel"]["BIZDOMAIN"]);
		for(csdd in sharedDropdown["sharedDropDownValueModels"]){
			if(
				json[c]["childValueStandardChoiceModel"]["BIZDOMAIN"] == sharedDropdown["sharedDropDownValueModels"][csdd]["BIZDOMAIN"]
				&&
				json[c]["childValueStandardChoiceModel"]["BIZDOMAIN_VALUE"] == sharedDropdown["sharedDropDownValueModels"][csdd]["BIZDOMAIN_VALUE"]
			){
				json[c]["CHILD_VAL_ID"] = sharedDropdown["sharedDropDownValueModels"][csdd]["BDV_SEQ_NBR"];
				json[c]["childValueStandardChoiceModel"]["BDV_SEQ_NBR"] = sharedDropdown["sharedDropDownValueModels"][csdd]["BDV_SEQ_NBR"];
				json[c]["childValueStandardChoiceModel"]["SORT_ORDER"] = sharedDropdown["sharedDropDownValueModels"][csdd]["SORT_ORDER"];
				json[c]["childValueStandardChoiceModel"]["VALUE_DESC"] = sharedDropdown["sharedDropDownValueModels"][csdd]["VALUE_DESC"];
				json[c]["childValueStandardChoiceModel"]["standardChoiceValueI18NModels"] = sharedDropdown["sharedDropDownValueModels"][csdd]["standardChoiceValueI18NModels"];
			}
		}
		
		logDebug("json[c][\"parentValueStandardChoiceModel\"][\"BIZDOMAIN\"]: " + json[c]["parentValueStandardChoiceModel"]["BIZDOMAIN"]);
		sharedDropdown = getSharedDropDown(json[c]["parentValueStandardChoiceModel"]["BIZDOMAIN"]);
		logDebug('sharedDropdown Parent: ' + JSON.stringify(stringifyJSType(sharedDropdown)));
		for(csddp in sharedDropdown["sharedDropDownValueModels"]){
			if(
				json[c]["parentValueStandardChoiceModel"]["BIZDOMAIN"] == sharedDropdown["sharedDropDownValueModels"][csddp]["BIZDOMAIN"]
				&&
				json[c]["parentValueStandardChoiceModel"]["BIZDOMAIN_VALUE"] == sharedDropdown["sharedDropDownValueModels"][csddp]["BIZDOMAIN_VALUE"]
			){
				json[c]["PARENT_VAL_ID"] = sharedDropdown["sharedDropDownValueModels"][csddp]["BDV_SEQ_NBR"];
				json[c]["parentValueStandardChoiceModel"]["BDV_SEQ_NBR"] = sharedDropdown["sharedDropDownValueModels"][csddp]["BDV_SEQ_NBR"];
				json[c]["parentValueStandardChoiceModel"]["SORT_ORDER"] = sharedDropdown["sharedDropDownValueModels"][csddp]["SORT_ORDER"];
				json[c]["parentValueStandardChoiceModel"]["VALUE_DESC"] = sharedDropdown["sharedDropDownValueModels"][csddp]["VALUE_DESC"];
				json[c]["parentValueStandardChoiceModel"]["standardChoiceValueI18NModels"] = sharedDropdown["sharedDropDownValueModels"][csddp]["standardChoiceValueI18NModels"];
			}
		}
	}
	
	logDebug('json Updated: ' + JSON.stringify(stringifyJSType(json)));
	
	var jsonInputOrg = JSON.parse(JSON.stringify(json));//Clone Object
	
	result = ConfigEngineAPI.createDrillDownMapping(json, override);
	
//	var result = {
//			"success": false,
//			"exists": true
//		};
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	if(result["success"] == true){
		archive_GITHUB("Drilldown Mapping", String(serviceCode[1]), jsonInputOrg, result, override);
	}
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function getSharedDropDown(serviceCode){
	
	if(!sharedDropDownMap.get(serviceCode)){
		logDebug('###NOT FOUND...............');
		sharedDropDownMap.put(serviceCode, ConfigEngineAPI.searchSharedDropDown(serviceCode, false)[0]);
	}else{
		logDebug('###FOUND...............');
	}
	
	return sharedDropDownMap.get(serviceCode);
	
}

function cmd_searchSheetsToBeHidden(){
	logDebug('cmd_searchSheetsToBeHidden....................................');
	return {};
}

function cmd_loadASI_ASIT_Configurations(){
	logDebug('loadASI_ASIT_Configurations...............................');
	var params = param("params");
	logDebug("params: " + params);
	
	var serviceCode = toJson(params)[0];
	logDebug("serviceCode: " + serviceCode);
	
	var result = ConfigEngineAPI.loadASI_ASIT_Configurations(serviceCode);

	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_loadUserConfigurations(){
	logDebug('cmd_loadUserConfigurations....................................');
	var params = param("params");
	logDebug("params: " + params);
	
	var serviceCode = toJson(params)[0];
	logDebug("serviceCode: " + serviceCode);
	
	var user_name = toJson(params)[1];
	logDebug("user_name: " + user_name);
	
	var result = ConfigEngineAPI.loadUserConfigurations(serviceCode, user_name);

	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchPageFlowModel(){
	logDebug("cmd_searchPageFlowModel.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchCapTypeCitizenAccessModel(serviceCode[1], false);
	
	if(result == null || result.length == 0){
		result = ConfigEngineAPI.searchPageFlowModel(serviceCode[1], false);
	}
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_createPageFlowModel(){
logDebug("cmd_createPageFlowModel.......................................");
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var override = param("override");
	logDebug("override: " + override);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	json = toJson(json);
	
	var result = "";
	
	var connectWithRT = false;
	var pfName = '';
	var group = '';
	var type = '';
	var sub_type = '';
	var category = '';
	
	if(json[0]["pageFlowModel"] != null && json[0]["pageFlowModel"] != ""){
		connectWithRT = true;
		
		pfName = json[0]["R1_SMARTCHOICE_CODE_FOR_ACA"];
		group = json[0]["R1_PER_GROUP"];
		type = json[0]["R1_PER_TYPE"];
		sub_type = json[0]["R1_PER_SUB_TYPE"];
		category = json[0]["R1_PER_CATEGORY"];
		
		json = json[0]["pageFlowModel"];
	}
	
	result = ConfigEngineAPI.createPageFlowModel(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	if(override == true && connectWithRT == true && result['success'] == true && result['exists'] == false){
		logDebug("Going to connect the PageFlow with ApplicationType");
		ConfigEngineAPI.connectAppTypeWithPF(serviceCode[0], pfName, group, type, sub_type, category);
	}
	
	
	//
	
	return res;
}

function cmd_searchWorkFlowModel(){
	logDebug("cmd_searchWorkFlowModel.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchWorkflowModel(serviceCode[1], false);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_createWorkFlowModel(){
	logDebug("cmd_createWorkFlowModel.......................................");
	
	var json = param("json");
	logDebug("json: " + json);
	json = toJson(json);
	printJson("WF JSON:: ", json);
	
	var wfCode = param("wfcode");
	logDebug("wfCode: " + wfCode);
	
	var flowStyle = param("flowStyle");
	logDebug("flowStyle: " + flowStyle);
	
	var override = param("override");
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	logDebug("override: " + override);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var serv_prov_code = param("serv_prov_code");
	logDebug("serv_prov_code: " + serv_prov_code);
	
	var result = ConfigEngineAPI.createWorkFlowModel(serv_prov_code, json, wfCode, flowStyle, true);//override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("createWorkFlowModel:Result:: " + JSON.stringify(stringifyJSType(res)));
}

function cmd_searchApplicationStatusList() {
	logDebug('cmd_searchApplicationStatusList..........................................');
	var params = param("params");
	var sql = param("sql");

	var paramsArr = toJson(params);
	var result = ConfigEngineAPI.searchApplicationStatusList(paramsArr[1], true);
	var res = {
		"message": "Success",
		"content": result
	};

	logDebug("searchApplicationStatusList:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchTSIList() {
	logDebug('cmd_searchTSIList..........................................');
	var params = param("params");
	var sql = param("sql");

	var paramsArr = toJson(params);
	var result = ConfigEngineAPI.searchTSIList(paramsArr[0], true);
	var res = {
		"message": "Success",
		"content": result
	};

	logDebug("searchTSIList:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchDepartmentList() {
	logDebug('cmd_searchDepartmentList..........................................');
	var params = param("params");
	var sql = param("sql");

	var paramsArr = toJson(params);
	var result = ConfigEngineAPI.searchDepartmentList(paramsArr[0], true);
	var res = {
		"message": "Success",
		"content": result
	};

	logDebug("searchDepartmentList:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchDepartmentListFlow() {
	logDebug('cmd_searchDepartmentListFlow..........................................');
	var params = param("params");
	var sql = param("sql");

	var paramsArr = toJson(params);
	var result = ConfigEngineAPI.searchDepartmentListFlow(paramsArr[0], paramsArr[1], true);
	var res = {
		"message": "Success",
		"content": result
	};

	logDebug("searchDepartmentList:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}


//aa.env.setValue("action", "createPageFlowModel");
//aa.env.setValue("override", "true");
//aa.env.setValue("params", "[\"ADMA\", \"HASH_PF2\"]");
//aa.env.setValue("json", '[{"R1_DOC_CODE_FOR_ACA":null,"R1_PER_CATEGORY":"HASH","R1_PER_GROUP":"Building","R1_PER_SUB_TYPE":"Certificates","R1_PER_TYPE":"Workbook","R1_SMARTCHOICE_CODE_FOR_ACA":"HASH_PF2","RENEWAL_CATEGORY":null,"RENEWAL_GROUP":null,"RENEWAL_SUB_TYPE":null,"RENEWAL_TYPE":null,"SERV_PROV_CODE":"ADMA","pageFlowModel":{"PAGE_FLOW_TYPE":"PERMIT","PF_GROUP_CODE":"HASH_PF2","SERV_PROV_CODE":"ADMA","stepModels":[{"DISPLAY_ORDER":"0","PF_GROUP_CODE":"HASH_PF2","RES_ID":null,"SERV_PROV_CODE":"ADMA","STEP_ID":null,"STEP_NAME":"Applicant Page","pageModels":[{"AFTERCLICK_SCRIPT_NAME":null,"BEFORECLICK_SCRIPT_NAME":null,"DISPLAY_ORDER":"0","INSTRUCTION":null,"ONLOAD_SCRIPT_NAME":null,"PAGE_ID":null,"PAGE_NAME":"Applicant Page Step","PF_GROUP_CODE":"HASH_PF2","RES_ID":null,"SERV_PROV_CODE":"ADMA","STEP_ID":null,"pageComponentModels":[{"COMPONENT_ID":"5","COMPONENT_INSTRUCTION":null,"COMPONENT_NAME":"Applicant","COMPONENT_SEQ_NBR":null,"CUSTOM_HEADING":"Applicant","DISPLAY_FLG":null,"DISPLAY_ORDER":"0","EDITABLE_FLG":"Y","PAGE_ID":null,"PF_GROUP_CODE":"HASH_PF2","PORTLET_RANGE1":null,"PORTLET_RANGE2":null,"REQUIRED_FLG":"Y","RES_ID":null,"SERV_PROV_CODE":"ADMA","VALIDATE_FLG":"N"},{"COMPONENT_ID":"1","COMPONENT_INSTRUCTION":null,"COMPONENT_NAME":"Address","COMPONENT_SEQ_NBR":null,"CUSTOM_HEADING":"Address","DISPLAY_FLG":null,"DISPLAY_ORDER":"1","EDITABLE_FLG":"Y","PAGE_ID":null,"PF_GROUP_CODE":"HASH_PF2","PORTLET_RANGE1":null,"PORTLET_RANGE2":null,"REQUIRED_FLG":"Y","RES_ID":null,"SERV_PROV_CODE":"ADMA","VALIDATE_FLG":"N"},{"COMPONENT_ID":"22","COMPONENT_INSTRUCTION":null,"COMPONENT_NAME":"Assets","COMPONENT_SEQ_NBR":null,"CUSTOM_HEADING":"Assets","DISPLAY_FLG":null,"DISPLAY_ORDER":"2","EDITABLE_FLG":"N","PAGE_ID":null,"PF_GROUP_CODE":"HASH_PF2","PORTLET_RANGE1":null,"PORTLET_RANGE2":null,"REQUIRED_FLG":"Y","RES_ID":null,"SERV_PROV_CODE":"ADMA","VALIDATE_FLG":"N"}],"pageI18NModels":[{"INSTRUCTION":null,"LANG_ID":"ar_AE","PAGE_NAME":"مقدم الطلب","RES_ID":null,"SERV_PROV_CODE":"ADMA"},{"INSTRUCTION":null,"LANG_ID":"en_US","PAGE_NAME":"Applicant Page Step","RES_ID":null,"SERV_PROV_CODE":"ADMA"}]}],"stepI18NModels":[{"LANG_ID":"ar_AE","RES_ID":null,"SERV_PROV_CODE":"ADMA","STEP_NAME":"صفحة مقدم الطلب"},{"LANG_ID":"en_US","RES_ID":null,"SERV_PROV_CODE":"ADMA","STEP_NAME":"Applicant Page"}]},{"DISPLAY_ORDER":"2","PF_GROUP_CODE":"HASH_PF2","RES_ID":null,"SERV_PROV_CODE":"ADMA","STEP_ID":null,"STEP_NAME":"Documents Page","pageModels":[{"AFTERCLICK_SCRIPT_NAME":null,"BEFORECLICK_SCRIPT_NAME":null,"DISPLAY_ORDER":"0","INSTRUCTION":null,"ONLOAD_SCRIPT_NAME":null,"PAGE_ID":null,"PAGE_NAME":"Attachements","PF_GROUP_CODE":"HASH_PF2","RES_ID":null,"SERV_PROV_CODE":"ADMA","STEP_ID":null,"pageComponentModels":[{"COMPONENT_ID":"13","COMPONENT_INSTRUCTION":null,"COMPONENT_NAME":"Attachment","COMPONENT_SEQ_NBR":null,"CUSTOM_HEADING":"Attachment","DISPLAY_FLG":null,"DISPLAY_ORDER":"0","EDITABLE_FLG":"N","PAGE_ID":null,"PF_GROUP_CODE":"HASH_PF2","PORTLET_RANGE1":null,"PORTLET_RANGE2":null,"REQUIRED_FLG":"N","RES_ID":null,"SERV_PROV_CODE":"ADMA","VALIDATE_FLG":"N"}],"pageI18NModels":[{"INSTRUCTION":null,"LANG_ID":"ar_AE","PAGE_NAME":"المرفقات","RES_ID":null,"SERV_PROV_CODE":"ADMA"},{"INSTRUCTION":null,"LANG_ID":"en_US","PAGE_NAME":"Attachements","RES_ID":null,"SERV_PROV_CODE":"ADMA"}]}],"stepI18NModels":[{"LANG_ID":"ar_AE","RES_ID":null,"SERV_PROV_CODE":"ADMA","STEP_NAME":"الوثائق"},{"LANG_ID":"en_US","RES_ID":null,"SERV_PROV_CODE":"ADMA","STEP_NAME":"Documents Page"}]},{"DISPLAY_ORDER":"1","PF_GROUP_CODE":"HASH_PF2","RES_ID":null,"SERV_PROV_CODE":"ADMA","STEP_ID":null,"STEP_NAME":"General Information Page","pageModels":[{"AFTERCLICK_SCRIPT_NAME":null,"BEFORECLICK_SCRIPT_NAME":null,"DISPLAY_ORDER":"0","INSTRUCTION":null,"ONLOAD_SCRIPT_NAME":null,"PAGE_ID":null,"PAGE_NAME":"Information 1","PF_GROUP_CODE":"HASH_PF2","RES_ID":null,"SERV_PROV_CODE":"ADMA","STEP_ID":null,"pageComponentModels":[{"COMPONENT_ID":"10","COMPONENT_INSTRUCTION":null,"COMPONENT_NAME":"ASI","COMPONENT_SEQ_NBR":null,"CUSTOM_HEADING":"ASI","DISPLAY_FLG":null,"DISPLAY_ORDER":"0","EDITABLE_FLG":"N","PAGE_ID":null,"PF_GROUP_CODE":"HASH_PF2","PORTLET_RANGE1":"HASH_ASI","PORTLET_RANGE2":"APPLICATION INFORMATION","REQUIRED_FLG":"N","RES_ID":null,"SERV_PROV_CODE":"ADMA","VALIDATE_FLG":"N"},{"COMPONENT_ID":"10","COMPONENT_INSTRUCTION":null,"COMPONENT_NAME":"ASI","COMPONENT_SEQ_NBR":null,"CUSTOM_HEADING":"ASI","DISPLAY_FLG":null,"DISPLAY_ORDER":"1","EDITABLE_FLG":"N","PAGE_ID":null,"PF_GROUP_CODE":"HASH_PF2","PORTLET_RANGE1":"ACUD01","PORTLET_RANGE2":"BUILDING INFO","REQUIRED_FLG":"N","RES_ID":null,"SERV_PROV_CODE":"ADMA","VALIDATE_FLG":"N"}],"pageI18NModels":[{"INSTRUCTION":null,"LANG_ID":"ar_AE","PAGE_NAME":"معلومات 1","RES_ID":null,"SERV_PROV_CODE":"ADMA"},{"INSTRUCTION":null,"LANG_ID":"en_US","PAGE_NAME":"Information 1","RES_ID":null,"SERV_PROV_CODE":"ADMA"}]},{"AFTERCLICK_SCRIPT_NAME":null,"BEFORECLICK_SCRIPT_NAME":null,"DISPLAY_ORDER":"1","INSTRUCTION":null,"ONLOAD_SCRIPT_NAME":null,"PAGE_ID":null,"PAGE_NAME":"Information 2","PF_GROUP_CODE":"HASH_PF2","RES_ID":null,"SERV_PROV_CODE":"ADMA","STEP_ID":null,"pageComponentModels":[{"COMPONENT_ID":"11","COMPONENT_INSTRUCTION":null,"COMPONENT_NAME":"ASI Table","COMPONENT_SEQ_NBR":null,"CUSTOM_HEADING":"ASI Table","DISPLAY_FLG":null,"DISPLAY_ORDER":"0","EDITABLE_FLG":"N","PAGE_ID":null,"PF_GROUP_CODE":"HASH_PF2","PORTLET_RANGE1":"HASH_ASIT","PORTLET_RANGE2":"HASH_ASIT","REQUIRED_FLG":"N","RES_ID":null,"SERV_PROV_CODE":"ADMA","VALIDATE_FLG":"N"},{"COMPONENT_ID":"11","COMPONENT_INSTRUCTION":null,"COMPONENT_NAME":"ASI Table","COMPONENT_SEQ_NBR":null,"CUSTOM_HEADING":"ASI Table","DISPLAY_FLG":null,"DISPLAY_ORDER":"1","EDITABLE_FLG":"N","PAGE_ID":null,"PF_GROUP_CODE":"HASH_PF2","PORTLET_RANGE1":"ABD","PORTLET_RANGE2":"ABD","REQUIRED_FLG":"N","RES_ID":null,"SERV_PROV_CODE":"ADMA","VALIDATE_FLG":"N"}],"pageI18NModels":[{"INSTRUCTION":null,"LANG_ID":"ar_AE","PAGE_NAME":"معلومات 2","RES_ID":null,"SERV_PROV_CODE":"ADMA"},{"INSTRUCTION":null,"LANG_ID":"en_US","PAGE_NAME":"Information 2","RES_ID":null,"SERV_PROV_CODE":"ADMA"}]}],"stepI18NModels":[{"LANG_ID":"ar_AE","RES_ID":null,"SERV_PROV_CODE":"ADMA","STEP_NAME":"معلومات عامة"},{"LANG_ID":"en_US","RES_ID":null,"SERV_PROV_CODE":"ADMA","STEP_NAME":"General Information Page"}]}]}}]');


run();
/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_ACCELA_GLOBAL_WORKBOOK.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ADMIN
| Created at	: 24/09/2020 02:52:00
|
/------------------------------------------------------------------------------------------------------*/
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
/*------------------------------------------------------------------------------------------------------*/
eval(getScriptText("INCLUDE_CONFIG_GLOBAL_API"));
eval(getScriptText("INCLUDE_BASESERVICE"));

var skipDelete = true;

/*------------------------------------------------------------------------------------------------------*/
function cmd_getAllTimeAccountGroups() {
	logDebug('cmd_getAllTimeAccountGroups..........................................');
	var result = ConfigEngineAPI.getAllTimeAccountGroups(false);
	var res = {
		"message": "Success",
		"content": result
	};

	return res;
}

function cmd_updateTimeAccountGroups() {
	logDebug("cmd_updateTimeAccountGroups.......................................");
	var params = param("params");
	printJson("params", params);
	var json = param("json");
	printJson("json", json);
	var override = param("override");
	var Delete = param("delete");

	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;

	json = toJson(json);
	
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object

	var result = ConfigEngineAPI.updateTimeAccountGroups(json, override, Delete);

	var res = {
		"message": "Success",
		"content": result
	};
	
	if(result["success"] == true){
		archive_GITHUB("Time Accounting Group", params[0], jsonInputCloned, result, override);
	}

	return res;
}

function cmd_getAllTimeAccountTypes() {
	var result = ConfigEngineAPI.getAllTimeAccountTypes(false);
	var res = {
		"message": "Success",
		"content": result
	};

	return res;
}

function cmd_updateTimeAccountTypes() {
	logDebug("cmd_updateTimeAccountTypes.......................................");
	var params = param("params");
	var json = param("json");
	printJson("json", json);
	var override = param("override");
	var Delete = param("delete");

	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	Delete = Delete == 'true' || Delete == 'TRUE' || Delete == 'True' ? true : false;
//	Delete = true;

	json = toJson(json);
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object

	var result = ConfigEngineAPI.updateTimeAccountTypes(json, override, Delete);

	var res = {
		"message": "Success",
		"content": result
	};
	
	if(result["success"] == true){
		archive_GITHUB("Time Accounting Type", params[0], jsonInputCloned, result, override);
	}

	return res;
}

function cmd_getAllTimeTypesGroupsMapping() {
	var result = ConfigEngineAPI.getAllTimeTypesGroupsMapping();
	var res = {
		"message": "Success",
		"content": result
	};

	return res;
}

function cmd_updateTimeTypesGroupsMapping() {
	logDebug('cmd_updateTimeTypesGroupsMapping..........................................');
	var params = param("params");
	printJson("params", params);
	var json = param("json");
	printJson("json", json);
	var override = param("override");

	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;

	json = toJson(json);
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object

	var result = ConfigEngineAPI.updateTimeTypesGroupsMapping(json, override);

	var res = {
		"message": "Success",
		"content": result
	};
	
	if(result["success"] == true){
		
		var mapping = [];
		for(var m in jsonInputCloned){
			
			var timeTypeName = jsonInputCloned[m]["TIME_TYPE_NAME"];
			var timeGroupModel = jsonInputCloned[m]["timeGroupModel"];
			
			for(var g in timeGroupModel){
				var obj = {};
				obj["TIME_TYPE_NAME"] = timeTypeName;
				obj["TIME_GROUP_NAME"] = timeGroupModel[g]["TIME_GROUP_NAME"];
				
				mapping.push(obj);
			}
			
		}
		
		archive_GITHUB("Time Types Groups Mapping", params[0], mapping, result, override);
	}

	return res;
}

function cmd_searchUserProfile(){
	logDebug('cmd_getAllUsersInfo..........................................');
	var params = param("params");
	var sql = param("sql");

	params = toJson(params);

	var result = ConfigEngineAPI.searchUserProfile(params[0], params[1], false);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("searchUserProfile:Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_createUpdateUserProfile() {
	var json = param("json");
	var override = param("override");

	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;

	json = toJson(json);
	

	var result = ConfigEngineAPI.createUpdateUserProfile(json, override);

	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("createUpdateUserProfile:Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}


function cmd_getAllUsersInfo() {
	logDebug('cmd_getAllUsersInfo..........................................');
	var params = param("params");
	var sql = param("sql");

	var groupCode = toJson(params);

	var result = ConfigEngineAPI.getAllUsersInfo(groupCode[1], false);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("AllUsersInfo:Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_getAllUsers() {
	logDebug('cmd_getAllUsers..........................................');
	var params = param("params");
	var sql = param("sql");

	var result = ConfigEngineAPI.getAllUsers(true);
	var res = {
		"message": "Success",
		"content": result
	};

	logDebug("getAllUsers:Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchAllUsersList() {
	logDebug('cmd_searchAllUsersList..........................................');
	var params = param("params");
	var sql = param("sql");

	var result = ConfigEngineAPI.searchAllUsersList(true);
	var res = {
		"message": "Success",
		"content": result
	};

	logDebug("getAllUsers:Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_updateUsers() {
	var params = param("params");
	var json = param("json");
	var override = param("override");

	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;

	json = toJson(json);
	
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	var result = ConfigEngineAPI.updateUsers(json, serviceProvidorCode, override);

	var res = {
		"message": "Success",
		"content": result
	};
	
	if(result["success"] == true){
		archive_GITHUB("Users", String(serviceProvidorCode), jsonInputCloned, result, override);
	}

	return res;
}

function cmd_getAllUsersGroupsMapping() {
	var params = param("params");
	var sql = param("sql");

	var result = ConfigEngineAPI.getUsersGroupsMapping(false, {});
	var res = {
		"message": "Success",
		"content": result
	};

	return res;
}

function cmd_getAllAgencyGroups() {
	var params = param("params");
	var sql = param("sql");

	var result = ConfigEngineAPI.getAllAgencyGroups();
	var res = {
		"message": "Success",
		"content": result
	};

	return res;
}

function cmd_updateAgencyGroups() {
	var params = param("params");
	var json = param("json");
	var override = param("override");

	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;

	json = toJson(json);
	
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object

	var result = ConfigEngineAPI.updateAgencyGroups(json);

	var res = {
		"message": "Success",
		"content": result
	};
	
	if(result["success"] == true){
		archive_GITHUB("Users Groups", String(params[0]), jsonInputCloned, result, override);
	}

	return res;
}

function cmd_getUsersList() {
	var params = param("params");
	var sql = param("sql");

	var result = ConfigEngineAPI.getUsersList();
	var res = {
		"message": "Success",
		"content": result
	};

	return res;
}

function cmd_getUserGroupsList() {
	var params = param("params");
	var sql = param("sql");

	var result = ConfigEngineAPI.getUserGroupsList();
	var res = {
		"message": "Success",
		"content": result
	};

	return res;
}

function cmd_searchLicensedProfessionals() {
	logDebug('cmd_searchLicensedProfessional....................................');
	var params = param("params");
	var sql = param("sql");
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	var result = ConfigEngineAPI.searchLicensedProfessionals(serviceProvidorCode);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_searchLicensedProfessionalTypesList(){
	logDebug('cmd_searchLicensedProfessionalTypesList....................................');

	var result = ConfigEngineAPI.searchLicensedProfessionalTypesList();
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_searchLicensedProfessionalsList() {
	logDebug('cmd_searchLicensedProfessionalsList....................................');
	var params = param("params");
	var sql = param("sql");
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);
	
	var inverse = false;
	try{
		inverse = toJson(params)[1];
	}catch(e){
		
	}
	if(inverse == true || inverse == "True" || inverse == 'TRUE' || inverse == 'true'){
		inverse = true;
	}
	logDebug("inverse: " + inverse);

	var result = ConfigEngineAPI.searchLicensedProfessionalsList(serviceProvidorCode, false, false, inverse);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_searchLicensedProfessionalAttributes() {
	logDebug('cmd_searchLicensedProfessionalAttributes....................................');
	var params = param("params");
	var sql = param("sql");
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	var result = ConfigEngineAPI.searchLicensedProfessionalAttributes(serviceProvidorCode);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_updateLicensedProfessionalAttributes() {
	logDebug('cmd_updateLicensedProfessionalAttributes....................................');
	var params = param("params");
	var json = param("json");
	var override = param("override");

	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;

	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);
	
	printJson("json", json);
	
	json = toJson(json);
	
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object

	var result = ConfigEngineAPI.updateLicensedProfessionalAttributes(json, serviceProvidorCode, override);

	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	if(result["success"] == true){
		archive_GITHUB("Licensed Professional Attributes", String(params[0]), jsonInputCloned, result, override);
	}

	return res;
}

function cmd_searchLicensedProfessionalTablesData() {
	logDebug('cmd_searchLicensedProfessionalTablesData....................................');
	var params = param("params");
	var sql = param("sql");
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	var result = ConfigEngineAPI.searchLicensedProfessionalTablesData(serviceProvidorCode);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_updateLicensedProfessionalTablesData() {
	logDebug('cmd_updateLicensedProfessionalTablesData....................................');
	var params = param("params");
	var json = param("json");
	var override = param("override");

	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;

	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);
	
	printJson("json", json);
	
	json = toJson(json);
	
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object

	var result = ConfigEngineAPI.updateLicensedProfessionalTablesData(json, serviceProvidorCode, override);

	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	if(result["success"] == true){
		archive_GITHUB("Licensed Professional Tables Data", String(params[0]), jsonInputCloned, result, override);
	}

	return res;
}

function cmd_searchContactsList() {
	logDebug('cmd_searchContactsList....................................');
	var params = param("params");
	var sql = param("sql");
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	var result = ConfigEngineAPI.searchContactsList(serviceProvidorCode);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_updateLicensedProfessionals() {
	logDebug('cmd_updateLicensedProfessionals....................................');
	var params = param("params");
	var json = param("json");
	var override = param("override");

	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;

	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);
	
	printJson("json", json);
	
	json = toJson(json);
	
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object

	var result = ConfigEngineAPI.updateLicensedProfessionals(json, serviceProvidorCode, override);

	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	if(result["success"] == true){
		archive_GITHUB("Licensed Professionals", String(params[0]), jsonInputCloned, result, override);
	}

	return res;
}

function cmd_searchContacts(){
	logDebug('cmd_searchContacts....................................');
	var params = param("params");
	var sql = param("sql");
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	var result = ConfigEngineAPI.searchContacts(serviceProvidorCode, true);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_searchPublicUsers() {
	logDebug('cmd_searchPublicUsers....................................');
	var params = param("params");
	var sql = param("sql");
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	var result = ConfigEngineAPI.searchAllPublicUsers(serviceProvidorCode, true);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_updatePublicUsers() {
	logDebug('cmd_updatePublicUsers....................................');
	var params = param("params");
	var json = param("json");
	var override = param("override");

	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;

	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);
	
	printJson("json", json);
	
	json = toJson(json);
	
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object

	var result = ConfigEngineAPI.updatePublicUsers(json, serviceProvidorCode, override);

	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	if(result["success"] == true){
		archive_GITHUB("Public Users", String(params[0]), jsonInputCloned, result, override);
	}

	return res;
}

function cmd_searchAllContacts() {
	logDebug('cmd_searchAllContacts....................................');
	var params = param("params");
	var sql = param("sql");
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	var result = ConfigEngineAPI.searchAllContacts(serviceProvidorCode, true);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}


function cmd_updateContacts() {
	var params = param("params");
	var json = param("json");
	var override = param("override");

	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;

	json = toJson(json);
	
	printJson("json", json);
	
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	var result = ConfigEngineAPI.updateContacts(json, serviceProvidorCode, override);

	var res = {
		"message": "Success",
		"content": result
	};
	
	if(result["success"] == true){
		archive_GITHUB("Contacts", String(params[0]), jsonInputCloned, result, override);
	}

	return res;
}

function cmd_searchCalendars() {
	logDebug('cmd_searchCalendars....................................');
	var params = param("params");
	var sql = param("sql");
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	var result = ConfigEngineAPI.searchCalendars(serviceProvidorCode);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_updateCalendars() {
	var params = param("params");
	var json = param("json");
	var override = param("override");

	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;

	json = toJson(json);
	
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	var result = ConfigEngineAPI.updateCalendars(json, serviceProvidorCode, override);

	var res = {
		"message": "Success",
		"content": result
	};
	
	if(result["success"] == true){
		archive_GITHUB("Calendars", String(params[0]), jsonInputCloned, result, override);
	}

	return res;
}

function cmd_searchConditionStatus() {
	logDebug('cmd_searchConditionStatus....................................');
	var params = param("params");
	var sql = param("sql");
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	var result = ConfigEngineAPI.searchConditionStatus(serviceProvidorCode);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_createConditionStatus() {
	logDebug('cmd_createConditionStatus....................................');
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	json = toJson(json);
	
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object
	
	var result = ConfigEngineAPI.createConditionStatus(json, serviceProvidorCode, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	if(result["success"] == true){
		archive_GITHUB("Condition Status", String(params[0]), jsonInputCloned, result, override);
	}

	return res;
}

function cmd_searchCondition() {
	logDebug('cmd_searchCondition....................................');
	var params = param("params");
	var sql = param("sql");
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	var result = ConfigEngineAPI.searchCondition(serviceProvidorCode);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_createCondition() {
	logDebug('cmd_createCondition....................................');
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);

	json = toJson(json);
	
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object
	
	var result = ConfigEngineAPI.createCondition(json, serviceProvidorCode, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	if(result["success"] == true){
		archive_GITHUB("Condition Type", String(params[0]), jsonInputCloned, result, override);
	}

	return res;
}

function cmd_searchStandaredCondition() {
	logDebug('cmd_searchStandaredCondition....................................');
	var params = param("params");
	var sql = param("sql");
	
	params = toJson(params);
	
	var serviceProvidorCode = params[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);
	
	var conditionType = params[1];
	logDebug("conditionType: " + conditionType);

	var result = ConfigEngineAPI.searchStandaredCondition(serviceProvidorCode, conditionType);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_createStandaredCondition() {
	logDebug('cmd_createStandaredCondition....................................');
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	params = toJson(params);
	
	var serviceProvidorCode = params[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);
	
	var conditionType = params[1];
	logDebug("conditionType: " + conditionType);

	json = toJson(json);
	
	var result = ConfigEngineAPI.createStandaredCondition(json, serviceProvidorCode, conditionType, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_searchStandaredComments() {
	logDebug('cmd_searchStandaredComments....................................');
	var params = param("params");
	var sql = param("sql");
	
	params = toJson(params);
	
	var serviceProvidorCode = params[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);
	
	var result = ConfigEngineAPI.searchStandaredComments(serviceProvidorCode, true);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_createStandaredComments() {
	logDebug('cmd_createStandaredComments....................................');
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	params = toJson(params);
	
	var serviceProvidorCode = params[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);
	
	json = toJson(json);
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object
	
	var result = ConfigEngineAPI.createStandaredComments(json, serviceProvidorCode, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	if(result["success"] == true){
		archive_GITHUB("Standard Comments", String(params[0]), jsonInputCloned, result, override);
	}

	return res;
}

function cmd_searchActivityType() {
	logDebug('cmd_searchActivityType....................................');
	var params = param("params");
	var sql = param("sql"); 
	
	params = toJson(params);
	
	var serviceProvidorCode = params[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);
	
	var result = ConfigEngineAPI.searchActivityType(serviceProvidorCode, true);
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));

	return res;
}

function cmd_createActivityType() {
	logDebug('cmd_createActivityType....................................');
	
	var params = param("params");
	logDebug("params: " + params);
	
	var json = param("json");
	printJson("json", json);
	
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	params = toJson(params);
	
	var serviceProvidorCode = params[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);
	
	json = toJson(json);
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object
	
	var result = ConfigEngineAPI.createActivityType(json, serviceProvidorCode, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	if(result["success"] == true){
		archive_GITHUB("Activity Type", String(params[0]), jsonInputCloned, result, override);
	}

	return res;
}

function cmd_searchActivitySpecificInfo(){
	logDebug("cmd_searchActivitySpecificInfo.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchActivitySpecificInfo(serviceCode[1], false);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createActivitySpecificInfo(){
	logDebug("cmd_createActivitySpecificInfo.......................................");
	
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
	
	var result = ConfigEngineAPI.createActivitySpecificInfo(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("cmd_createActivitySpecificInfo:Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchSharedDropDowns(){
	logDebug("cmd_searchSharedDropDowns.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	params = toJson(params);
	
	var keys = params[1];
	logDebug("keys: " + keys);
	if(keys != null && keys != undefined && keys != ""){
		if (!Array.isArray(keys)) {
			logDebug("KEYS IS NOT AN ARRAY");
			keys = keys.split(",");
		}else{
			logDebug("KEYS IS ARRAY");
		}
	}
	
	logDebug("serviceCode: " + params[0]);
	logDebug("keys: " + keys);
	
	var type = null;
	if(params.length == 3){
		type = params[2];
	}
	if(type == undefined || type == ""){
		type = null;
	}
	
	var result = ConfigEngineAPI.searchSharedDropDowns(params[0], keys, false, type);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createSharedDropDowns(){
	logDebug("cmd_createSharedDropDowns.......................................");
	timeDebug("createSharedDropDowns:START");
		try{
	var params = param("params");
	logDebug("params: " + params);
	
	var jsonInput = param("json");
	printJson("jsonInput", jsonInput);
	
	var action = param("action");
	logDebug("action: " + action);
	
	var override = param("override");
	logDebug("override: " + override);
	
	var params2 = param("params2");
	logDebug("params2: " + params2);
	
	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var resArr = [];
	var jsonInputCloned;
	
	if(!override){
		logDebug('Returning: {"success": false, "exists": true}');
		resArr = [{
			"success": false,
			"exists": true
		}];
		
	}else{
		jsonInput = toJson(jsonInput);
		
		jsonInputCloned = JSON.parse(JSON.stringify(jsonInput));//Clone Object
		
		for(var j in jsonInput){
			var json = jsonInput[j];
			var oldMapping = [];
		
			if(override){
				var seriesIds = new java.util.HashMap();
				
				var standardChoices = ConfigEngineAPI.searchStandardChoiceValueModel(json["BIZDOMAIN"], false);
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
		
//				logDebug("oldMapping:: " + JSON.stringify(stringifyJSType(oldMapping)));
				
				if(override && oldMapping.length > 0){
					//Delete Old Mapping
					logDebug('Delete Old Mapping ......................');
					ConfigEngineAPI.deleteDrillDownMapping(oldMapping);
				}
				
				logDebug('After Deleting Old Mapping ......................');
				
				resArr = resArr.concat(ConfigEngineAPI.createSharedDropDown(json, override));
				
				var createdObject = ConfigEngineAPI.searchSharedDropDown(json["BIZDOMAIN"], false);
//				logDebug("createdObject:: " + JSON.stringify(stringifyJSType(createdObject)));
		
				var newMapping = [];
				for(om in oldMapping){
					var oldMappedParent = oldMapping[om]["parentValueStandardChoiceModel"];
					var oldMappedChild = oldMapping[om]["childValueStandardChoiceModel"];

					for(sc in createdObject[0]["sharedDropDownValueModels"]){
						var isfound = false;
						var createdObj =createdObject[0]["sharedDropDownValueModels"][sc];

//						logDebug('oldMappedParent: ' + JSON.stringify(stringifyJSType(oldMappedParent)));
//						logDebug('createdObj: ' + JSON.stringify(stringifyJSType(createdObj)));
						if(oldMappedParent != null && oldMappedParent != undefined && oldMappedParent["BIZDOMAIN"] == createdObj["BIZDOMAIN"] &&
								oldMappedParent["BIZDOMAIN_VALUE"] == createdObj["BIZDOMAIN_VALUE"]
						){
							oldMapping[om]["parentValueStandardChoiceModel"] = createdObj;
							oldMapping[om]["PARENT_VAL_ID"] = createdObj["BDV_SEQ_NBR"];
							
							isfound = true;
						}

						if(oldMappedChild != null && oldMappedChild != undefined && oldMappedChild["BIZDOMAIN"] == createdObj["BIZDOMAIN"] &&
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
//				logDebug("newMapping:: " + JSON.stringify(stringifyJSType(newMapping)));
				
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
				resArr = resArr.concat(ConfigEngineAPI.createSharedDropDown(json, override));
			}
		}
	}

	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };

	var res = {
			"message": "Success",
			"content": result
		};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	if(result["success"] == true){
		if(params.length > 1){
			archive_GITHUB("Standard Choices", String(params[1]), jsonInputCloned, result, override);
		}else{
			archive_GITHUB("Standard Choices", String(params[0]), jsonInputCloned, result, override);
		}
	}
	
	timeDebug("createSharedDropDowns:END");
	
	return res;
		}catch(e){
			logDebug('Error Updating global standaredchoice: ' + e);
			throw e;
		}
}

function cmd_searchRenewalInfo(){
	logDebug("cmd_searchRenewalInfo.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchRenewalInfo(serviceCode[1], false);
	if(result != null && result != undefined){
		for(var r in result){
			var dt = stringToDate("" + result[r]["EXPIRATION_DATE"], "yyyy-MM-dd", "-");
			dt = dt.getMonth();
			dt = MONTHS_GLOBAL[dt];
			result[r]["EXPIRATION_DATE"] = dt;
		}
	}
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createRenewalInfo(){
	logDebug("cmd_createRenewalInfo.......................................");
	
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
	logDebug("serviceCode: " + serviceCode[0]);
	
	json = toJson(json);
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object
	
	var result = ConfigEngineAPI.createRenewalInfo(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	if(result["success"] == true){
		archive_GITHUB("Renewal Info", String(params[0]), jsonInputCloned, result, override);
	}
	
	return res;
}

function cmd_searchFeeItemsList(){
	logDebug("cmd_searchFeeItemsList.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceProvidorCode = toJson(params)[0];
	logDebug("serviceProvidorCode: " + serviceProvidorCode);
	
	var result = ConfigEngineAPI.searchFeeItemsList(serviceProvidorCode);
	logDebug(JSON.stringify(stringifyJSType(result)));

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchOrganizations(){
	logDebug("cmd_searchOrganizations.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchOrganizations(serviceCode[1], false);

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchOrganizationsList() {
	logDebug('cmd_searchAllUsersList..........................................');
	var params = param("params");
	var sql = param("sql");

	var result = ConfigEngineAPI.searchOrganizationsList(true);
	var res = {
		"message": "Success",
		"content": result
	};

	logDebug("getOrganizationsList:Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_createOrganizations(){
	logDebug("cmd_createOrganizations.......................................");
	
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
	logDebug("serviceCode: " + serviceCode[0]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createOrganizations(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchDepartments(){
	logDebug("cmd_searchDepartments.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var serviceCode = toJson(params);
	logDebug("serviceCode: " + serviceCode[1]);
	
	var result = ConfigEngineAPI.searchDepartments(serviceCode[1], false);

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_createDepartments(){
	logDebug("cmd_createDepartments.......................................");
	
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
	logDebug("serviceCode: " + serviceCode[0]);
	
	json = toJson(json);
	
	var jsonInputCloned = JSON.parse(JSON.stringify(json));//Clone Object
	
	var result = ConfigEngineAPI.createDepartments(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	if(result["success"] == true){
		archive_GITHUB("Departments", String(jsonInputCloned[0]["SERV_PROV_CODE"]), jsonInputCloned, result, override);
	}
	
	return res;
}

function cmd_searchBureaus(){
	logDebug("cmd_searchBureaus.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var paramsArr = toJson(params);
	logDebug("serviceCode: " + paramsArr[0]);
	logDebug("AgencyCode: " + paramsArr[1]);
	
	var result = ConfigEngineAPI.searchBureaus(paramsArr[0], paramsArr[1], false);

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchBureauList() {
	logDebug('cmd_searchBureauList..........................................');
	var params = param("params");
	var sql = param("sql");

	var paramsArr = toJson(params);
	var result = ConfigEngineAPI.searchBureauList(paramsArr[0], paramsArr[1], true);
	var res = {
		"message": "Success",
		"content": result
	};

	logDebug("getOrganizationsList:Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_createBureaus(){
	logDebug("cmd_createBureaus.......................................");
	
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
	logDebug("serviceCode: " + serviceCode[0]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createBureaus(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchDivisions(){
	logDebug("cmd_searchDivisions.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var paramsArr = toJson(params);
	logDebug("serviceCode: " + paramsArr[0]);
	logDebug("AgencyCode: " + paramsArr[1]);
	
	var result = ConfigEngineAPI.searchDivisions(paramsArr[0], paramsArr[1], false);

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchDivisionList() {
	logDebug('cmd_searchDivisionList..........................................');
	var params = param("params");
	var sql = param("sql");

	var paramsArr = toJson(params);
	var result = ConfigEngineAPI.searchDivisionList(paramsArr[0], paramsArr[1], true);
	var res = {
		"message": "Success",
		"content": result
	};

	logDebug("searchDivisionList:Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_createDivisions(){
	logDebug("cmd_createDivisions.......................................");
	
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
	logDebug("serviceCode: " + serviceCode[0]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createDivisions(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchSections(){
	logDebug("cmd_searchSections.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var paramsArr = toJson(params);
	logDebug("serviceCode: " + paramsArr[0]);
	logDebug("AgencyCode: " + paramsArr[1]);
	
	var result = ConfigEngineAPI.searchSections(paramsArr[0], paramsArr[1], false);

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchSectionList() {
	logDebug('cmd_searchSectionList..........................................');
	var params = param("params");
	var sql = param("sql");

	var paramsArr = toJson(params);
	var result = ConfigEngineAPI.searchSectionList(paramsArr[0], paramsArr[1], true);
	var res = {
		"message": "Success",
		"content": result
	};

	logDebug("searchSectionList:Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_createSections(){
	logDebug("cmd_createSections.......................................");
	
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
	logDebug("serviceCode: " + serviceCode[0]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createSections(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchGroups(){
	logDebug("cmd_searchGroups.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var paramsArr = toJson(params);
	logDebug("serviceCode: " + paramsArr[0]);
	logDebug("AgencyCode: " + paramsArr[1]);
	
	var result = ConfigEngineAPI.searchGroups(paramsArr[0], paramsArr[1], false);

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchGroupList() {
	logDebug('cmd_searchGroupList..........................................');
	var params = param("params");
	var sql = param("sql");

	var paramsArr = toJson(params);
	var result = ConfigEngineAPI.searchGroupList(paramsArr[0], paramsArr[1], true);
	var res = {
		"message": "Success",
		"content": result
	};

	logDebug("searchGroupList:Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_createGroups(){
	logDebug("cmd_createGroups.......................................");
	
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
	logDebug("serviceCode: " + serviceCode[0]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createGroups(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchOffices(){
	logDebug("cmd_searchOffices.......................................");
	var params = param("params");
	logDebug("params: " + params);

	var sql = param("sql");
	logDebug("sql: " + sql);
	
	var paramsArr = toJson(params);
	logDebug("serviceCode: " + paramsArr[0]);
	logDebug("AgencyCode: " + paramsArr[1]);
	
	var result = ConfigEngineAPI.searchOffices(paramsArr[0], paramsArr[1], false);

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

function cmd_searchOfficeList() {
	logDebug('cmd_searchOfficeList..........................................');
	var params = param("params");
	var sql = param("sql");

	var paramsArr = toJson(params);
	var result = ConfigEngineAPI.searchOfficeList(paramsArr[0], paramsArr[1], true);
	var res = {
		"message": "Success",
		"content": result
	};

	logDebug("searchOfficeList:Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_createOffices(){
	logDebug("cmd_createOffices.......................................");
	
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
	logDebug("serviceCode: " + serviceCode[0]);
	
	json = toJson(json);
	
	var result = ConfigEngineAPI.createOffices(json, override);
	
	var res = {
		"message": "Success",
		"content": result
	};
	
	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
	
	return res;
}

function cmd_searchFileComments(){
	logDebug("cmd_searchFileComments.......................................");
	var params = param("params");
	logDebug("params: " + params);
	
	var modelName = params[0];
	var fileName = params[1];
	
	var result = getFileComments_GITHUB(modelName, fileName);

	var res = {};
	
	if(result == "GITHUB_NOT_CONFIGURED"){
		res = {
				"message": "GITHUB Not Configured for this server!",
				"content": []
			};
	}else{
		res = {
			"message": "Success",
			"content": result
		};
	}
	
	return res;
}

function cmd_searchFileBySHA(){
	logDebug("cmd_searchFileBySHA.......................................");
	var params = param("params");
	logDebug("params: " + params);
	
	var modelName = params[0];
	var fileName = params[1];
	var sha = params[2];
	
	var result = getFileBySHA_GITHUB(modelName, fileName, sha);

	var res = {
		"message": "Success",
		"content": result
	};
	
	return res;
}

//function cmd_searchReports(){
//	logDebug("cmd_searchReports.......................................");
//	var params = param("params");
//	logDebug("params: " + params);
//
//	var sql = param("sql");
//	logDebug("sql: " + sql);
//	
//	var paramsArr = toJson(params);
//	logDebug("serviceCode: " + paramsArr[0]);
//	
//	var result = ConfigEngineAPI.searchReports(paramsArr[0], false);
//
//	var res = {
//		"message": "Success",
//		"content": result
//	};
//	
//	return res;
//}
//
//function cmd_createReports(){
//	logDebug("cmd_createReports.......................................");
//	
//	var params = param("params");
//	logDebug("params: " + params);
//	
//	var json = param("json");
//	printJson("json", json);
//	
//	var action = param("action");
//	logDebug("action: " + action);
//	
//	var override = param("override");
//	logDebug("override: " + override);
//	
//	var params2 = param("params2");
//	logDebug("params2: " + params2);
//	
//	override = override == 'true' || override == 'TRUE' || override == 'True' ? true : false;
//	
//	var serviceCode = toJson(params);
//	logDebug("serviceCode: " + serviceCode[0]);
//	
//	json = toJson(json);
//	
//	var result = ConfigEngineAPI.createReports(serviceCode[0], json, override);
//	
//	var res = {
//		"message": "Success",
//		"content": result
//	};
//	
//	logDebug("Result:: " + JSON.stringify(stringifyJSType(res)));
//	
//	return res;
//}

/*------------------------------------------------------------------------------------------------------*/
run();
/* ------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_CONFIG_GLOBAL_API.js
| Event			:
|
| Usage			:
| Notes			: auto generated Record Script by Accela Eclipse Plugin
| Created by	: ADMIN
| Created at	: 24/09/2020 02:58:06
|
/------------------------------------------------------------------------------------------------------ */
function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1) { servProvCode = arguments[1] ;} // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance('com.accela.aa.emse.emse.EMSEBusiness').getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, 'ADMIN');
		return emseScript.getScriptText() + '';
	} catch (err) {
		return '';
	}
}
/* ------------------------------------------------------------------------------------------------------ */
eval(getScriptText('INCLUDE_CONFIG_NEW'));
eval(getScriptText("INCLUDE_GITHUB"));
/* ------------------------------------------------------------------------------------------------------ */
function stringifyJSType(e) {
	return e && (e.getClass ? e = String(e) : typeof e === 'object' ? e = stringifyObject(e) : Object.prototype.toString.call(e) === '[object Array]' && (e = stringifyArray(e))), e;
}

function stringifyObject(e) {
	for (var t in e) {
		if (e.hasOwnProperty(t)) {
			var r = e[t];
			e[t] = stringifyJSType(r);
		}
	}
	return e;
}

function stringifyArray(e) {
	for (var t = 0; t < e.length; t++) e[t] = stringifyJSType(e[t]);
}

var MONTHS_GLOBAL = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function getMonthVal(monthStr){
	switch(monthStr){
		case "JAN":
			return 0;
		case "FEB":
			return 1;
		case "MAR":
			return 2;
		case "APR":
			return 3;
		case "MAY":
			return 4;
		case "JUN":
			return 5;
		case "JUL":
			return 6;
		case "AUG":
			return 7;
		case "SEP":
			return 8;
		case "OCT":
			return 9;
		case "NOV":
			return 10;
		case "DEC":
			return 11;
		default:
			return monthStr;
	}
}

function stringToDate(_date,_format,_delimiter)
{
	if(_date.indexOf(' ') != -1){
		_date = _date.split(' ')[0];
	}
    var formatLowerCase=_format.toLowerCase();
    var formatItems=formatLowerCase.split(_delimiter);
    var dateItems=_date.split(_delimiter);
    var monthIndex=formatItems.indexOf("mm");
    var dayIndex=formatItems.indexOf("dd");
    var yearIndex=formatItems.indexOf("yyyy");
    var month=parseInt(dateItems[monthIndex]);
    month-=1;
    var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    return formatedDate;
}

function logDebug(msg) {
	aa.print(msg);
	java.lang.System.out.println(msg);
}

function isNullOrEmpty(str) {
	return str == null || str === '' || str === undefined || str === 'null' || str === 'undefined';
}
/* ------------------------------------------------------------------------------------------------------ */
function ConfigEngineAPI() { }
ConfigEngineAPI.prototype = {};
var conf = new ConfigEngine();
/* ------------------------------------------------------------------------------------------------------ */
ConfigEngineAPI.searchTimeAccountGroup = function (code, ignoreSubModels) {
	conf.className = 'com.accela.orm.model.timeaccount.TimeGroupModel';

	var searchObj = {
		'TIME_GROUP_NAME': String(code)
	};

	var resultTimeGroup = conf.search(searchObj, true, !ignoreSubModels, false, true);

	//	if(!ignoreSubModels){
	//		for(counter in resultTimeGroup){
	//			var xTypeModels = resultTimeGroup[counter]['xtimeGroupTypeModels'];
	//			var timeGroupTypeModels = [];
	//
	//			for(var t in xTypeModels){
	//				var typeModels = ConfigEngineAPI.searchTimeTypeModel(null, xTypeModels[t]["TIME_TYPE_SEQ"], true);
	//				if(typeModels && typeModels.length > 0)
	//					timeGroupTypeModels.push(typeModels[0]);
	//			}
	//			resultTimeGroup[counter]['timeGroupTypeModels'] = timeGroupTypeModels;
	//		}
	//	}

	return resultTimeGroup;
}

ConfigEngineAPI.getAllTimeAccountGroups = function (ignoreSubModels, ignoreRecStatus) {
	conf.className = 'com.accela.orm.model.timeaccount.TimeGroupModel';
	var searchObj = { 'REC_STATUS': 'A' };
	if(ignoreRecStatus){
		searchObj = {};
	}
	var resultTimeGroup = conf.search(searchObj, true, !ignoreSubModels, false, true);
	return resultTimeGroup;
}

ConfigEngineAPI.updateTimeAccountGroups = function (jsonInput, overrideExisting, Delete) {
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var sysData = ConfigEngineAPI.getAllTimeAccountGroups(false);

	conf.className = 'com.accela.orm.model.timeaccount.TimeGroupModel';
	var searchObj = { 'TIME_GROUP_NAME': '' };
	var subModels = {
		'timeGroupI18nModels': { 'ISLANG': true },
		'xtimeGroupTypeModels': { 'ISGENERATOR': false },
		'timeGroupSecurityModels': {}
	};

	var resArr = [];

	var deletedItems = getDeletedItems(['TIME_GROUP_NAME'], sysData, jsonInput);
	if (Delete && deletedItems.length > 0) {
		for (var d in deletedItems) {
			var dItem = deletedItems[d];
			searchObj['TIME_GROUP_NAME'] = dItem['TIME_GROUP_NAME'];
			conf.Delete(searchObj, subModels);
		}
	}

	var createdItems = getCreatedItems(['TIME_GROUP_NAME'], sysData, jsonInput);
	for (var c in createdItems) {
		var cItem = createdItems[c];
		searchObj['TIME_GROUP_NAME'] = cItem['TIME_GROUP_NAME'];
		
		resArr = resArr.concat(conf.create(searchObj, cItem, subModels, overrideExisting));
	}

	var updatedItems = getUpdatedItems(['TIME_GROUP_NAME'], sysData, jsonInput, { 'timeGroupI18nModels': 'LANG_ID' });

	for (var u in updatedItems) {
		var uItem = updatedItems[u];
		searchObj['TIME_GROUP_NAME'] = uItem['TIME_GROUP_NAME'];
		var exItem = sysData.filter(function (item) { return item['TIME_GROUP_NAME'] == uItem['TIME_GROUP_NAME'] ;})[0];
		uItem['xtimeGroupTypeModels'] = exItem['xtimeGroupTypeModels'].map(function (mod) { return { 'TIME_TYPE_SEQ': mod['TIME_TYPE_SEQ'] }; });
		uItem['timeGroupSecurityModels'] = exItem['policyModel'];
		var policyModels = uItem['timeGroupSecurityModels'];
		fillPolicyModel(policyModels, 'TimeGroupSec', 'User');
		
		resArr = resArr.concat(conf.create(searchObj, uItem, subModels, overrideExisting));
	}

	var result = resArr.filter(function (r) { return r.exists == true; }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };
	result["delete"] = deletedItems.length > 0;
	
	return result;
}

ConfigEngineAPI.updateTimeAccountTypes = function (jsonInput, overrideExisting, Delete) {
	logDebug("updateTimeAccountTypes................");
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var sysData = ConfigEngineAPI.getAllTimeAccountTypes(false);

	conf.className = 'com.accela.orm.model.timeaccounting.TimeTypeModel';
	var searchObj = { 'TIME_TYPE_NAME': '', 'R1_PER_GROUP': '', 'R1_PER_TYPE': '', 'R1_PER_SUB_TYPE': '', 'R1_PER_CATEGORY': '' };
	var subModels = {
		'timeTypeI18NModels': { 'ISLANG': true },
		'timeGroupTypeModels': {},
		'timeProfileTypeModels': {},
		'timeTypepolicyModels': {}
	};

	var resArr = [];

//	var deletedItems = getDeletedItems(['TIME_TYPE_NAME', 'R1_PER_GROUP', 'R1_PER_TYPE', 'R1_PER_SUB_TYPE', 'R1_PER_CATEGORY'], sysData, jsonInput);
//	logDebug("deletedItems.length: " + deletedItems.length);
//	logDebug("Delete: " + Delete);
//	if (Delete && deletedItems.length > 0) {
//		for (var d in deletedItems) {
//			var dItem = deletedItems[d];
//			searchObj['TIME_TYPE_NAME'] = dItem['TIME_TYPE_NAME'];
//			conf.Delete(searchObj, subModels);
//		}
//	}

	var createdItems = getCreatedItems(['TIME_TYPE_NAME', 'RECORD_TYPE'], sysData, jsonInput);
	logDebug("createdItems.length: " + createdItems.length);
	for (var c in createdItems) {
		var cItem = createdItems[c];
//		searchObj['TIME_TYPE_NAME'] = cItem['TIME_TYPE_NAME'];
		searchObj = {
				'TIME_TYPE_NAME': cItem['TIME_TYPE_NAME'],
				'R1_PER_GROUP': cItem['R1_PER_GROUP'],
				'R1_PER_TYPE': cItem['R1_PER_TYPE'],
				'R1_PER_SUB_TYPE': cItem['R1_PER_SUB_TYPE'],
				'R1_PER_CATEGORY': cItem['R1_PER_CATEGORY']
		};
		resArr = resArr.concat(conf.create(searchObj, cItem, subModels, overrideExisting));
	}

	var updatedItems = getUpdatedItems(['TIME_TYPE_NAME', 'RECORD_TYPE'], sysData, jsonInput, { 'timeTypeI18NModels': 'LANG_ID' });
	logDebug("updatedItems.length: " + updatedItems.length);
	for (var u in updatedItems) {
		var uItem = updatedItems[u];
//		searchObj['TIME_TYPE_NAME'] = uItem['TIME_TYPE_NAME'];
		
		searchObj = {
				'TIME_TYPE_NAME': uItem['TIME_TYPE_NAME'],
				'R1_PER_GROUP': uItem['R1_PER_GROUP'],
				'R1_PER_TYPE': uItem['R1_PER_TYPE'],
				'R1_PER_SUB_TYPE': uItem['R1_PER_SUB_TYPE'],
				'R1_PER_CATEGORY': uItem['R1_PER_CATEGORY']
		};
		
		var exItem = sysData.filter(function (item) { return item['TIME_TYPE_NAME'] == uItem['TIME_TYPE_NAME']; })[0];
		uItem['timeGroupTypeModels'] = exItem['timeGroupTypeModels'];
		uItem['timeProfileTypeModels'] = exItem['timeProfileTypeModels'];
		uItem['timeTypepolicyModels'] = exItem['policyModel'];
		var policyModels = uItem['timeTypepolicyModels'];
		fillPolicyModel(policyModels, 'TimeTypeSec', 'User');
		resArr = resArr.concat(conf.create(searchObj, uItem, subModels, overrideExisting));
	}
	var result = resArr.filter(function (r) { return r.exists == true; }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };
	result["delete"] = typeof(deletedItems) != "undefined" && deletedItems.length > 0;
	
	return result;

}

ConfigEngineAPI.searchTimeTypeModel = function (name, seq, ignoreSubModels) {
	conf.className = 'com.accela.orm.model.timeaccounting.TimeTypeModel';

	var searchObj = {
		'TIME_TYPE_NAME': name ? String(name) : null,
		'TIME_TYPE_SEQ': seq ? String(seq) : null
	};

	var resultTimeType = conf.search(searchObj, true, !ignoreSubModels, false, true);

	if (!ignoreSubModels) {
		for (counter in resultTimeType) {
			var seq = resultTimeType[counter]['TIME_TYPE_SEQ'];
			var policyModels = [];

			policyModels = searchPolicyModel('TimeTypeSec', seq, true);

			resultTimeType[counter]['policyModel'] = policyModels;
		}
	}

	return resultTimeType;
}

ConfigEngineAPI.getAllTimeAccountTypes = function (ignoreSubModels) {
	conf.className = 'com.accela.orm.model.timeaccounting.TimeTypeModel';

	var searchObj = { 'auditModel': { 'REC_STATUS': 'A' } };

	var resultTimeType = conf.search(searchObj, true, !ignoreSubModels, false, true);

	if (!ignoreSubModels) {
		for (counter in resultTimeType) {
			var seq = resultTimeType[counter]['TIME_TYPE_SEQ'];
			var policyModels = [];

			policyModels = searchPolicyModel('TimeTypeSec', seq, true);

			resultTimeType[counter]['policyModel'] = policyModels;
		}
	}

	return resultTimeType;
}

ConfigEngineAPI.searchTimeTypeGroupsModel = function (name, ignoreSubModels) {
	var resultTimeType = ConfigEngineAPI.searchTimeTypeModel(name);

	if (resultTimeType && resultTimeType.length > 0) {
		return resultTimeType[0]['timeGroupModel'];
	}

	return null;
}

ConfigEngineAPI.getAllTimeTypesGroupsMapping = function () {
	conf.className = 'com.accela.orm.model.timeaccounting.TimeTypeModel';
	var searchObj = {};//{ 'auditModel': { 'REC_STATUS': 'A' } };
	var resultTimeType = conf.search(searchObj, true, true, false, true);

	var mappingResult = [];

	for (var t in resultTimeType) {
		var type = resultTimeType[t];
		for (var g in type.timeGroupModel) {
			var group = type.timeGroupModel[g];
			group['TIME_TYPE_NAME'] = type['TIME_TYPE_NAME'];
			mappingResult.push(group);
		}
	}

	return mappingResult;
}

ConfigEngineAPI.updateTimeTypesGroupsMapping = function (jsonInput, overrideExisting) {
	logDebug("updateTimeTypesGroupsMapping........................");
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}

	var sysData = ConfigEngineAPI.getAllTimeAccountTypes(false);
	var sysDataMap = {};
	for(var sys in sysData){
		if(!sysDataMap[sysData[sys]["TIME_TYPE_NAME"]]){
			logDebug("Adding To sysDataMap: " + sysData[sys]["TIME_TYPE_NAME"]);
			sysDataMap[sysData[sys]["TIME_TYPE_NAME"]] = sysData[sys]; 
		}
	}

	var searchObj = { 'TIME_TYPE_NAME': '' };
	var subModels = {
		'timeTypeI18NModels': { 'ISLANG': true },
		'timeGroupTypeModels': {},
		'timeProfileTypeModels': {},
		'timeTypepolicyModels': {}
	};

	var allTimeAccountGroups = ConfigEngineAPI.getAllTimeAccountGroups(false, true);
	var groupModels = {};
	for(var atag in allTimeAccountGroups){
		if(!groupModels[allTimeAccountGroups[atag]["TIME_GROUP_NAME"]]){
			groupModels[allTimeAccountGroups[atag]["TIME_GROUP_NAME"]] = allTimeAccountGroups[atag]; 
		}
	}
	
	conf.deleteBySQL("delete from XTIME_GROUP_TYPE where 1 = ?", [1]);
	
	var counter = 0;
	var sqlInsert = null;
	for (var i in jsonInput) {
//		var groupModel = groupModels[jsonInput[i]["timeGroupModel"][0]["TIME_GROUP_NAME"]];
		var timeModel = sysDataMap[jsonInput[i]['TIME_TYPE_NAME']];
		
		var groupModelArr = jsonInput[i]["timeGroupModel"];
		for(var gma in groupModelArr){
			var groupModel = groupModels[groupModelArr[gma]["TIME_GROUP_NAME"]];
			
			if (groupModel != null && groupModel != undefined && timeModel != null && timeModel != undefined) {
			
				if(sqlInsert == null){
					sqlInsert = "insert into XTIME_GROUP_TYPE ";//(SERV_PROV_CODE, TIME_GROUP_SEQ, TIME_TYPE_SEQ, REC_DATE, REC_FUL_NAM, REC_STATUS) values ";
				}else{
					sqlInsert += ' union all ';
				}
				sqlInsert += "select '" + groupModel["SERV_PROV_CODE"] + "', " + groupModel["TIME_GROUP_SEQ"] + ", " + timeModel["TIME_TYPE_SEQ"] + ", SYSDATETIME(), 'ADMIN', 'A' ";
			
				counter++;
				
				if(counter >= 1000){
					logDebug("sqlInsert: \n" + sqlInsert);
					
					conf.updateBySQL(sqlInsert);
					counter = 0;
					
					sqlInsert = null;
				}
			
	//			sqlInsert = "insert into XTIME_GROUP_TYPE (SERV_PROV_CODE, TIME_GROUP_SEQ, TIME_TYPE_SEQ, REC_DATE, REC_FUL_NAM, REC_STATUS) values " +
	//			"('" + groupModel["SERV_PROV_CODE"] + "', " + groupModel["TIME_GROUP_SEQ"] + ", " + timeModel["TIME_TYPE_SEQ"] + ", SYSDATETIME(), 'ADMIN', 'A') ";
	//			
	//			logDebug("sqlInsert: \n" + sqlInsert);
	//			
	//			conf.updateBySQL(sqlInsert);
			}
		}
	}
	
	logDebug("sqlInsert: \n" + sqlInsert);
	
	conf.updateBySQL(sqlInsert);

//	var resArr = [];
//
//	for (var i in jsonInput) {
//		var groups = jsonInput[i]["timeGroupModel"];
//		jsonInput[i]["timeGroupTypeModels"] = [];
//		var timeGroupTypeModels = jsonInput[i]["timeGroupTypeModels"];
//		for (var j in groups) {
//			var groupJson = groups[j];
////			var groupModels = ConfigEngineAPI.searchTimeAccountGroup(groupJson["TIME_GROUP_NAME"], null, false);
//			var groupModel = groupModels[groupJson["TIME_GROUP_NAME"]];
////			if (groupModels.length > 0) {
//			if (groupModel != null && groupModel != undefined) {
////				var groupTypeModel = { "TIME_GROUP_SEQ": groupModels[0]["TIME_GROUP_SEQ"] };
//				var groupTypeModel = { "TIME_GROUP_SEQ": groupModel["TIME_GROUP_SEQ"] };
//				
//				timeGroupTypeModels.push(groupTypeModel);
//			}
//		}
//		delete jsonInput[i]["timeGroupModel"];
//	}
//
//	conf.className = 'com.accela.orm.model.timeaccounting.TimeTypeModel';
//
//	var updatedItems = getUpdatedItems(['TIME_TYPE_NAME'], sysData, jsonInput, { 'timeGroupTypeModels': 'TIME_GROUP_SEQ' });
//	updatedItems = updatedItems.concat(getDeletedItems(['TIME_TYPE_NAME'], sysData, jsonInput));
//
//	var exItems = [];
//	
//	for (var u in updatedItems) {
//		var uItem = updatedItems[u];
//		searchObj['TIME_TYPE_NAME'] = uItem['TIME_TYPE_NAME'];
////		var exItem = sysData.filter(function (item) { return item['TIME_TYPE_NAME'] == uItem['TIME_TYPE_NAME']; })[0];
//		var exItem = sysDataMap[uItem['TIME_TYPE_NAME']];
//		if(exItem != null && exItem != undefined){
//			logDebug("ITEM_FOUNT## " + exItem["TIME_TYPE_NAME"]);
//			exItem['timeGroupTypeModels'] = uItem['timeGroupTypeModels'];
//			exItem['timeTypepolicyModels'] = exItem['policyModel'];
//	
////			resArr = resArr.concat(conf.create(searchObj, exItem, subModels, overrideExisting));
//			exItems.push(exItem);
//		}else{
//			logDebug("ITEM_FOUNT##NOT " + exItem["TIME_TYPE_NAME"]);
//		}
//	}
//	
//	logDebug("exItems.length: " + exItems.length);
//	logDebug("exItems: " + JSON.stringify(exItems));
//	resArr = resArr.concat(conf.create({}, exItems, subModels, overrideExisting));
//
//	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };
	
	var result = {
		"success": true,
		"exists": true
	};
	
	return result;
}

ConfigEngineAPI.searchUsers = function (userName, ignoreSubModels) {
	conf.className = 'com.accela.orm.model.common.UserModel'

	var searchObj = {
		'USER_NAME': userName ? String(userName) : null
	}

	var result = conf.search(searchObj, true, !ignoreSubModels, false, true)
	return result
}

ConfigEngineAPI.searchLicensedProfessionals = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.licenseprofessional.RefLicensedProfessionalModel";
	
	var searchObj = {"SERV_PROV_CODE": code};
	
	conf.subModels = {
		};
	
	return conf.search(searchObj, true, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchLicensedProfessionalTypesList = function(){
	conf.className = "com.accela.orm.model.common.StandardChoiceValueModel";

	var searchObj = {
		"BIZDOMAIN" : "LICENSED PROFESSIONAL TYPE"
	};

	conf.subModels = {};

	var lpList =  conf.search(searchObj, asJson, true, false, true);
	
	lpList = lpList.map(function (lp) {
		return lp["BIZDOMAIN_VALUE"];
	});
	
	return distinctList(lpList);
}

ConfigEngineAPI.searchLicensedProfessionalsList = function(code, ignoreSubModels, asJson, inverse){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.licenseprofessional.RefLicensedProfessionalModel";
	
	var searchObj = {"SERV_PROV_CODE": code};
	
	conf.subModels = {
		};
	
	var lpList = conf.search(searchObj, true, ignoreSubModels, false, true);

	if(asJson){
		var lpListReturn = {};
		if(inverse){
			for(var lp in lpList){
				lpListReturn[lpList[lp]["LIC_TYPE"] + "::" + lpList[lp]["LIC_NBR"]] = lpList[lp]["LIC_SEQ_NBR"];
			}
		}else{
			for(var lp in lpList){
				lpListReturn[lpList[lp]["LIC_SEQ_NBR"]] = lpList[lp]["LIC_TYPE"] + "::" + lpList[lp]["LIC_NBR"];
			}
		}
		
		return lpListReturn;
	}else{
		if(inverse){
			lpList = lpList.map(function (lp) {
				return lp["LIC_TYPE"] + "::" + lp["LIC_NBR"];
			});
		}else{
			lpList = lpList.map(function (lp) {
				return lp["LIC_SEQ_NBR"] + "::" + lp["LIC_TYPE"] + "::" + lp["LIC_NBR"];
			});
		}
		
		return distinctList(lpList);
	}

	
}

ConfigEngineAPI.getContactNameById = function(id){
conf.className = "com.accela.orm.model.contact.ReferenceContactModel";
	
	var searchObj = {"G1_CONTACT_NBR": id};
	
	conf.subModels = {
		};
	
	var lpList =  conf.search(searchObj, true, false, false, true, true);
	
	var name = '';
	
	if(lpList != null && lpList != undefined && lpList.length > 0){
		var fName = lpList[0]["G1_FNAME"];
		var mName = lpList[0]["G1_MNAME"];
		var lName = lpList[0]["G1_LNAME"];
		var fullName = lpList[0]["G1_FULL_NAME"];
		
		fName = ConfigEngine.Trim(fName);
		mName = ConfigEngine.Trim(mName);
		lName = ConfigEngine.Trim(lName);
		
		if(fName == '' && mName == '' && lName == ''){
			fullName = ConfigEngine.Trim(fullName);
			if(fullName == ''){
				name = fullName;
			}
		}else{
			if(fName != ''){
				name = fName + ' ';
			}
			
			if(mName != ''){
				name = name + mName + ' ';
			}
			
			if(lName != ''){
				name = name + lName;
			}
		}
	}
	
	return name;
}

ConfigEngineAPI.searchAllContacts = function(code, ignoreSubModels){
ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.contact.ReferenceContactModel";
	
	var searchObj = {"SERV_PROV_CODE": code};
	
	conf.subModels = {
		};
	
	var contacts = conf.search(searchObj, true, ignoreSubModels, false, true, true);
	
	contacts = contacts.filter(function (contact) {
		var fullName = contact["G1_FULL_NAME"];
		if(!isEmpty(fullName)){
			fullName = fullName.toUpperCase();
			return fullName.indexOf("FULL NAME") != -1;
		}
		
		return false;
	});
	
	return contacts; 
}

ConfigEngineAPI.updateContacts = function (jsonInput, serviceProvidorCode, overrideExisting){
	logDebug('ConfigEngineAPI.updateContacts..........................................');
	
	var overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	logDebug('overrideExisting: ' + overrideExisting);
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput]
	}
	
	var sysData = ConfigEngineAPI.searchAllContacts(serviceProvidorCode);
	logDebug("sysData:: " + JSON.stringify(stringifyJSType(sysData)));
	
	var resArr = [];
	
	var subModels = {};
	var searchObj = { 'G1_CONTACT_NBR': '' };
	
	var createdItems = getCreatedItems(['G1_CONTACT_NBR'], sysData, jsonInput);
	var updatedItems = getUpdatedItemsByFields(['G1_CONTACT_NBR'], sysData, jsonInput, ['G1_BUSINESS_NAME', 'G1_CONTACT_TYPE', 'G1_EMAIL', 'G1_FNAME', 'G1_FULL_NAME', 'G1_LNAME', 'G1_MNAME', 'G1_PHONE1_COUNTRY_CODE', 'G1_PHONE1', 'G1_PHONE2_COUNTRY_CODE', 'G1_PHONE2', 'G1_PHONE3_COUNTRY_CODE', 'G1_PHONE3', 'G1_PREFERRED_CHANNEL', 'G1_RELATION']);
	
	logDebug("createdItems:: " + JSON.stringify(stringifyJSType(createdItems)));
	logDebug("createdItems.length:: " + createdItems.length);
	logDebug("updatedItems:: " + JSON.stringify(stringifyJSType(updatedItems)));
	logDebug("updatedItems.length:: " + updatedItems.length);
	
	if(createdItems != null && createdItems.length > 0){
		resArr = resArr.concat(conf.create(searchObj, createdItems, subModels, false));
		
		for(var c in createdItems){
			searchObj = { 'G1_CONTACT_NBR': '-1' };
			var rcpu = conf.create(searchObj, createdItems[c], subModels, overrideExisting, false, false);
			logDebug('rcpu:: ' + rcpu);
		}
	}
	
	conf.className = "com.accela.orm.model.contact.ReferenceContactModel";
	
	conf.subModels = {
		};
	
	if(updatedItems != null && updatedItems.length > 0){
		for(var u in updatedItems){
			searchObj = { 'G1_CONTACT_NBR': updatedItems[u]['G1_CONTACT_NBR'] };
			resArr = resArr.concat(conf.update(searchObj, updatedItems[u], subModels, true));
		}
	}
	
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false }
	
	return result;
	
}

ConfigEngineAPI.searchContactsList = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.contact.ReferenceContactModel";
	
	var searchObj = {"SERV_PROV_CODE": code};
	
	conf.subModels = {
		};
	
	var lpList =  conf.search(searchObj, true, ignoreSubModels, false, true, true);
	

	lpList = lpList.map(function (lp) {
		var fName = lp["G1_FNAME"];
		var mName = lp["G1_MNAME"];
		var lName = lp["G1_LNAME"];
		var fullName = lp["G1_FULL_NAME"];
		
		var name = '';
		
		fName = ConfigEngine.Trim(fName);
		mName = ConfigEngine.Trim(mName);
		lName = ConfigEngine.Trim(lName);
		
		if(fName == '' && mName == '' && lName == ''){
			fullName = ConfigEngine.Trim(fullName);
			if(fullName == ''){
				name = fullName;
			}
		}else{
			if(fName != ''){
				name = fName + ' ';
			}
			
			if(mName != ''){
				name = name + mName + ' ';
			}
			
			if(lName != ''){
				name = name + lName;
			}
		}
		
		return lp["G1_CONTACT_NBR"] + "::" + name;
	});

	return distinctList(lpList);
}

ConfigEngineAPI.searchLicensedProfessionalAttributes = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchLicensedProfessionalAttributes..........................................');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
		
	conf.className = "com.accela.orm.model.licenseprofessional.RefPeopleAttributeModel";
	
	var searchObj = {"SERV_PROV_CODE": code};
	
	conf.subModels = {
		};
	
	var attributes = conf.search(searchObj, true, ignoreSubModels, false, true, true);
	
	var LPs = ConfigEngineAPI.searchLicensedProfessionalsList(code, ignoreSubModels, true);
	
	attributes = attributes.map(function (attr) {
		var res = {
			"G1_ATTRIBUTE_NAME": attr["G1_ATTRIBUTE_NAME"],
	        "G1_ATTRIBUTE_UNIT_TYPE": attr["G1_ATTRIBUTE_UNIT_TYPE"],
	        "G1_ATTRIBUTE_VALUE": attr["G1_ATTRIBUTE_VALUE"],
	        "G1_ATTRIBUTE_VALUE_DATA_TYPE": attr["G1_ATTRIBUTE_VALUE_DATA_TYPE"],
	        "G1_ATTRIBUTE_VALUE_REQ_FLAG": attr["G1_ATTRIBUTE_VALUE_REQ_FLAG"],
	        "G1_CONTACT_NBR": attr["G1_CONTACT_NBR"],
	        "G1_CONTACT_TYPE": attr["G1_CONTACT_TYPE"],
	        "G1_DISPLAY_ORDER": attr["G1_DISPLAY_ORDER"],
	        "G1_VALIDATION_SCRIPT": attr["G1_VALIDATION_SCRIPT"],
	        "SERV_PROV_CODE": attr["SERV_PROV_CODE"],
	        "VCH_DISP_FLAG1": attr["VCH_DISP_FLAG"],
	        "LICPRO": LPs[attr["G1_CONTACT_NBR"]]
		};
		return res;
	});
	
	return attributes; 
}

ConfigEngineAPI.updateLicensedProfessionalAttributes = function (jsonInput, serviceProvidorCode, overrideExisting){
	logDebug('ConfigEngineAPI.updateLicensedProfessionalAttributes..........................................');

	var LPs = ConfigEngineAPI.searchLicensedProfessionalsList(String(jsonInput[0]['SERV_PROV_CODE']), true, true, true);
	var option = jsonInput[0]['OPTION'];//1= update , 2= delete/insert
	
	var filteredJson = {};
	
	for(var item in jsonInput){
		var licPro = ""+LPs[jsonInput[item]["LICPRO"]];
		jsonInput[item]["G1_CONTACT_NBR"] = licPro;
		delete jsonInput[item]["OPTION"];
		delete jsonInput[item]["LICPRO"];
		
		var jsonItem = filteredJson[licPro];
		if(jsonItem == null || jsonItem == undefined){
			jsonItem = [];
		}
		jsonItem.push(jsonInput[item]);
		
		filteredJson[licPro] = jsonItem;
	}
	
	conf.className = "com.accela.orm.model.licenseprofessional.RefPeopleAttributeModel";
	
	var searchObj = {"SERV_PROV_CODE": String(jsonInput[0]['SERV_PROV_CODE']), "G1_CONTACT_NBR": "", "G1_CONTACT_TYPE": ""};
	
	conf.subModels = {
		};
	
	var resArr = [];
	var res = '';
	
	for(var key in filteredJson){
		if(option == '1'){
			logDebug('Option is 1');
			
			
			var attributeNames = [];
			
			for(var c in filteredJson[key]){
				attributeNames.push(filteredJson[key][c]["G1_ATTRIBUTE_NAME"]);
			}
			
			attributeNames = JSON.stringify(attributeNames);
			attributeNames = attributeNames.replace('[', '');
			attributeNames = attributeNames.replace(']', '');
			attributeNames = replaceAll(attributeNames, '"', '\'');
			
			var deleteSql = "delete from G3contact_attribute where SERV_PROV_CODE = '" +
			String(jsonInput[0]['SERV_PROV_CODE']) + "' and G1_CONTACT_NBR = '" +
			filteredJson[key][0]["G1_CONTACT_NBR"] + "' and G1_CONTACT_TYPE = '" +
			filteredJson[key][0]["G1_CONTACT_TYPE"] + "' and G1_ATTRIBUTE_NAME in (" + attributeNames + ")";
			
			logDebug('Delete Query: ' + deleteSql);
			
			conf.deleteBySQL(deleteSql, null);
			
			searchObj = {"SERV_PROV_CODE": String(jsonInput[0]['SERV_PROV_CODE']), "G1_CONTACT_NBR": filteredJson[key][0]["G1_CONTACT_NBR"], "G1_CONTACT_TYPE": filteredJson[key][0]["G1_CONTACT_TYPE"]};
			res = conf.create(searchObj, filteredJson[key], subModels, overrideExisting, true, false, false, false, true);
			
		}else{
			searchObj = {"SERV_PROV_CODE": String(jsonInput[0]['SERV_PROV_CODE']), "G1_CONTACT_NBR": filteredJson[key][0]["G1_CONTACT_NBR"], "G1_CONTACT_TYPE": filteredJson[key][0]["G1_CONTACT_TYPE"]};
			res = conf.create(searchObj, filteredJson[key], subModels, overrideExisting);
		}
		
		resArr = resArr.concat(res);
	}
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };
	
	return result;
}

ConfigEngineAPI.searchLicensedProfessionalTablesData = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchLicensedProfessionalTablesData..........................................');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
		
	conf.className = "com.accela.orm.model.licenseprofessional.RefInfoTabelFieldModel";
	
	var searchObj = {"SERV_PROV_CODE": code};
	
	conf.subModels = {
			"refInfoTabelValueModels": {}
		};
	
	var attributes = conf.search(searchObj, true, ignoreSubModels, false, true, true);
	
	var LPs = ConfigEngineAPI.searchLicensedProfessionalsList(code, ignoreSubModels, true);
	
	var attributesList = [];
	
	for(var a in attributes){
		var att = attributes[a];
		
		for(v in att["refInfoTabelValueModels"]){
			var valueModel = att["refInfoTabelValueModels"][v];
			
			var valueOutput = {
					"GROUP_CODE": valueModel["GROUP_CODE"],
					"INFO_ID": valueModel["INFO_ID"],
					"INFO_NAME": att["INFO_NAME"],
					"LEVEL_NBR": att["LEVEL_NBR"],
					"PARENT_ID": att["PARENT_ID"],
					"R1_DISPLAY_LIC_VERIF_ACA": att["R1_DISPLAY_LIC_VERIF_ACA"],
					"REF_CATEGORY": att["REF_CATEGORY"],
					"REFERENCE_ID": att["REFERENCE_ID"],
					"REQUIRED_FLAG": att["REQUIRED_FLAG"],
					"SERV_PROV_CODE": att["SERV_PROV_CODE"],
					"GROUPCODE_NAME": valueModel["GROUPCODE_NAME"],
					"ROW_NUM": valueModel["ROW_NUM"],
					"SUBGROUP_NAME": valueModel["SUBGROUP_NAME"],
					"TABLE_VALUE": valueModel["TABLE_VALUE"],
					"LICPRO": LPs[valueModel["REFERENCE_ID"]]
			};
			
			attributesList.push(valueOutput);
		}
	}
	
	return attributesList; 
}

ConfigEngineAPI.searchLicensedProfessionalTablesData_OGR = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchLicensedProfessionalTablesData_OGR..........................................');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
		
	conf.className = "com.accela.orm.model.licenseprofessional.RefInfoTabelFieldModel";
	
	var searchObj = {"SERV_PROV_CODE": code};
	
	conf.subModels = {
			"refInfoTabelValueModels": {}
		};
	
	var attributes = conf.search(searchObj, true, ignoreSubModels, false, true, true);
	
	var orgData = {};
	
	for(var a in attributes){
		var att = attributes[a];
		var referenceId = att['REFERENCE_ID'];
		
		var attList = orgData[referenceId];
		if(attList == null || attList == undefined){
			attList = [];
		}
		
		att['refInfoTabelValueModels'] = [];
		
		attList.push(att);
		
		orgData[referenceId] = attList;
	}
	
	return orgData; 
}

ConfigEngineAPI.getLicensedProfessionalTablesCachOrder = function(code){
	logDebug('ConfigEngineAPI.getLicensedProfessionalTablesCachOrder............');
	
	conf.className = "com.accela.orm.model.asi.RefAppSpecInfoFieldModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R1_CHECKBOX_GROUP": "LICENSEINFOTABLE"};
	
	conf.subModels = {
		};
	
	var columns = conf.search(searchObj, asJson, false, false, true);
	
	columns.sort(function(a, b){
//		return a["RES_ID"] - b["RES_ID"];
		return a["R1_DISPLAY_ORDER"] - b["R1_DISPLAY_ORDER"];
	});
	
	var columnCounter = {};
	var returnResult = {};
	
	for(var c in columns){
		var keyCounter = columns[c]["R1_TABLE_GROUP_NAME"] + ":" + columns[c]["R1_CHECKBOX_TYPE"];
		var key = columns[c]["R1_TABLE_GROUP_NAME"] + ":" + columns[c]["R1_CHECKBOX_TYPE"] + ":" + columns[c]["R1_CHECKBOX_DESC"];
		
		var counter = columnCounter[keyCounter];
		if(counter == null || counter == undefined){
			counter = 0;
		}
		
		returnResult[key] = String(counter);
		
		counter ++;
		columnCounter[keyCounter] = counter;
	}
	
	return returnResult;
}

ConfigEngineAPI.updateLicensedProfessionalTablesData = function (jsonInput, serviceProvidorCode, overrideExisting){
	logDebug('ConfigEngineAPI.updateLicensedProfessionalTablesData..........................................');
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	var serProvCode = String(jsonInput[0]['SERV_PROV_CODE']);
	
	var LPs = ConfigEngineAPI.searchLicensedProfessionalsList(serProvCode, true, true, true);
	
	var orgData = ConfigEngineAPI.searchLicensedProfessionalTablesData_OGR();
	logDebug('orgData: ' + JSON.stringify(stringifyJSType(orgData)));
	
	var columnsNumberCache = ConfigEngineAPI.getLicensedProfessionalTablesCachOrder(serProvCode);
	logDebug('columnsNumberCache: ' + JSON.stringify(columnsNumberCache));
	
	
	var delGroupCode = {};
	var delInfoName = {};
	var delReferenceId = {};
	var delGroupCodeName = {};
	var delSubGroupName = {};
	
	var sqlInsert1 = {};
	var sqlInsert2 = {};
	
	var subGroupSequences = {};
	var columnSequences = {};
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	
	for(var item in jsonInput){
		var lipProOrg = jsonInput[item]["LICPRO"];
		lipProOrg = lipProOrg.split("::");
		lipProOrg[0] = lipProOrg[0].toUpperCase();
		var licPro = ""+LPs[jsonInput[item]["LICPRO"]];
		logDebug('licPro: ' + licPro);
		
		var attBulk = orgData[licPro];
		var parentInfoId;
		if(attBulk == null || attBulk == undefined){
			parentInfoId = sequenceGeneratorEJB.getNextValue("RINFO_TABLE_SEQ");
			var parentSqlInsert = "insert into Rinfo_table values ('" + serProvCode + "', '" + parentInfoId + "', '1', '" + licPro + "', '" + lipProOrg[0] + "', '0', '1', '" + lipProOrg[0] + "', null, null, null, null, null, null, SYSDATETIME(), 'ADMIN', 'A', null)";
			logDebug('parentSqlInsert: \n' + parentSqlInsert);
			conf.updateBySQL(parentSqlInsert);
			
			orgData[licPro] = [
			                   {
			                	   "COLUMN_TYPE":null,
			                	   "DEFAULT_VALUE":null,
			                	   "DISPLAY_LENGTH":null,
			                	   "DISPLAY_ORDER":null,
			                	   "GROUP_CODE":"CONTRACTOR",
			                	   "INFO_ID":parentInfoId,
			                	   "INFO_NAME":"CONTRACTOR",
			                	   "LEVEL_NBR":"1",
			                	   "MAX_LENGTH":null,
			                	   "PARENT_ID":"0",
			                	   "R1_DISPLAY_LIC_VERIF_ACA":null,
			                	   "REF_CATEGORY":"1",
			                	   "REFERENCE_ID":licPro,
			                	   "REQUIRED_FLAG":null,
			                	   "SERV_PROV_CODE":serProvCode,
			                	   "refInfoTabelValueModels": []
			                   }
			                   ];
		}else{
			parentInfoId = attBulk[0]['INFO_ID'];
		}
		
		delGroupCode[lipProOrg[0]] = '';
		delInfoName[jsonInput[item]["SUBGROUP_NAME"]] = '';
		delInfoName[jsonInput[item]["INFO_NAME"]] = '';
		delReferenceId[licPro] = '';
		delGroupCodeName[lipProOrg[0]] = '';
		delSubGroupName[jsonInput[item]['SUBGROUP_NAME']] = '';
		
		var subGroupInfoId = subGroupSequences[licPro+':'+lipProOrg[0]+':'+parentInfoId+':'+jsonInput[item]["SUBGROUP_NAME"]];
		if(subGroupInfoId == null || subGroupInfoId == undefined){
			subGroupInfoId = sequenceGeneratorEJB.getNextValue("RINFO_TABLE_SEQ");
			subGroupSequences[licPro+':'+lipProOrg[0]+':'+parentInfoId+':'+jsonInput[item]["SUBGROUP_NAME"]] = subGroupInfoId;
		}
		var sql1 = "'" + serProvCode + "', '" + subGroupInfoId + "', '1', '" + licPro + "', '" + lipProOrg[0] + "', '" + parentInfoId + "', '2', '" + jsonInput[item]["SUBGROUP_NAME"] + "', '10', null, null, null, null, null, SYSDATETIME(), 'ADMIN', 'A', null";
		sqlInsert1[sql1] = sql1;

		var columnInfoId = columnSequences[licPro+':'+lipProOrg[0]+":"+subGroupInfoId+':'+jsonInput[item]["INFO_NAME"]];
		if(columnInfoId == null || columnInfoId == undefined){
			columnInfoId = sequenceGeneratorEJB.getNextValue("RINFO_TABLE_SEQ");
			columnSequences[licPro+':'+lipProOrg[0]+":"+subGroupInfoId+':'+jsonInput[item]["INFO_NAME"]] = columnInfoId;
		}
		var sql2 = "'" + serProvCode + "', '" + columnInfoId + "', '1', '" + licPro + "', '" + lipProOrg[0] + "', '" + subGroupInfoId + "', '3', '" + jsonInput[item]["INFO_NAME"] + "', 10, '1', null, '', '0', 'N', SYSDATETIME(), 'ADMIN', 'A', 'N'";
		sqlInsert1[sql2] = sql2;

		columnCacheKey = lipProOrg[0] + ":" + String(jsonInput[item]['SUBGROUP_NAME']) + ":" + jsonInput[item]["INFO_NAME"];
		var columnNumber = columnsNumberCache[columnCacheKey];

		var cellSeqVal = sequenceGeneratorEJB.getNextValue("RINFO_TABLE_VALUE_SEQ");
		var sql3 = "'" + serProvCode + "', '" + cellSeqVal + "', '" + columnInfoId + "', '1', '" + licPro + "', '" + lipProOrg[0] + "', '" + String(jsonInput[item]['SUBGROUP_NAME']) + "', '" + columnNumber + "', '" + String(jsonInput[item]['ROW_NUM']) + "', '" + columnNumber + "', '" + String(jsonInput[item]['TABLE_VALUE']) + "', SYSDATETIME(), 'ADMIN', 'A'";
		sqlInsert2[sql3] = sql3;
	}
	
	
	var delSQL1 = 'delete from Rinfo_table where SERV_PROV_CODE = \'' + serProvCode + '\' and GROUP_CODE in (#GROUP_CODE#) and INFO_NAME in (#INFO_NAME#) and REFERENCE_ID in (#REFERENCE_ID#)';
	var delSQL2 = 'delete from Rinfo_table_value where SERV_PROV_CODE = \'' + serProvCode + '\' and GROUPCODE_NAME in (#GROUPCODE_NAME#) and SUBGROUP_NAME in (#SUBGROUP_NAME#) and REFERENCE_ID in (#REFERENCE_ID#)';
	
	delSQL1 = delSQL1.replace("#GROUP_CODE#", JSONObjectToKeysArray(delGroupCode));
	delSQL1 = delSQL1.replace("#INFO_NAME#", JSONObjectToKeysArray(delInfoName));
	delSQL1 = delSQL1.replace("#REFERENCE_ID#", JSONObjectToKeysArray(delReferenceId));
	
	delSQL2 = delSQL2.replace("#GROUPCODE_NAME#", JSONObjectToKeysArray(delGroupCodeName));
	delSQL2 = delSQL2.replace("#SUBGROUP_NAME#", JSONObjectToKeysArray(delSubGroupName));
	delSQL2 = delSQL2.replace("#REFERENCE_ID#", JSONObjectToKeysArray(delReferenceId));
	
	logDebug('Delete SQL1: \n' + delSQL1);
	logDebug('Delete SQL2: \n' + delSQL2);
	
	conf.deleteBySQL(delSQL2, []);
	conf.deleteBySQL(delSQL1, []);
	
	var sqlInsertInfoTable = null;
	for(var key in sqlInsert1){
		if(sqlInsertInfoTable == null){
			sqlInsertInfoTable = "insert into Rinfo_table ";
		}else{
			sqlInsertInfoTable += " union all ";
		}
		
		sqlInsertInfoTable += 'select ' + key;
	}
	logDebug('sqlInsertInfoTable: \n' + sqlInsertInfoTable);
	conf.updateBySQL(sqlInsertInfoTable);
	
	var sqlInsertInfoTableValue = null;
	for(var key in sqlInsert2){
		if(sqlInsertInfoTableValue == null){
			sqlInsertInfoTableValue = "insert into Rinfo_table_value ";
		}else{
			sqlInsertInfoTableValue += " union all ";
		}
		
		sqlInsertInfoTableValue += 'select ' + key;
	}
	logDebug('sqlInsertInfoTableValue: \n' + sqlInsertInfoTableValue);
	conf.updateBySQL(sqlInsertInfoTableValue);
	
	return { 'success': true, 'exists': true };
}

ConfigEngineAPI.searchLicensedProfessionalTablesDataValue = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchLicensedProfessionalTablesData..........................................');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
		
	conf.className = "com.accela.orm.model.licenseprofessional.RefInfoTabelValueModel";
	
	var searchObj = {"SERV_PROV_CODE": code};
	
	conf.subModels = {
		};
	
	var attributes = conf.search(searchObj, true, ignoreSubModels, false, true, true);
	
	return attributes; 
}

ConfigEngineAPI.searchUserSecurityModel = function(USER_NAME, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchUserSecurityModel..........................................');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
		
	conf.className = "com.accela.orm.model.common.UserSecurityModel";
	
	var searchObj = { "LEVEL_DATA": String(USER_NAME), "LEVEL_TYPE": "User", "POLICY_NAME": "UserSettings" }
	
	conf.subModels = {
		};
	
	return conf.search(searchObj, true, ignoreSubModels, false, true, true);
}

ConfigEngineAPI.updateLicensedProfessionals = function (jsonInput, serviceProvidorCode, overrideExisting){
	logDebug('ConfigEngineAPI.updateLicensedProfessionals..........................................');
	
	var overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	logDebug('overrideExisting: ' + overrideExisting);
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var sysData = ConfigEngineAPI.searchLicensedProfessionals(serviceProvidorCode);
	
	var resArr = [];
	
	var subModels = {};
	var searchObj = { 'LIC_NBR': '', 'LIC_TYPE': '' };
	
//	var deletedItems = getDeletedItems(['LIC_NBR', 'LIC_TYPE], sysData, jsonInput);
	var createdItems = getCreatedItems(['LIC_NBR', 'LIC_TYPE'], sysData, jsonInput);
	var updatedItems = getUpdatedItems(['LIC_NBR', 'LIC_TYPE'], sysData, jsonInput, {});
	
//	logDebug("deletedItems:: " + JSON.stringify(stringifyJSType(deletedItems)));
	logDebug("createdItems:: " + JSON.stringify(stringifyJSType(createdItems)));
	logDebug("updatedItems:: " + JSON.stringify(stringifyJSType(updatedItems)));
	
	if(createdItems != null && createdItems.length > 0){
		var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
		for(var item in createdItems){
			var newSeq = sequenceGeneratorEJB.getNextValue("RSTATE_LIC_SEQ");
			createdItems[item]["LIC_SEQ_NBR"] = newSeq;
		}
		
//		resArr = resArr.concat(conf.create(searchObj, createdItems, subModels, false));
		resArr = resArr.concat(conf.create("BATCH", createdItems, subModels, false));
	}
	
//	if(deletedItems != null && deletedItems.length > 0){
//		for (var d in deletedItems) {
//			var dItem = deletedItems[d];
//			searchObj['LIC_NBR'] = dItem['LIC_NBR'];
//			logDebug('Deleting: ' + searchObj['LIC_NBR']);
//			var exItem = getItemsByFilter(['LIC_NBR'], sysData, searchObj)[0];
//			
//			conf.className = 'com.accela.orm.model.licenseprofessional.RefLicensedProfessionalModel';
//			
//			//Deleting Reference
//			var sql = "delete from XLICENSEE_RECORD where SERV_PROV_CODE = '" + exItem["SERV_PROV_CODE"] + "' and LIC_SEQ_NBR = " + exItem["LIC_SEQ_NBR"];
//			logDebug('Delete SQL: \n' + sql);
//			var params = [];
////			conf.deleteBySQL(sql, params);
//			
//			conf.Delete(searchObj, subModels);
//		}
//	}
	
	logDebug('Updating................. ');
	for (var u in updatedItems) {
		
		var uItem = updatedItems[u];
		
		searchObj['LIC_NBR'] = uItem['LIC_NBR'];
		searchObj['LIC_TYPE'] = uItem['LIC_TYPE'];
		
		logDebug('Updating: ' + searchObj['LIC_NBR']);
		logDebug('Updating::uItem: ' + JSON.stringify(uItem));
		
		var exItem = getItemsByFilter(['LIC_NBR'], sysData, searchObj)[0];
		exItem['ACA_PERMISSION'] = uItem['ACA_PERMISSION'];
		exItem['ADDRESS1'] = uItem['ADDRESS1'];
		exItem['BUS_LIC'] = uItem['BUS_LIC'];
		exItem['BUS_NAME'] = uItem['BUS_NAME'];
		exItem['BUS_NAME2'] = uItem['BUS_NAME2'];
		exItem['CAE_FNAME'] = uItem['CAE_FNAME'];
		exItem['CAE_LNAME'] = uItem['CAE_LNAME'];
		exItem['CAE_MNAME'] = uItem['CAE_MNAME'];
		exItem['CITY'] = uItem['CITY'];
		exItem['EMAIL'] = uItem['EMAIL'];
		exItem['L1_BIRTH_DATE'] = uItem['L1_BIRTH_DATE'];
		exItem['L1_POST_OFFICE_BOX'] = uItem['L1_POST_OFFICE_BOX'];
		exItem['L1_SALUTATION'] = uItem['L1_SALUTATION'];
		exItem['L1_TITLE'] = uItem['L1_TITLE'];
		exItem['LAST_UPDATE_DD'] = uItem['LAST_UPDATE_DD'];
		exItem['LIC_EXPIR_DD'] = uItem['LIC_EXPIR_DD'];
		exItem['LIC_STATE'] = uItem['LIC_STATE'];
		exItem['LIC_TYPE'] = uItem['LIC_TYPE'];
		exItem['LIC_TYPE_FLAG'] = uItem['LIC_TYPE_FLAG'];
		exItem['PHONE1'] = uItem['PHONE1'];
		exItem['PHONE1_COUNTRY_CODE'] = uItem['PHONE1_COUNTRY_CODE'];
		exItem['SERV_PROV_CODE'] = uItem['SERV_PROV_CODE'];
		exItem['STATE'] = uItem['STATE'];
		exItem['ZIP'] = uItem['ZIP'];
		
		logDebug('Updating::exItem: ' + JSON.stringify(exItem));
		logDebug('Updating::exItem:PHONE1: ' + exItem['PHONE1']);
		
		resArr = resArr.concat(conf.update(searchObj, exItem, subModels, true));
	}
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };
	
	return result;
}


ConfigEngineAPI.searchLicensedProfessional = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.licenseprofessional.RefLicensedProfessionalModel";
	
	var searchObj = {"LIC_SEQ_NBR": code};
	
	conf.subModels = {
		};
	
	return conf.search(searchObj, true, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchContacts = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.PublicUserAPORelationModel";
	
	var searchObj = {"AGENCY": code, "ENT_TYPE": "REF_CONTACT"};
	
	conf.subModels = {
		};
	
	return conf.search(searchObj, true, ignoreSubModels, false, true);
	
}

ConfigEngineAPI.searchAllPublicUsers = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchAllPublicUsers............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.PublicUserModel";
	
	var searchObj = {"AUTH_SERV_PROV_CODE": null};
	
	conf.subModels = {};
	
	var users = conf.search(searchObj, true, ignoreSubModels, false, false);
//	users = users.filter(function (user) {
//		return user["USER_ID"].lastIndexOf("lamar3", 0) === 0;
//	});
	
	for(var u in users){
		conf.className = 'com.accela.orm.model.user.PublicUserAPORelationModel';
		var searchObj = { "USER_SEQ_NBR": users[u]["USER_SEQ_NBR"], "ENT_TYPE": "REF_CONTACT" };
		var staffsMod = conf.search(searchObj, true, true, false, true, true);
		staffsMod = staffsMod.map(function (lp) {
			return lp["ENT_ID"] + "::" + ConfigEngineAPI.getContactNameById(lp["ENT_ID"]);
		});
		users[u]["CONTACTS"] = staffsMod.toString();
		
		conf.className = 'com.accela.orm.model.user.PublicUserLicenseRelationModel';
		var searchObj = { "USER_SEQ_NBR": users[u]["USER_SEQ_NBR"] };
		var licenses = conf.search(searchObj, true, false, false, false, false);
		licenses = licenses.map(function (lp) {
			return lp["LIC_SEQ_NBR"] + "::" + lp["LIC_TYPE"] + "::" + ConfigEngineAPI.searchLicensedProfessional(lp["LIC_SEQ_NBR"], true)[0]["LIC_NBR"];
		});
		users[u]["LICENSES"] = licenses.toString();
		
		logDebug('users[u]["PASSWORD"]: ' + users[u]["PASSWORD"]);
		users[u]["PASSWORD"] = "";
		
		///////
		
		conf.className = 'com.accela.orm.model.user.PublicUserQuestionModel';
		var passQuestionAnswer = conf.search(searchObj, true, true, false, true, true);
		
		if(passQuestionAnswer != null && passQuestionAnswer != undefined && passQuestionAnswer.length > 0){
			users[u]["PASSWORD_REQUEST_QUESTION"] = passQuestionAnswer[0]["QUESTION"];
			users[u]["PASSWORD_REQUEST_ANSWER"] = passQuestionAnswer[0]["ANSWERS"];
		}else{
			users[u]["PASSWORD_REQUEST_QUESTION"] = "";
			users[u]["PASSWORD_REQUEST_ANSWER"] = "";
		}
	}
	
	return users; 
}

ConfigEngineAPI.updatePublicUsers = function (jsonInput, serviceProvidorCode, overrideExisting){
	logDebug('ConfigEngineAPI.updatePublicUsers..........................................');
	
	var overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	logDebug('overrideExisting: ' + overrideExisting);
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var sysData = ConfigEngineAPI.searchAllPublicUsers(serviceProvidorCode, true);
	logDebug("sysData:: " + JSON.stringify(stringifyJSType(sysData)));
	
	var resArr = [];
	
	var subModels = {};
	var searchObj = { 'USER_NAME': '' };
	
	var createdItems = getCreatedItems(['USER_ID'], sysData, jsonInput);
	var updatedItems = getUpdatedItemsByFields(['USER_ID'], sysData, jsonInput, ["EMAIL_ID", "ACCOUNT_TYPE", "PASSWORD_REQUEST_QUESTION", "PASSWORD_REQUEST_ANSWER", "RECEIVE_SMS", "PHONE_CELL_IDD", "PHONE_CELL", "LICENSES", "CONTACTS"]);
	
	logDebug("createdItems:: " + JSON.stringify(stringifyJSType(createdItems)));
	logDebug("createdItems Length:: " + createdItems.length);
	logDebug("updatedItems:: " + JSON.stringify(stringifyJSType(updatedItems)));
	logDebug("updatedItems Length:: " + updatedItems.length);
	
	var existsItems = getExistsItems(['EMAIL_ID'], sysData, createdItems);
	logDebug("existsItems:: " + JSON.stringify(stringifyJSType(existsItems)));
	logDebug("existsItems Length:: " + existsItems.length);
	if(existsItems != null && existsItems != undefined && existsItems.length > 0){
		var msg = 'Following emails for the new public users already exists: \n';
		var emails = [];
		
		for(var e in existsItems){
			emails.push(existsItems[e]["EMAIL_ID"]);
		}
		
		msg = msg + JSON.stringify(emails);
		
		return {
			"success": false,
			"exists": true,
			"displayerror": true,
			"message": msg
		};
	}
	
	if(updatedItems != null && updatedItems.length > 0){
		
		for(var updatedItem in updatedItems){
			logDebug('updatedItems[updatedItem]: \n' + JSON.stringify(stringifyJSType(updatedItems[updatedItem])));
			
			var sysItemToUpdate = getItemByKeyValue(sysData, "USER_ID", updatedItems[updatedItem]["USER_ID"]);
			
			delete sysItemToUpdate["publicUserAddressRelationModels"];
			delete sysItemToUpdate["publicUserAndUserModel"];
			delete sysItemToUpdate["publicUserContactRelationModels"];
			delete sysItemToUpdate["publicUserLicenseRelationModels"];
			delete sysItemToUpdate["publicUserOwnerRelationModels"];
			delete sysItemToUpdate["publicUserParcelRelationModels"];
			delete sysItemToUpdate["publicUserSSOModels"];
			delete sysItemToUpdate["pulicUser4Agent"];
			delete sysItemToUpdate["resultSummary"];
			
			
			sysItemToUpdate["EMAIL_ID"] = updatedItems[updatedItem]["EMAIL_ID"];
			sysItemToUpdate["ACCOUNT_TYPE"] = updatedItems[updatedItem]["ACCOUNT_TYPE"];
			sysItemToUpdate["PASSWORD"] = updatedItems[updatedItem]["PASSWORD"];
			sysItemToUpdate["PASSWORD_REQUEST_QUESTION"] = updatedItems[updatedItem]["PASSWORD_REQUEST_QUESTION"];
			sysItemToUpdate["PASSWORD_REQUEST_ANSWER"] = updatedItems[updatedItem]["PASSWORD_REQUEST_ANSWER"];
			sysItemToUpdate["RECEIVE_SMS"] = updatedItems[updatedItem]["RECEIVE_SMS"];
			sysItemToUpdate["PHONE_CELL_IDD"] = updatedItems[updatedItem]["PHONE_CELL_IDD"];
			sysItemToUpdate["PHONE_CELL"] = updatedItems[updatedItem]["PHONE_CELL"];
			sysItemToUpdate["CONTACTS"] = updatedItems[updatedItem]["CONTACTS"];
			sysItemToUpdate["LICENSES"] = updatedItems[updatedItem]["LICENSES"];
			
			logDebug('sysItemToUpdate: \n' + JSON.stringify(stringifyJSType(sysItemToUpdate)));
			
			var userSeq = sysItemToUpdate["USER_SEQ_NBR"];
			
			var licenses = sysItemToUpdate["LICENSES"];
			var contacts = sysItemToUpdate["CONTACTS"];
			
			delete sysItemToUpdate["LICENSES"];
			delete sysItemToUpdate["CONTACTS"];
			
			var password = '';
		    if (!isNullOrEmpty(sysItemToUpdate["PASSWORD"])) {
		    	sysItemToUpdate["PASSWORD"] = com.accela.security.Utility().encryptPassword(sysItemToUpdate["PASSWORD"]);
			}
			
			var updateSql = '';
			var params = [];
			
			if(isNullOrEmpty(sysItemToUpdate["PASSWORD"])){
				updateSql = 'UPDATE PUBLICUSER set EMAIL_ID = ? , ACCOUNT_TYPE = ?, PASSWORD_REQUEST_QUESTION = ?, PASSWORD_REQUEST_ANSWER = ?, RECEIVE_SMS = ?, PHONE_CELL_IDD = ?, PHONE_CELL = ? where USER_SEQ_NBR = ?';
				params = [sysItemToUpdate["EMAIL_ID"], sysItemToUpdate["ACCOUNT_TYPE"], sysItemToUpdate["PASSWORD_REQUEST_QUESTION"], sysItemToUpdate["PASSWORD_REQUEST_ANSWER"], sysItemToUpdate["RECEIVE_SMS"], sysItemToUpdate["PHONE_CELL_IDD"], sysItemToUpdate["PHONE_CELL"], sysItemToUpdate["USER_SEQ_NBR"]];
			}else{
				updateSql = 'UPDATE PUBLICUSER set EMAIL_ID = ? , ACCOUNT_TYPE = ?, PASSWORD = ?, PASSWORD_REQUEST_QUESTION = ?, PASSWORD_REQUEST_ANSWER = ?, RECEIVE_SMS = ?, PHONE_CELL_IDD = ?, PHONE_CELL = ? where USER_SEQ_NBR = ?';
				params = [sysItemToUpdate["EMAIL_ID"], sysItemToUpdate["ACCOUNT_TYPE"], sysItemToUpdate["PASSWORD"], sysItemToUpdate["PASSWORD_REQUEST_QUESTION"], sysItemToUpdate["PASSWORD_REQUEST_ANSWER"], sysItemToUpdate["RECEIVE_SMS"], sysItemToUpdate["PHONE_CELL_IDD"], sysItemToUpdate["PHONE_CELL"], sysItemToUpdate["USER_SEQ_NBR"]];
			}
			conf.updateBySQL(updateSql, params);
			
			///////////////////////////////////////
			
			if(!isNullOrEmpty(sysItemToUpdate["PASSWORD"])){
				
				updateSql = 'UPDATE PUSER set PASSWORD = ? where USER_NAME =  ?';
				params = [sysItemToUpdate["PASSWORD"], 'PUBLICUSER'+userSeq];
				conf.updateBySQL(updateSql, params);
			}
			
			///////////////////////////////////////
			
			var staff = {};
			
			staff["GA_AGENCY_CODE"] = serviceProvidorCode;
			staff["GA_BUREAU_CODE"] = serviceProvidorCode;
			staff["GA_DIVISION_CODE"] = "PUBLIC";
			staff["GA_EMAIL"] = sysItemToUpdate["EMAIL_ID"];
			staff["GA_EMPLOY_CLASS_DES"]= null;
			staff["GA_EMPLOY_PH1"]= null;
			staff["GA_EMPLOY_PH2"]= null;
			staff["GA_EMPLOY_TYPE_DES"]= null;
			staff["GA_FAX"]= null;
			staff["GA_FNAME"] = sysItemToUpdate["USER_ID"];
			staff["GA_GROUP_CODE"] = "NA";
			staff["GA_ID_NUM"]= null;
			staff["GA_INITIAL"]= null;
			staff["GA_IVR_PIN"]= null;
			staff["GA_IVR_SEQ"]= null;
			staff["GA_LNAME"]= null;
			staff["GA_LOCKING_PRIV"]= null;
			staff["GA_MNAME"]= null;
			staff["GA_OFFICE_CODE"] = "NA";
			staff["GA_PASSWORD_EXPIR_DT"]= null;
			staff["GA_PREFERRED_CHANNEL"]= null;
			staff["GA_RATE1"]= null;
			staff["GA_RATE2"]= null;
			staff["GA_RATE3"]= null;
			staff["GA_SECTION_CODE"] = "NA";
			staff["GA_STAFF_STATUS"]= null;
			staff["GA_SUBGROUP_CODE"]= null;
			staff["GA_SUFFIX"]= null;
			staff["GA_TITLE"]= null;
			staff["GA_USER_ID"] = userSeq;
			staff["RES_ID"]= null;
			staff["SERV_PROV_CODE"] = serviceProvidorCode;
			staff["USER_NAME"] = "PUBLICUSER" + userSeq;
			staff["staffsI18NModels"] = null;
			
			conf.className = 'com.accela.orm.model.user.StaffsModel';
			var subModels = {
				'staffsI18NModels': { 'ISLANG': true }
			}
			var searchObj = {
				'USER_NAME': "PUBLICUSER" + userSeq
			};
			
			var isGenerator = true;
			var createdStaff = conf.create(searchObj, staff, subModels, true, false, false, isGenerator);
			logDebug("updatedStaff:: " + JSON.stringify(stringifyJSType(createdStaff)));
			
			/////////////////////////
			
			var publicUserQuestionModel = {};

			publicUserQuestionModel["QUESTION"] = sysItemToUpdate["PASSWORD_REQUEST_QUESTION"];
			publicUserQuestionModel["ANSWERS"] = sysItemToUpdate["PASSWORD_REQUEST_ANSWER"];
			publicUserQuestionModel["SORT_ORDER"] = "1";
			publicUserQuestionModel["USER_SEQ_NBR"] = String(userSeq);

			var subModels = {};
			conf.className = 'com.accela.orm.model.user.PublicUserQuestionModel';
			var searchObj = { "USER_SEQ_NBR": String(userSeq) };

			var isGenerator = true;
			var updatingPublicUserQuestionModelResult = conf.create(searchObj, publicUserQuestionModel, subModels, true, false, false, isGenerator);
			logDebug('Update PublicUserQuestionModel Result:: ' + JSON.stringify(stringifyJSType(updatingPublicUserQuestionModelResult)));
			
			/////////////////////////
			
			if(contacts != null && contacts != undefined && contacts != ''){
				contacts = contacts.split(',');
				
				var contactsList = [];
				
				for(var c in contacts){
					var cont = contacts[c].split("::");
					
					var contactItem = {};
					
					contactItem["AGENCY"] = serviceProvidorCode;
					contactItem["ENT_ID"] = cont[0];
					contactItem["ENT_TYPE"] = "REF_CONTACT";
					contactItem["IS_ACCOUNT_OWNER"] = "Y";
					contactItem["STATUS"] = "A";
					contactItem["USER_SEQ_NBR"] = String(userSeq);
					
					contactsList.push(contactItem);
				}
				
				conf.className = 'com.accela.orm.model.user.PublicUserAPORelationModel';
				var searchObj = { "USER_SEQ_NBR": String(userSeq), "ENT_TYPE": "REF_CONTACT" };
				var isGenerator = true;
				var updatingContactResult = conf.create(searchObj, contactsList, subModels, true, false, false, isGenerator);
				logDebug('updatingContactResult:: ' + JSON.stringify(stringifyJSType(updatingContactResult)));
				
			}
				
				/////////////////////////
				
			if(licenses != null && licenses != undefined && licenses != ''){
				licenses = licenses.split(',');
	
				var deleteSql = "delete from XPUBLIC_USER_PROV_LIC where USER_SEQ_NBR = " + String(userSeq);
				conf.deleteBySQL(deleteSql, null);
	
				var insertSql = "INSERT INTO XPUBLIC_USER_PROV_LIC(IS_PRIMARY_LICENSE,ISSUED_BY_AGENCY,LIC_SEQ_NBR,LIC_TYPE,LICENSE_IMPORTED,REC_DATE,REC_FUL_NAM,REC_STATUS,SERV_PROV_CODE,STATUS,USER_SEQ_NBR) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
	
				for(var l in licenses){
					var licKey = licenses[l].split("::");
					var params = ["N", "Y", parseInt(licKey[0]), licKey[1], "Y", new java.util.Date(), 'ADMIN', 'A', serviceProvidorCode, "A", userSeq];
					conf.updateBySQL(insertSql, params);
				}
			}
			
		}
	}
	
	if(createdItems != null && createdItems.length > 0){
//		resArr = resArr.concat(conf.create(searchObj, createdItems, subModels, false));
//		var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
		
		var contactsJson = [];
		
		for(var createdItem in createdItems){
			logDebug('createdItems[createdItem]: \n' + JSON.stringify(stringifyJSType(createdItems[createdItem])));
			
			var licenses = createdItems[createdItem]["LICENSES"];
			var contacts = createdItems[createdItem]["CONTACTS"];
			
			delete createdItems[createdItem]["LICENSES"];
			delete createdItems[createdItem]["CONTACTS"];
			
//			var newSeq = sequenceGeneratorEJB.getNextValue("PUBLICUSER_SEQ");//PUSER_SEQ
			var newSeq = ConfigEngineAPI.getPublicUserNewSequence();
			logDebug('newSeq:::: ' + newSeq);
		    
			createdItems[createdItem]["USER_SEQ_NBR"] = newSeq;
			
			var date = new Date();
			var dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + "-" + date.getDay() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		    createdItems[createdItem]["REGISTER_DATE"] = dateStr;
		    
		    date = new Date(date.getFullYear() + 100, date.getMonth(), date.getDate());
		    dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + "-" + date.getDay() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		    createdItems[createdItem]["PASSWORD_EXPIR_DD"] = dateStr;
		    
		    var password = '';
		    if (isNullOrEmpty(createdItems[createdItem]["PASSWORD"])) {
		    	password = com.accela.security.Utility().encryptPassword("12345678");
		    	createdItems[createdItem]["PASSWORD"] = "12345678";
			} else {
				password = com.accela.security.Utility().encryptPassword(createdItems[createdItem]["PASSWORD"])
			}
//		    createdItems[createdItem]["PASSWORD"] = password;
		    
		    logDebug('password: ' + password);
		    logDebug('createdItems[createdItem]["PASSWORD"]: ' + createdItems[createdItem]["PASSWORD"]);
		    
		    createdItems[createdItem]["UUID"] = java.util.UUID.randomUUID().toString();
		    logDebug('createdItems[createdItem]["UUID"]: ' + createdItems[createdItem]["UUID"]);
		    
			try{
				conf.className = "com.accela.orm.model.user.PublicUserModel";
				var InputJSON = createdItems[createdItem];
				searchObj = { 'USER_SEQ_NBR': newSeq };
				
				var isGenerator = false;
				logDebug('Going to create Item: \n' + JSON.stringify(stringifyJSType(InputJSON)));
				var rcpu = conf.create(searchObj, InputJSON, subModels, overrideExisting, false, false, isGenerator);
				logDebug('rcpu:: ' + rcpu);
			}catch(e){
				logDebug('ERROR Creating Public User: ' + e);
				logDebug("InputJSON:: " + JSON.stringify(stringifyJSType(InputJSON)));
			}
			
			/////////////////////////
			var user = {};
			
			user["ACCOUNT_DISABLE_PERIOD"] = null;
			user["ALLOW_USER_CHANGE_PASSWORD"] = null;
			user["CASHIER_ID"] = null;
			user["CHANGE_PASSWORD_NEXT_LOGIN"] = null;
			user["CONTRACT_ID"] = null;
			user["DAILY_INSP_UNITS"] = null;
			user["DISP_NAME"] = "Public User";
			user["DISTINGUISH_NAME"] = null;
			user["EMPLOYEE_ID"] = null;
			user["FNAME"] = null;
			user["GA_USER_ID"] = ""+newSeq;
			user["INSPECTOR_STATUS"] = null;
			user["INTEGRATED_FLAG"] = null;
			user["LAST_CHANGE_PASSWORD"] = null;
			user["LAST_LOGIN_TIME"] = null;
			user["LDAP_ALIAS"] = null;
			user["LNAME"] = null;
			user["LOCKED"] = null;
			user["LOCKEDTIME"] = null;
			user["LOGINFAILCOUNT"] = null;
			user["MNAME"] = null;
			user["PASSWORD"] = password;
			user["PASSWORD_EXPIRE_TIMEFRAME"] = null;
			user["PIN_NBR"] = null;
			user["REC_LOCK"] = null;
			user["REC_SECURITY"] = null;
			user["SECTION_508_FLAG"] = null;
			user["SERV_PROV_CODE"] = serviceProvidorCode;
			user["STATUS"] = "ENABLE";
			user["SUPERVISOR_FLAG"] = null;
			user["USER_NAME"] = "PUBLICUSER" + newSeq,
			user["USER_SEQ_NBR"] = null;
			
			var subModels = {};
			conf.className = 'com.accela.orm.model.common.UserModel';
			searchObj = { 'USER_NAME': 'PUBLICUSER'+ newSeq};
			
			var isGenerator = false;
			logDebug('Going to create PUSER: \n' + JSON.stringify(stringifyJSType(user)));
			var rcpu = conf.create(searchObj, user, subModels, true, false, false, isGenerator);
			logDebug('rcpu:: ' + rcpu);
			
			/////////////////////////
			var staff = {};
			
			staff["GA_AGENCY_CODE"] = serviceProvidorCode;
			staff["GA_BUREAU_CODE"] = serviceProvidorCode;
			staff["GA_DIVISION_CODE"] = "PUBLIC";
			staff["GA_EMAIL"] = createdItems[createdItem]["EMAIL_ID"];
			staff["GA_EMPLOY_CLASS_DES"]= null;
			staff["GA_EMPLOY_PH1"]= null;
			staff["GA_EMPLOY_PH2"]= null;
			staff["GA_EMPLOY_TYPE_DES"]= null;
			staff["GA_FAX"]= null;
			staff["GA_FNAME"] = createdItems[createdItem]["USER_ID"];
			staff["GA_GROUP_CODE"] = "NA";
			staff["GA_ID_NUM"]= null;
			staff["GA_INITIAL"]= null;
			staff["GA_IVR_PIN"]= null;
			staff["GA_IVR_SEQ"]= null;
			staff["GA_LNAME"]= null;
			staff["GA_LOCKING_PRIV"]= null;
			staff["GA_MNAME"]= null;
			staff["GA_OFFICE_CODE"] = "NA";
			staff["GA_PASSWORD_EXPIR_DT"]= null;
			staff["GA_PREFERRED_CHANNEL"]= null;
			staff["GA_RATE1"]= null;
			staff["GA_RATE2"]= null;
			staff["GA_RATE3"]= null;
			staff["GA_SECTION_CODE"] = "NA";
			staff["GA_STAFF_STATUS"]= null;
			staff["GA_SUBGROUP_CODE"]= null;
			staff["GA_SUFFIX"]= null;
			staff["GA_TITLE"]= null;
			staff["GA_USER_ID"] = ""+newSeq;
			staff["RES_ID"]= null;
			staff["SERV_PROV_CODE"] = serviceProvidorCode;
			staff["USER_NAME"] = "PUBLICUSER" + newSeq;
			staff["staffsI18NModels"] = null;
			
			conf.className = 'com.accela.orm.model.user.StaffsModel';
			var subModels = {
				'staffsI18NModels': { 'ISLANG': true }
			}
			var searchObj = {
				'USER_NAME': "PUBLICUSER" + newSeq
			};
			
			var isGenerator = true;
			var createdStaff = conf.create(searchObj, staff, subModels, true, false, false, isGenerator);
			logDebug("createdStaff:: " + JSON.stringify(stringifyJSType(createdStaff)));
			
			/////////////////////////
			var pUserAgencyModel = {};

			pUserAgencyModel["USER_SEQ_NBR"] = newSeq;
			pUserAgencyModel["SERV_PROV_CODE"] = serviceProvidorCode;
			pUserAgencyModel["USER_NAME"] = "PUBLICUSER"+ newSeq;
			pUserAgencyModel["AGENCY_PIN"]= null;
			pUserAgencyModel["USER_PIN"]= null;
			pUserAgencyModel["STATUS"]= null;
			pUserAgencyModel["DEFAULT_AGENCY"]= null;

			conf.className = 'com.accela.orm.model.user.PublicUserAgencyModel';
			var subModels = {
				'staffsI18NModels': { 'ISLANG': true }
			}
			var searchObj = {
				'USER_NAME': "PUBLICUSER" + newSeq
			};

			var createdPUserAgencyModel = conf.create(searchObj, pUserAgencyModel, subModels, true, false, false, true);
			logDebug("createdPUserAgencyModel:: " + JSON.stringify(stringifyJSType(createdPUserAgencyModel)));
			
			////////////////////////////
			
			var publicUserQuestionModel = {};

			publicUserQuestionModel["QUESTION"] = createdItems[createdItem]["PASSWORD_REQUEST_QUESTION"];
			publicUserQuestionModel["ANSWERS"] = createdItems[createdItem]["PASSWORD_REQUEST_ANSWER"];
			publicUserQuestionModel["SORT_ORDER"] = "1";
			publicUserQuestionModel["USER_SEQ_NBR"] = String(newSeq);

			var subModels = {};
			conf.className = 'com.accela.orm.model.user.PublicUserQuestionModel';
			var searchObj = { "USER_SEQ_NBR": String(newSeq) };

			var isGenerator = true;
			var creatingPublicUserQuestionModelResult = conf.create(searchObj, publicUserQuestionModel, subModels, true, false, false, isGenerator);
			logDebug('Create PublicUserQuestionModel Result:: ' + JSON.stringify(stringifyJSType(creatingPublicUserQuestionModelResult)));
			
			///////////////////////////
			if(contacts != null && contacts != undefined && contacts != ''){
				contacts = contacts.split(',');
				
				var aporRelationalList = [];
				
				for(var c in contacts){
					var cont = contacts[c].split("::");
					
					var aporRelational = {};
					
					aporRelational["AGENCY"] = serviceProvidorCode;
					aporRelational["ENT_ID"] = cont[0];
					aporRelational["ENT_TYPE"] = "REF_CONTACT";
					aporRelational["IS_ACCOUNT_OWNER"] = "Y";
					aporRelational["STATUS"] = "A";
					aporRelational["USER_SEQ_NBR"] = String(newSeq);
					
					aporRelationalList.push(aporRelational);
				}
				
				conf.className = 'com.accela.orm.model.user.PublicUserAPORelationModel';
				var searchObj = { "USER_SEQ_NBR": String(newSeq), "ENT_TYPE": "REF_CONTACT" };
				var isGenerator = true;
				var creatingContactResult = conf.create(searchObj, aporRelationalList, subModels, true, false, false, isGenerator);
				logDebug('creatingContactResult:: ' + JSON.stringify(stringifyJSType(creatingContactResult)));
			}
			
			////////////////////////////////////////////
			if(licenses != null && licenses != undefined && licenses != ''){
				licenses = licenses.split(',');
	
				var deleteSql = "delete from XPUBLIC_USER_PROV_LIC where USER_SEQ_NBR = " + String(newSeq);
				conf.deleteBySQL(deleteSql, null);
	
				var insertSql = "INSERT INTO XPUBLIC_USER_PROV_LIC(IS_PRIMARY_LICENSE,ISSUED_BY_AGENCY,LIC_SEQ_NBR,LIC_TYPE,LICENSE_IMPORTED,REC_DATE,REC_FUL_NAM,REC_STATUS,SERV_PROV_CODE,STATUS,USER_SEQ_NBR) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
	
				for(var l in licenses){
					var licKey = licenses[l].split("::");
					var params = ["N", "Y", parseInt(licKey[0]), licKey[1], "Y", new java.util.Date(), 'ADMIN', 'A', serviceProvidorCode, "A", newSeq];
					conf.updateBySQL(insertSql, params);
				}
			}
		}
	}

	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };
	
	return result;
}

ConfigEngineAPI.getPublicUserNewSequence = function(){
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	var newSeq = sequenceGeneratorEJB.getNextValue("PUBLICUSER_SEQ");
	logDebug('newSeq:::: ' + newSeq);
	
	var user = ConfigEngineAPI.searchUsers('PUBLICUSER'+newSeq);
	logDebug('user:: \n' + JSON.stringify(stringifyJSType(user)));
	if(user.length > 0){
		return ConfigEngineAPI.getPublicUserNewSequence();
	}
	
	conf.className = 'com.accela.orm.model.user.PublicUserLicenseRelationModel';
	var searchObj = { "USER_SEQ_NBR": newSeq };
	var publicUserLicenseRelationModel = conf.search(searchObj, true, true, false, true, true);
	if(publicUserLicenseRelationModel.length > 0){
		return ConfigEngineAPI.getPublicUserNewSequence();
	}
	
	return newSeq;
}

ConfigEngineAPI.searchPublicUserBySeqNumber = function (seqNumber, ignoreSubModels) {
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;

	conf.className = "com.accela.orm.model.user.PublicUserModel";
	var searchObj = {"USER_SEQ_NBR": String(seqNumber)};
	conf.subModels = {};
	return conf.search(searchObj, true, ignoreSubModels, false, false);
}

ConfigEngineAPI.searchPublicUserByUserId = function (userId) {
	var obj = new com.accela.orm.model.user.PublicUserModel();
	var sql = "SELECT * FROM PUBLICUSER where USER_ID = " + userId;
	var params = [];
	conf.subModels = {};

	return conf.searchBySQL(obj.getClass(), sql, params, true, false, false);
}

ConfigEngineAPI.searchAllUsersList = function () {
	lpList = ConfigEngineAPI.getAllUsers();
	
	lpList = lpList.map(function (lp) {
		return lp["USER_NAME"];
	});

	return distinctList(lpList);
}

ConfigEngineAPI.searchUserProfile = function(code, username, ignoreSubModels){
	logDebug('searchUserProfile.......................');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.common.UserProfileModel";
	
	var searchObj = {};
	
	if(isNullOrEmpty(username)){
		searchObj = {"SERV_PROV_CODE": String(code)};
	}else{
		searchObj = {"SERV_PROV_CODE": String(code), "USER_NAME": String(username)};
	}
	
	logDebug("searchObj: " + JSON.stringify(searchObj));
	
	conf.subModels = {
			
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createUpdateUserProfile = function(jsonInput, overrideExisting){
	logDebug('createUpdateUserProfile.......................');
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	conf.className = "com.accela.orm.model.common.UserProfileModel";
	
	var subModels = {
			
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	var resArr = [];
	
	for(var key in jsonInput){
		logDebug("key: " + key);
		
		var searchObj = {"SERV_PROV_CODE": jsonInput[key]["SERV_PROV_CODE"], "USER_NAME": jsonInput[key]["USER_NAME"], "PROFILE_SEQ_NBR": jsonInput[key]["PROFILE_SEQ_NBR"]};
		logDebug("searchObj: " + JSON.stringify(searchObj));
		
		resArr = resArr.concat(conf.create(searchObj, jsonInput[key], subModels, overrideExisting));
	}
		
	var searchObj = {"GUIDE_GROUP": String(jsonInput[0]["GUIDE_GROUP"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("UserProfile", String(jsonInputOrg[0]["GUIDE_GROUP"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}


ConfigEngineAPI.getAllUsers = function (ignoreSubModels, isForUpdate) {
	logDebug('getAllUsers.......................');
	ignoreSubModels = ignoreSubModels == null || ignoreSubModels == undefined ? false : ignoreSubModels;
	var userProfiles = {
			"1": "HOME_PAGE",
			"3": "DEFAULT_MODULE",
			"4": "ACCESS_MODE",
			"5": "BILLING_RATE",
			"7": "May Enter Time Accounting", // Y/N
			"8": "Time Accounting Group", // null = all, id = time accounting group
			"9": "Time Accounting Types", // 0 = "All Time Accounting Types" , 1 = "Specified Time Accounting Types"
			"10": "Number of Days That Delete is Allowed",// MAX 999
			"11": "Number of Days That Update is Allowed",// MAX 999
			"12": "Hourly Rate",
			"13": "May Modify the Logged Date", // Y/N 
			"14": "May Modify Billable Flag", // Y/N
			"15": "May Enter Materials And Cost",// X=Hidden Y N
			"16": "May Enter Start/End/Elapsed Time", // 0 = "Yes" , 1 = "Elapsed Time Only"
			"17": "May See Other User's Time Accounting", // Y/N
			"18": "May Modify Rates and Cost",// S X Y N A
			"19": "May Enter Vehicle and Mileage",// X Y N
			"20": "May Delete Other User's Time Accounting", // N= No, S=Supervisor, A=Administrator
			"21": "May Add/Modify Other User's Time Accounting", // N= No, S=Supervisor, A=Administrator
			"23": "DISP_INITIALS",
			"27": "May Lock Other User's Time Accounting" // N= No, S=Supervisor, A=Administrator
	}
	conf.className = 'com.accela.orm.model.common.UserModel'
	var searchObj = {}
	var activeOnly = false;
	var users = conf.search(searchObj, true, ignoreSubModels, false, false, activeOnly);
	logDebug('users.length: ' + users.length);
	users = stringifyJSType(users);

	var aaUsers = users.filter(function (user) {
		var userName = user["USER_NAME"].toUpperCase();
		return userName.lastIndexOf("PUBLICUSER", 0) !== 0;
//		return userName.indexOf("HASHAIKEH", 0) !== -1; 
	});
	
	logDebug('aaUsers.length: ' + aaUsers.length);
	
	if(isForUpdate){
		return aaUsers;
	}

	for (var u in aaUsers) {
		aaUsers[u]["PASSWORD"] = ""

		conf.className = 'com.accela.orm.model.user.StaffsModel'
		var searchObj = { "USER_NAME": aaUsers[u]["USER_NAME"] }
		var staffsMod = conf.search(searchObj, true, true, false, true, true)
		aaUsers[u]["staffsModel"] = staffsMod[0];

		logDebug("Getting Profiles.................");
//		conf.className = 'com.accela.orm.model.common.UserProfileModel';
//		var searchObj = { "USER_NAME": aaUsers[u]["USER_NAME"] };
//		var profiles = conf.search(searchObj, true, false, false, false, false);
		var profiles = ConfigEngineAPI.searchUserProfile(aaUsers[u]["SERV_PROV_CODE"], aaUsers[u]["USER_NAME"], false);
		logDebug("profiles.length: " + profiles.length);
		var profs = [];
		for (var pr in profiles) {
			logDebug('profiles[pr]["PROFILE_SEQ_NBR"]: ' + profiles[pr]["PROFILE_SEQ_NBR"]);
			if (userProfiles.hasOwnProperty(profiles[pr]["PROFILE_SEQ_NBR"])) {
				logDebug("userProfiles.hasOwnProperty = true");
				
				var seq = profiles[pr]["PROFILE_SEQ_NBR"];
				if(seq == '3' || seq == '4' || seq == '5' || seq == '23'){
					aaUsers[u][userProfiles[profiles[pr]["PROFILE_SEQ_NBR"]]] = profiles[pr]["PROFILE_VALUE"];
				}
				delete profiles[pr]["auditModel"];
				profs.push(profiles[pr]);
			}else{
				logDebug("userProfiles.hasOwnProperty = false");
			}
		}
		
		aaUsers[u]["userProfileModels"] = profs; 

		var searchObj = { "USER_NAME": aaUsers[u]["USER_NAME"] }
		var groups = ConfigEngineAPI.getUsersGroupsMapping(false, searchObj)
		groups = groups.map(function (group) {
			return group["MODULE_NAME"] + "::" + group["DISP_TEXT"]
		})
		aaUsers[u]["groups"] = groups.join(',')

		conf.className = 'com.accela.orm.model.common.UserSecurityModel'
		var searchObj = { "LEVEL_DATA": aaUsers[u]["USER_NAME"], "LEVEL_TYPE": "User", "POLICY_NAME": "UserSettings" }
		var policyModel = conf.search(searchObj, true, false, false, false, false)
		if (policyModel[0]) {
			var data = policyModel[0]["DATA1"]
			var perms = data.split(';')
			for (var p in perms) {
				var pair = perms[p].split("=")
				aaUsers[u][pair[0]] = pair[1]
			}
		} else {
			aaUsers[u]["AGIS"] = "N"
			aaUsers[u]["AMO"] = "N"
			aaUsers[u]["AW"] = "N"
			aaUsers[u]["DUMMYUSER"] = "N"
		}

		var dSearchObj;
		try{
			dSearchObj = aaUsers[u]["SERV_PROV_CODE"] + "/" + staffsMod[0]["GA_AGENCY_CODE"] + "/" + staffsMod[0]["GA_BUREAU_CODE"] + "/" + staffsMod[0]["GA_DIVISION_CODE"] + "/" + staffsMod[0]["GA_SECTION_CODE"] + "/" + staffsMod[0]["GA_GROUP_CODE"] + "/" + staffsMod[0]["GA_OFFICE_CODE"]
//			dSearchObj = {
//				"R3_AGENCY_CODE": staffsMod[0]["GA_AGENCY_CODE"],
//				"R3_BUREAU_CODE": staffsMod[0]["GA_BUREAU_CODE"],
//				"R3_DIVISION_CODE": staffsMod[0]["GA_DIVISION_CODE"],
//				"R3_SECTION_CODE": staffsMod[0]["GA_SECTION_CODE"],
//				"R3_GROUP_CODE": staffsMod[0]["GA_GROUP_CODE"],
//				"R3_OFFICE_CODE": staffsMod[0]["GA_OFFICE_CODE"]
//			}
		}catch(e){
			dSearchObj = "ADMIN/NA/NA/NA/NA/NA/NA";
//			dSearchObj = {
//					"R3_AGENCY_CODE": "ADMIN",
//					"R3_BUREAU_CODE": "NA",
//					"R3_DIVISION_CODE": "NA",
//					"R3_SECTION_CODE": "NA",
//					"R3_GROUP_CODE": "NA",
//					"R3_OFFICE_CODE": "NA"
//				}
		}

		var dept = ConfigEngineAPI.searchDepartment(aaUsers[u]["SERV_PROV_CODE"], dSearchObj)[0];
		aaUsers[u]['DEPARTMENT'] = dept ? dept["R3_DEPTNAME"] : "";
	}
	return aaUsers
}

ConfigEngineAPI.updateUsers = function (jsonInput, serviceProvidorCode, overrideExisting) {
	logDebug("updateUsers...........................");
	
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	logDebug('overrideExisting: ' + overrideExisting);
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	logDebug("jsonInput:: " + JSON.stringify(stringifyJSType(jsonInput)));
	
	var sysData = ConfigEngineAPI.getAllUsers(false, true);

	var searchObj = { 'USER_NAME': '' }
	
	var userProfiles = {
		"1": "/index.cfm?fuseaction=Menu",
		"2": "1",
		"3": "DEFAULT_MODULE",
		"4": "ACCESS_MODE",
		"5": "BILLING_RATE",
		"6": null,
		"7": "N",
		"8": null,
		"9": "0",
		"10": "999",
		"11": "999",
		"12": "0.0",
		"13": "N",
		"14": "N",
		"15": "X",
		"16": "0",
		"17": "N",
		"18": "X",
		"19": "X",
		"20": "N",
		"21": "N",
		"23": "DISP_INITIALS",
		"24": "N",
		"25": null,
		"26": "N",
		"27": "N",
		"28": "Y"
	};

	var subModels = {
		'delegateUserModels': {},
		'userDisciplineModels': {},
		'staffsModel': {},
		'userDistrictModels': {},
		'userGroupModels': {},
		'userProfileModels': {},
		'userSecurityModels': {},
	}

	var resArr = [];

//	timeDebug("Getting created Items");
	var createdItems = getCreatedItems(['USER_NAME'], sysData, jsonInput);
	logDebug("createdItems.length: " + createdItems.length);
//	timeDebug("After Getting created Items");
	
	var sql1Params = null;
	var sql2ParamsA = null;
	var sql2ParamsI = null;
	
	for (var c in createdItems) {
		var cItem = createdItems[c];
//		timeDebug("cItem Before");
//		logDebug('cItem Before: \n' + JSON.stringify(stringifyJSType(cItem)));
//		timeDebug("cItem Before");
		
		searchObj['USER_NAME'] = cItem['USER_NAME'];

		cItem['GA_USER_ID'] = cItem['USER_NAME']
		cItem['staffsModel']['USER_NAME'] = cItem['USER_NAME']
		cItem['staffsModel']['GA_USER_ID'] = cItem['USER_NAME']
		if (isNullOrEmpty(cItem["PASSWORD"])) {
			cItem["PASSWORD"] = com.accela.security.Utility().encryptPassword("1234")
		} else {
			cItem["PASSWORD"] = com.accela.security.Utility().encryptPassword(cItem["PASSWORD"])
		}
		
		// userProfileModels
		cItem["userProfileModels"] = [];
		for (var pr in userProfiles) {
			
			var profile = {
					"PROFILE_SEQ_NBR": pr,
					"PROFILE_VALUE": userProfiles[pr],
					"USER_NAME": cItem['USER_NAME']
				};
			
			if(pr == '3' || pr == '4' || pr == '5' || pr == '23'){
				profile["PROFILE_VALUE"] = cItem[userProfiles[pr]];
			}else{
				if(!isEmpty(cItem['USER_PROFILE']) && !isEmpty(cItem['USER_PROFILE'][pr]) ){
					profile["PROFILE_VALUE"] = cItem['USER_PROFILE'][pr]['PROFILE_VALUE'];
				}
			}
			
			cItem["userProfileModels"].push(profile);
		}

		// Department
//		timeDebug("Before fillDepartment");
		fillDepartment(cItem);
//		timeDebug("After fillDepartment");

		// userSecurityModels
		cItem['userSecurityModels'] = [];
		
		var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
		var xPolicySeq = sequenceGeneratorEJB.getNextValue("XPOLICY_SEQ");
		logDebug('xPolicySeq ::: ' + xPolicySeq);
		var policy = {
			"DATA1": "AGIS=" + cItem["AGIS"] + ";" + "AMO=" + cItem["AMO"] + ";" + "AW=" + cItem["AW"] + ";" + "DUMMYUSER=" + cItem["DUMMYUSER"],
			"LEVEL_DATA": cItem['USER_NAME'],
			"LEVEL_TYPE": "User",
			"POLICY_NAME": "UserSettings",
			"RIGHT_GRANTED": "Y",
			"STATUS": "Y",
			"POLICY_SEQ": xPolicySeq
		}
		cItem["userSecurityModels"].push(policy);
		
		timeDebug("cItem After");
		logDebug('cItem After: \n' + JSON.stringify(stringifyJSType(cItem)));
		timeDebug("cItem After");
		// Do create...
//		conf.className = 'com.accela.orm.model.common.UserModel';
//		resArr = resArr.concat(conf.create(searchObj, cItem, subModels, false));
		// Update staffsModel for i18
//		updateStaffsModel(cItem['staffsModel']);
		
		if(sql1Params == null){
			sql1Params = "'" + cItem['USER_NAME'] + "'";
		}else{
			sql1Params += ",'" + cItem['USER_NAME'] + "'";
		}
		
		//update Active InActive Manually
		var activeInActive = !isNullOrEmpty(cItem['USER_PROFILE']) && !isNullOrEmpty(cItem['USER_PROFILE']['ACTIVE']) && (cItem['USER_PROFILE']['ACTIVE'] == true || cItem['USER_PROFILE']['ACTIVE'] == 'true') ? 'A' : 'I';
		
		if(activeInActive == 'A'){
			if(sql2ParamsA == null){
				sql2ParamsA = "'" + cItem['USER_NAME'] + "'";
			}else{
				sql2ParamsA += ",'" + cItem['USER_NAME'] + "'";
			}
		}else{
			if(sql2ParamsI == null){
				sql2ParamsI = "'" + cItem['USER_NAME'] + "'";
			}else{
				sql2ParamsI += ",'" + cItem['USER_NAME'] + "'";
			}
		}
		
		createdItems[c] = cItem;
		
//		conf.className = 'com.accela.orm.model.common.UserModel';
//		logDebug('Creatint...................');
//		logDebug('Creatint: \n' + JSON.stringify(stringifyJSType(createdItems[c])));
//		var rrr = conf.create(searchObj, createdItems[c], subModels, overrideExisting);
//		logDebug('rrr: ' + rrr);
//		resArr = resArr.concat(rrr);
	}
	
	if(createdItems.length > 0){
		logDebug('Batch Create...................');
		conf.className = 'com.accela.orm.model.common.UserModel';
		resArr = resArr.concat(conf.create("BATCH", createdItems, subModels, false));
		logDebug('Batch Create................... Done');
	}
	
	for (var c in createdItems) {
		var cItem = createdItems[c];
		
		updateStaffsModel(cItem['staffsModel']);//time..........715ms
//		timeDebug("updateStaffsModel");
	}
	
	if(sql1Params != null){
		var sql1 = "update PUSER_PROFILE set REC_STATUS = 'Y' WHERE USER_NAME in (" + sql1Params + ") AND PROFILE_SEQ_NBR = 28";
		conf.updateBySQL(sql1);
	}
	
	if(sql2ParamsA != null){
		var sql2A = "update PUSER_PROFILE set REC_STATUS = 'A' WHERE USER_NAME in (" + sql2ParamsA + ") AND PROFILE_SEQ_NBR IN (7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,24,27)";
		conf.updateBySQL(sql2A);
	}
	
	if(sql2ParamsI != null){
		var sql2I = "update PUSER_PROFILE set REC_STATUS = 'I' WHERE USER_NAME in (" + sql2ParamsI + ") AND PROFILE_SEQ_NBR IN (7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,24,27)";
		conf.updateBySQL(sql2I);
	}
	

//	timeDebug("Going to get the updated Items");
	logDebug("Going to get the updated Items..............");
	var updatedItems = getUpdatedItems(['USER_NAME'], sysData, jsonInput, { 'staffsI18NModels': 'LANG_ID'}, ['USER_PROFILE']);
	logDebug("updatedItems.length: " + updatedItems.length);
//	timeDebug("After get the updated Items");
	
	sql1Params = null;
	sql2ParamsA = null;
	sql2ParamsI = null;
	
	for (var u in updatedItems) {
		var uItem = updatedItems[u];
		searchObj['USER_NAME'] = uItem['USER_NAME'];
		uItem['staffsModel']['USER_NAME'] = uItem['USER_NAME'];
//		timeDebug("Loop updatedItems #1");
//		var exItem = ConfigEngineAPI.searchUsers(uItem['USER_NAME'], false)[0];
		var exItem = sysData.filter(function (item) { return item['USER_NAME'] == uItem['USER_NAME'] ;})[0];
		
//		logDebug('exItem Before: \n' + JSON.stringify(stringifyJSType(exItem)));
//		timeDebug("Loop updatedItems #2");
		var format = new java.text.SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		var date = new Date();
		var dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + "-" + date.getDay() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

//		timeDebug("Loop updatedItems #3");
		
		exItem["LAST_CHANGE_PASSWORD"] = isNullOrEmpty(exItem["LAST_CHANGE_PASSWORD"]) ? dateStr : format.parse(exItem["LAST_CHANGE_PASSWORD"]);
		
//		timeDebug("Loop updatedItems #4");//Time91ms
		exItem["LAST_LOGIN_TIME"] = isNullOrEmpty(exItem["LAST_LOGIN_TIME"]) ? dateStr : format.parse(exItem["LAST_LOGIN_TIME"]);
//		timeDebug("Loop updatedItems #5");
		for (var p in exItem) {
			if (!subModels.hasOwnProperty(p)) {
				if (uItem.hasOwnProperty(p)) {
					if (p == "PASSWORD") {
						if (!isNullOrEmpty(uItem[p])) {
							exItem[p] = com.accela.security.Utility().encryptPassword(uItem[p])
						}
					} else {
						exItem[p] = uItem[p]
					}
				}
			}
		}
//		timeDebug("Loop updatedItems #6");

		// userProfileModels
//		var profiles = exItem["userProfileModels"];
//		for (var pr in profiles) {
//			if (userProfiles.hasOwnProperty(profiles[pr]["PROFILE_SEQ_NBR"])) {
//				profiles[pr]["PROFILE_VALUE"] = uItem[userProfiles[profiles[pr]["PROFILE_SEQ_NBR"]]];
//			}
//		}
		
		exItem["userProfileModels"] = [];
		for (var pr in userProfiles) {
			
			var profile = {
					"PROFILE_SEQ_NBR": pr,
					"PROFILE_VALUE": userProfiles[pr],
					"USER_NAME": uItem['USER_NAME']
				};
			
			if(pr == '3' || pr == '4' || pr == '5' || pr == '23'){
				profile["PROFILE_VALUE"] = uItem[userProfiles[pr]];
			}else{
				if(!isEmpty(uItem['USER_PROFILE']) && !isEmpty(uItem['USER_PROFILE'][pr]) ){
					profile["PROFILE_VALUE"] = uItem['USER_PROFILE'][pr]['PROFILE_VALUE'];
				}
			}
			
			exItem["userProfileModels"].push(profile);
		}
//		timeDebug("Loop updatedItems #7");
//		logDebug('exItem After:: \n' + JSON.stringify(stringifyJSType(exItem)));
//		timeDebug("Loop updatedItems #8");
//		logDebug('fillDepartment....................');
		// Department
		fillDepartment(uItem);
//		logDebug('AfterfillDepartment....................');
//		timeDebug("Loop updatedItems #9");//time 101ms
		// userSecurityModels
		exItem['userSecurityModels'] = exItem['policyModel'];
//		timeDebug("Loop updatedItems #10");
		try{
			exItem['userSecurityModels'][0]["DATA1"] = "AGIS=" + uItem["AGIS"] + ";" + "AMO=" + uItem["AMO"] + ";" + "AW=" + uItem["AW"] + ";" + "DUMMYUSER=" + uItem["DUMMYUSER"]
		}catch(e){
			logDebug('Error setting exItem["userSecurityModels"][0]["DATA1"]: ' + e);
		}
//		timeDebug("Loop updatedItems #11");
		//Fill Names
		exItem['DISP_NAME'] = uItem['DISP_NAME'];
		exItem['FNAME'] = uItem['FNAME'];
		exItem['GA_USER_ID'] = uItem['GA_USER_ID'];
		exItem['LNAME'] = uItem['LNAME'];
		exItem['MNAME'] = uItem['MNAME'];
//		timeDebug("Loop updatedItems #11");//Time 99ms
//		logDebug('exItem After: \n' + JSON.stringify(stringifyJSType(exItem)));
//		logDebug('uItem After: \n' + JSON.stringify(stringifyJSType(uItem)));
//		timeDebug("Loop updatedItems #12");
		// Do update...
		conf.className = 'com.accela.orm.model.common.UserModel';
//		resArr = resArr.concat(conf.update(searchObj, exItem, subModels, true));
		resArr = resArr.concat(conf.update(null, exItem, subModels, true));
		// Update staffsModel for i18
		updateStaffsModel(uItem['staffsModel']);
//		timeDebug("Loop updatedItems #13");//Time 209ms
//		var sql1 = "update PUSER_PROFILE set REC_STATUS = 'Y' WHERE USER_NAME = '" + uItem['USER_NAME'] + "' AND PROFILE_SEQ_NBR = 28";
//		conf.updateBySQL(sql1);
		
		if(sql1Params == null){
			sql1Params = "'" + exItem['USER_NAME'] + "'";
		}else{
			sql1Params += ",'" + exItem['USER_NAME'] + "'";
		}
		
		//update Active InActive Manually
		var activeInActive = !isNullOrEmpty(uItem['USER_PROFILE']) && !isNullOrEmpty(uItem['USER_PROFILE']['ACTIVE']) && (uItem['USER_PROFILE']['ACTIVE'] == true || uItem['USER_PROFILE']['ACTIVE'] == 'true') ? 'A' : 'I';
//		timeDebug("Loop updatedItems #14");
		if(activeInActive == 'A'){
			if(sql2ParamsA == null){
				sql2ParamsA = "'" + exItem['USER_NAME'] + "'";
			}else{
				sql2ParamsA += ",'" + exItem['USER_NAME'] + "'";
			}
		}else{
			if(sql2ParamsI == null){
				sql2ParamsI = "'" + exItem['USER_NAME'] + "'";
			}else{
				sql2ParamsI += ",'" + exItem['USER_NAME'] + "'";
			}
		}
//		timeDebug("Loop updatedItems #15");//Time 99ms
//		var sql = "update PUSER_PROFILE set REC_STATUS = '" + activeInActive + "' WHERE USER_NAME = '" + uItem['USER_NAME'] + "' AND PROFILE_SEQ_NBR IN (7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,24,27)";
//		conf.updateBySQL(sql);
	}
//	timeDebug("After Loop updatedItems #1");
	
	if(sql1Params != null){
		var sql1 = "update PUSER_PROFILE set REC_STATUS = 'Y' WHERE USER_NAME in (" + sql1Params + ") AND PROFILE_SEQ_NBR = 28";
		conf.updateBySQL(sql1);
	}
//	timeDebug("After Loop updatedItems #2");
	
	if(sql2ParamsA != null){
		var sql2A = "update PUSER_PROFILE set REC_STATUS = 'A' WHERE USER_NAME in (" + sql2ParamsA + ") AND PROFILE_SEQ_NBR IN (7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,24,27)";
		conf.updateBySQL(sql2A);
	}
//	timeDebug("After Loop updatedItems #3");
	
	if(sql2ParamsI != null){
		var sql2I = "update PUSER_PROFILE set REC_STATUS = 'I' WHERE USER_NAME in (" + sql2ParamsI + ") AND PROFILE_SEQ_NBR IN (7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,24,27)";
		conf.updateBySQL(sql2I);
	}
//	timeDebug("After Loop updatedItems #4");
	
	// Update groups
	var userGroupMapping = [];
	for (var i in jsonInput) {
		var user = jsonInput[i]
		var groups = user['GROUPS'].split(',')
		userGroupMapping = userGroupMapping.concat(updateUserGroups(user['USER_NAME'], groups));
	}
	if(userGroupMapping.length > 0){
		conf.create("BATCH", userGroupMapping, {}, false);
	}
	
//	timeDebug("After Loop updatedItems #5");
	var sql = "UPDATE XPOLICY SET STATUS = 'Y' " +
	"WHERE 1=1 " +
	"AND SERV_PROV_CODE = '" + serviceProvidorCode + "' " +
	"AND POLICY_NAME = 'UserSettings' " +
	"AND LEVEL_DATA NOT LIKE 'PUBLICUSER%' " +
	"AND STATUS = 'A' ";
	
	conf.updateBySQL(sql);
//	timeDebug("After Loop updatedItems #6");//Time 93ms
	sql = "UPDATE XPOLICY " +
		"SET DATA1 = 'AGIS=Y;AMO=Y;AW=N;DUMMYUSER=N' " +
		"WHERE 1=1 " +
		"AND SERV_PROV_CODE = '" + serviceProvidorCode + "' " +
		"AND DATA1 NOT LIKE '%DUMMYUSER=N%' " +
		"AND POLICY_NAME = 'UserSettings' " +
		"AND LEVEL_DATA NOT LIKE 'PUBLICUSER%'";
	
	conf.updateBySQL(sql);
//	timeDebug("After Loop updatedItems #7");
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };
//	timeDebug("After Loop updatedItems #8");//Time 98ms
	return result;
}

// Private
function fillDepartment(item) {
	logDebug('item["DEPARTMENT"]: ' + item["DEPARTMENT"]);
	
	var dSearchObj = item["DEPARTMENT"];
	
	try{
		var dept = ConfigEngineAPI.searchDepartmentByDepName(dSearchObj, true);
		
		logDebug('dept: ' + dept);
		logDebug('JSON.stringify(stringifyJSType(dept)): ' + JSON.stringify(stringifyJSType(dept)));
		
		item["staffsModel"]["GA_AGENCY_CODE"] = dept["R3_AGENCY_CODE"];
		item["staffsModel"]["GA_BUREAU_CODE"] = dept["R3_BUREAU_CODE"];
		item["staffsModel"]["GA_DIVISION_CODE"] = dept["R3_DIVISION_CODE"];
		item["staffsModel"]["GA_SECTION_CODE"] = dept["R3_SECTION_CODE"];
		item["staffsModel"]["GA_GROUP_CODE"] = dept["R3_GROUP_CODE"];
		item["staffsModel"]["GA_OFFICE_CODE"] = dept["R3_OFFICE_CODE"];
	}catch(e){
		logDebug('Error Getting Department: ' + e);
		item["staffsModel"]["GA_AGENCY_CODE"] = "";
		item["staffsModel"]["GA_BUREAU_CODE"] = "";
		item["staffsModel"]["GA_DIVISION_CODE"] = "";
		item["staffsModel"]["GA_SECTION_CODE"] = "";
		item["staffsModel"]["GA_GROUP_CODE"] = "";
		item["staffsModel"]["GA_OFFICE_CODE"] = "";
	}
	
}

var staffModelExistingItems = null;

function updateStaffsModel(item) {
	logDebug('updateStaffsModel::item:: \n' + JSON.stringify(stringifyJSType(item)));
	var subModels = {
		'staffsI18NModels': { 'ISLANG': true }
	}
	
	conf.className = 'com.accela.orm.model.user.StaffsModel';

	logDebug("item['USER_NAME']: " + item['USER_NAME']);
		
	var searchObj;// = { 'USER_NAME': item['USER_NAME'] };
	
	if(staffModelExistingItems == null){
		staffModelExistingItems = {};
		var searchObj = {'SERV_PROV_CODE': ""};
		var result = conf.search(searchObj, true, true, false, true);
		for(var r in result){
			if(result[r]["USER_NAME"] != null && result[r]["USER_NAME"] != undefined){
				staffModelExistingItems[result[r]["USER_NAME"]] = result[r]; 
			}
		}
	}

//	var exItem = conf.search(searchObj, true, true, false, true)[0];
	var exItem = staffModelExistingItems[item['USER_NAME']];
	logDebug('updateStaffsModel::exItem:: \n' + JSON.stringify(stringifyJSType(exItem)));
	
	if(exItem == null || exItem == undefined){
		exItem = item;
	}
	
	var format = new java.text.SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
	
	try{
		exItem["GA_PASSWORD_EXPIR_DT"] = isNullOrEmpty(exItem["GA_PASSWORD_EXPIR_DT"]) ? "" : format.parse(exItem["GA_PASSWORD_EXPIR_DT"]);
	}catch(e){
		logDebug('ERR::exItem["GA_PASSWORD_EXPIR_DT"]::  ' + e);
	}

	for (var p in exItem) {
		if (!subModels.hasOwnProperty(p)) {
			if (item.hasOwnProperty(p)) {
				exItem[p] = item[p];
			}
		}
	}

	exItem["staffsI18NModels"] = item["staffsI18NModels"];

	for (var m in exItem["staffsI18NModels"]) {
		try{
			exItem["staffsI18NModels"][m]["RES_ID"] = exItem["RES_ID"];
		}catch(e){
			logDebug('ERR::exItem["staffsI18NModels"][m]["RES_ID"]:: ' + e);
		}
	}
	
	searchObj = { 'USER_NAME': item['USER_NAME'] };
	conf.update(searchObj, exItem, subModels, true)
}

ConfigEngineAPI.getUsersGroupsMapping = function (ignoreSubModels, searchObj) {
	conf.className = 'com.accela.orm.model.user.UserGroupModel'
	var result = conf.search(searchObj, true, !ignoreSubModels, false, true, true)
	result.map(function (item) {
		item["DISP_TEXT"] = item["virtualUserGroupModel"]["DISP_TEXT"]
	})

	result.sort(function (a, b) {
		if (a.last_nom < b.last_nom) {
			return -1;
		}
		if (a.last_nom > b.last_nom) {
			return 1;
		}
		return 0;
	})
	return result
}

ConfigEngineAPI.searchAgencyGroup = function (module, desc, ignoreSubModels) {
	conf.className = 'com.accela.orm.model.common.AgencyGroupModel'

	var searchObj = {
		'MODULE_NAME': module ? String(module) : null,
		'DISP_TEXT': desc ? String(desc) : null
	}

	var result = conf.search(searchObj, true, !ignoreSubModels, false, true)
	return result
}

ConfigEngineAPI.getAllAgencyGroups = function () {
	conf.className = 'com.accela.orm.model.common.AgencyGroupModel'

	var searchObj = {}

	var result = conf.search(searchObj, true, false, false, true, true)
	result.sort(function (a, b) {
		if (a["MODULE_NAME"] < b["MODULE_NAME"]) {
			return -1;
		}
		if (a["MODULE_NAME"] > b["MODULE_NAME"]) {
			return 1;
		}
		return 0;
	})

	result = result.map(function (group) {
		group["users"] = getAgencyGroupUsers(group["GROUP_SEQ_NBR"])
		return group;
	})
	return result
}

// Private
function getAgencyGroupUsers(groupNumber) {
	conf.className = 'com.accela.orm.model.user.UserGroupModel'
	var searchObj = { 'GROUP_SEQ_NBR': groupNumber }
	var result = conf.search(searchObj, true, false, false, true, true)
	var users = result.map(function (user) {
		return user["USER_NAME"]
	})
	return users.join(',')
}

ConfigEngineAPI.updateAgencyGroups = function (jsonInput) {
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var sysData = ConfigEngineAPI.getAllAgencyGroups()

	var searchObj = { 'MODULE_NAME': '', 'DISP_TEXT': '' }
	var subModels = {}
	var resArr = []

	var keys = ['MODULE_NAME', 'DISP_TEXT']

	var createdItems = getCreatedItems(keys, sysData, jsonInput)
	for (var c in createdItems) {
		var cItem = createdItems[c]
		searchObj['MODULE_NAME'] = cItem['MODULE_NAME']
		searchObj['DISP_TEXT'] = cItem['DISP_TEXT']
		conf.className = 'com.accela.orm.model.common.AgencyGroupModel'
		resArr = resArr.concat(conf.create(searchObj, cItem, subModels, false))
		var createdItem = ConfigEngineAPI.searchAgencyGroup(cItem['MODULE_NAME'], cItem['DISP_TEXT'], true)[0]
		var users = cItem['USERS'].split(',')
		updateAgencyGroupUsers(createdItem, users)
	}

	var updatedItems = getUpdatedItems(keys, sysData, jsonInput)
	for (var u in updatedItems) {
		var uItem = updatedItems[u]
		var exItem = ConfigEngineAPI.searchAgencyGroup(uItem['MODULE_NAME'], uItem['DISP_TEXT'], true)[0]
		for (var p in exItem) {
			if (uItem.hasOwnProperty(p)) {
				exItem[p] = uItem[p]
			}
		}
		searchObj['MODULE_NAME'] = uItem['MODULE_NAME']
		searchObj['DISP_TEXT'] = uItem['DISP_TEXT']
		conf.className = 'com.accela.orm.model.common.AgencyGroupModel'
		resArr = resArr.concat(conf.update(searchObj, exItem, subModels, true))
		var users = uItem['USERS'].split(',')
		updateAgencyGroupUsers(exItem, users)
	}

	return { 'success': true, 'exists': false };
}

// Private
function updateAgencyGroupUsers(groupModel, users) {
	var usersGroupsModels = []
	for (var i in users) {
		var model = {
			'USER_NAME': users[i],
			'MODULE_NAME': groupModel['MODULE_NAME'],
			'DISP_TEXT': groupModel['DISP_TEXT']
		}
		usersGroupsModels.push(model)
	}
	ConfigEngineAPI.updateUsersGroupsMapping(usersGroupsModels, { 'GROUP_SEQ_NBR': groupModel['GROUP_SEQ_NBR'] })
}

function updateUserGroups(userName, groups) {
	var usersGroupsModels = []
	for (var i in groups) {
		var model = {
			'USER_NAME': userName,
			'MODULE_NAME': (groups[i].split('::'))[0],
			'DISP_TEXT': (groups[i].split('::'))[1]
		}
		usersGroupsModels.push(model)
	}
	return ConfigEngineAPI.getUpdateUsersGroupsMappingList(usersGroupsModels, { 'USER_NAME': userName });
}

ConfigEngineAPI.updateUsersGroupsMapping = function (jsonInput, searchObj) {
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}

	var sysData = ConfigEngineAPI.getUsersGroupsMapping(false, searchObj)

	searchObj = { 'GROUP_SEQ_NBR': '', 'USER_NAME': '' }
	var subModels = {}

	var keys = ['USER_NAME', 'MODULE_NAME', 'DISP_TEXT']
	var deletedItems = getDeletedItems(keys, sysData, jsonInput);

	if (deletedItems.length > 0) {
		for (var d in deletedItems) {
			var dItem = deletedItems[d]
			searchObj['GROUP_SEQ_NBR'] = dItem['GROUP_SEQ_NBR']
			searchObj['USER_NAME'] = dItem['USER_NAME']
			conf.className = 'com.accela.orm.model.user.UserGroupModel'
			conf.Delete(searchObj, subModels)
		}
	}

	var createdItems = getCreatedItems(keys, sysData, jsonInput)
	for (var c in createdItems) {
		var cItem = createdItems[c];
		
		var group = ConfigEngineAPI.searchAgencyGroup(cItem['MODULE_NAME'], cItem['DISP_TEXT'], true)[0];

		cItem['GROUP_SEQ_NBR'] = group['GROUP_SEQ_NBR']
		searchObj['GROUP_SEQ_NBR'] = cItem['GROUP_SEQ_NBR']
		searchObj['USER_NAME'] = cItem['USER_NAME']
		conf.className = 'com.accela.orm.model.user.UserGroupModel'
		conf.create(searchObj, cItem, subModels, false)
	}
	return { 'success': true, 'exists': false };
}

ConfigEngineAPI.getUpdateUsersGroupsMappingList = function (jsonInput, searchObj) {
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}

	var sysData = ConfigEngineAPI.getUsersGroupsMapping(false, searchObj)

	searchObj = { 'GROUP_SEQ_NBR': '', 'USER_NAME': '' }
	var subModels = {}

	var keys = ['USER_NAME', 'MODULE_NAME', 'DISP_TEXT']
	var deletedItems = getDeletedItems(keys, sysData, jsonInput);

	if (deletedItems.length > 0) {
		conf.Delete(deletedItems, subModels);
	}

	var createdItems = getCreatedItems(keys, sysData, jsonInput)
	for (var c in createdItems) {
		var cItem = createdItems[c];
		
		var group = ConfigEngineAPI.searchAgencyGroup(cItem['MODULE_NAME'], cItem['DISP_TEXT'], true)[0];

		cItem['GROUP_SEQ_NBR'] = group['GROUP_SEQ_NBR'];
		searchObj['GROUP_SEQ_NBR'] = cItem['GROUP_SEQ_NBR'];
		searchObj['USER_NAME'] = cItem['USER_NAME'];
		conf.className = 'com.accela.orm.model.user.UserGroupModel';
		
		createdItems[c] = cItem;
	}
	return createdItems;
}

var departmentList = null;
ConfigEngineAPI.searchDepartmentByDepName = function (code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchDepartment............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	if(departmentList == null){
		logDebug("departmentList IS null");
		conf.className = "com.accela.orm.model.user.DepartMentTypeModel";
		
	//	var searchObj = {"R3_DEPTNAME": String(code)};
		var searchObj = {"SERV_PROV_CODE": ""};
		
		conf.subModels = {
				"bureauModel": {},
				"divisionModel": {},
				"dpttyI18NModels": {},
				"groupModel": {},
				"officeModel": {},
				"organizationAgencyModel": {
					"agencyI18NModels": {},
					"auditModel": {}
				},
				"sectionModel": {},
				"auditModel": {}
		};
		
		var result = conf.search(searchObj, true, ignoreSubModels, true, true);
		departmentList = {};
		for(var r in result){
			departmentList[result[r]["R3_DEPTNAME"]] = result[r]; 
		}
	}else{
		logDebug("departmentList IS NOT null");
	}
	
	return departmentList[String(code)];
}

/* ------------------------------------------------------------------------------------------------------/
    | Global Lists
/------------------------------------------------------------------------------------------------------ */
ConfigEngineAPI.getUsersList = function () {
	conf.className = 'com.accela.orm.model.common.UserModel'
	var users = conf.search({}, true, false, false, false, true)
	users = stringifyJSType(users)
	var users = users.map(function (user) {
		return user["USER_NAME"]
	})

	return users
}

ConfigEngineAPI.getUserGroupsList = function () {
	conf.className = 'com.accela.orm.model.common.AgencyGroupModel'
	var groups = conf.search({}, true, false, false, true, true)
	groups.sort(function (a, b) {
		if (a["MODULE_NAME"] < b["MODULE_NAME"]) {
			return -1;
		}
		if (a["MODULE_NAME"] > b["MODULE_NAME"]) {
			return 1;
		}
		return 0;
	})

	groups = groups.map(function (group) {
		return group["MODULE_NAME"] + "::" + group["DISP_TEXT"]
	})

	return groups
}

function searchPolicyModel(policyName, seq) {
	conf.className = 'com.accela.orm.model.timeaccounting.TimeGroupSecurityModel'

	var searchObj = {
		'POLICY_NAME': String(policyName),
		'LEVEL_DATA': String(seq)
	}

	conf.subModels = {}

	return conf.search(searchObj, true, false, false, true)
}

function fillPolicyModel(policyModels, policyName, type) {
	for (var p in policyModels) {
		var pModel = policyModels[p]
		pModel['POLICY_NAME'] = policyName
		pModel['LEVEL_TYPE'] = type
	}
}

ConfigEngineAPI.searchCalendars = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.calendar.CalendarModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	conf.subModels = {
			"calendarEventModels": {},
			"calendarI18NModels": {
				"ISLANG": true
			}
//			,"calendarSecurityModels": {}
		};
	
	var calendars = conf.search(searchObj, true, ignoreSubModels, false, true);
	
	calendars = calendars.filter(function (calendar) {
		var cal = calendar["CALENDAR_NAME"].toUpperCase();
		return cal.indexOf("HASH", 0) !== -1;
	});
	
	return calendars;
	
//	return conf.search(searchObj, true, ignoreSubModels, false, true);
}

ConfigEngineAPI.updateCalendars = function(jsonInput, serviceProvidorCode, overrideExisting){
	logDebug('updateCalendars...........................................');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	logDebug('jsonInput: \n' + JSON.stringify(stringifyJSType(jsonInput)));
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	conf.className = "com.accela.orm.model.calendar.CalendarModel";
	
	var subModels = {
			"calendarEventModels": {},
			"calendarI18NModels": {
				"ISLANG": true
			}
//			,"calendarSecurityModels": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	for(j in jsonInput){
		jsonInput[j]["CUT_OFF_TIME"] = (""+jsonInput[j]["CUT_OFF_TIME"]).substring(0, 15);
	}
	
	var resArr = [];
	
	var searchObj = {"SERV_PROV_CODE": String(serviceProvidorCode)};
	
	var sysData = ConfigEngineAPI.searchCalendars(serviceProvidorCode, false);
	
	var createdItems = getCreatedItems(['CALENDAR_NAME'], sysData, jsonInput);
	
	logDebug("createdItems:: " + JSON.stringify(stringifyJSType(createdItems)));
	logDebug("createdItems Length:: " + createdItems.length);
	
	if(createdItems != null && createdItems.length > 0){
		logDebug('On Creating Items.................................');
		for(var c in createdItems){
			searchObj = {"CALENDAR_NAME": createdItems[c]["CALENDAR_NAME"]};
			resArr = resArr.concat(conf.create(searchObj, createdItems[c], subModels, false));
		}
	}
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false }
	
	return result;
	
//	return conf.create(searchObj, jsonInput, subModels, overrideExisting);
}

ConfigEngineAPI.searchCondition = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchCondition............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.condition.ConditionTypeModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "BIZDOMAIN": "CONDITION TYPE"};
	
	conf.subModels = {
			"conditionGroupModel": {},
			"conditionTypeModel": {},
			"conditionsOfApprovals": {},
			"standardChoiceValueI18NModels": {},
			"templateAttributeDefinition": {},
			"templateGroupRelation": {},
			"templateTableDefinition": {}
		};
	
	return conf.search(searchObj, true, ignoreSubModels, false, true);
}

ConfigEngineAPI.createCondition = function(jsonInput, serviceProvidorCode, overrideExisting){
	logDebug('ConfigEngineAPI.createCondition............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	logDebug("SERV_PROV_CODE::: " + jsonInput[0]["SERV_PROV_CODE"]);
	var sysData = ConfigEngineAPI.searchCondition(serviceProvidorCode);
	
	conf.className = "com.accela.orm.model.condition.ConditionTypeModel";
	
	var subModels = {
			"conditionGroupModel": {},
			"conditionTypeModel": {},
			"conditionsOfApprovals": {},
			"standardChoiceValueI18NModels": {},
			"templateAttributeDefinition": {},
			"templateGroupRelation": {},
			"templateTableDefinition": {}
		};
	
	var resArr = [];
	
	var searchObj = {"SERV_PROV_CODE": serviceProvidorCode, "BIZDOMAIN": "CONDITION TYPE"};
	
//	var deletedItems = getDeletedItems(['BIZDOMAIN_VALUE'], sysData, jsonInput);
	var createdItems = getCreatedItems(['BIZDOMAIN_VALUE'], sysData, jsonInput);
	var updatedItems = getUpdatedItems(['BIZDOMAIN', 'BIZDOMAIN_VALUE', 'VALUE_DESC'], sysData, jsonInput, {});
	
//	logDebug("deletedItems:: " + JSON.stringify(stringifyJSType(deletedItems)));
//	logDebug("deletedItems.length:: " + deletedItems.length);
	logDebug("createdItems:: " + JSON.stringify(stringifyJSType(createdItems)));
	logDebug("createdItems.length:: " + createdItems.length);
	logDebug("updatedItems:: " + JSON.stringify(stringifyJSType(updatedItems)));
	logDebug("updatedItems.length:: " + updatedItems.length);
	
	if(createdItems != null && createdItems.length > 0){
		logDebug('On Creating Items.................................');
		
		var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
		
		for(var c in createdItems){
			var newSeq = sequenceGeneratorEJB.getNextValue("RBIZDOMAIN_VALUE_SEQ");
			logDebug('newSeq ::: ' + newSeq);
			createdItems[c]["BDV_SEQ_NBR"] = newSeq;

			searchObj = {"SERV_PROV_CODE": serviceProvidorCode, "BIZDOMAIN_VALUE": String(createdItems[c]["BIZDOMAIN_VALUE"]), "BIZDOMAIN": "CONDITION TYPE"};
			resArr = resArr.concat(conf.create(searchObj, createdItems[c], subModels, false));
		}
	}
	
	if(updatedItems != null && updatedItems.length > 0){
		logDebug('On Updating Items.................................');
		for(var c in updatedItems){
			searchObj = {"SERV_PROV_CODE": serviceProvidorCode, "BIZDOMAIN_VALUE": String(updatedItems[c]["BIZDOMAIN_VALUE"]), "BIZDOMAIN": "CONDITION TYPE"};
			resArr = resArr.concat(conf.update(searchObj, updatedItems[c], subModels, true));
		}
	}
	
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false }
	
	return result;
}

ConfigEngineAPI.searchStandardCondition = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchStandardCondition............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.condition.RefStdConditionModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	conf.subModels = {
			"conditionDetail": {},
			"conditionGroupItem": {},
			"conditionI18NModels": {},
			"conditionTypeItem": {},
			"conditionTypeModel": {}//This is the connection with the ConditionModel 
		};
	
	return conf.search(searchObj, true, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchStandardConditionByModelId = function(code, ignoreSubModels, RES_ID){
	logDebug('ConfigEngineAPI.searchStandardConditionByModelId............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.condition.RefStdConditionModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	conf.subModels = {
			"conditionDetail": {},
			"conditionGroupItem": {},
			"conditionI18NModels": {},
			"conditionTypeItem": {},
			"conditionTypeModel": {}//This is the connection with the ConditionModel 
		};
	
	var result = conf.search(searchObj, true, ignoreSubModels, false, true);
	
	return result.filter(function (item) { 
		return item['conditionTypeModel']['RES_ID'] == String(RES_ID);
		});
	
}

ConfigEngineAPI.createStandardCondition = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createStandardCondition............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	conf.className = "com.accela.orm.model.condition.RefStdConditionModel";
	
	var subModels = {
			"conditionDetail": {},
			"conditionGroupItem": {},
			"conditionI18NModels": {},
			"conditionTypeItem": {},
			"conditionTypeModel": {}//This is the connection with the ConditionModel 
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("StandardConditions", String(code), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchConditionStatus = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchConditionStatus............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.condition.ConditionTypeModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "BIZDOMAIN": "CONDITION STATUS"};
	
	conf.subModels = {
			"conditionGroupModel": {},
			"conditionTypeModel": {},
			"conditionsOfApprovals": {},
			"standardChoiceValueI18NModels": {},
			"templateAttributeDefinition": {},
			"templateGroupRelation": {},
			"templateTableDefinition": {}
		};
	
	return conf.search(searchObj, true, ignoreSubModels, false, true);
}

ConfigEngineAPI.createConditionStatus = function(jsonInput, code, overrideExisting){
	logDebug('ConfigEngineAPI.createConditionStatus............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	conf.className = "com.accela.orm.model.condition.ConditionTypeModel";
	
	var subModels = {
			"conditionGroupModel": {},
			"conditionTypeModel": {},
			"conditionsOfApprovals": {},
			"standardChoiceValueI18NModels": {},
			"templateAttributeDefinition": {},
			"templateGroupRelation": {},
			"templateTableDefinition": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	
	
	logDebug('jsonInput.length: ' + jsonInput.length);
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	for(j in jsonInput){
		var newSeq = sequenceGeneratorEJB.getNextValue("RBIZDOMAIN_VALUE_SEQ");
		logDebug('BIZDOMAIN_VALUE ::: ' + jsonInput[j]['BIZDOMAIN_VALUE']);
		logDebug('Generated Sequence: ' + newSeq);
		jsonInput[j]['BDV_SEQ_NBR'] = newSeq;
	}
	
	var searchObj = {"SERV_PROV_CODE": String(code), "BIZDOMAIN": "CONDITION STATUS"};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchStandaredCondition = function(code, conditionType, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchStandaredCondition............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.condition.RefStdConditionModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_CON_TYPE": String(conditionType)};
	
	conf.subModels = {
			"conditionDetail": {
				"conditionDetailI18NModels": {}
			},
//			"conditionGroupItem": {},
//			"conditionI18NModels": {},
//			"conditionTypeItem": {}
//			,"conditionTypeModel": {}
		};
	
	return conf.search(searchObj, true, ignoreSubModels, false, true);
}

ConfigEngineAPI.createStandaredCondition = function(jsonInput, code, conditionType, overrideExisting){
	logDebug('ConfigEngineAPI.createStandaredCondition............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	conf.className = "com.accela.orm.model.condition.RefStdConditionModel";
	
	var subModels = {
			"conditionDetail": {
				"conditionDetailI18NModels": {}
			},
//			"conditionGroupItem": {},
//			"conditionI18NModels": {},
//			"conditionTypeItem": {}
//			,"conditionTypeModel": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var currentData = ConfigEngineAPI.searchStandaredCondition(code, conditionType, false);
	var currentR3_CON_NBR = [];
	logDebug('currentData.length: ' + currentData.length);
	for(var c in currentData){
		currentR3_CON_NBR.push(currentData[c]["R3_CON_NBR"]);
	}
	
	logDebug('currentR3_CON_NBR: ' + currentR3_CON_NBR);
	
	var deleteSql = "delete from B6CONDIT_DETAIL WHERE B1_CON_NBR in (select B1_CON_NBR from B6CONDIT WHERE R3_CON_NBR in (" + currentR3_CON_NBR + "))";
	logDebug('deleteSql: ' + deleteSql);
	conf.deleteBySQL(deleteSql, null);
	
	deleteSql = "delete from XCONDIT_STATYP WHERE B1_CON_NBR in (select B1_CON_NBR from B6CONDIT WHERE R3_CON_NBR in (" + currentR3_CON_NBR + "))";
	logDebug('deleteSql: ' + deleteSql);
	conf.deleteBySQL(deleteSql, null);
	
	deleteSql = "delete from B6CONDIT WHERE R3_CON_NBR in (" + currentR3_CON_NBR + ")";
	logDebug('deleteSql: ' + deleteSql);
	conf.deleteBySQL(deleteSql, null);
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	logDebug('jsonInput.length: ' + jsonInput.length);
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_CON_TYPE": String(conditionType)};
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	
	for(var j in jsonInput){
		var newSeq = sequenceGeneratorEJB.getNextValue("R3CLEART_SEQ");
		logDebug('newSeq:: ' + newSeq);	
		newSeq++;
		logDebug('newSeq++:: ' + newSeq);
		jsonInput[j]["conditionDetail"]["R3_CON_NBR"] = newSeq;
	}
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("Standard Condition", String(conditionType), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchStandaredCommentsGroup = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchStandaredCommentsGroup............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.stdcomment.StandardCommentGroupModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};//, "G6_GROUP_NAME": String(groupName)};
	
	conf.subModels = {
		};
	
	return conf.search(searchObj, true, ignoreSubModels, false, true);
}

var StandaredCommentsGroup = null;
ConfigEngineAPI.searchStandaredCommentsGroup_commentTypeModels = function(code, groupName, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchStandaredCommentsGroup_commentTypeModels............');
	
	if(StandaredCommentsGroup == null){
		var tmp_StandaredCommentsGroup = ConfigEngineAPI.searchStandaredCommentsGroup(code, ignoreSubModels);
		StandaredCommentsGroup = [];
		for(var scg in tmp_StandaredCommentsGroup){
			StandaredCommentsGroup[tmp_StandaredCommentsGroup[scg]["G6_GROUP_NAME"]] = tmp_StandaredCommentsGroup[scg];
		}
	}
	
	var commentTypeModels = [];
	try{
		commentTypeModels = StandaredCommentsGroup[groupName]["commentTypeModels"];
	}catch(e){
		commentTypeModels = [];
	}
	return commentTypeModels;
}

ConfigEngineAPI.searchStandaredCommentsRelation = function(code, commentType){
	logDebug('ConfigEngineAPI.searchStandaredCommentsRelation............');
	
	conf.className = "com.accela.orm.model.stdcomment.XCommentGroupEntityModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "ENTITY_DATA": commentType, "ENTITY_TYPE": "COMMENT"};
	
	conf.subModels = {
		};
	
	return conf.search(searchObj, true, true, false, true);
}

ConfigEngineAPI.searchStandaredComments = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchStandaredComments............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.stdcomment.StandardCommentModel";
	
	conf.subModels = {
	};
	var searchObj = {"SERV_PROV_CODE": String(code)};
	var standardCommentModels = conf.search(searchObj, true, ignoreSubModels, false, true);
	
	for(var s in standardCommentModels){
		var relationResult = ConfigEngineAPI.searchStandaredCommentsRelation(code, standardCommentModels[s]['G6_COM_TYP']);
		
		if(relationResult && relationResult.length > 0){
			standardCommentModels[s]['ENTITY_DATA'] = relationResult[0]['ENTITY_DATA'];
			standardCommentModels[s]['ENTITY_TYPE'] = relationResult[0]['ENTITY_TYPE'];
			standardCommentModels[s]['G6_GROUP_NAME'] = relationResult[0]['G6_GROUP_NAME'];
			
		}else{
			standardCommentModels[s]['ENTITY_DATA'] = null;
			standardCommentModels[s]['ENTITY_TYPE'] = null;
			standardCommentModels[s]['G6_GROUP_NAME'] = null;
		}
	}
	
	
	return standardCommentModels;
}

ConfigEngineAPI.createStandaredComments = function(jsonInput, code, overrideExisting){
	logDebug('ConfigEngineAPI.createStandaredComments............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
//	if(!overrideExisting){
//		logDebug('Returning: {"success": false, "exists": true}');
//		return {
//			"success": false,
//			"exists": true
//		};
//	}
	
//	timeDebug("getting sysData");
	var sysData = ConfigEngineAPI.searchStandaredComments(code);
//	timeDebug("After getting sysData");
	
	var updatedItems = getUpdatedItemsByFields(['G6_DOC_ID'], sysData, jsonInput, ['G6_NAME', 'G6_COMMENT', { 'standardCommentI18NModels': 'G6_COMMENT' }]);
	logDebug('Number of updated Items: ' + updatedItems.length);
//	timeDebug('Number of updated Items: ' + updatedItems.length);
	
	var createdItems = getCreatedItems(['G6_DOC_ID'], sysData, jsonInput);
	logDebug('Number of created Items: ' + createdItems.length);
//	timeDebug('Number of created Items: ' + createdItems.length);//100
	
	var resArr = [];
	
	conf.className = "com.accela.orm.model.stdcomment.StandardCommentModel";
	
	var subModels = {"standardCommentI18NModels": {}};
	
//	timeDebug("calling update");
	if(updatedItems != null && updatedItems.length > 0){
		for(var u in updatedItems){
			searchObj = {"SERV_PROV_CODE": String(code), 'G6_DOC_ID': updatedItems[u]['G6_DOC_ID'] };
			resArr = resArr.concat(conf.update(searchObj, updatedItems[u], subModels, true));
		}
	}
//	timeDebug("after calling update");
	
//	timeDebug("calling create");
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	if(createdItems != null && createdItems.length > 0){
		
//		timeDebug("setting sequences");
		for(var c in createdItems){
			
			newSeq = sequenceGeneratorEJB.getNextValue("STCOMMNT_RES_SEQ");
			logDebug('newSeq:::: ' + newSeq);
			createdItems[c]["RES_ID"] = newSeq;
			for(var cc in createdItems[c]["standardCommentI18NModels"]){
				createdItems[c]["standardCommentI18NModels"][cc]["RES_ID"] = newSeq; 
			}
			
//			searchObj = { "SERV_PROV_CODE": String(code), 'G6_DOC_ID': createdItems[c]['G6_DOC_ID'] };
//			var createdItemResult = conf.create(searchObj, createdItems[c], subModels, overrideExisting, false, false);
//			logDebug('createdItemResult:: ' + createdItemResult);
		}//2657ms
//		timeDebug("Finish setting sequences");
		
		var createdItemResult = conf.create("BATCH", createdItems, subModels, overrideExisting);
		logDebug('createdItemResult:: ' + createdItemResult);
	}
//	timeDebug("After calling create");//25188

	var standaredCommentsGroups = {};
	
	for(var s in jsonInput){
		var G6_GROUP_NAME = jsonInput[s]["G6_GROUP_NAME"];
		
		var stdCommentsGroup = standaredCommentsGroups[G6_GROUP_NAME];
		if(stdCommentsGroup == null || stdCommentsGroup == undefined){
			stdCommentsGroup = {};
			
			stdCommentsGroup["G6_GROUP_NAME"] = jsonInput[s]["G6_GROUP_NAME"];
			stdCommentsGroup["SERV_PROV_CODE"] = jsonInput[s]["SERV_PROV_CODE"];
			stdCommentsGroup["checklistModels"] = null;
			stdCommentsGroup["inspectionModels"] = null;
			stdCommentsGroup["recordModels"] = null;
			stdCommentsGroup["resultSummary"] = null;
			stdCommentsGroup["standardCommentGroupI18NModels"] = null;
			stdCommentsGroup["workflowModels"] = null;
			stdCommentsGroup["RES_ID"] = null
		}
		
		var commentTypeModels = stdCommentsGroup["commentTypeModels"];
		if(commentTypeModels == null || commentTypeModels == undefined){
//			commentTypeModels = [];
			
			commentTypeModels = ConfigEngineAPI.searchStandaredCommentsGroup_commentTypeModels(String(code), G6_GROUP_NAME, true)
		}
		
		var found = false;
		for(var c in commentTypeModels){
			if(commentTypeModels[c]["ENTITY_DATA"] == jsonInput[s]["ENTITY_DATA"]
				&& commentTypeModels[c]["ENTITY_TYPE"] == jsonInput[s]["ENTITY_TYPE"]
				&& commentTypeModels[c]["G6_GROUP_NAME"] == jsonInput[s]["G6_GROUP_NAME"]
				&& commentTypeModels[c]["SERV_PROV_CODE"] == jsonInput[s]["SERV_PROV_CODE"]
			){
				found = true;
				break;
			}
		}
		
		if(found == false){
			var commentTypeModel = {};
			commentTypeModel["ENTITY_DATA"] = jsonInput[s]["ENTITY_DATA"];
			commentTypeModel["ENTITY_TYPE"] = jsonInput[s]["ENTITY_TYPE"];
			commentTypeModel["G6_GROUP_NAME"] = jsonInput[s]["G6_GROUP_NAME"];
			commentTypeModel["SERV_PROV_CODE"] = jsonInput[s]["SERV_PROV_CODE"];
			commentTypeModel["ENTITY_SEQ_NBR"] = null;
			
			commentTypeModels.push(commentTypeModel);
		}
		
		
		stdCommentsGroup["commentTypeModels"] = commentTypeModels;
		
		standaredCommentsGroups[G6_GROUP_NAME] = stdCommentsGroup;
	}
	
	standaredCommentsGroups = jsonObjToJsonArr(standaredCommentsGroups);
//	printJson("standaredCommentsGroups", standaredCommentsGroups);
	
	
	conf.className = "com.accela.orm.model.stdcomment.StandardCommentGroupModel";
	
	subModels = {
			"commentTypeModels": {},
			"inspectionModels": {},
			"checklistModels": {},
			"recordModels": {},
			"workflowModels": {}
		};
	
	try{
		resArr = resArr.concat(conf.create(searchObj, standaredCommentsGroups, subModels, overrideExisting, true));
	}catch(e){
		for(var scg in standaredCommentsGroups){
			searchObj = {"SERV_PROV_CODE": String(code), "G6_GROUP_NAME": standaredCommentsGroups[scg]["G6_GROUP_NAME"]};
			try{
				resArr = resArr.concat(conf.create(searchObj, standaredCommentsGroups[scg], subModels, overrideExisting));
			}catch(e){}
		}
	}
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };
	
	return result;
}

ConfigEngineAPI.searchActivityType = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchActivityType............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.workflow.ActivityTypeModel";
	
	conf.subModels = {
	};
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	return conf.search(searchObj, true, ignoreSubModels, false, true);
}

ConfigEngineAPI.createActivityType = function(jsonInput, code, overrideExisting){
	logDebug('ConfigEngineAPI.createActivityType............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	conf.className = "com.accela.orm.model.workflow.ActivityTypeModel";
	
	var subModels = {
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	logDebug('jsonInput.length: ' + jsonInput.length);
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchActivitySpecificInfo = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchASI............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.RefAppSpecInfoFieldModel";
	
	var searchObj = {"R1_CHECKBOX_CODE": String(code), "R1_CHECKBOX_GROUP": "ACTIVITY"};
	
	conf.subModels = {
			"templateLayoutConfigModel": {
				"templateLayoutConfigI18NModels": {
					"ISLANG": true
				}
			},
			"refAppSpecInfoFieldI18NModels": {
				"ISLANG": true
			},
			"sharedDropDownModel": {}
		};
	
	return conf.search(searchObj, true, ignoreSubModels, false, true);
}

ConfigEngineAPI.createActivitySpecificInfo = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createActivitySpecificInfo............');
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	conf.className = "com.accela.orm.model.asi.RefAppSpecInfoFieldModel";
	
	var subModels = {
			"templateLayoutConfigModel": {
				"templateLayoutConfigI18NModels": {
					"ISLANG": true
				}
			},
			"refAppSpecInfoFieldI18NModels": {
				"ISLANG": true
			},
			"sharedDropDownModel": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	var searchObj = {"R1_CHECKBOX_CODE": String(jsonInput[0]["R1_CHECKBOX_CODE"]), "R1_CHECKBOX_GROUP": "ACTIVITY"};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	logDebug('Going to archive in GITHUB');
	archive_GITHUB("Activity Specific Info", String(jsonInputOrg[0]["R1_CHECKBOX_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchSharedDropDowns = function(code, keys, ignoreSubModels, type){
	logDebug('ConfigEngineAPI.searchSharedDropDowns............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	var typeMap = {"System Switch": "SystemSwitch",
		"Shared drop-down": "ShareDropDown",
		"EMSE": "EMSE",
		"Doc Virtual Folder": "DocVirtualFolder",
		"Doc Review Status": "DocReviewStatus",
		"Doc Status": "DocStatus"};
	
	logDebug('code: ' + code);
	logDebug('type: ' + type);
	
	conf.className = "com.accela.orm.model.asi.SharedDropDownListModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	if(type != null && type != undefined && type != ''){
		type = typeMap[type];
		logDebug('type: ' + type);
		searchObj = {"SERV_PROV_CODE": String(code), "STD_CHOICE_TYPE": String(type)};
	}
	
	conf.subModels = {
			"sharedDropDownValueModels": {
				"standardChoiceValueI18NModels": []
			}
		};
	
	var result = conf.search(searchObj, true, ignoreSubModels, false, true);
	logDebug('result.length: ' + result.length);
	logDebug('keys: ' + keys);
	logDebug('keys.length: ' + keys.length);
	if(keys && keys.length > 0){
		logDebug('keys[0]: ' + keys[0]);
		result = result.filter(function (item) { 
				var itemStr = String(item['BIZDOMAIN']).toUpperCase();
				for(var k in keys){
					if(keys[k].toUpperCase().equals(itemStr)){
						return true;
					}
				}
				
				return false; 
			});
	}
	logDebug('result.length: ' + result.length);
	
	return result;
}

ConfigEngineAPI.createSharedDropDown = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createSharedDropDown............');
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	conf.className = "com.accela.orm.model.asi.SharedDropDownListModel";
	
	var subModels = {
			"sharedDropDownValueModels": {
				"standardChoiceValueI18NModels": []
			}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {"BIZDOMAIN": String(jsonInput[0]["BIZDOMAIN"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	return result;

}

ConfigEngineAPI.searchRenewalInfo = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchASI............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.expiration.RefExpirationModel";
	
	var searchObj = {};
	
	conf.subModels = {};
	
	return conf.search(searchObj, true, ignoreSubModels, true, true);
}

ConfigEngineAPI.createRenewalInfo = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createRenewalInfo............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	conf.className = "com.accela.orm.model.expiration.RefExpirationModel";
	
	var subModels = {};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var resArr = [];
	var skipDelete = true;
	
	for(var j in jsonInput){
		var searchObj = {"EXPIRATION_CODE": jsonInput[j]["EXPIRATION_CODE"]};
		var active = "A";
		try{
			active = jsonInput[j]["REC_STATUS"];
			delete jsonInput[j]["REC_STATUS"];
		}catch(e){
			logDebug("Error get/delete REC_STATUS: " + e);
			active = "A";
		}
		
		logDebug('jsonInput[j]["EXPIRATION_DATE"]: ' + jsonInput[j]["EXPIRATION_DATE"]);
		logDebug('getMonthVal(jsonInput[j]["EXPIRATION_DATE"]): ' + getMonthVal(jsonInput[j]["EXPIRATION_DATE"]));
		var date = new Date();
		date.setMonth(getMonthVal(jsonInput[j]["EXPIRATION_DATE"]));
		
		var dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + "-" + date.getDay() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		
		jsonInput[j]["EXPIRATION_DATE"] = dateStr;
		
		resArr = resArr.concat(conf.create(searchObj, jsonInput[j], subModels, overrideExisting, skipDelete, active));
	}
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };

	return result;

}

ConfigEngineAPI.searchFeeItemsList = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.finance.RefFeeItemModel";
	
	var searchObj = {"SERV_PROV_CODE": code};
	
	conf.subModels = {
		};
	
	var fiList =  conf.search(searchObj, true, ignoreSubModels, false, true);
	

	fiList = fiList.map(function (lp) {
		return lp["R1_GF_COD"];
	});

	return fiList;
}

ConfigEngineAPI.searchOrganizations = function (code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchOrganizations............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.OrganizationAgencyModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	conf.subModels = {
			"agencyI18NModels": {},
			"auditModel": {}
	};
	
	var result = conf.search(searchObj, true, ignoreSubModels, true, true);
	
	var res = [];
	
	for(var r in result){
		var item = {};
		item["R3_AGENCY_CODE"] = result[r]["R3_AGENCY_CODE"];
		item["R3_AGENCY_NAME"] = result[r]["R3_AGENCY_NAME"];
		item["RES_ID"] = result[r]["RES_ID"];
		item["SERV_PROV_CODE"] = result[r]["SERV_PROV_CODE"];
		item["agencyI18NModels"] = result[r]["agencyI18NModels"];
		item["REC_STATUS"] = result[r]["auditModel"]["REC_STATUS"];
		
		res.push(item);
	}
	
	return res;
}

ConfigEngineAPI.searchOrganizationsList = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchOrganizationsList............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.OrganizationAgencyModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	conf.subModels = {
		};
	
	var lpList =  conf.search(searchObj, true, ignoreSubModels, false, true, true);
	
	lpList = lpList.map(function (lp) {
		return lp["R3_AGENCY_CODE"];
	});


	return distinctList(lpList);
}

ConfigEngineAPI.searchOrganization = function (code, agency_code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchOrganizations............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.OrganizationAgencyModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_AGENCY_CODE": String(agency_code)};
	
	conf.subModels = {
			"agencyI18NModels": {},
			"auditModel": {}
	};
	
	return conf.search(searchObj, true, ignoreSubModels, true, true);
}

ConfigEngineAPI.createAgencyI18NModels = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createAgencyI18NModels............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.user.OrganizationAgencyI18NModel";
	
	var searchObj = {"SERV_PROV_CODE": jsonInput[0]["SERV_PROV_CODE"], "LANG_ID": jsonInput[0]["LANG_ID"], "RES_ID": jsonInput[0]["RES_ID"]};
	
	conf.subModels = {};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting, false);
	
	archive_GITHUB("AgencyI18NModels", String(jsonInputOrg[0]["SERV_PROV_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.createOrganizations = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createOrganizations............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	var subModels = {
			"agencyI18NModels": {}
	};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	var resArr = [];
	var skipDelete = true;
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	
	for(var j in jsonInput){
		var newSeq = null;
		
		var organization = ConfigEngineAPI.searchOrganization(jsonInput[j]["SERV_PROV_CODE"], jsonInput[j]["R3_AGENCY_CODE"], false);
		logDebug("Updated Organization: " + JSON.stringify(stringifyJSType(organization)));
		if(organization != null && organization.length > 0){
			organization = organization[0];
			
		}else{
			organization = null;
		}
		
		conf.className = "com.accela.orm.model.user.OrganizationAgencyModel";
		
		subModels = {
				"agencyI18NModels": {}
		};
		
		var searchObj = {"R3_AGENCY_CODE": jsonInput[j]["R3_AGENCY_CODE"]};
		var active = "A";
		try{
			active = jsonInput[j]["REC_STATUS"];
			delete jsonInput[j]["REC_STATUS"];
		}catch(e){
			logDebug("Error get/delete REC_STATUS: " + e);
			active = "A";
		}
		
		if(jsonInput[j]["RES_ID"] == null && organization != null){
			jsonInput[j]["RES_ID"] = organization["RES_ID"];
		}else{
			jsonInput[j]["RES_ID"] = null;
		}
		
		if(jsonInput[j]["RES_ID"] == null){
			
			newSeq = sequenceGeneratorEJB.getNextValue("R3AGENCY_RES_SEQ");
			logDebug('newSeq:::: ' + newSeq);
			jsonInput[j]["RES_ID"] = newSeq;
		}else{
			newSeq = jsonInput[j]["RES_ID"];
		}
		
		resArr = resArr.concat(conf.create(searchObj, jsonInput[j], subModels, overrideExisting, skipDelete, active));
		
		var agencyI18NModels = jsonInput[j]["agencyI18NModels"];
		
		if(agencyI18NModels != null && agencyI18NModels.length > 0){
			logDebug("agencyI18NModels.length: " + agencyI18NModels.length);
			
			for(var a in agencyI18NModels){
				agencyI18NModels[a]["RES_ID"] = newSeq;
				
				ConfigEngineAPI.createAgencyI18NModels(agencyI18NModels[a], true);
			}
		}
		
	}
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };

	archive_GITHUB("Organizations", String(jsonInputOrg[0]["SERV_PROV_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

ConfigEngineAPI.searchDepartments = function (code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchDepartments............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.DepartMentTypeModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	conf.subModels = {
			"bureauModel": {},
			"divisionModel": {},
			"dpttyI18NModels": {},
			"groupModel": {},
			"officeModel": {},
			"organizationAgencyModel": {
				"agencyI18NModels": {},
				"auditModel": {}
			},
			"sectionModel": {},
			"auditModel": {}
	};
	
	var result =  conf.search(searchObj, true, ignoreSubModels, true, true);
	
	for(var r in result){
		
		result[r]["REC_STATUS"] = result[r]["auditModel"]["REC_STATUS"];
		delete result[r]["auditModel"];
	}
	
	return result;
}

ConfigEngineAPI.searchDepartment = function (code, dep_key, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchDepartment............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.DepartMentTypeModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_DEPT_KEY": String(dep_key)};
	
	conf.subModels = {
			"bureauModel": {},
			"divisionModel": {},
			"dpttyI18NModels": {},
			"groupModel": {},
			"officeModel": {},
			"organizationAgencyModel": {
				"agencyI18NModels": {},
				"auditModel": {}
			},
			"sectionModel": {},
			"auditModel": {}
	};
	
	return conf.search(searchObj, true, ignoreSubModels, true, true);
}

ConfigEngineAPI.createDdpttyI18NModels = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createDdpttyI18NModels............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.user.DepartMentTypeI18N";
	
	var searchObj = {"SERV_PROV_CODE": jsonInput[0]["SERV_PROV_CODE"], "LANG_ID": jsonInput[0]["LANG_ID"], "RES_ID": jsonInput[0]["RES_ID"]};
	
	conf.subModels = {};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting, false);
	
	archive_GITHUB("DdpttyI18NModels", String(jsonInputOrg[0]["SERV_PROV_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.createDepartments = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createOrganizations............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	var subModels = {
			"agencyI18NModels": {}
	};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	conf.className = "com.accela.orm.model.user.DepartMentTypeModel";
	
	var searchObj = {"SERV_PROV_CODE": String(jsonInput[0]["SERV_PROV_CODE"])};
	
	conf.subModels = {
			"bureauModel": {},
			"divisionModel": {},
			"dpttyI18NModels": {},
			"groupModel": {},
			"officeModel": {},
			"organizationAgencyModel": {
				"agencyI18NModels": {},
				"auditModel": {}
			},
			"sectionModel": {},
			"auditModel": {}
	};
	
	var resArr = [];
	var skipDelete = true;
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	
	for(var j in jsonInput){
		var newSeq = null;
		var department = ConfigEngineAPI.searchDepartment(jsonInput[j]["SERV_PROV_CODE"], jsonInput[j]["R3_DEPT_KEY"], false);
		logDebug("Updated Department: " + JSON.stringify(stringifyJSType(department)));
		if(department != null && department.length > 0){
			department = department[0];
			
		}else{
			department = null;
		}
		
		conf.className = "com.accela.orm.model.user.OrganizationAgencyModel";
		
		subModels = {
				"agencyI18NModels": {}
		};
		
		var searchObj = {"R3_AGENCY_CODE": jsonInput[j]["R3_AGENCY_CODE"]};
		var active = "A";
		try{
			active = jsonInput[j]["REC_STATUS"];
			delete jsonInput[j]["REC_STATUS"];
		}catch(e){
			logDebug("Error get/delete REC_STATUS: " + e);
			active = "A";
		}
		
		if(department != null){
			department["R3_DEPTNAME"] = jsonInput[j]["R3_DEPTNAME"];
			department["R3_SUBGROUP_DESC"] = jsonInput[j]["R3_SUBGROUP_DESC"];
			department["dpttyI18NModels"] = jsonInput[j]["dpttyI18NModels"];
			for(var dp in department["dpttyI18NModels"]){
				department["dpttyI18NModels"][dp]["RES_ID"] = ""+department["RES_ID"];
			}
			
			jsonInput[j] = department; 
		}else{
			newSeq = sequenceGeneratorEJB.getNextValue("G3DPTTYP_RES_SEQ");
			logDebug('newSeq:::: ' + newSeq);
			jsonInput[j]["RES_ID"] = newSeq;
			
			for(var dp in jsonInput[j]["dpttyI18NModels"]){
				jsonInput[j]["dpttyI18NModels"][dp]["RES_ID"] = ""+newSeq;
			}
		}
		
		jsonInput[j]["bureauModel"] = ConfigEngineAPI.getBureau(jsonInput[j]["bureauModel"], false);
		
		jsonInput[j]["divisionModel"] = ConfigEngineAPI.getDivision(jsonInput[j]["divisionModel"], false);
		
		jsonInput[j]["sectionModel"] = ConfigEngineAPI.getSection(jsonInput[j]["sectionModel"], false);
		
		jsonInput[j]["groupModel"] = ConfigEngineAPI.getGroup(jsonInput[j]["groupModel"], false);
		
		jsonInput[j]["officeModel"] = ConfigEngineAPI.getOffice(jsonInput[j]["officeModel"], false);
		
		printJson("jsonInput[j] JSON: ", jsonInput[j]);
		logDebug("jsonInput[j] JSON:: " + JSON.stringify(stringifyJSType(jsonInput[j])));
		
		conf.className = "com.accela.orm.model.user.DepartMentTypeModel";
		
		searchObj = {
				"SERV_PROV_CODE": String(jsonInput[j]["SERV_PROV_CODE"]),
				"R3_DEPT_KEY": String(jsonInput[j]["R3_DEPT_KEY"])
		};
		
		conf.subModels = {
				"bureauModel": {},
				"divisionModel": {},
				"dpttyI18NModels": {},
				"groupModel": {},
				"officeModel": {},
				"organizationAgencyModel": {
					"agencyI18NModels": {},
					"auditModel": {}
				},
				"sectionModel": {},
				"auditModel": {}
		};
		
		resArr = resArr.concat(conf.create(searchObj, jsonInput[j], subModels, overrideExisting, skipDelete, active));
		
		var dpttyI18NModels = jsonInput[j]["dpttyI18NModels"];
		
		if(dpttyI18NModels != null && dpttyI18NModels.length > 0){
			logDebug("agencyI18NModels.length: " + dpttyI18NModels.length);
			
			for(var a in dpttyI18NModels){
				ConfigEngineAPI.createDdpttyI18NModels(dpttyI18NModels[a], true);
			}
		}
		
	}
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };

	return result;
	
}

ConfigEngineAPI.searchBureaus = function (code, agency_code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchBureaus............');
	
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.BureauModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_AGENCY_CODE": String(agency_code)};
	
	conf.subModels = {
			"bureauI18NModels": {},
			"auditModel": {}
	};
	
	var result =  conf.search(searchObj, true, ignoreSubModels, true, true);
	
	for(var r in result){
		
		result[r]["REC_STATUS"] = result[r]["auditModel"]["REC_STATUS"];
		delete result[r]["auditModel"];
	}
	
	return result;
}

ConfigEngineAPI.createBureauI18NModels = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createbureauI18NModels............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.user.BureauI18NModel";
	
	var searchObj = {"SERV_PROV_CODE": jsonInput[0]["SERV_PROV_CODE"], "LANG_ID": jsonInput[0]["LANG_ID"], "RES_ID": jsonInput[0]["RES_ID"]};
	
	conf.subModels = {};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting, false);
	
	archive_GITHUB("BureauI18NModels", String(jsonInputOrg[0]["SERV_PROV_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.createBureaus = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createBureaus............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	var subModels = {
			"bureauI18NModels": {}
	};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var resArr = [];
	var skipDelete = true;
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	
	for(var j in jsonInput){
		var newSeq = null;
		
		var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput[j]));//Clone Object
		if (!Array.isArray(jsonInputOrg)) {
			jsonInputOrg = [jsonInputOrg];
		}
		
		var bureauList = ConfigEngineAPI.searchBureau(jsonInput[j]["SERV_PROV_CODE"], jsonInput[j]["R3_BUREAU_CODE"], false);
		logDebug("Updated Bureau: " + JSON.stringify(stringifyJSType(bureauList)));
		
		var bureau = null;
		
		if(bureauList != null && bureauList.length > 0){
			if(bureauList.length == 1){
				bureau = bureauList[0];
			}else{
				for(var b in bureauList ){
					if(bureauList[b]["R3_AGENCY_CODE"] == jsonInput[j]["R3_AGENCY_CODE"]){
						bureau = bureauList[b];
					}
				}
			}
			
		}else{
			bureau = null;
		}
		
		conf.className = "com.accela.orm.model.user.BureauModel";
		
		subModels = {
				"bureauI18NModels": {}
		};
		
		var searchObj = {"R3_AGENCY_CODE": jsonInput[j]["R3_AGENCY_CODE"]};
		var active = "A";
		try{
			active = jsonInput[j]["REC_STATUS"];
			delete jsonInput[j]["REC_STATUS"];
		}catch(e){
			logDebug("Error get/delete REC_STATUS: " + e);
			active = "A";
		}
		
		if(jsonInput[j]["RES_ID"] == null && bureau != null){
			jsonInput[j]["RES_ID"] = bureau["RES_ID"];
		}else{
			jsonInput[j]["RES_ID"] = null;
		}
		
		if(jsonInput[j]["RES_ID"] == null){
			
			newSeq = sequenceGeneratorEJB.getNextValue("R3BUREAU_RES_SEQ");
			logDebug('newSeq:::: ' + newSeq);
			jsonInput[j]["RES_ID"] = newSeq;
		}else{
			newSeq = jsonInput[j]["RES_ID"];
		}
		
		var resCreate = conf.create(searchObj, jsonInput[j], subModels, overrideExisting, skipDelete, active);
		
		resArr = resArr.concat(resCreate);
		
		archive_GITHUB("Bureau", String(jsonInputOrg[0]["R3_AGENCY_CODE"]), jsonInputOrg, resCreate, overrideExisting);
		
		var bureauI18NModels = jsonInput[j]["bureauI18NModels"];
		
		if(bureauI18NModels != null && bureauI18NModels.length > 0){
			logDebug("bureauI18NModels.length: " + bureauI18NModels.length);
			
			for(var a in bureauI18NModels){
				bureauI18NModels[a]["RES_ID"] = newSeq;
				
				ConfigEngineAPI.createBureauI18NModels(bureauI18NModels[a], true);
			}
		}
		
	}
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };

	
	
	return result;

}

var BureauMap = {};

ConfigEngineAPI.getBureau = function (input, ignoreSubModels) {
	var bureau = BureauMap[input["R3_BUREAU_CODE"]];
	if(bureau != null && bureau != undefined){
		return bureau;
	}
	
	bureau = ConfigEngineAPI.searchBureau(input["SERV_PROV_CODE"], input["R3_BUREAU_CODE"], ignoreSubModels);
	if(bureau != null && bureau.length > 0){
		BureauMap[bureau[0]["R3_BUREAU_CODE"]] = bureau[0]; 
		return bureau[0]; 
	}else{
		ConfigEngineAPI.createBureau(input, true);
		bureau = ConfigEngineAPI.searchBureau(input["SERV_PROV_CODE"], input["R3_BUREAU_CODE"], ignoreSubModels);
		BureauMap[bureau[0]["R3_BUREAU_CODE"]] = bureau[0];
		return bureau[0];
	}
}

ConfigEngineAPI.searchBureauList = function(code, agency_code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchBureauList............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.BureauModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_AGENCY_CODE": String(agency_code)};
	
	conf.subModels = {
		};
	
	var lpList =  conf.search(searchObj, true, ignoreSubModels, false, true, true);
	
	lpList = lpList.map(function (lp) {
		return lp["R3_BUREAU_CODE"];
	});


	return distinctList(lpList);
}

ConfigEngineAPI.searchBureau = function (code, bureau_code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchBureau............');
	
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.BureauModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_BUREAU_CODE": String(bureau_code)};
	
	conf.subModels = {
			"bureauI18NModels": {}
	};
	
	return conf.search(searchObj, true, ignoreSubModels, true, true);
	
}

ConfigEngineAPI.createBureau = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createBureau............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	conf.className = "com.accela.orm.model.user.BureauModel";
	
	subModels = {
			"divisionI18NModels": {}
	};
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	
	var searchObj = {"R3_BUREAU_CODE": jsonInput["R3_BUREAU_CODE"]};
	
	var skipDelete = true;
	
	newSeq = sequenceGeneratorEJB.getNextValue("R3BUREAU_RES_SEQ");
	logDebug('newSeq:::: ' + newSeq);
	jsonInput["RES_ID"] = newSeq;
	
	return conf.create(searchObj, jsonInput, subModels, overrideExisting, skipDelete, "A");
}

ConfigEngineAPI.searchDivisions = function (code, agency_code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchDivisions............');
	
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.DivisionModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_AGENCY_CODE": String(agency_code)};
	
	conf.subModels = {
			"divisionI18NModels": {},
			"auditModel": {}
	};
	
	var result =  conf.search(searchObj, true, ignoreSubModels, true, true);
	
	for(var r in result){
		
		result[r]["REC_STATUS"] = result[r]["auditModel"]["REC_STATUS"];
		delete result[r]["auditModel"];
	}
	
	return result;
}

ConfigEngineAPI.createDivisionI18NModels = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createDivisionI18NModels............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.user.DivisionI18NModel";
	
	var searchObj = {"SERV_PROV_CODE": jsonInput[0]["SERV_PROV_CODE"], "LANG_ID": jsonInput[0]["LANG_ID"], "RES_ID": jsonInput[0]["RES_ID"]};
	
	conf.subModels = {};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting, false);
	
	archive_GITHUB("DivisionI18NModels", String(jsonInputOrg[0]["SERV_PROV_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.createDivisions = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createDivisions............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	var subModels = {
			"divisionI18NModels": {}
	};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	var resArr = [];
	var skipDelete = true;
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	
	for(var j in jsonInput){
		var newSeq = null;
		
		
		
		var divisionList = ConfigEngineAPI.searchDivision(jsonInput[j]["SERV_PROV_CODE"], jsonInput[j]["R3_DIVISION_CODE"], false);
		logDebug("Updated Division: " + JSON.stringify(stringifyJSType(divisionList)));
		
		var division = null;
		
		if(divisionList != null && divisionList.length > 0){
			if(divisionList.length == 1){
				division = divisionList[0];
			}else{
				for(var v in divisionList){
					if(divisionList[v]["R3_AGENCY_CODE"] == jsonInput[j]["R3_AGENCY_CODE"]){
						division = divisionList[v];
					}
				}
			}
			
		}else{
			division = null;
		}
		
		conf.className = "com.accela.orm.model.user.DivisionModel";
		
		subModels = {
				"divisionI18NModels": {}
		};
		
		var searchObj = {"R3_AGENCY_CODE": jsonInput[j]["R3_AGENCY_CODE"], "R3_DIVISION_CODE": jsonInput[j]["R3_DIVISION_CODE"]};
		var active = "A";
		try{
			active = jsonInput[j]["REC_STATUS"];
			delete jsonInput[j]["REC_STATUS"];
		}catch(e){
			logDebug("Error get/delete REC_STATUS: " + e);
			active = "A";
		}
		
		if(jsonInput[j]["RES_ID"] == null && division != null){
			jsonInput[j]["RES_ID"] = division["RES_ID"];
		}else{
			jsonInput[j]["RES_ID"] = null;
		}
		
		if(jsonInput[j]["RES_ID"] == null){
			
			newSeq = sequenceGeneratorEJB.getNextValue("R3DIVISN_RES_SEQ");
			logDebug('newSeq:::: ' + newSeq);
			jsonInput[j]["RES_ID"] = newSeq;
		}else{
			newSeq = jsonInput[j]["RES_ID"];
		}
		
		logDebug("jsonInput[j] With SEQ:: " + JSON.stringify(stringifyJSType(jsonInput[j])));
		
		var resCreate = conf.create(searchObj, jsonInput[j], subModels, overrideExisting, skipDelete, active);
		resArr = resArr.concat(resCreate);
		logDebug("resArr:: " + JSON.stringify(stringifyJSType(resArr)));
		
		
		
		var divisionI18NModels = jsonInput[j]["divisionI18NModels"];
		
		if(divisionI18NModels != null && divisionI18NModels.length > 0){
			logDebug("divisionI18NModels.length: " + divisionI18NModels.length);
			
			for(var a in divisionI18NModels){
				divisionI18NModels[a]["RES_ID"] = newSeq;
				
				logDebug("divisionI18NModels[a] With SEQ:: " + JSON.stringify(stringifyJSType(divisionI18NModels[a])));
				
				ConfigEngineAPI.createDivisionI18NModels(divisionI18NModels[a], true);
			}
		}
		
	}
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };

	archive_GITHUB("Division", String(jsonInputOrg[0]["R3_AGENCY_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

var DivisionMap = {};

ConfigEngineAPI.getDivision = function (input, ignoreSubModels) {
	var division = DivisionMap[input["R3_DIVISION_CODE"]];
	if(division != null && division != undefined){
		return division;
	}
	
	division = ConfigEngineAPI.searchDivision(input["SERV_PROV_CODE"], input["R3_DIVISION_CODE"], ignoreSubModels);
	if(division != null && division.length > 0){
		DivisionMap[division[0]["R3_DIVISION_CODE"]] = division[0]; 
		return division[0]; 
	}else{
		ConfigEngineAPI.createDivision(input, true);
		division = ConfigEngineAPI.searchDivision(input["SERV_PROV_CODE"], input["R3_DIVISION_CODE"], ignoreSubModels);
		DivisionMap[division[0]["R3_DIVISION_CODE"]] = division[0];
		return division[0];
	}
}

ConfigEngineAPI.searchDivisionList = function(code, agency_code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchDivisionList............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.DivisionModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_AGENCY_CODE": String(agency_code)};
	
	conf.subModels = {
		};
	
	var lpList =  conf.search(searchObj, true, ignoreSubModels, false, true, true);
	
	lpList = lpList.map(function (lp) {
		return lp["R3_DIVISION_CODE"];
	});


	return distinctList(lpList);
}

ConfigEngineAPI.searchDivision = function (code, division_code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchDivision............');
	
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.DivisionModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_DIVISION_CODE": String(division_code)};
	
	conf.subModels = {
			"divisionI18NModels": {}
	};
	
	return conf.search(searchObj, true, ignoreSubModels, true, true);
	
}

ConfigEngineAPI.createDivision = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createDivision............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	conf.className = "com.accela.orm.model.user.DivisionModel";
	
	subModels = {
			"divisionI18NModels": {}
	};
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	
	var searchObj = {"R3_DIVISION_CODE": jsonInput["R3_DIVISION_CODE"]};
	
	var skipDelete = true;
	
	newSeq = sequenceGeneratorEJB.getNextValue("R3DIVISN_RES_SEQ");
	logDebug('newSeq:::: ' + newSeq);
	jsonInput["RES_ID"] = newSeq;
	
	return conf.create(searchObj, jsonInput, subModels, overrideExisting, skipDelete, "A");
}

ConfigEngineAPI.searchSections = function (code, agency_code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchSections............');
	
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.SectionModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_AGENCY_CODE": String(agency_code)};
	
	conf.subModels = {
			"wsectinI18NModels": {},
			"auditModel": {}
	};
	
	var result =  conf.search(searchObj, true, ignoreSubModels, true, true);
	
	for(var r in result){
		
		result[r]["REC_STATUS"] = result[r]["auditModel"]["REC_STATUS"];
		delete result[r]["auditModel"];
	}
	
	return result;
}

ConfigEngineAPI.createWsectinI18NModels = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createWsectinI18NModels............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.user.wsectinI18NModels";
	
	var searchObj = {"SERV_PROV_CODE": jsonInput[0]["SERV_PROV_CODE"], "LANG_ID": jsonInput[0]["LANG_ID"], "RES_ID": jsonInput[0]["RES_ID"]};
	
	conf.subModels = {};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting, false);
	
	archive_GITHUB("SectinI18NModels", String(jsonInputOrg[0]["SERV_PROV_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.createSections = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createSections............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	var subModels = {
			"wsectinI18NModelss": {}
	};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	var resArr = [];
	var skipDelete = true;
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	
	for(var j in jsonInput){
		var newSeq = null;
		
		var sectionList = ConfigEngineAPI.searchSection(jsonInput[j]["SERV_PROV_CODE"], jsonInput[j]["R3_SECTION_CODE"], false);
		logDebug("Updated Section: " + JSON.stringify(stringifyJSType(sectionList)));
		
		var section = null;
		
		if(sectionList != null && sectionList.length > 0){
			if(sectionList.length == 1){
				section = sectionList[0];
			}else{
				for(var v in sectionList){
					if(sectionList[v]["R3_AGENCY_CODE"] == jsonInput[j]["R3_AGENCY_CODE"]){
						section = sectionList[v];
					}
				}
			}
			
		}else{
			section = null;
		}
		
		conf.className = "com.accela.orm.model.user.SectionModel";
		
		subModels = {
				"wsectinI18NModelss": {}
		};
		
		var searchObj = {"R3_AGENCY_CODE": jsonInput[j]["R3_AGENCY_CODE"], "R3_SECTION_CODE": jsonInput[j]["R3_SECTION_CODE"]};
		var active = "A";
		try{
			active = jsonInput[j]["REC_STATUS"];
			delete jsonInput[j]["REC_STATUS"];
		}catch(e){
			logDebug("Error get/delete REC_STATUS: " + e);
			active = "A";
		}
		
		if(jsonInput[j]["RES_ID"] == null && section != null){
			jsonInput[j]["RES_ID"] = section["RES_ID"];
		}else{
			jsonInput[j]["RES_ID"] = null;
		}
		
		if(jsonInput[j]["RES_ID"] == null){
			
			newSeq = sequenceGeneratorEJB.getNextValue("R3WSECTN_RES_SEQ");
			logDebug('newSeq:::: ' + newSeq);
			jsonInput[j]["RES_ID"] = newSeq;
		}else{
			newSeq = jsonInput[j]["RES_ID"];
		}
		
		logDebug("jsonInput[j] With SEQ:: " + JSON.stringify(stringifyJSType(jsonInput[j])));
		
		resArr = resArr.concat(conf.create(searchObj, jsonInput[j], subModels, overrideExisting, skipDelete, active));
		logDebug("resArr:: " + JSON.stringify(stringifyJSType(resArr)));
		
		var wsectinI18NModelss = jsonInput[j]["wsectinI18NModelss"];
		
		if(wsectinI18NModelss != null && wsectinI18NModelss.length > 0){
			logDebug("wsectinI18NModelss.length: " + wsectinI18NModelss.length);
			
			for(var a in wsectinI18NModelss){
				wsectinI18NModelss[a]["RES_ID"] = newSeq;
				
				logDebug("wsectinI18NModelss[a] With SEQ:: " + JSON.stringify(stringifyJSType(wsectinI18NModelss[a])));
				
				ConfigEngineAPI.createWsectinI18NModels(wsectinI18NModelss[a], true);
			}
		}
		
	}
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };

	archive_GITHUB("Section", String(jsonInputOrg[0]["R3_AGENCY_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

var SectionMap = {};

ConfigEngineAPI.getSection = function (input, ignoreSubModels) {
	var section = SectionMap[input["R3_SECTION_CODE"]];
	if(section != null && section != undefined){
		return section;
	}
	
	section = ConfigEngineAPI.searchSection(input["SERV_PROV_CODE"], input["R3_SECTION_CODE"], ignoreSubModels);
	if(section != null && section.length > 0){
		SectionMap[section[0]["R3_SECTION_CODE"]] = section[0]; 
		return section[0]; 
	}else{
		ConfigEngineAPI.createSection(input, true);
		section = ConfigEngineAPI.searchSection(input["SERV_PROV_CODE"], input["R3_SECTION_CODE"], ignoreSubModels);
		SectionMap[section[0]["R3_SECTION_CODE"]] = section[0];
		return section[0];
	}
}

ConfigEngineAPI.searchSectionList = function(code, agency_code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchSectionList............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.SectionModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_AGENCY_CODE": String(agency_code)};
	
	conf.subModels = {
		};
	
	var lpList =  conf.search(searchObj, true, ignoreSubModels, false, true, true);
	
	lpList = lpList.map(function (lp) {
		return lp["R3_SECTION_CODE"];
	});


	return distinctList(lpList);
}

ConfigEngineAPI.searchSection = function (code, division_code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchSection............');
	
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.SectionModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_SECTION_CODE": String(division_code)};
	
	conf.subModels = {
			"wsectinI18NModels": {}
	};
	
	return conf.search(searchObj, true, ignoreSubModels, true, true);
	
}

ConfigEngineAPI.createSection = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createSection............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	conf.className = "com.accela.orm.model.user.SectionModel";
	
	subModels = {
			"wsectinI18NModels": {}
	};
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	
	var searchObj = {"R3_SECTION_CODE": jsonInput["R3_SECTION_CODE"]};
	
	var skipDelete = true;
	
	newSeq = sequenceGeneratorEJB.getNextValue("R3WSECTN_RES_SEQ");
	logDebug('newSeq:::: ' + newSeq);
	jsonInput["RES_ID"] = newSeq;
	
	return conf.create(searchObj, jsonInput, subModels, overrideExisting, skipDelete, "A");
}

ConfigEngineAPI.searchGroups = function (code, agency_code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchGroups............');
	
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.OrganizationGroupModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_AGENCY_CODE": String(agency_code)};
	
	conf.subModels = {
			"groupI18NModels": {},
			"auditModel": {}
	};
	
	var result =  conf.search(searchObj, true, ignoreSubModels, true, true);
	
	for(var r in result){
		
		result[r]["REC_STATUS"] = result[r]["auditModel"]["REC_STATUS"];
		delete result[r]["auditModel"];
	}
	
	return result;
}

ConfigEngineAPI.createOrganizationGroupI18NModel = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createOrganizationGroupI18NModel............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.user.OrganizationGroupI18NModel";
	
	var searchObj = {"SERV_PROV_CODE": jsonInput[0]["SERV_PROV_CODE"], "LANG_ID": jsonInput[0]["LANG_ID"], "RES_ID": jsonInput[0]["RES_ID"]};
	
	conf.subModels = {};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting, false);
	
	archive_GITHUB("OrganizationGroupI18NModel", String(jsonInputOrg[0]["SERV_PROV_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.createGroups = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createGroups............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	var subModels = {
			"groupI18NModels": {}
	};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	var resArr = [];
	var skipDelete = true;
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	
	for(var j in jsonInput){
		var newSeq = null;
		
		var groupList = ConfigEngineAPI.searchGroup(jsonInput[j]["SERV_PROV_CODE"], jsonInput[j]["R3_GROUP_CODE"], false);
		logDebug("Updated Group: " + JSON.stringify(stringifyJSType(groupList)));
		
		var group = null;
		
		if(groupList != null && groupList.length > 0){
			if(groupList.length == 1){
				group = groupList[0];
			}else{
				for(var v in groupList){
					if(groupList[v]["R3_AGENCY_CODE"] == jsonInput[j]["R3_AGENCY_CODE"]){
						group = groupList[v];
					}
				}
			}
			
		}else{
			group = null;
		}
		
		conf.className = "com.accela.orm.model.user.OrganizationGroupModel";
		
		subModels = {
				"groupI18NModels": {}
		};
		
		var searchObj = {"R3_AGENCY_CODE": jsonInput[j]["R3_AGENCY_CODE"], "R3_GROUP_CODE": jsonInput[j]["R3_GROUP_CODE"]};
		var active = "A";
		try{
			active = jsonInput[j]["REC_STATUS"];
			delete jsonInput[j]["REC_STATUS"];
		}catch(e){
			logDebug("Error get/delete REC_STATUS: " + e);
			active = "A";
		}
		
		if(jsonInput[j]["RES_ID"] == null && group != null){
			jsonInput[j]["RES_ID"] = group["RES_ID"];
		}else{
			jsonInput[j]["RES_ID"] = null;
		}
		
		if(jsonInput[j]["RES_ID"] == null){
			
			newSeq = sequenceGeneratorEJB.getNextValue("R3WGROUP_RES_SEQ");
			logDebug('newSeq:::: ' + newSeq);
			jsonInput[j]["RES_ID"] = newSeq;
		}else{
			newSeq = jsonInput[j]["RES_ID"];
		}
		
		logDebug("jsonInput[j] With SEQ:: " + JSON.stringify(stringifyJSType(jsonInput[j])));
		
		resArr = resArr.concat(conf.create(searchObj, jsonInput[j], subModels, overrideExisting, skipDelete, active));
		logDebug("resArr:: " + JSON.stringify(stringifyJSType(resArr)));
		
		var groupI18NModels = jsonInput[j]["groupI18NModels"];
		
		if(groupI18NModels != null && groupI18NModels.length > 0){
			logDebug("groupI18NModels.length: " + groupI18NModels.length);
			
			for(var a in groupI18NModels){
				groupI18NModels[a]["RES_ID"] = newSeq;
				
				logDebug("groupI18NModels[a] With SEQ:: " + JSON.stringify(stringifyJSType(groupI18NModels[a])));
				
				ConfigEngineAPI.createOrganizationGroupI18NModel(groupI18NModels[a], true);
			}
		}
		
	}
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };

	archive_GITHUB("Group", String(jsonInputOrg[0]["R3_AGENCY_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

var GroupMap = {};

ConfigEngineAPI.getGroup = function (input, ignoreSubModels) {
	var group = GroupMap[input["R3_GROUP_CODE"]];
	if(group != null && group != undefined){
		return group;
	}
	
	group = ConfigEngineAPI.searchGroup(input["SERV_PROV_CODE"], input["R3_GROUP_CODE"], ignoreSubModels);
	if(group != null && group.length > 0){
		GroupMap[group[0]["R3_GROUP_CODE"]] = group[0]; 
		return group[0]; 
	}else{
		ConfigEngineAPI.createGroup(input, true);
		group = ConfigEngineAPI.searchGroup(input["SERV_PROV_CODE"], input["R3_GROUP_CODE"], ignoreSubModels);
		GroupMap[group[0]["R3_GROUP_CODE"]] = group[0];
		return group[0];
	}
}

ConfigEngineAPI.searchGroupList = function(code, agency_code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchGroupList............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.OrganizationGroupModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_AGENCY_CODE": String(agency_code)};
	
	conf.subModels = {
		};
	
	var lpList =  conf.search(searchObj, true, ignoreSubModels, false, true, true);
	
	lpList = lpList.map(function (lp) {
		return lp["R3_GROUP_CODE"];
	});


	return distinctList(lpList);
}

ConfigEngineAPI.searchGroup = function (code, group_code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchGroup............');
	
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.OrganizationGroupModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_GROUP_CODE": String(group_code)};
	
	conf.subModels = {
			"groupI18NModels": {}
	};
	
	return conf.search(searchObj, true, ignoreSubModels, true, true);
	
}

ConfigEngineAPI.createGroup = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createGroup............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	conf.className = "com.accela.orm.model.user.OrganizationGroupModel";
	
	subModels = {
			"groupI18NModels": {}
	};
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	
	var searchObj = {"R3_GROUP_CODE": jsonInput["R3_GROUP_CODE"]};
	
	var skipDelete = true;
	
	newSeq = sequenceGeneratorEJB.getNextValue("R3WSECTN_RES_SEQ");
	logDebug('newSeq:::: ' + newSeq);
	jsonInput["RES_ID"] = newSeq;
	
	return conf.create(searchObj, jsonInput, subModels, overrideExisting, skipDelete, "A");
}

ConfigEngineAPI.searchOffices = function (code, agency_code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchOffices............');
	
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.OfficeModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_AGENCY_CODE": String(agency_code)};
	
	conf.subModels = {
			"officeI18NModels": {},
			"auditModel": {}
	};
	
	var result =  conf.search(searchObj, true, ignoreSubModels, true, true);
	
	for(var r in result){
		
		result[r]["REC_STATUS"] = result[r]["auditModel"]["REC_STATUS"];
		delete result[r]["auditModel"];
	}
	
	return result;
}

ConfigEngineAPI.createOfficeI18NModels = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createOfficeI18NModels............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.user.OfficeI18NModel";
	
	var searchObj = {"SERV_PROV_CODE": jsonInput[0]["SERV_PROV_CODE"], "LANG_ID": jsonInput[0]["LANG_ID"], "RES_ID": jsonInput[0]["RES_ID"]};
	
	conf.subModels = {};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting, false);
	
	archive_GITHUB("OfficeI18NModels", String(jsonInputOrg[0]["SERV_PROV_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.createOffices = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createOffices............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	var subModels = {
			"officeI18NModels": {}
	};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	var resArr = [];
	var skipDelete = true;
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	
	for(var j in jsonInput){
		var newSeq = null;
		
		var officeList = ConfigEngineAPI.searchOffice(jsonInput[j]["SERV_PROV_CODE"], jsonInput[j]["R3_OFFICE_CODE"], false);
		logDebug("Updated Office: " + JSON.stringify(stringifyJSType(officeList)));
		
		var office = null;
		
		if(officeList != null && officeList.length > 0){
			if(officeList.length == 1){
				office = officeList[0];
			}else{
				for(var v in officeList){
					if(officeList[v]["R3_AGENCY_CODE"] == jsonInput[j]["R3_AGENCY_CODE"]){
						office = officeList[v];
					}
				}
			}
			
		}else{
			office = null;
		}
		
		conf.className = "com.accela.orm.model.user.OfficeModel";
		
		subModels = {
				"officeI18NModels": {}
		};
		
		var searchObj = {"R3_AGENCY_CODE": jsonInput[j]["R3_AGENCY_CODE"], "R3_OFFICE_CODE": jsonInput[j]["R3_OFFICE_CODE"]};
		var active = "A";
		try{
			active = jsonInput[j]["REC_STATUS"];
			delete jsonInput[j]["REC_STATUS"];
		}catch(e){
			logDebug("Error get/delete REC_STATUS: " + e);
			active = "A";
		}
		
		if(jsonInput[j]["RES_ID"] == null && office != null){
			jsonInput[j]["RES_ID"] = office["RES_ID"];
		}else{
			jsonInput[j]["RES_ID"] = null;
		}
		
		if(jsonInput[j]["RES_ID"] == null){
			
			newSeq = sequenceGeneratorEJB.getNextValue("R3OFFICE_RES_SEQ");
			logDebug('newSeq:::: ' + newSeq);
			jsonInput[j]["RES_ID"] = newSeq;
		}else{
			newSeq = jsonInput[j]["RES_ID"];
		}
		
		logDebug("jsonInput[j] With SEQ:: " + JSON.stringify(stringifyJSType(jsonInput[j])));
		
		resArr = resArr.concat(conf.create(searchObj, jsonInput[j], subModels, overrideExisting, skipDelete, active));
		logDebug("resArr:: " + JSON.stringify(stringifyJSType(resArr)));
		
		var officeI18NModels = jsonInput[j]["officeI18NModels"];
		
		if(officeI18NModels != null && officeI18NModels.length > 0){
			logDebug("officeI18NModels.length: " + officeI18NModels.length);
			
			for(var a in officeI18NModels){
				officeI18NModels[a]["RES_ID"] = newSeq;
				
				logDebug("officeI18NModels[a] With SEQ:: " + JSON.stringify(stringifyJSType(officeI18NModels[a])));
				
				ConfigEngineAPI.createOfficeI18NModels(officeI18NModels[a], true);
			}
		}
		
	}
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };

	archive_GITHUB("Office", String(jsonInputOrg[0]["R3_AGENCY_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

var OfficeMap = {};

ConfigEngineAPI.getOffice = function (input, ignoreSubModels) {
	var office = OfficeMap[input["R3_OFFICE_CODE"]];
	if(office != null && office != undefined){
		return office;
	}
	
	office = ConfigEngineAPI.searchOffice(input["SERV_PROV_CODE"], input["R3_OFFICE_CODE"], ignoreSubModels);
	if(office != null && office.length > 0){
		OfficeMap[office[0]["R3_OFFICE_CODE"]] = office[0]; 
		return office[0]; 
	}else{
		ConfigEngineAPI.createOffice(input, true);
		office = ConfigEngineAPI.searchOffice(input["SERV_PROV_CODE"], input["R3_OFFICE_CODE"], ignoreSubModels);
		OfficeMap[office[0]["R3_OFFICE_CODE"]] = office[0];
		return office[0];
	}
}

ConfigEngineAPI.searchOfficeList = function(code, agency_code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchOfficeList............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.OfficeModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_AGENCY_CODE": String(agency_code)};
	
	conf.subModels = {
		};
	
	var lpList =  conf.search(searchObj, true, ignoreSubModels, false, true, true);
	
	lpList = lpList.map(function (lp) {
		return lp["R3_OFFICE_CODE"];
	});


	return distinctList(lpList);
}

ConfigEngineAPI.searchOffice = function (code, division_code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchOffice............');
	
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.user.OfficeModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R3_OFFICE_CODE": String(division_code)};
	
	conf.subModels = {
			"officeI18NModels": {}
	};
	
	return conf.search(searchObj, true, ignoreSubModels, true, true);
	
}

ConfigEngineAPI.createOffice = function(jsonInput, overrideExisting){
	logDebug('ConfigEngineAPI.createOffice............');
	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
	
	conf.className = "com.accela.orm.model.user.OfficeModel";
	
	subModels = {
			"officeI18NModels": {}
	};
	
	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
	
	var searchObj = {"R3_OFFICE_CODE": jsonInput["R3_OFFICE_CODE"]};
	
	var skipDelete = true;
	
	newSeq = sequenceGeneratorEJB.getNextValue("R3OFFICE_RES_SEQ");
	logDebug('newSeq:::: ' + newSeq);
	jsonInput["RES_ID"] = newSeq;
	
	return conf.create(searchObj, jsonInput, subModels, overrideExisting, skipDelete, "A");
}

//ConfigEngineAPI.searchReports = function (code, ignoreSubModels) {
//	logDebug('ConfigEngineAPI.searchReports............');
//	
//	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
//	aa.print('ignoreSubModels: ' + ignoreSubModels);
//	
//	conf.className = "com.accela.orm.model.report.ReportModel";
//	
//	var searchObj = {"SERV_PROV_CODE": String(code)};
//	
//	conf.subModels = {
//			"i18NModel": {},
//			"reportI18Models": {},
//			"reportDetailModels": {
////				"i18NModel": {},
////				"reportDetailI18Models": {}
////				,
////				"reportParametersModels": {
////					"i18NModel": {}
////				},
////				"reportPortletsModels": {
////					"reportPortletsCriteriaModels": {}
////				},
////				"reportWorkflowModels": {},
////				"reportPermissionsModels": {
////					"userGropModel": {}
////				}
//			}
//	};
//	
//	var result = conf.search(searchObj, true, ignoreSubModels, true, true);
//	
//	var reports = [];
//	
//	for(var r in result){
//		
//		for(var m in result[r]['reportDetailModels']){
//			var model = result[r]['reportDetailModels'][m];
//			model['CATEGORY_NAME'] = result[r]['CATEGORY_NAME'];
//			
//			reports.push(model);
//		}
//	}
//	
//	return reports;
//}
//
//ConfigEngineAPI.createReports= function(serviceCode, jsonInput, overrideExisting){
//	logDebug('ConfigEngineAPI.createReports............');
//	overrideExisting = overrideExisting == undefined || overrideExisting == 'False' ? false : overrideExisting;
//	logDebug('overrideExisting: ' + overrideExisting);
//	
//	if(!overrideExisting){
//		logDebug('Returning: {"success": false, "exists": true}');
//		return {
//			"success": false,
//			"exists": true
//		};
//	}
//	
//	conf.className = "com.accela.orm.model.report.ReportModel";
//	
//	subModels = {
//		"i18NModel": {},
//		"reportI18Models": {},
//		"reportDetailModels": {}
//	}
//	
//	var sysData = ConfigEngineAPI.searchReports(serviceCode, false);
//	logDebug('sysData: \n' + JSON.stringify(stringifyJSType(sysData)));
//	
//	var createdItems = getCreatedItems(['REPORT_NAME', 'CATEGORY_NAME'], sysData, jsonInput);
//	logDebug('createdItems.length: ' + createdItems.length);
//	logDebug('createdItems: \n' + JSON.stringify(stringifyJSType(createdItems)));
//
//	var updatedItems = getUpdatedItems(['REPORT_NAME', 'CATEGORY_NAME'], sysData, jsonInput, ['REPORT_FORMAT', 'REPORT_LINK', 'REPORT_DESCRIPTION']);
//	logDebug('updatedItems.length: ' + updatedItems.length);
//	logDebug('updatedItems: \n' + JSON.stringify(stringifyJSType(updatedItems)));
//	
//	var sequenceGeneratorEJB = new com.accela.sequence.SequenceGeneratorEJB();
//	
//	newSeq = sequenceGeneratorEJB.getNextValue("RPT_DETAIL_RES_SEQ");
//	logDebug('newSeq:::: ' + newSeq);
//	jsonInput["RES_ID"] = newSeq;
//	
//	var searchObj = {"SERV_PROV_CODE": serviceCode};
//	
//	var skipDelete = true;
//	
//}

function printJson(title, json){
	try{
		logDebug(title + "1: " + JSON.stringify(json));
	}catch(e){
		logDebug(title + "2: " + json);
	}
}

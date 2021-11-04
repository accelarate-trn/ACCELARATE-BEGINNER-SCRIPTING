/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_CONFIG_API.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MHASHAIKEH
| Created at	: 07/07/2020 15:23:46
|
/------------------------------------------------------------------------------------------------------*/
eval(getScriptText("INCLUDE_CONFIG"));
eval(getScriptText("INCLUDE_GITHUB"));

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

function invokeAll(object) {
    var methods = object.getClass().getMethods();
    aa.print("------invoking all methods");
    for (x in methods) {
           var method = methods[x];
           aa.print(method.getName() + "() ;");
    }
    aa.print("------------------");
}

function invokeGetters(object) {
    var numOfParams = 0;

    if (arguments.length == 2) {
           numOfParams = parseInt(arguments[1]);
    }
    var methods = object.getClass().getMethods();
    aa.print("------invoking methods with namePattern=getXXX()");
    for (x in methods) {
           var method = methods[x];
           if (method.getName().toLowerCase().startsWith("get") && method.getParameterTypes().length == numOfParams) {
                  aa.print(method.getName() + "() = " + method.invoke(object));
           }
    }
    aa.print("------------------");
}

function invokeMethods(object) {
    var numOfParams = 0;

    if (arguments.length == 2) {
           numOfParams = parseInt(arguments[1]);
    }
    var methods = object.getClass().getMethods();
    aa.print("------invoking methods with namePattern=getXXX()");
    for (x in methods) {
           var method = methods[x];
           if (method.getName().toLowerCase().startsWith("get") && method.getParameterTypes().length == numOfParams) {
                  aa.print(method.getName() + "() = " + method.invoke(object));
           }
           
           if(method.getName().toLowerCase().startsWith("set")){

        	   var params = '';
        	   if(method.getParameterTypes().length == 0){
        		   params = '()';
        	   }else{
        		   params = '( ';
        		   
        		   for(i in method.getParameterTypes()){
        			   if(i > 0){
        				   params += ', ';
        			   }
        			   params += method.getParameterTypes()[i];
            	   }
        		   
        		   params += ' )';
        	   }

        	   aa.print(method.getName() + ' ' + params);
        	   
        	   
           }
    }
    aa.print("------------------");
}

function printMethods(object)
{
    for (x in object.getClass().getMethods())
    {
        aa.print(object.getClass().getMethods()[x].getName());
    }
}

function printObject(object){
	var output = ""
	for (var property in object) {
	   output += property + ': ' + object[property]+'; ';
	}
	aa.print(output)
}

function stringifyJSType(e) {
	return e && (e.getClass ? e = String(e) : "object" == typeof e ? e = stringifyObject(e) : "[object Array]" === Object.prototype.toString.call(e) && (e = stringifyArray(e))), e
}

function stringifyObject(e) {
	for (var t in e)
		if (e.hasOwnProperty(t)) {
			var r = e[t];
			e[t] = stringifyJSType(r)
		}
	return e
}

function stringifyArray(e) {
	for (var t = 0; t < e.length; t++) e[t] = stringifyJSType(e[t])
}

function logDebug(msg){
	aa.print(msg);
	java.lang.System.out.println(msg);
}

function isEmpty(str){
	return str == null || str == undefined || str == '';
}

function ConfigEngineAPI() {
	
}

ConfigEngineAPI.prototype = {}


var conf = new ConfigEngine();

ConfigEngineAPI.Delete = function (searchRes, className) {
	conf.Delete(searchRes, className);
}

ConfigEngineAPI.searchASISubGroup = function(code, subGroup, ignoreSubModels){
	aa.print('ConfigEngineAPI.searchASI............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.RefAppSpecInfoFieldModel";
	
	var searchObj = {"R1_CHECKBOX_CODE": String(code), "R1_CHECKBOX_TYPE": String(subGroup), "R1_CHECKBOX_GROUP": "APPLICATION"};
	
	conf.subModels = {
			"refAppSpecInfoFieldI18NModels": {
				"ISLANG": true
			},
			"sharedDropDownModel": {},
			"asiDropdownModels": {}
		};
	
	var asis = conf.search(searchObj, asJson, ignoreSubModels, false, true);
	
	conf.className = "com.accela.orm.model.asi.ASIModel";
	
	for(var a in asis){
		var sql = "select m.R1_CHECKBOX_DESC_ALIAS 'Field_Alias_English' , d.R1_CHECKBOX_DESC_ALIAS 'Field_Alias_Arabic'  FROM R2CHCKBOX M left JOIN R2CHCKBOX_I18N D ON m.SERV_PROV_CODE = d.SERV_PROV_CODE and M.RES_ID = D.RES_ID where M.R1_CHECKBOX_CODE = ? and M.R1_CHECKBOX_DESC = ?";
		var params = [String(code), String(asis[a]["R1_CHECKBOX_DESC"])];
		
		var labels = conf.selectBySQL(sql, params);
		
		if(labels != null && labels != undefined && labels.size() > 0){
			asis[a]["FIELD_ALIAS_ENGLISH"] = labels.get(0)[0];
			asis[a]["FIELD_ALIAS_SECLANG"] = labels.get(0)[1];
		}else{	
			asis[a]["FIELD_ALIAS_ENGLISH"] = '';
			asis[a]["FIELD_ALIAS_SECLANG"] = '';
		}
	}
	
	return asis;
}

ConfigEngineAPI.searchASI = function(code, ignoreSubModels){
	aa.print('ConfigEngineAPI.searchASI............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.RefAppSpecInfoFieldModel";
	
	var searchObj = {"R1_CHECKBOX_CODE": String(code), "R1_CHECKBOX_GROUP": "APPLICATION"};
	
	conf.subModels = {
			"refAppSpecInfoFieldI18NModels": {
				"ISLANG": true
			},
			"sharedDropDownModel": {},
			"asiDropdownModels": {}
		};
	
	var asis = conf.search(searchObj, asJson, ignoreSubModels, false, true);
	
	conf.className = "com.accela.orm.model.asi.ASIModel";
	
	for(var a in asis){
		var sql = "select m.R1_CHECKBOX_DESC_ALIAS 'Field_Alias_English' , d.R1_CHECKBOX_DESC_ALIAS 'Field_Alias_Arabic'  FROM R2CHCKBOX M left JOIN R2CHCKBOX_I18N D ON m.SERV_PROV_CODE = d.SERV_PROV_CODE and M.RES_ID = D.RES_ID where M.R1_CHECKBOX_CODE = ? and M.R1_CHECKBOX_DESC = ?";
		var params = [String(code), String(asis[a]["R1_CHECKBOX_DESC"])];
		
		var labels = conf.selectBySQL(sql, params);
		
		if(labels != null && labels != undefined && labels.size() > 0){
			asis[a]["FIELD_ALIAS_ENGLISH"] = labels.get(0)[0];
			asis[a]["FIELD_ALIAS_SECLANG"] = labels.get(0)[1];
		}else{	
			asis[a]["FIELD_ALIAS_ENGLISH"] = '';
			asis[a]["FIELD_ALIAS_SECLANG"] = '';
		}
	}
	
	return asis;
}

ConfigEngineAPI.createASI = function(jsonInput, overrideExisting, addOnly){
	logDebug("createASII................................");
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.asi.RefAppSpecInfoFieldModel";
	
	var subModels = {
			"refAppSpecInfoFieldI18NModels": {
				"ISLANG": true
			},
			"sharedDropDownModel": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {"R1_CHECKBOX_CODE": String(jsonInput[0]["R1_CHECKBOX_CODE"]), "R1_CHECKBOX_GROUP": "APPLICATION"};
	
	var result;
	if(addOnly){
		result = conf.create(searchObj, jsonInput, subModels, overrideExisting, true);
	}else{
		result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	}
	
	var sql1 = "update R2CHCKBOX set R1_CHECKBOX_DESC_ALIAS = ? where SERV_PROV_CODE = ? and R1_CHECKBOX_CODE = ? and R1_CHECKBOX_DESC = ?";
	var sql2 = "update R2CHCKBOX_I18N set R1_CHECKBOX_DESC_ALIAS = ? where RES_ID IN (SELECT RES_ID FROM R2CHCKBOX where SERV_PROV_CODE = ? and R1_CHECKBOX_CODE = ? and R1_CHECKBOX_DESC = ?) AND LANG_ID = ?";
	
	var params = [];
	
	for(var j in jsonInput){
		params = [String(jsonInput[j]["FIELD_ALIAS_ENGLISH"]), String(jsonInput[j]["SERV_PROV_CODE"]), String(jsonInput[j]["R1_CHECKBOX_CODE"]), String(jsonInput[j]["R1_CHECKBOX_DESC"])];
		conf.updateBySQL(sql1, params);
		
		try{
		params = [String(jsonInput[j]["FIELD_ALIAS_ENGLISH"]), String(jsonInput[j]["SERV_PROV_CODE"]), String(jsonInput[j]["R1_CHECKBOX_CODE"]), String(jsonInput[j]["R1_CHECKBOX_DESC"]), String(jsonInput[j]["refAppSpecInfoFieldI18NModels"][1]["LANG_ID"])];
		conf.updateBySQL(sql2, params);
		}catch(e){
//			logDebug("ERRRRR1: " + e);
		}
		
		try{
		params = [String(jsonInput[j]["FIELD_ALIAS_SECLANG"]), String(jsonInput[j]["SERV_PROV_CODE"]), String(jsonInput[j]["R1_CHECKBOX_CODE"]), String(jsonInput[j]["R1_CHECKBOX_DESC"]), String(jsonInput[j]["refAppSpecInfoFieldI18NModels"][0]["LANG_ID"])];
		conf.updateBySQL(sql2, params);
		}catch(e){
//			logDebug("ERRRRR2: " + e);
		}
	}
	
	archive_GITHUB("Custom Fields", String(jsonInputOrg[0]["R1_CHECKBOX_CODE"]), jsonInputOrg, result, overrideExisting);
	
	
	return result;
}

ConfigEngineAPI.searchASIGroups = function(code, ignoreSubModels){
	aa.print('ConfigEngineAPI.searchASI............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.RefAppSpecInfoFieldModel";
	var obj = new com.accela.orm.model.asi.RefAppSpecInfoFieldModel();
	
	var sql = "select distinct R1_CHECKBOX_CODE, R1_CHECKBOX_TYPE from R2CHCKBOX where SERV_PROV_CODE = '"+String(code)+"' and R1_CHECKBOX_GROUP = 'APPLICATION'";
	var params = [];
	
	conf.subModels = {
			"R1_CHECKBOX_CODE": {},
			"R1_CHECKBOX_TYPE": {}
		};
	
	return conf.searchBySQL(obj.getClass(), sql, params, asJson, ignoreSubModels, false);
}

ConfigEngineAPI.searchASITGroups = function(code, ignoreSubModels){
	aa.print('ConfigEngineAPI.searchASI............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.RefAppSpecInfoFieldModel";
	var obj = new com.accela.orm.model.asi.RefAppSpecInfoFieldModel();
	
	var sql = "select distinct R1_CHECKBOX_CODE, R1_CHECKBOX_TYPE from R2CHCKBOX where SERV_PROV_CODE = '"+String(code)+"' and R1_CHECKBOX_GROUP = 'FEEATTACHEDTABLE'";
	var params = [];
	
	conf.subModels = {
			"R1_CHECKBOX_CODE": {},
			"R1_CHECKBOX_TYPE": {}
		};
	
	return conf.searchBySQL(obj.getClass(), sql, params, asJson, ignoreSubModels, false);
}

ConfigEngineAPI.searchDocuments = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.document.RefDocumentModel";
	
	var searchObj = {"DOC_CODE": String(code)};
	
	conf.subModels = {
			"documentI18NModels": {
				"ISLANG": true
			},
			"templateAttribute": {}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createDocuments = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.document.RefDocumentModel";
	
	var subModels = {
			"documentI18NModels": {
				"ISLANG": true
			},
			"templateAttribute": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {"DOC_CODE": String(jsonInput[0]["DOC_CODE"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("Document Types", String(jsonInputOrg[0]["DOC_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchFeesSchedule = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.finance.RefFeeScheduleModel";
	
	var searchObj = {"FEE_SCHEDULE_NAME":String(code)};
	
	conf.subModels = {
			"feeScheduleI18NModels":{},
			"feeItems":{
				"feeItemI18NModels":{},
//				"unitDescModel":{}
			}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createFeesSchedule = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.finance.RefFeeScheduleModel";
	
	var subModels = {
			"feeScheduleI18NModels":{},
			"feeItems":{
				"feeItemI18NModels":{},
//				"unitDescModel":{}
			}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {"FEE_SCHEDULE_NAME":String(jsonInput[0]["FEE_SCHEDULE_NAME"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("Fees", String(jsonInputOrg[0]["FEE_SCHEDULE_NAME"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchApplicationType = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.cap.CapTypeModel";
	
	var searchObj = {};
	
	if(code.indexOf('/') == -1){
		searchObj = {
			"R1_PER_CATEGORY": String(code)
		};
	}else{
		var codeParts = (String(code)).split('/');
		searchObj = {
			"R1_PER_GROUP": codeParts[0],
			"R1_PER_TYPE": codeParts[1],
			"R1_PER_SUB_TYPE": codeParts[2],
			"R1_PER_CATEGORY":  codeParts[3]
		}
	}
	
	conf.subModels = {
			//capTypeRelationModel  ,  captypeStandardComment
			"capTypeI18NModels": {},
			"citizenAccessModel": {},
//			"capTypeACAModel": {},
//			"capTypeGISModel": {},
			"capTypeMaskModel": {},
//			"capTypeIDMaskModel": {}
	};
	
	
//	asJson = false;
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createApplicationType = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.cap.CapTypeModel";
	
	var subModels = {
			"capTypeI18NModels": {},
//			"citizenAccessModel": {},
//			"capTypeACAModel": {},
//			"capTypeGISModel": {},
			"capTypeMaskModel": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {
			"R1_PER_GROUP": String(jsonInput[0]["R1_PER_GROUP"]),
			"R1_PER_TYPE": String(jsonInput[0]["R1_PER_TYPE"]),
			"R1_PER_SUB_TYPE": String(jsonInput[0]["R1_PER_SUB_TYPE"]),
			"R1_PER_CATEGORY":  String(jsonInput[0]["R1_PER_CATEGORY"])
	};
	
	
	var result = conf.createOrUpdate(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("Application Type", String(jsonInputOrg[0]["R1_PER_GROUP"]) + "_" + String(jsonInputOrg[0]["R1_PER_TYPE"]) + "_" + String(jsonInputOrg[0]["R1_PER_SUB_TYPE"]) + "_" + String(jsonInputOrg[0]["R1_PER_CATEGORY"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchApplicationStatusGroup = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.statusgroup.AppStatusGroupModel";
	
	var searchObj = {"APP_STATUS_GROUP_CODE":String(code)};
	
	conf.subModels = {
			"appStatusGroupI18NModels": {}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createApplicationStatusGroup = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.statusgroup.AppStatusGroupModel";
	
	var subModels = {
			"appStatusGroupI18NModels": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {"APP_STATUS_GROUP_CODE": String(jsonInput[0]["APP_STATUS_GROUP_CODE"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("Application Status", String(jsonInputOrg[0]["APP_STATUS_GROUP_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchTaskSpecInfoGroup = function(code, ignoreSubModels){
	aa.print('ConfigEngineAPI.searchASI............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.RefAppSpecInfoFieldModel";
	
	var searchObj = {"R1_CHECKBOX_CODE": String(code), "R1_CHECKBOX_GROUP": "WORKFLOW TASK"};
	
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
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createTaskSpecInfoGroup = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
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
	
	var searchObj = {"R1_CHECKBOX_CODE": String(jsonInput[0]["R1_CHECKBOX_CODE"]), "R1_CHECKBOX_GROUP": "WORKFLOW TASK"};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("Task Custom Fields", String(jsonInputOrg[0]["R1_CHECKBOX_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchASIT = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.RefAppSpecInfoFieldModel";
	
	var searchObj = {"R1_CHECKBOX_CODE": String(code), "R1_CHECKBOX_GROUP": "FEEATTACHEDTABLE"};
	
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
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createASIT = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
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
	
	var searchObj = {"R1_CHECKBOX_CODE": String(jsonInput[0]["R1_CHECKBOX_CODE"]), "R1_CHECKBOX_GROUP": "FEEATTACHEDTABLE"};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	var sql1 = "update R2CHCKBOX set R1_CHECKBOX_DESC_ALIAS = ? where SERV_PROV_CODE = ? and R1_CHECKBOX_CODE = ? and R1_CHECKBOX_DESC = ?";
	var sql2 = "update R2CHCKBOX_I18N set R1_CHECKBOX_DESC_ALIAS = ? where RES_ID IN (SELECT RES_ID FROM R2CHCKBOX where SERV_PROV_CODE = ? and R1_CHECKBOX_CODE = ? and R1_CHECKBOX_DESC = ?) AND LANG_ID = ?";
	
	var params = [];
	
	for(var j in jsonInput){
		params = [String(jsonInput[j]["R1_CHECKBOX_DESC"]), String(jsonInput[j]["SERV_PROV_CODE"]), String(jsonInput[j]["R1_CHECKBOX_CODE"]), String(jsonInput[j]["R1_CHECKBOX_DESC"])];
		conf.updateBySQL(sql1, params);
		
		try{
			params = [String(jsonInput[j]["R1_CHECKBOX_DESC"]), String(jsonInput[j]["SERV_PROV_CODE"]), String(jsonInput[j]["R1_CHECKBOX_CODE"]), String(jsonInput[j]["R1_CHECKBOX_DESC"]), String(jsonInput[j]["refAppSpecInfoFieldI18NModels"][1]["LANG_ID"])];
			conf.updateBySQL(sql2, params);
		}catch(e){
			logDebug("ERRRRR1: " + e);
		}
		
		try{
			params = [String(jsonInput[j]["refAppSpecInfoFieldI18NModels"][0]["R1_CHECKBOX_DESC"]), String(jsonInput[j]["SERV_PROV_CODE"]), String(jsonInput[j]["R1_CHECKBOX_CODE"]), String(jsonInput[j]["R1_CHECKBOX_DESC"]), String(jsonInput[j]["refAppSpecInfoFieldI18NModels"][0]["LANG_ID"])];
			conf.updateBySQL(sql2, params);
		}catch(e){
			logDebug("ERRRRR2: " + e);
		}
	}

	archive_GITHUB("Custom Tables", String(jsonInputOrg[0]["R1_CHECKBOX_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchFeesUnitValues = function(){
	conf.className = "com.accela.orm.model.asi.SharedDropDownListModel";
	
	var searchObj = {"BIZDOMAIN": "UNIT DESC"};
	
	conf.subModels = {
			"sharedDropDownValueModels": {
				"standardChoiceValueI18NModels": []
			}
		};
	
	var dList = conf.search(searchObj, asJson, false, false, true);
	dList = dList[0]['sharedDropDownValueModels'];
	
	dList = dList.map(function (lp) {
		return lp["BIZDOMAIN_VALUE"];
	});

	return dList;
}

ConfigEngineAPI.searchSharedDropDown = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.SharedDropDownListModel";
	
	var searchObj = {"BIZDOMAIN": String(code)};
	
	conf.subModels = {
			"sharedDropDownValueModels": {
				"standardChoiceValueI18NModels": []
			}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchSharedDropDownList = function(code){
	var sql = "select distinct BIZDOMAIN from RBIZDOMAIN where SERV_PROV_CODE = ? AND STD_CHOICE_TYPE = 'ShareDropDown'";
	var params = [String(code)];
	
	var dList = conf.selectBySQL(sql, params);
	
	var result = [];
	
	for(var d = 0; d < dList.size(); d++){
		result.push(dList.get(d)[0]);
	}
	
	return result;
}

ConfigEngineAPI.createSharedDropDown = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.asi.SharedDropDownListModel";
	
	var subModels = {
			"sharedDropDownValueModels": {
				"standardChoiceValueI18NModels": []
			}
		};
	
	var searchObj = {"BIZDOMAIN": String(jsonInput[0]["BIZDOMAIN"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("Dropdowns", String(jsonInputOrg[0]["BIZDOMAIN"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

ConfigEngineAPI.searchSequence = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.common.SequenceModel";
	
	var searchObj = {"SEQ_NAME": String(code)};
	
	conf.subModels = {
			"sequenceIntervalModels": {}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchSequenceList = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.common.SequenceModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	conf.subModels = {
			"sequenceIntervalModels": {}
		};
	
	var seqList = conf.search(searchObj, asJson, ignoreSubModels, false, true);
	
	seqList = seqList.map(function (seq) {
		return seq["SEQ_NAME"];
	});
	
	return distinctList(seqList);
}

ConfigEngineAPI.createSequence = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
//	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.common.SequenceModel";
	
	var subModels = {
			"sequenceIntervalModels": {}
		};
	
	var searchObj = {"SEQ_NAME": String(jsonInput[0]["SEQ_NAME"])};
	
	var result = conf.createOrUpdate(searchObj, jsonInput, subModels, overrideExisting);
	
//	archive_GITHUB("Sequences", String(jsonInputOrg[0]["SEQ_NAME"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

ConfigEngineAPI.searchSequenceInterval = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.common.SequenceIntervalModel";
	
	var searchObj = {"SEQ_NAME": String(code)};
	
	conf.subModels = {
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createSequenceInterval = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.common.SequenceIntervalModel";
	
	var subModels = {
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {"SEQ_NAME": String(jsonInput[0]["SEQ_NAME"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("Sequence Interval", String(jsonInputOrg[0]["SEQ_NAME"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

ConfigEngineAPI.searchMask = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.common.MaskModel";
	
	var searchObj = {"SEQ_NAME": String(code)};
	
	conf.subModels = {
//			"sequenceModel": {
//				"sequenceIntervalModels": {}
//			}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createMask = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.common.MaskModel";
	
	var subModels = {
//			"sequenceModel": {
//				"sequenceIntervalModels": {}
//			}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {"SEQ_NAME": String(jsonInput[0]["SEQ_NAME"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("Masks", String(jsonInputOrg[0]["SEQ_NAME"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

ConfigEngineAPI.searchSmartChoice = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.cap.SmartChoiceModel";
	
	var searchObj = {"GROUP_CODE": String(code)};
	
	conf.subModels = {
			"smartChoiceOptions": {}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createSmartChoice = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.cap.SmartChoiceModel";
	
	var subModels = {
			"smartChoiceOptions": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {"GROUP_CODE": String(jsonInput[0]["GROUP_CODE"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("Intake Form", String(jsonInputOrg[0]["GROUP_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

ConfigEngineAPI.searchSmartChoiceOptions = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.cap.SmartChoiceOptionModel";
	
	var searchObj = {"GROUP_CODE": String(code)};
	
	conf.subModels = {

		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createSmartChoiceOptions = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.cap.SmartChoiceOptionModel";
	
	var subModels = {

		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {"GROUP_CODE": String(jsonInput[0]["GROUP_CODE"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("Smart Choice Options", String(jsonInputOrg[0]["GROUP_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

ConfigEngineAPI.searchPageFlow = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.pageflow.PageFlowModel";
	
	var searchObj = {"PF_GROUP_CODE": String(code)};
	
	conf.subModels = {
			"stepModels": {
				"pageModels": {
					"pageComponentModels": {
						"componentModel": {},
						"pageComponentI18NModels": {}
					},
					"pageI18NModels": {}
				},
				"stepI18NModels": {}
			}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createPageFlow = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.pageflow.PageFlowModel";
	
	var subModels = {
			"stepModels": {
				"pageModels": {
					"pageComponentModels": {
						"componentModel": {},
						"pageComponentI18NModels": {}
					},
					"pageI18NModels": {}
				},
				"stepI18NModels": {}
			}
		};
	
	var searchObj = {"PF_GROUP_CODE": String(jsonInput[0]["PF_GROUP_CODE"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);

	archive_GITHUB("PageFlow", String(jsonInputOrg[0]["PF_GROUP_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchInspectionGroupModel = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.inspection.InspectionTypeModel";
	
	var searchObj = {"INSP_CODE": String(code)};
	
	conf.subModels = {
			"inspectionRequiredCheckListModels": {},
			"inspectionTypeI18nModels": {},
			"refInspectionDisciplineModels": {},
			"xinspectionTypeCategoryModels": {}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchInspectionCodeList = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.inspection.InspectionTypeModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	conf.subModels = {
			"inspectionRequiredCheckListModels": {},
			"inspectionTypeI18nModels": {},
			"refInspectionDisciplineModels": {},
			"xinspectionTypeCategoryModels": {}
		};
	
	var lpList = conf.search(searchObj, asJson, ignoreSubModels, false, true);
	
	lpList = lpList.map(function (lp) {
		return lp["INSP_CODE"];
	});
	
	return distinctList(lpList);
	
}

ConfigEngineAPI.createInspectionGroupModel = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.inspection.InspectionTypeModel";
	
	var subModels = {
			"inspectionRequiredCheckListModels": {},
			"inspectionTypeI18nModels": {},
			"refInspectionDisciplineModels": {},
			"xinspectionTypeCategoryModels": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {"INSP_CODE": String(jsonInput[0]["INSP_CODE"])};
	
//	return conf.createOrUpdate(searchObj, jsonInput, subModels, overrideExisting);
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);

	archive_GITHUB("Inspection Group", String(jsonInputOrg[0]["INSP_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchInspectionResultGroupModel = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.inspection.InspectionResultGroupModel";
	
	var searchObj = {"INSP_RESULT_GROUP": String(code)};
	
	conf.subModels = {
			"inspResultGroupI18NModels": {
			}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchInspectionResultGroupList = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.inspection.InspectionResultGroupModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	conf.subModels = {
			"inspResultGroupI18NModels": {
			}
		};
	
	var lpList =  conf.search(searchObj, asJson, ignoreSubModels, false, true);
	
	lpList = lpList.map(function (lp) {
		return lp["INSP_RESULT_GROUP"];
	});
	
	return distinctList(lpList);
}

ConfigEngineAPI.createInspectionResultGroupModel = function(code, jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.inspection.InspectionResultGroupModel";
	
	var subModels = {
			"inspResultGroupI18NModels": {
			}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {"INSP_RESULT_GROUP": String(code)};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("Inspection Result Group", String(jsonInputOrg[0]["INSP_RESULT_GROUP"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

ConfigEngineAPI.searchInspectionCheckListGroupModel = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.inspection.GuideSheetGroupModel";
	
	var searchObj = {"GUIDE_GROUP": String(code)};
	
	conf.subModels = {
			"guideSheetGroupI18nModels": {}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchInspectionCheckListGroupList = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.inspection.GuideSheetGroupModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	conf.subModels = {
			"guideSheetGroupI18nModels": {}
		};
	
	var lpList =  conf.search(searchObj, asJson, ignoreSubModels, false, true);
	
	lpList = lpList.map(function (lp) {
		return lp["GUIDE_GROUP"];
	});
	
	return distinctList(lpList);
}

ConfigEngineAPI.createInspectionCheckListGroupModel = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	conf.className = "com.accela.orm.model.inspection.GuideSheetGroupModel";
	
	var subModels = {
			"guideSheetGroupI18nModels": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonMap = {};
	for(var item in jsonInput){
		if(jsonMap[ jsonInput[item]["GUIDE_GROUP"] ] ){
			jsonMap[ jsonInput[item]["GUIDE_GROUP"] ].push(jsonInput[item]);
		}else{
			jsonMap[ jsonInput[item]["GUIDE_GROUP"] ] = [jsonInput[item]];
		}
	}
	
	var resArr = [];
	
	for(var key in jsonMap){
		var searchObj = {"GUIDE_GROUP": String(key)};
		
		logDebug("searchObj: " + JSON.stringify(searchObj));
		
		var jsonInputOrg = JSON.parse(JSON.stringify(jsonMap[key]));//Clone Object
		
		try{
			resArr = resArr.concat(conf.create(searchObj, jsonMap[key], subModels, overrideExisting));
			
			archive_GITHUB("Inspection CheckList Group", String(key), jsonInputOrg, {"success": true}, overrideExisting);
		}catch(e){
			logDebug("...ERRR...");
			logDebug("searchObj: " + JSON.stringify({"GUIDE_TYPE": String(jsonMap[key][0]["GUIDE_TYPE"])}));
			logDebug("Error## " + e);
			logDebug("...ERRR...");
		}
	}
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };
	
	
	
	return result;
	
//	var searchObj = {"GUIDE_GROUP": String(jsonInput[0]["GUIDE_GROUP"])};
//	return conf.create(searchObj, jsonInput, subModels, overrideExisting);

}

ConfigEngineAPI.createInspectionCheckListGroupModel_BU = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.inspection.GuideSheetGroupModel";
	
	var subModels = {
			"guideSheetGroupI18nModels": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {"GUIDE_GROUP": String(jsonInput[0]["GUIDE_GROUP"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("Inspection CheckList Group_BU", String(jsonInputOrg[0]["GUIDE_GROUP"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

ConfigEngineAPI.searchInspectionCheckListStatusGroup = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.inspection.GuideSheetItemStatusGroupModel";
	
//	var searchObj = {"SERV_PROV_CODE": String(code)};
	var searchObj = {"GUIDE_ITEM_STATUS_GROUP": String(code)};
//	searchObj = {};
	
	conf.subModels = {
			"guideSheetItemStatusGroupI18NModels": {}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchInspectionCheckListStatusGroupList = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.inspection.GuideSheetItemStatusGroupModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
//	searchObj = {};
	
	conf.subModels = {
			"guideSheetItemStatusGroupI18NModels": {}
		};
	
	var lpList =  conf.search(searchObj, true, ignoreSubModels, false, true, true);
	
	lpList = lpList.map(function (lp) {
		return lp["GUIDE_ITEM_STATUS_GROUP"];
	});
	
	return distinctList(lpList);
}

ConfigEngineAPI.createInspectionCheckListStatusGroup = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	conf.className = "com.accela.orm.model.inspection.GuideSheetItemStatusGroupModel";
	
	var subModels = {
			"guideSheetItemStatusGroupI18NModels": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonMap = {};
	for(var item in jsonInput){
		if(jsonMap[ jsonInput[item]["GUIDE_ITEM_STATUS_GROUP"] ] ){
			jsonMap[ jsonInput[item]["GUIDE_ITEM_STATUS_GROUP"] ].push(jsonInput[item]);
		}else{
			jsonMap[ jsonInput[item]["GUIDE_ITEM_STATUS_GROUP"] ] = [jsonInput[item]];
		}
	}
	
	var resArr = [];
	
	for(var key in jsonMap){
		var searchObj = {"GUIDE_ITEM_STATUS_GROUP": String(key)};
		
		logDebug("searchObj: " + JSON.stringify(searchObj));
		
		var jsonInputOrg = JSON.parse(JSON.stringify(jsonMap[key]));//Clone Object
		
		try{
			resArr = resArr.concat(conf.create(searchObj, jsonMap[key], subModels, overrideExisting));
			
			archive_GITHUB("Inspection Checklist Status Gro", String(key), jsonInputOrg, {"success": true}, overrideExisting);
		}catch(e){
			logDebug("...ERRR...");
			logDebug("searchObj: " + JSON.stringify({"GUIDE_ITEM_STATUS_GROUP": String(jsonMap[key][0]["GUIDE_ITEM_STATUS_GROUP"])}));
			logDebug("Error## " + e);
			logDebug("...ERRR...");
		}
	}
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };
	return result;
	
//	var searchObj = {"GUIDE_ITEM_STATUS_GROUP": String(jsonInput[0]["GUIDE_ITEM_STATUS_GROUP"])};
//	aa.print('String(jsonInput[0]["GUIDE_ITEM_STATUS_GROUP"]): ' + String(jsonInput[0]["GUIDE_ITEM_STATUS_GROUP"]));
//	
//	return conf.create(searchObj, jsonInput, subModels, overrideExisting);

}

ConfigEngineAPI.searchGuideSheetModel = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.inspection.GuideSheetModel";
	
	var searchObj = {"GUIDE_TYPE": String(code)};
	
	conf.subModels = {
			"guideSheetItemModels": {
				"guideSheetItemI18NModels": {}
			}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createGuideSheetModel = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.inspection.GuideSheetModel";
	
	var subModels = {
			"guideSheetItemModels": {
				"guideSheetItemI18NModels": {}
			}
		};
	
	var searchObj = {"GUIDE_TYPE": String(jsonInput[0]["GUIDE_TYPE"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);

	archive_GITHUB("GuideSheetModel", String(jsonInputOrg[0]["GUIDE_TYPE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchInspectionCheckListItemModel = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.inspection.GuideSheetItemModel";
	
	var searchObj = {"GUIDE_TYPE": String(code)};
	code = code.toUpperCase();
	if(code == 'I' || code == 'INACTIVE'){
		searchObj = {"REC_STATUS": 'I'};
	}
	
	conf.subModels = {
			"guideSheetItemI18NModels": {}
		};
	
	if(code == 'I' || code == 'INACTIVE'){
		return conf.search(searchObj, asJson, ignoreSubModels, false, true, false);
	}else{
		return conf.search(searchObj, asJson, ignoreSubModels, false, true);
	}
}

ConfigEngineAPI.searchInspectionCheckListItemModelList = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.inspection.GuideSheetItemModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	conf.subModels = {
			"guideSheetItemI18NModels": {}
		};
	
	var lpList =  conf.search(searchObj, asJson, ignoreSubModels, false, true);
	
	lpList = lpList.map(function (lp) {
		return lp["GUIDE_TYPE"];
	});
	
	return distinctList(lpList);
}

ConfigEngineAPI.searchInspectionCheckListItemList = function(code, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchInspectionCheckListItemList............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.inspection.GuideSheetItemModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	conf.subModels = {
			"guideSheetItemI18NModels": {}
		};
	
	var lpList =  conf.search(searchObj, true, ignoreSubModels, false, true, true);
	
	lpList = lpList.map(function (lp) {
		return lp["GUIDE_TYPE"];
	});

	return distinctList(lpList);
}

ConfigEngineAPI.createInspectionCheckListItemModel = function(jsonInput, overrideExisting){
	logDebug('createInspectionCheckListItemModel..................................');
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonMap = {};
	for(var item in jsonInput){
		if(jsonMap[ jsonInput[item]["GUIDE_TYPE"] ] ){
			jsonMap[ jsonInput[item]["GUIDE_TYPE"] ].push(jsonInput[item]);
		}else{
			jsonMap[ jsonInput[item]["GUIDE_TYPE"] ] = [jsonInput[item]];
		}
	}
	
	
	for(var key in jsonMap){
		
		var guideSheet = ConfigEngineAPI.searchGuideSheetModel(jsonMap[key][0]["GUIDE_TYPE"]);
		if(guideSheet.length < 1){
			var guideSheetJson = {"GUIDE_DESC": null, "GUIDE_STATUS": null, "GUIDE_TYPE": jsonMap[key][0]["GUIDE_TYPE"], "SERV_PROV_CODE": jsonMap[key][0]["SERV_PROV_CODE"], "guideSheetItemModels": []};
			
			ConfigEngineAPI.createGuideSheetModel(guideSheetJson, true);
		}
	}
	
	conf.className = "com.accela.orm.model.inspection.GuideSheetItemModel";
	
	var subModels = {
			"guideSheetItemI18NModels": {}
		};
	
	var resArr = [];
	for(var key in jsonMap){
		var searchObj = {"GUIDE_TYPE": String(key)};
		
		var jsonInputOrg = JSON.parse(JSON.stringify(jsonMap[key]));//Clone Object
		try{
			resArr = resArr.concat(conf.create(searchObj, jsonMap[key], subModels, overrideExisting));
			archive_GITHUB("Inspection CheckList", String(key), jsonInputOrg, {"success": true}, overrideExisting);
		}catch(e){
			logDebug("...ERRR...");
			logDebug("searchObj: " + JSON.stringify({"GUIDE_TYPE": String(jsonMap[key][0]["GUIDE_TYPE"])}));
			logDebug("Error## " + e);
			logDebug("...ERRR...");
		}
	}
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false };
	return result;
	
//	var searchObj = {"GUIDE_TYPE": String(jsonInput[0]["GUIDE_TYPE"])};
//	return conf.create(searchObj, jsonInput, subModels, overrideExisting);

}

ConfigEngineAPI.searchNotificationTemplate = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.communication.NotificationTemplateModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	conf.subModels = {
			"emailTemplateModel": {
				"emailTemplateI18NModels": {}
			},
			"notificationTemplateI18NModels": {},
			"smsTemplateModel": {
				"sMSTemplateI18NModels": {}
			}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createNotificationTemplate = function(jsonInput, overrideExisting){
	logDebug("createNotificationTemplate.........................");
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	logDebug('overrideExisting: ' + overrideExisting);
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	if(!overrideExisting){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	conf.className = "com.accela.orm.model.communication.NotificationTemplateModel";
	
	var subModels = {
			"emailTemplateModel": {
				"emailTemplateI18NModels": {}
			},
			"notificationTemplateI18NModels": {},
			"smsTemplateModel": {
				"sMSTemplateI18NModels": {}
			}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var resArr = [];
	
	var maxResId = conf.getMaxRES_ID('RNOTIFICATION_TEMPLATE_SEQ');
	for(var jsonItem in jsonInput){
		jsonInput[jsonItem]['RES_ID'] = maxResId;

		jsonInput[jsonItem]['emailTemplateModel']['RES_ID'] = maxResId;
		for(var emailTemplateModel in jsonInput[jsonItem]['emailTemplateModel']['emailTemplateI18NModels']){
			jsonInput[jsonItem]['emailTemplateModel']['emailTemplateI18NModels'][emailTemplateModel]['RES_ID'] = maxResId;
		}
		
		for(var notificationTemplateI18NModel in jsonInput[jsonItem]['notificationTemplateI18NModels']){
			jsonInput[jsonItem]['notificationTemplateI18NModels'][notificationTemplateI18NModel]['RES_ID'] = maxResId;
		}
		
		jsonInput[jsonItem]['smsTemplateModel']['RES_ID'] = maxResId;
		for(var smsTemplateModel in jsonInput[jsonItem]['smsTemplateModel']['sMSTemplateI18NModels']){
			jsonInput[jsonItem]['smsTemplateModel']['sMSTemplateI18NModels'][smsTemplateModel]['RES_ID'] = maxResId;
		}
		
		var searchObj = {"SERV_PROV_CODE": String(jsonInput[jsonItem]["SERV_PROV_CODE"]), "TEMPLATE_NAME": String(jsonInput[jsonItem]["TEMPLATE_NAME"])};
		
		resArr = resArr.concat(conf.create(searchObj, [jsonInput[jsonItem]], subModels, overrideExisting));
		
		maxResId = maxResId + 1;
	}
	
//	var sysData = ConfigEngineAPI.searchNotificationTemplate(String(jsonInput[0]["SERV_PROV_CODE"]), false);
//	
//	logDebug('jsonInput After Replacing the RES_ID: \n' + JSON.stringify(jsonInput));
//	
//	var searchObj = {"SERV_PROV_CODE": String(jsonInput[0]["SERV_PROV_CODE"])};
//	
//	var createdItems = getCreatedItems(['TEMPLATE_NAME'], sysData, jsonInput);
//	
//	logDebug("createdItems:: " + JSON.stringify(stringifyJSType(createdItems)));
//	logDebug("createdItems Length:: " + createdItems.length);
//	
//	
//	var updatedItems = getUpdatedItems(['DESCRIPTION'], sysData, jsonInput, {});
//	
//	logDebug("updatedItems:: " + JSON.stringify(stringifyJSType(updatedItems)));
//	logDebug("updatedItems.length:: " + updatedItems.length);
	
//	return conf.create(searchObj, jsonInput, subModels, overrideExisting);
//	//return conf.createOrUpdate(searchObj, jsonInput, subModels, overrideExisting);
	
	var result = resArr.filter(function (r) { return r.exists == true }).length > 0 ? { 'success': true, 'exists': true } : { 'success': true, 'exists': false }
	
	archive_GITHUB("Notifications", String(jsonInputOrg[0]["SERV_PROV_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

ConfigEngineAPI.searchDrillDownList = function(code){
	
	conf.className = "com.accela.orm.model.asi.DrillDownModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code)};
	
	conf.subModels = {
			"drillDownSeriesModels": {}
		};
	
	
	var lpList = conf.search(searchObj, asJson, false, false, true);
	
	lpList = lpList.map(function (lp) {
		return lp["DRLLD_NAME"];
	});

	return distinctList(lpList);
}

ConfigEngineAPI.searchDrillDownModel = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.DrillDownModel";
	
	var searchObj = {"DRLLD_NAME": String(code)};
	
	conf.subModels = {
//			"drillDownRelationModel": {},
			"drillDownSeriesModels": {
				"zipDrillDownValueMapModels": {
					"childValueStandardChoiceModel": {
						"standardChoiceValueI18NModels": {}
					},
					"parentValueStandardChoiceModel": {
						"standardChoiceValueI18NModels": {}
					}
				},
				"childSharedDropDownModel": {},
				"parentSharedDropDownModel": {}
			}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createDrillDownModel = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.asi.DrillDownModel";
	
	var subModels = {
			//"drillDownRelationModel": {},
			"drillDownSeriesModels": {
//				"zipDrillDownValueMapModels": {
//					"childValueStandardChoiceModel": {
//						"standardChoiceValueI18NModels": {}
//					},
//					"parentValueStandardChoiceModel": {
//						"standardChoiceValueI18NModels": {}
//					}
//				},
				"childSharedDropDownModel": {},
				"parentSharedDropDownModel": {}
			}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {"DRLLD_NAME": String(jsonInput[0]["DRLLD_NAME"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
//	archive_GITHUB("Drilldown", String(jsonInputOrg[0]["DRLLD_NAME"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

ConfigEngineAPI.deleteDrillDownMapping = function (searchRes) {
	ConfigEngineAPI.Delete(searchRes, 'com.accela.orm.model.asi.DrillDownValueMapModel');
}

ConfigEngineAPI.deleteDrillDownSeries = function (searchRes) {
	ConfigEngineAPI.Delete(searchRes, 'com.accela.orm.model.asi.DrillDownSeriesModel');
}

ConfigEngineAPI.searchDrillDownMapping = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.DrillDownValueMapModel";
	
	var searchObj = {"DRLLD_ID": String(code)};
	
	conf.subModels = {
			"childValueStandardChoiceModel": {
				"standardChoiceValueI18NModels": {}
			},
			"parentValueStandardChoiceModel": {
				"standardChoiceValueI18NModels": {}
			}
		};
	
//	"sharedDropDownValueModels": {
//		"standardChoiceValueI18NModels": []
//	}
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchDrillDownMapping_BY_DDL_P = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.DrillDownValueMapModel";
	
//	var searchObj = {"parentValueStandardChoiceModel": {"BIZDOMAIN": String(code)}};
	var searchObj = {"PARENT_VAL_ID": String(code)};
	
	conf.subModels = {
			"childValueStandardChoiceModel": {
				"standardChoiceValueI18NModels": {}
			},
			"parentValueStandardChoiceModel": {
				"standardChoiceValueI18NModels": {}
			}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchDrillDownMapping_BY_DDL_C = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.DrillDownValueMapModel";
	
//	var searchObj = {"childValueStandardChoiceModel": {"BIZDOMAIN": String(code)}};
	var searchObj = {"CHILD_VAL_ID": String(code)};
	
	conf.subModels = {
			"childValueStandardChoiceModel": {
				"standardChoiceValueI18NModels": {}
			},
			"parentValueStandardChoiceModel": {
				"standardChoiceValueI18NModels": {}
			}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchdrillDownSeriesModelsByID = function(code, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.DrillDownSeriesModel";
	
	var searchObj = {"DRLLD_SERIES_ID": String(code)};
	
	conf.subModels = {
			"childSharedDropDownModel": {},
			"parentSharedDropDownModel": {}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchdrillDownSeriesModels = function(code, isParent, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.DrillDownSeriesModel";
	
	var searchObj;
	if(isParent){
		searchObj = {"parentSharedDropDownModel": {"BIZDOMAIN": String(code)}};
	}else{
		searchObj = {"childSharedDropDownModel": {"BIZDOMAIN": String(code)}};
	}
	
	conf.subModels = {
			"childSharedDropDownModel": {},
			"parentSharedDropDownModel": {}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchdrillDownSeriesModelsByBoth = function(parent, child, ignoreSubModels){
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.DrillDownSeriesModel";
	
	var searchObj = {"PARENT_COL_NAME": String(parent), "CHILD_COL_NAME": String(child)};
	
	conf.subModels = {
			"zipDrillDownValueMapModels": {
				"childValueStandardChoiceModel": {},
				"parentValueStandardChoiceModel": {}
			}
		};
	
	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createdrillDownSeriesModels = function(jsonInput, overrideExisting, searchObj){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.asi.DrillDownSeriesModel";
	
	var subModels = {
			"childSharedDropDownModel": {},
			"parentSharedDropDownModel": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);

//	archive_GITHUB("DrillDown Series Models", String(jsonInputOrg[0]["ASITAB_GRP_NAM"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.createDrillDownRelationModel = function(jsonInput, overrideExisting, searchObj){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.asi.DrillDownRelationModel";
	
	var subModels = {};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);

//	archive_GITHUB("DrillDown Relation Model", String(jsonInputOrg[0]["DRLLD_ID"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}


ConfigEngineAPI.createDrillDownMapping = function(jsonInput, overrideExisting, skipDelete){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
//	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.asi.DrillDownValueMapModel";
	
	var subModels = {
//			"childValueStandardChoiceModel": {},
//			"parentValueStandardChoiceModel": {}
		};
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var searchObj = {"DRLLD_ID": String(jsonInput[0]["DRLLD_ID"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting, skipDelete);
	
//	archive_GITHUB("Drilldown Mapping", String(jsonInputOrg[0]["DRLLD_ID"]), jsonInputOrg, result, overrideExisting);
	
	return result;

}

ConfigEngineAPI.searchTimeAccountGroup = function(code, ignoreSubModels) {
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;

	conf.className = "com.accela.orm.model.timeaccount.TimeGroupModel";

	var searchObj = {
		"TIME_GROUP_NAME" : String(code)
	};

	conf.subModels = {
		"timeGroupI18nModels" : {
			"ISLANG" : true
		},
		"xtimeGroupTypeModels":{}
	};

	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createTimeAccountGroup = function(jsonInput, overrideExisting) {
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object

	conf.className = "com.accela.orm.model.timeaccount.TimeGroupModel";

	var subModels = {
		"timeGroupI18nModels" : {
			"ISLANG" : true
		},
		"timeGroupSecurityModels" : {}
	};

	if (!Array.isArray(jsonInput)) {
		jsonInput = [ jsonInput ];
	}

	var searchObj = {
		"TIME_GROUP_NAME" : String(jsonInput[0]["TIME_GROUP_NAME"])
	};

	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("Time Account Group", String(jsonInputOrg[0]["TIME_GROUP_NAME"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchSecurityModel = function(policyName, seq, ignoreSubModels) {
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;

	conf.className = "com.accela.orm.model.timeaccounting.TimeGroupSecurityModel";

	var searchObj = {
		"POLICY_NAME" : String(policyName),
		"LEVEL_DATA" : String(seq)
	};

	conf.subModels = {};

	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchTimeTypeModel = function(name, seq, ignoreSubModels) {
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;

	conf.className = "com.accela.orm.model.timeaccounting.TimeTypeModel";

	var searchObj = {
		"TIME_TYPE_NAME" : name ? String(name) : null,
		"TIME_TYPE_SEQ" : seq ? String(seq) : null
	};

	conf.subModels = {
		"timeTypeI18NModels" : {
			"ISLANG" : true
		}
	};

	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

//ConfigEngineAPI.searchWorkflowModel = function(code, ignoreSubModels) {
//	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
//
//	conf.className = "com.accela.orm.model.workflow.WorkflowModel";
//
//	var searchObj = {
//		"SPROCESS_GROUP_CODE" : String(code)
//	};
//
//	conf.subModels = {};
//
//	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
//}

ConfigEngineAPI.searchWorkflowProcessModel = function(code, ignoreSubModels) {
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;

	conf.className = "com.accela.orm.model.workflow.ProcessModel";

	var searchObj = {
		"R1_PROCESS_CODE" : String(code)
	};

	conf.subModels = {};

	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchWorkflowTaskItemModel= function(code, ignoreSubModels) {
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;

	conf.className = "com.accela.orm.model.workflow.RefTaskItemModel";

	var searchObj = {
		"R1_PROCESS_CODE" : String(code)
	};

	conf.subModels = {};

	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.connectAppTypeWithPF = function(service_providor_code, pf, group, type, sub_type, category){
	logDebug('connectAppTypeWithPF..................');
	var sql = "update R3APPTYP set R1_SMARTCHOICE_CODE_FOR_ACA = '" + pf + "' where SERV_PROV_CODE = '" + service_providor_code + "' and R1_PER_GROUP = '" + group + "' and R1_PER_TYPE = '" + type + "' and R1_PER_SUB_TYPE = '" + sub_type + "' and R1_PER_CATEGORY = '" + category + "'";
	logDebug('sql: \n' + sql);
	var params = [];
	conf.updateBySQL(sql, params);
}

ConfigEngineAPI.searchCapTypeCitizenAccessModel = function(code, ignoreSubModels) {
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;

	conf.className = "com.accela.orm.model.cap.CapTypeCitizenAccessModel";

	var searchObj = {
		"R1_SMARTCHOICE_CODE_FOR_ACA" : String(code)
	};

	conf.subModels = {
			"pageFlowModel": {
				"stepModels": {
					"pageModels": {
						"pageComponentModels": {
						},
						"pageI18NModels": {}
					},
					"stepI18NModels": {}
				}
			}
	};

	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
	
	var sql = "update R3APPTYP set R1_SMARTCHOICE_CODE_FOR_ACA = ? where SERV_PROV_CODE = ? and R1_PER_GROUP = ? and R1_PER_TYPE = ? and R1_PER_SUB_TYPE = ? and R1_PER_CATEGORY = ?;";
	var params = ['HASH_PF2', 'ADMA', 'Building', 'Certificates', 'Workbook', 'HASH'];
	conf.updateBySQL(sql, params);
}

ConfigEngineAPI.searchPageFlowModel = function(code, ignoreSubModels) {
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;

	conf.className = "com.accela.orm.model.pageflow.PageFlowModel";

	var searchObj = {
		"PF_GROUP_CODE" : String(code)
	};

	conf.subModels = {
			"stepModels": {
				"pageModels": {
					"pageComponentModels": {
//						"componentModel": {},
//						"entityPermissions": {},
//						"pageComponentI18NModels": {}
					},
					"pageI18NModels": {}
				},
				"stepI18NModels": {}
			}
	};

	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.createPageFlowModel = function(jsonInput, overrideExisting){
	overrideExisting = overrideExisting == undefined ? false : overrideExisting;
	
	if (!Array.isArray(jsonInput)) {
		jsonInput = [jsonInput];
	}
	
	var jsonInputOrg = JSON.parse(JSON.stringify(jsonInput));//Clone Object
	
	conf.className = "com.accela.orm.model.pageflow.PageFlowModel";
	
	var subModels = {
			"stepModels": {
				"pageModels": {
					"pageComponentModels": {
//						"componentModel": {},
//						"entityPermissions": {},
//						"pageComponentI18NModels": {}
					},
					"pageI18NModels": {}
				},
				"stepI18NModels": {}
			}
		};
	
	var searchObj = {"PF_GROUP_CODE":String(jsonInput[0]["PF_GROUP_CODE"])};
	
	var result = conf.create(searchObj, jsonInput, subModels, overrideExisting);
	
	archive_GITHUB("PageFlow", String(jsonInputOrg[0]["PF_GROUP_CODE"]), jsonInputOrg, result, overrideExisting);
	
	return result;
}

ConfigEngineAPI.searchPageFlowComponents = function(code, ignoreSubModels) {
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;

	conf.className = "com.accela.orm.model.pageflow.ComponentModel";

	var searchObj = {
		"PAGE_FLOW_TYPE" : "PERMIT"
	};

	conf.subModels = {
			"COMPONENT_ID":"",
			"COMPONENT_NAME":""
	};

	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchStandardChoiceValueModel = function(code, ignoreSubModels) {
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;

	conf.className = "com.accela.orm.model.common.StandardChoiceValueModel";

	var searchObj = {
		"BIZDOMAIN" : String(code)
	};

	conf.subModels = {};

	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.loadUserConfigurations = function(code, user_name){
	logDebug('loadUserConfigurations::user_name: ' + user_name);
	
	var result = {};
	
	var hide = [];
	hide.push('SETTINGS_LISTS');
	//hide.push('Sequences');
	//hide.push('Fees');
	//hide.push('Notifications');
	
	result.hide = hide;
	
	var preventUpdates = [];
	//preventUpdates.push('Application Status');
	
	result.preventUpdates = preventUpdates;
	
	result.secondLanguage = 'Arabic'; 
	
	result.supportedLanguages = ConfigEngineAPI.searchSupportedLanguages(code);
	
	result.fids = ConfigEngineAPI.loadFIDs();
	
	result.pf_components = ConfigEngineAPI.searchPageFlowComponents('', false);
	
//	result.asis = ConfigEngineAPI.searchASIGroups(code, false);
//	result.asits = ConfigEngineAPI.searchASITGroups(code, false);
	
	return result;
}

ConfigEngineAPI.loadASI_ASIT_Configurations = function(code){
	logDebug('loadASI_ASIT_Configurations::code: ' + code);
	
	var result = {};
	
	result.asis = ConfigEngineAPI.searchASIGroups(code, false);
	result.asits = ConfigEngineAPI.searchASITGroups(code, false);
	
	return result;
}

ConfigEngineAPI.searchSupportedLanguages = function(code){
	var obj = ConfigEngine.getInstance("com.accela.webservice.service.I18nSettingsWebService");
	
	var primarySettings = obj.getI18nPrimarySettings(code);
	
	var languages = primarySettings.getSupportLanguages();
	aa.print('languages::::::: ' + languages);
	
	var result = [];
	
	for(var c = languages.length - 1; c >= 0; c--){
//	for(c in languages){
		aa.print("local: " + languages[c].getLocale());
		aa.print("local lable: " + languages[c].getLocaleLabel());
		var lang = {};
		lang.local = languages[c].getLocale();
		if(languages[c].getLocale().indexOf("ar_") != -1 ){
			lang.lable = "Arabic";
		}else{
			lang.lable = languages[c].getLocaleLabel().split(" ")[0];
		}
		result.push(lang);
	}
	
	return result;
}

ConfigEngineAPI.loadFIDs = function(){
	try {
		var fidBiz = com.accela.aa.emse.dom.service.CachedService.getInstance().getPeopleService()
		var serverConstant = com.accela.aa.emse.dom.service.CachedService.getInstance().getServerConstantService()
		var modules = serverConstant.getModulesByAgency(aa.getServiceProviderCode());
		var retObj = {};
		var ret = [];
		for (var i = 0; i < modules.size(); i++) {
			var moduleName = modules.get(i);

			var arrFid = fidBiz.getFIDList(aa.getServiceProviderCode(), aa.getAuditID(), moduleName);

			for (var x = 0; x < arrFid.size(); x++) {
				var fid = arrFid.get(x);
				var fidObj = {
					code : String(fid.getFIDCode()),
					name : String(fid.getFIDName()),
					fullAccess : String(fid.isFullAccess()),
					readOnly : String(fid.isReadOnly()),
				}
				if (!retObj[fidObj.code]) {
					ret.push(fidObj);
					retObj[fidObj.code] = fidObj.code;
				}
			}
		}
		aa.print(JSON.stringify(ret));
	} catch (e) {
		aa.print("ERROR:" + e);
	}
	
	return ret;
}

ConfigEngineAPI.searchWorkflowModel = function(code, ignoreSubModels) {
	eval(getScriptText("INCLUDE_CONFIG_WF"));
	
	return getWorkflowDetals(code);
}

ConfigEngineAPI.createWorkFlowModel = function(serv_prov_code, json, wfCode, flowStyle, override) {
	logDebug('ConfigEngineAPI.createWorkFlowModel............');
	override = override == undefined || override == 'False' ? false : override;
	logDebug('ConfigEngineAPI:createWorkFlowModel:override: ' + override);
	
	var jsonInputOrg = JSON.parse(JSON.stringify(json));//Clone Object
	
	if(!override){
		logDebug('Returning: {"success": false, "exists": true}');
		return {
			"success": false,
			"exists": true
		};
	}
	
	eval(getScriptText("INCLUDE_CONFIG_WF"));
	
	var departmentList = ConfigEngineAPI.searchDepartmentListWithLevels(serv_prov_code, true);
	
	var supportedLanguages = ConfigEngineAPI.searchSupportedLanguages('ADMA');
	var secondLang = null;
	if(supportedLanguages != null && supportedLanguages != undefined && supportedLanguages.length > 1){
		secondLang = supportedLanguages[supportedLanguages.length - 1]["local"];
		logDebug("secondLang: " + secondLang);
	}else{
		logDebug("One Language.............");
	}
	
	var result = createUpdateWorkflow(departmentList, json, wfCode, flowStyle, override, secondLang);
	logDebug('ConfigEngineAPI.createWorkFlowModel:result: ' + JSON.stringify(result));
	
	archive_GITHUB("Workflow", wfCode, jsonInputOrg, result, override);
	
	return result;
}

ConfigEngineAPI.searchWorkflowTaskStatusModel = function(code, ignoreSubModels) {
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;

	conf.className = "com.accela.orm.model.sprocess.R3statypModel";

	var searchObj = {
		"R3_PROCESS_CODE" : String(code)
	};

	conf.subModels = {};

	return conf.search(searchObj, asJson, ignoreSubModels, false, true);
}

ConfigEngineAPI.searchApplicationStatusList = function(application_status_group, ignoreSubModels){
	logDebug('ConfigEngineAPI.searchApplicationStatusList............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.statusgroup.AppStatusGroupModel";
	
	var searchObj = {"APP_STATUS_GROUP_CODE": String(application_status_group)};
	
	conf.subModels = {
		};
	
	var lpList =  conf.search(searchObj, true, ignoreSubModels, false, true, true);
	
	lpList = lpList.map(function (lp) {
		return lp["STATUS"];
	});


	return distinctList(lpList);
}


ConfigEngineAPI.searchTSIList = function(code, ignoreSubModels){
	aa.print('ConfigEngineAPI.searchTSIList............');
	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
	
	conf.className = "com.accela.orm.model.asi.RefAppSpecInfoFieldModel";
	
	var searchObj = {"SERV_PROV_CODE": String(code), "R1_CHECKBOX_GROUP": "WORKFLOW TASK"};
	
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
	
	var lpList = conf.search(searchObj, asJson, ignoreSubModels, false, true);
	
	lpList = lpList.map(function (lp) {
		return ""+lp["R1_CHECKBOX_CODE"];
	});
	
	return distinctList(lpList);
}


ConfigEngineAPI.searchDepartmentList = function (code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchDepartmentList............');
//	ignoreSubModels = ignoreSubModels == undefined ? false : ignoreSubModels;
//	
//	conf.className = "com.accela.orm.model.user.DepartMentTypeModel";
//	
//	var searchObj = {"SERV_PROV_CODE": String(code)};
//	
//	conf.subModels = {
//			"bureauModel": {},
//			"divisionModel": {},
//			"dpttyI18NModels": {},
//			"groupModel": {},
//			"officeModel": {},
//			"organizationAgencyModel": {
//				"agencyI18NModels": {},
//				"auditModel": {}
//			},
//			"sectionModel": {},
//			"auditModel": {}
//	};
//	
//	var lpList =  conf.search(searchObj, true, ignoreSubModels, true, true);
//	
//	lpList = lpList.map(function (lp) {
//		return ""+lp["R3_DEPTNAME"];
//	});
	
	var sql = "select distinct R3_DEPTNAME FROM G3DPTTYP where SERV_PROV_CODE = ? and R3_DEPTNAME is not null and R3_DEPTNAME != ''";
	var params = [String(code)];
	
	var dList = conf.selectBySQL(sql, params);

	var result = [];
	
	for(var d = 0; d < dList.size(); d++){
		result.push(dList.get(d)[0]);
	}
	
	return result;
}

ConfigEngineAPI.searchDepartmentListFlow = function (code, process_code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchDepartmentList............');
	
	var sql = "select R3_AGENCY_CODE, R3_BUREAU_CODE, R3_DIVISION_CODE, R3_SECTION_CODE, R3_GROUP_CODE, R3_OFFICE_CODE, R3_DEPTNAME FROM G3DPTTYP where SERV_PROV_CODE = ? ";
	
	if(!isEmpty(process_code) && process_code != '0' ){
		var sqlAmmend = '';
		eval(getScriptText("INCLUDE_CONFIG_WF"));
		var workflow = getWorkflowDetals(process_code);
		for(var w in workflow){
			if(!isEmpty(sqlAmmend)){
				sqlAmmend = sqlAmmend + ","
			}
			sqlAmmend += "'" + workflow[w]["Department"] + "'";
		}
		
		sql = sql + ' and R3_DEPTNAME in (' + sqlAmmend + ")";
	}
	
	
	
	var params = [String(code)];
	
	var dList = conf.selectBySQL(sql, params);

	var result = [];
	
	for(var d = 0; d < dList.size(); d++){
		result.push([dList.get(d)[0],dList.get(d)[1],dList.get(d)[2],dList.get(d)[3],dList.get(d)[4],dList.get(d)[5],dList.get(d)[6]]);
	}
	
	return result;
}

ConfigEngineAPI.searchDepartmentListWithLevels = function (code, ignoreSubModels) {
	logDebug('ConfigEngineAPI.searchDepartmentListWithLevels............');
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
	
	var finalList = {};
	
	var lpList =  conf.search(searchObj, true, ignoreSubModels, true, true);
	
	for(var counter in lpList){
		finalList[""+lpList[counter]["R3_DEPTNAME"]] = ""+lpList[counter]["R3_DEPT_KEY"];
	}
	
	return finalList;
}

//function archive_GITHUB(){
//	java.lang.System.out.println("archive_GITHUB..........................");
//}


//var json = [];

//var result = ConfigEngineAPI.loadUserConfigurations('ADMA');
//var result = ConfigEngineAPI.searchASI('HASH_ASI', false);
//var result = ConfigEngineAPI.searchASIT('HASH_ASIT', false);
//var result = ConfigEngineAPI.loadASI_ASIT_Configurations('STANDARDTEST');
//var result = ConfigEngineAPI.searchASIGroups('ADMA', false);
//var result = ConfigEngineAPI.searchASI('HASH_ASI3', false);
//var result = ConfigEngineAPI.searchASISubGroup('HASH_ASI3', 'APP3INFO3', false);
//var result = ConfigEngineAPI.searchWorkflowModel('HASH_PROCESS', true);
//var result = ConfigEngineAPI.searchWorkflowProcessModel('HASH_PROCESS', true);
//var result = ConfigEngineAPI.searchWorkflowTaskItemModel('HASH_PROCESS', true);
//var result = ConfigEngineAPI.searchWorkflowTaskStatusModel('HASH_PROCESS', true);
//var result = ConfigEngineAPI.searchPageFlowModel('HASH_PF2', true);
//var result = ConfigEngineAPI.searchApplicationType('Building/Certificates/Workbook/HASH', false);
//var result = ConfigEngineAPI.searchCapTypeCitizenAccessModel('HASH_PF2', true);
//var result = ConfigEngineAPI.searchPageFlowComponents('', false);
//var result = ConfigEngineAPI.loadASI_ASIT_Configurations('ADMA'); 
//var result = ConfigEngineAPI.searchSupportedLanguages('ADMA');
//var secondLang = result[result.length - 1]["local"];
//aa.print('secondLangwww: ' + secondLang);
//var result = ConfigEngineAPI.searchSharedDropDownValues();
//var result = ConfigEngineAPI.searchSharedDropDownList('ADMA', false);
//var result = ConfigEngineAPI.searchApplicationStatusGroup('HASH', false);
//var result = ConfigEngineAPI.searchApplicationStatusList('HASH', false);
//var result = ConfigEngineAPI.searchTSIList('ADMA', false);
//var result = ConfigEngineAPI.searchDepartmentListWithLevels('ADMA', false);
//var result = ConfigEngineAPI.searchDepartmentListFlow('ADMA', false);
//var result = ConfigEngineAPI.searchDepartmentList('ADMA', false);
//var result = ConfigEngineAPI.searchInspectionCodeList('ADMA', false);
//var result = ConfigEngineAPI.searchInspectionCheckListItemList('ADMA', false);
//var result = ConfigEngineAPI.searchInspectionCheckListStatusGroup('ACUD', false);
//var result = ConfigEngineAPI.searchInspectionCheckListStatusGroupList('ADMA', false);
//var result = ConfigEngineAPI.searchInspectionResultGroupList('ADMA', false);
//var result = ConfigEngineAPI.searchInspectionCheckListGroupList('ADMA', false);
//var result = ConfigEngineAPI.searchInspectionCheckListGroupModel('HASH_CH', false);
//var result = ConfigEngineAPI.searchInspectionGroupModel('HASH3', false);
//var result = ConfigEngineAPI.searchInspectionCheckListItemModelList('ADMA', false);
//var result = ConfigEngineAPI.searchInspectionCheckListItemModel('20719836', true);
//var result = ConfigEngineAPI.searchInspectionCheckListItemModel('INACTIVE', true);
//var result =  ConfigEngineAPI.searchSequenceList('ADMA', false);
//var result =  ConfigEngineAPI.searchFeesSchedule('HASH', true);
//var result =  ConfigEngineAPI.searchNotificationTemplate('ADMA', false);
//var result =  ConfigEngineAPI.createNotificationTemplate(json, true);
//var result =  ConfigEngineAPI.searchGuideSheetModel('Building');
//var result =  ConfigEngineAPI.searchDrillDownList('ADMA');

//aa.print('Result: \n' + result);
//aa.print('Result: \n' + JSON.stringify(result));
//aa.print('Result: \n' + JSON.stringify(stringifyJSType(result)));
// pm(result, true);
// pm(result, false);
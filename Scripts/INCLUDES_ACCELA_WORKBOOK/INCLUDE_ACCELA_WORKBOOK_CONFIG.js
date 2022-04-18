/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_ACCELA_WORKBOOK_CONFIG.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MHASHAIKEH
| Created at	: 05/07/2020 10:47:21
|
/------------------------------------------------------------------------------------------------------*/
/*-USER-----------DATE----------------COMMENTS----------------------------------------------------------/
| MHASHAIKEH      05/07/2020 11:30:24  
/-----END CHANGE LOG-----------------------------------------------------------------------------------*/

function ConfigEngine_AWB(className, subModels, isI18n) {
	this.genDao = ConfigEngine_AWB.getInstance("com.accela.orm.jdbc.JDBCGenericDaoImpl");

	this.className = className;
	this.subModels = subModels;
	this.isI18n = isI18n;
}

ConfigEngine_AWB.prototype = {}

ConfigEngine_AWB.getInstance = function(classPath) {
	return ConfigEngine_AWB.scriptResult(aa.proxyInvoker.newInstance(classPath));
}

ConfigEngine_AWB.scriptResult = function(out) {
	if (!out.getSuccess()) {
		throw out.getErrorMessage();
	}
	
	return out.getOutput();
}

ConfigEngine_AWB.convertArrayToArrayList = function(arr) {
	if (!Array.isArray(arr)) {
		arr = [ arr ];
	}
	var arrList = aa.util.newArrayList();
	for (var i = 0; i < arr.length; i++) {
		arrList.add(arr[i]);
	}

	return arrList;
}

ConfigEngine_AWB.arrayToMapObject = function(arr) {
	return arr.reduce(function(obj, currentValue, currentIndex, arr) {
		if (!obj.hasOwnProperty(currentValue)) {
			obj[currentValue] = true;
		}
		return obj;
	}, {});
}

ConfigEngine_AWB.arrayToMapObjectByKey = function(arr, key) {
	var map = {};
	for (var i = 0; i < arr.length; i++) {
		if (key) {
			map[arr[i][key]] = arr[i];
		} else {
			map[arr[i]] = true;
		}
	}
	
	return map;
}

ConfigEngine_AWB.isI18n = function() {
	return com.accela.i18n.I18NContext.isEnableI18N();
}

ConfigEngine_AWB.isObjI18n = function(obj) {
	return ConfigEngine_AWB.isI18n() && (obj instanceof com.accela.i18n.I18NEnable);
}

ConfigEngine_AWB.getI18nLanguage = function() {
	return com.accela.i18n.I18NContext.getLanguage();
}

ConfigEngine_AWB.getReturnType = function(getterMethod) {	
	var obj = ConfigEngine_AWB.getDataType(getterMethod.getGenericReturnType());
	return obj;
}

ConfigEngine_AWB.getParameterType = function(setterMethod) {
	var parameters = setterMethod.getGenericParameterTypes();
	if (parameters.length != 1) {
		throw "Method name: " + setterMethod.getName() + " has " + parameters.length + ". Setter methods should have 1 parameter only.";
	}
	var obj = ConfigEngine_AWB.getDataType(parameters[0]);
	return obj;
}

ConfigEngine_AWB.getDataType = function(cls) {
	if (cls.getClass().getName().equals("sun.reflect.generics.reflectiveObjects.ParameterizedTypeImpl")) {
		if (com.accela.orm.util.ModelUtil.isList(cls.getRawType())) {
			return {
				"CLASS": cls.getActualTypeArguments()[0].getName(),
				"ISARRAY": true
			}
		} else {
			return {
				"CLASS": cls.getActualTypeArguments()[0].getName(),
				"ISARRAY": false
			}
		}
	} else {
		return {
			"CLASS": cls.getName(),
			"ISARRAY": false
		};
	}
}

ConfigEngine_AWB.parseJavaClassValue = function(cls, value) {
	if (value != null) {
		var describeObject = Object.prototype.toString.call(value);
		
		superClass = cls.getSuperclass();
		className = cls.getName();
		
		if (superClass != null && superClass.getName() == "java.lang.Enum"){
			value = java.lang.Enum.valueOf(cls, value)
		} else if (className == "java.lang.Long") {
			value = java.lang.Long.valueOf(value);
		} else if (className == "java.lang.Short") {
			value = java.lang.Short.valueOf(value);
		} else if (className == "java.lang.Integer") {
			value = java.lang.Integer.valueOf(value);
		} else if (className == "java.util.Date") {
			if (describeObject == "[object JavaObject]") {						
				if (!value.getClass().toString().equals("class java.util.Date")) {
					throw "Invalid date value, expected a String or an instance of java.util.Date, got " + value.getClass().toString();
				}
			} else {
				value = aa.util.parseDate(value);
			}
		}
	}
	
	return value;
}

ConfigEngine_AWB.prototype.search = function(jsonObj, asJson, allSubModels, includeAuditDate, doCascade) {
	aa.print('Search .............................');
	var entityObj = ConfigEngine_AWB.jsonToEntityClass(jsonObj, this.className, false);

	var resArr = [];
	if (doCascade) {
		var loader = new com.accela.orm.hibernate3.CascadeLoadImpl();
		resArr = loader.searchByModel(entityObj).toArray();
	} else {
		resArr = this.genDao.search(entityObj, 0, 0).toArray();
	}
	
	
	if (asJson) {
		aa.print('resArr.length: ' + resArr.length);
		resArr = this.searchResultToJson(resArr, allSubModels, includeAuditDate);
	}
	return resArr;
}

ConfigEngine_AWB.prototype.searchResultToJson = function(resArr, allSubModels, includeAuditDate) {
	var jsonResArr = [];
	for (var x = 0; x < resArr.length; x++) {
		var baseEntity = resArr[x];
		var jsonObj = ConfigEngine_AWB.entityClassToJson(resArr[x], this.subModels, allSubModels, includeAuditDate);
		jsonResArr.push(jsonObj);
	}
	return jsonResArr;
}

ConfigEngine_AWB.prototype.create = function(pkJsonObj, jsonObj, subModelsMap, overrideExisting) {
	var conf = this;
	
	// Search by PK for existing items
	var searchRes = this.search(pkJsonObj, false, false, false, true);
	
	// If there's existing items we delete them or return an erorr based on
	// overrideExisting flag
	if (searchRes.length > 0) {
		if (!overrideExisting) {
			return {
				"success": false,
				"exists": true
			}
		} else {
			// delete
			for (var w = 0; w < searchRes.length; w++) {
				var entityObj = searchRes[w];
				this.deleteEntityCascade(entityObj, subModelsMap);
			}
		}
	}
	
	var jsonObjArr = jsonObj;
	if (!Array.isArray(jsonObj)) {
		jsonObjArr = [jsonObj];
	}
	
	// Go over the entites and create them
	for (var w = 0; w < jsonObjArr.length; w++) {
		var entityObj = ConfigEngine_AWB.jsonToEntityClassCascade(jsonObjArr[w], this.className, subModelsMap);
		this.createEntityCascade(entityObj, subModelsMap, false);
	}
	
	return {
		"success": true,
		"exists": false
	};
}

var deleteCount = 0;
ConfigEngine_AWB.prototype.deleteEntityCascade = function(entityObj, subModelsMap) {
	if (!subModelsMap) {
		subModelsMap = {};
	}
	
	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObj.getClass());
	var subModels = annotationsObj.getSubModelProperties().toArray();
	
	for (var i = 0; i < subModels.length; i++) {
		if (subModelsMap.hasOwnProperty(subModels[i].getName())) {
			var returnType = ConfigEngine_AWB.getReturnType(subModels[i].getGetterMethod());
			var subModelValue = subModels[i].getGetterMethod().invoke(entityObj, []);

			// If there's no value for the sub model, nothing to delete
			if (subModelValue == null) {
				continue;
			}
			
			if (returnType["ISARRAY"]) {
				var subModelJsonArr = [];

				subModelValue = subModelValue.toArray();
				
				for (var q = 0; q < subModelValue.length; q++) {
					this.deleteEntityCascade(subModelValue[q], subModelsMap[subModels[i].getName()]);
				}
			} else {
				this.deleteEntityCascade(subModelValue, subModelsMap[subModels[i].getName()]);
			}
		}
	}
	
	aa.print("Deleting " + deleteCount + " item " + entityObj.getClass());
	this.genDao.delete(entityObj);
	deleteCount++;
}

var createCount = 0;
var updateCount = 0;
ConfigEngine_AWB.prototype.createEntityCascade = function(entityObj, subModelsMap, updateObj) {
	if (!subModelsMap) {
		subModelsMap = {};
	}
	
	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObj.getClass());
	var subModels = annotationsObj.getSubModelProperties().toArray();
	
	if (!updateObj) {
		this.genDao.create(entityObj, true);
		createCount++;
	} else {
		this.genDao.update(entityObj);
		updateCount++;
	}
	
	
	for (var i = 0; i < subModels.length; i++) {
		if (subModelsMap.hasOwnProperty(subModels[i].getName())) {
			var returnType = ConfigEngine_AWB.getReturnType(subModels[i].getGetterMethod());
			var subModelValue = subModels[i].getGetterMethod().invoke(entityObj, []);

			// If there's no value for the sub model, nothing to create
			if (subModelValue == null) {
				continue;
			}
			
			var childSubModelsMap = subModelsMap[subModels[i].getName()];
			
			var parentIsI18nObj = false;
			// If the parent is an instance of I18NEnable it will auto create a sub model using the default system language
			// We need to detect this case and update the model instead of creating it again to avoid duplicates
			if (childSubModelsMap.hasOwnProperty("ISLANG") && childSubModelsMap["ISLANG"]) {
				parentIsI18nObj = ConfigEngine_AWB.isObjI18n(entityObj);
			}
			
			if (returnType["ISARRAY"]) {
				var subModelJsonArr = [];

				subModelValue = subModelValue.toArray();
				
				for (var q = 0; q < subModelValue.length; q++) {
					var updateObj = false;
					if (parentIsI18nObj) {
						var langId = ConfigEngine_AWB.getEntityColumnValue(subModelValue[q], "LANG_ID");
						if (ConfigEngine_AWB.getI18nLanguage() == langId) {
							updateObj = true;
						}
					}
					this.createEntityCascade(subModelValue[q], childSubModelsMap, updateObj);
				}
			} else {
				var updateObj = false;
				if (parentIsI18nObj) {
					var langId = ConfigEngine_AWB.getEntityColumnValue(subModelValue, "LANG_ID");
					if (ConfigEngine_AWB.getI18nLanguage() == langId) {
						updateObj = true;
					}
				}
				this.createEntityCascade(subModelValue, childSubModelsMap, updateObj);
			}
		}
	}
	
	
	
}

ConfigEngine_AWB.getEntityColumnValue = function(entityObj, column) {
	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObj.getClass());
	
	if (!annotationsObj.getColumnMap().containsKey(column)) {
		throw "Class " + entityObj.getClass() + " doesn't contain column " + column;
	}
	
	var getterMethod = annotationsObj.getColumnMap().get(column).getGetterMethod();	
	return getterMethod.invoke(entityObj, []);
}

ConfigEngine_AWB.entityClassToJson = function(entityObj, subModelsMap, allSubModels, includeAudit) {
	if (!subModelsMap) {
		subModelsMap = {};
	}
	
//	aa.print('entityObj.getClass(): ' + entityObj.getClass());
	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObj.getClass());
	var jsonObj = ConfigEngine_AWB.getEntityClassValues(entityObj, annotationsObj);
	
	var subModels = annotationsObj.getSubModelProperties().toArray();
	var embeddedModels = annotationsObj.getEmbeddedProperties().toArray();
	
	subModels = subModels.concat(embeddedModels);
	for (var i = 0; i < subModels.length; i++) {
		if (subModelsMap.hasOwnProperty(subModels[i].getName()) || allSubModels || (includeAudit && subModels[i].getName().equals("auditModel"))) {
			var returnType = ConfigEngine_AWB.getReturnType(subModels[i].getGetterMethod());
//			aa.print('returnType["ISARRAY"]: ' + returnType["ISARRAY"]);
			var subModelValue = subModels[i].getGetterMethod().invoke(entityObj, []);
//			aa.print('subModelValue: ' + subModelValue);

			// If there's no value for the sub model, set it as null or empty array
			if (subModelValue == null) {
				var res = null;
				if (returnType["ISARRAY"]) {
					res = [];
				}
				jsonObj[subModels[i].getName()] = res;
				continue;
			}
			
			if (returnType["ISARRAY"]) {
				var subModelJsonArr = [];

				subModelValue = subModelValue.toArray();
				
				for (var q = 0; q < subModelValue.length; q++) {
//					aa.print('subModelValue[q]: ' + subModelValue[q]);
					var subModelJsonValue = ConfigEngine_AWB.entityClassToJson(subModelValue[q], subModelsMap[subModels[i].getName()], allSubModels);
					subModelJsonArr.push(subModelJsonValue);
				}
				
//				aa.print('subModels[i].getName(): ' + subModels[i].getName());
				jsonObj[subModels[i].getName()] = subModelJsonArr;
			} else {
				var subModelJsonValue = ConfigEngine_AWB.entityClassToJson(subModelValue, subModelsMap[subModels[i].getName()], allSubModels);
				jsonObj[subModels[i].getName()] = subModelJsonValue;
			}
		}
	}
	
	return jsonObj;
}

ConfigEngine_AWB.getEntityClassValues = function(entityObj, annotations) {
	var jsonObj = {};

	var columnsArr = annotations.getColumnMap().keySet().toArray();
	columnsArr = columnsArr.sort(function(a, b) {
		return a.localeCompare(b);
	});
	
	for (var i = 0; i < columnsArr.length; i++) {
		var columnDetails = annotations.getColumnMap().get(columnsArr[i]);
		
		// Embedded properties are stored as values of type Java Strings
		if (!(columnDetails instanceof java.lang.String)) {
			var getterMethod = annotations.getColumnMap().get(columnsArr[i]).getGetterMethod();	
			jsonObj[columnsArr[i]] = getterMethod.invoke(entityObj, []);
		}
	}
	
	return jsonObj;
}

ConfigEngine_AWB.jsonToEntityClassCascade = function(jsonObj, classPath, subModelsMap) {
	if (!subModelsMap) {
		subModelsMap = {};
	}
	
	var entityObj = ConfigEngine_AWB.jsonToEntityClass(jsonObj, classPath, true);
	
	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObj.getClass());
	var subModels = annotationsObj.getSubModelProperties().toArray();
	
	for (var i = 0; i < subModels.length; i++) {
		if (subModelsMap.hasOwnProperty(subModels[i].getName())) {
			var parameterType = ConfigEngine_AWB.getParameterType(subModels[i].getSetterMethod());
			var childJson = jsonObj[subModels[i].getName()];
			
			if (parameterType["ISARRAY"]) {
				var childEntityArr = aa.util.newArrayList();
				
				if (childJson) {
					for (var q = 0; q < childJson.length; q++) {
						var childEntity = ConfigEngine_AWB.jsonToEntityClassCascade(childJson[q], parameterType["CLASS"], subModelsMap[subModels[i].getName()]);
						childEntityArr.add(childEntity);
					}
				}
				
				subModels[i].getSetterMethod().invoke(entityObj, [childEntityArr]);
			} else {
				var childEntity = null;
				if (childJson) {
					childEntity = ConfigEngine_AWB.jsonToEntityClassCascade(childJson, parameterType["CLASS"], subModelsMap[subModels[i].getName()]);
				}
				
				subModels[i].getSetterMethod().invoke(entityObj, [childEntity]);
			}
		}
	}

	return entityObj;
}

ConfigEngine_AWB.jsonToEntityClass = function(jsonObj, classPath, addAuditModel, specificFields) {
	var obj = ConfigEngine_AWB.getInstance(classPath);
	
	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(java.lang.Class.forName(classPath));

	if (!annotationsObj.getColumnMap().containsKey("SERV_PROV_CODE")) {
		throw "Class " + classPath + " doesn't contain mandatory column SERV_PROV_CODE";
	}
	
	jsonObj["SERV_PROV_CODE"] = aa.getServiceProviderCode();

	if (addAuditModel) {
		// TODO: Convert it to use embedded models
		if (annotationsObj.getPropertyList().containsKey("auditModel")) {
			obj.setAuditModel(new com.accela.orm.model.common.AuditModel(new Date(), aa.getAuditID(), "A"));
		} else {
			// Some entities don't have an audit model, instead they have its
			// content directly on the object itself
			if (!annotationsObj.getColumnMap().containsKey("REC_DATE")
					|| !annotationsObj.getColumnMap().containsKey("REC_FUL_NAM")
					|| !annotationsObj.getColumnMap().containsKey("REC_STATUS")) {
				throw "Class " + classPath + " doesn't contain mandatory columns REC_DATE, REC_FUL_NAM, REC_STATUS nor does it contain a method to set Audit Model";
			}
			
			jsonObj["REC_DATE"] = new java.util.Date();
			jsonObj["REC_FUL_NAM"] = aa.getAuditID();
			jsonObj["REC_STATUS"] = "A";
		}
	}
	
	var numberOfMappedParameters = 0;
	var columnsArr = annotationsObj.getColumnMap().keySet().toArray();
	
	for (var i = 0; i < columnsArr.length; i++) {		
		// if specificFields is provided then only the fields within this entity
		// are added to the object
		if (jsonObj.hasOwnProperty(columnsArr[i]) && (!specificFields || specificFields.hasOwnProperty(columnsArr[i]))) {
			var value = jsonObj[columnsArr[i]];
			var setterMethod = annotationsObj.getColumnMap().get(columnsArr[i]).getSetterMethod();
			
			var parameters = setterMethod.getGenericParameterTypes();
			if (parameters.length != 1) {
				aa.print("Method name: " + setterMethod.getName() + " has " + parameters.length + ". Setter methods should have 1 parameter only.")
				continue;
			}
			
//			 aa.print(setterMethod.getName() + ": " + parameters[0].getName())
			// JSON values are text, set proper data type
			value = ConfigEngine_AWB.parseJavaClassValue(parameters[0], value);
			
			setterMethod.invoke(obj, [value]);
			numberOfMappedParameters++;
		}
	}
	
	if (numberOfMappedParameters == 0) {
		throw "Attempting to convert JSON obj into class: " + classPath + " has had 0 parameter set, aborting.";
	}

	return obj;
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

function getGeneralResponseJSON(operationStatus, statusDescription){
	var retVal = {};
	retVal.OperationStatus = operationStatus;
	retVal.StatusDescription = statusDescription;
	
	return retVal;
}

function reloadHashMaps(){
	classNameMap = aa.util.newHashMap();
	classNameMap.put("DOC", "com.accela.orm.model.document.RefDocumentModel");
	classNameMap.put("ASI", "com.accela.orm.model.asi.RefAppSpecInfoFieldModel");
	classNameMap.put("FEESCH", "com.accela.orm.model.finance.RefFeeScheduleModel");
	
	
	searchObjMap = aa.util.newHashMap();
	searchObjMap.put("DOC", {"DOC_CODE": ""+this.code});
	searchObjMap.put("ASI", {"R1_CHECKBOX_CODE": ""+this.code, "R1_CHECKBOX_GROUP": "APPLICATION"});
	searchObjMap.put("FEESCH", {"FEE_SCHEDULE_NAME":""+this.code});
	
	subModelsMap = aa.util.newHashMap();
	subModelsMap.put("DOC", {
								"documentI18NModels": {
									"ISLANG": true
								}
							}
	);
	subModelsMap.put("ASI", {
								"templateLayoutConfigModel": {
									"templateLayoutConfigI18NModels": {
										"ISLANG": true
									}
								},
								"refAppSpecInfoFieldI18NModels": {
									"ISLANG": true
								},
								"sharedDropDownModel": {}
							}
	);
	subModelsMap.put("FEESCH", {
						"documentI18NModels": {
							"ISLANG": true
						}
					}
	);
	
}

function getEnvValues(){
	
	if(classNameMap == null || searchObjMap == null || subModelsMap == null){
		reloadHashMaps();
	}
	
	className = classNameMap.get(category);
	searchObj = searchObjMap.get(category);
	subModels = subModelsMap.get(category);
}

var asJson = true;

var classNameMap = null;
var searchObjMap = null;
var subModelsMap = null;

var className = "";
var searchObj = "";
var subModels = "";


//aa.env.setValue("category", "ASI");
//aa.env.setValue("operation", "query");
//aa.env.setValue("code", "BFLO");
//aa.env.setValue("docInput", "");

var category = aa.env.getValue("category");
var operation = aa.env.getValue("operation");
var code = aa.env.getValue("code");
var docInput = aa.env.getValue("docInput");

function execute(){
	
	getEnvValues();
	
	aa.print('className: ' + className);
	aa.print('searchObj: ' + JSON.stringify(searchObj));
	aa.print('subModels: ' + JSON.stringify(subModels));

	var res = "";
	
	try {
		var conf = new ConfigEngine_AWB(className, subModels, true);
		
		aa.print("operation: " + operation)
		
		switch(""+operation){
			case "query":
				aa.print('conf.search.............');
				res = conf.search(searchObj, asJson, true, false, true);
				break;
			case "insert":
				res = conf.create(searchObj, docInput, subModels, true);
			default:
				res = getGeneralResponseJSON("501", "WRONG_OPERATION_PARAMETER");
			break;
		}
	} catch (e) {
		if (e instanceof org.mozilla.javascript.RhinoException) {
	    	aa.print(e.getValue());
	
	    	if (e.getScriptStackTrace()) {
	        	aa.print(e.getScriptStackTrace());
	        }
	    } else {
	        if (e.rhinoException) {
	        	aa.print(e.rhinoException);
	        } if (e.message) {
	        	aa.print(e.message);
	        } else {
	        	aa.print(e);
	        }
	        
	        if (e.stack) {
	        	aa.print(e.stack);
	        }
	    }
	}
	
	if(res != null && res != "" && res.length > 0){
		aa.env.setValue("RESULT", stringifyJSType(res));
	}else{
		aa.env.setValue("RESULT", getGeneralResponseJSON("500", "NO_DATA_FOUND"));
	}
}



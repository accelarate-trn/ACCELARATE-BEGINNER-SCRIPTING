/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_CONFIG_NEW.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: ADMIN
| Created at	: 24/09/2020 03:05:12
|
/------------------------------------------------------------------------------------------------------*/
/*-USER-----------DATE----------------COMMENTS----------------------------------------------------------/
| MHASHAIKEH      21/02/2021 14:59:01   
| MHASHAIKEH      14/03/2021 13:38:09 dd
/-----END CHANGE LOG-----------------------------------------------------------------------------------*/

eval(getScriptText("INCLUDE_CONFIG_API"));

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

function ConfigEngine(className, subModels, isI18n) {
	this.genDao = ConfigEngine.getInstance("com.accela.orm.jdbc.JDBCGenericDaoImpl");

	this.className = className;
	this.subModels = subModels;
	this.isI18n = isI18n;
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

function logDebug(msg){
	aa.print(msg);
	java.lang.System.out.println(msg);
}

function jsonObjToJsonArr(obj){
	var arr = [];
	
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			arr.push(obj[key]);
		}
	}
	
	return arr;
}

ConfigEngine.prototype = {}

ConfigEngine.getInstance = function (classPath) {
	return ConfigEngine.scriptResult(aa.proxyInvoker.newInstance(classPath));
}

ConfigEngine.scriptResult = function (out) {
	if (!out.getSuccess()) {
		throw out.getErrorMessage();
	}

	return out.getOutput();
}

ConfigEngine.convertArrayToArrayList = function (arr) {
	if (!Array.isArray(arr)) {
		arr = [arr];
	}
	var arrList = aa.util.newArrayList();
	for (var i = 0; i < arr.length; i++) {
		arrList.add(arr[i]);
	}

	return arrList;
}

ConfigEngine.arrayToMapObject = function (arr) {
	return arr.reduce(function (obj, currentValue, currentIndex, arr) {
		if (!obj.hasOwnProperty(currentValue)) {
			obj[currentValue] = true;
		}
		return obj;
	}, {})
}

ConfigEngine.arrayToMapObjectByKey = function (arr, key) {
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

ConfigEngine.isI18n = function () {
	return com.accela.i18n.I18NContext.isEnableI18N();
}

//ConfigEngineAPI.Delete = function (searchRes, className) {
//	conf.Delete(searchRes, className);
//}

// Removed ...
ConfigEngine.isObjI18n = function (obj) {
	return ConfigEngine.isI18n() && (obj instanceof com.accela.i18n.I18NEnable)
}

ConfigEngine.prototype.isDefaultI18nCreated = function (obj) {
	var i18nModelClass = com.accela.orm.util.GenericI18NModeUtil.getI18NModelClassName(obj);
	var i18NModel = com.accela.orm.util.GenericI18NModeUtil.copyModelToI18NModel(obj, i18nModelClass);
	
	if (i18NModel instanceof com.accela.orm.model.AuditModelEnable) {
		var i18NAuditModel = i18NModel.getAuditModel();
		i18NAuditModel.setAuditDate(null);
		i18NModel.setAuditModel(i18NAuditModel);
	} else {
		i18NModel.setRecDate(null);
	}
	var resArr = this.genDao.search(i18NModel, 0, 0);
	return resArr && resArr.size() > 0;
}


ConfigEngine.isPolicyModel = function (obj) {
	return (obj instanceof com.accela.orm.model.common.PolicyModel)
}

ConfigEngine.prototype.isMainModel = function (obj) {
	return obj.getClass() == "class " + this.className;
}

ConfigEngine.getI18nLanguage = function () {
	return com.accela.i18n.I18NContext.getLanguage();
}

ConfigEngine.getReturnType = function (getterMethod) {
	var obj = ConfigEngine.getDataType(getterMethod.getGenericReturnType());
	return obj;
}

ConfigEngine.getParameterType = function (setterMethod) {
	var parameters = setterMethod.getGenericParameterTypes();
	if (parameters.length != 1) {
		throw "Method name: " + setterMethod.getName() + " has " + parameters.length + ". Setter methods should have 1 parameter only.";
	}
	var obj = ConfigEngine.getDataType(parameters[0]);
	return obj;
}

ConfigEngine.getDataType = function (cls) {
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
		}
	}
}

ConfigEngine.parseJavaClassValue = function (cls, value) {
	if (value != null) {
		var describeObject = Object.prototype.toString.call(value);

		superClass = cls.getSuperclass();
		className = cls.getName();

		if (superClass != null && superClass.getName() == "java.lang.Enum") {
			value = java.lang.Enum.valueOf(cls, value)
		} else if (className == "java.lang.Long") {
			value = isNullOrEmpty(value) ? null : java.lang.Long.valueOf(value);
		} else if (className == "java.lang.Short") {
			value = isNullOrEmpty(value) ? null : java.lang.Short.valueOf(value);
		} else if (className == "java.lang.Integer") {
			value = isNullOrEmpty(value) ? null : java.lang.Integer.valueOf(value);
		} else if (className == "java.util.Date") {
			logDebug('describeObject: ' + describeObject);
			if (describeObject == "[object JavaObject]") {
				if (!value.getClass().toString().equals("class java.util.Date")) {
					if (value.getClass().toString().equals("class java.sql.Timestamp")) {
						var format = new java.text.SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
						value = isNullOrEmpty(value) ? "" : format.parse(value)
						value = aa.util.parseDate(value);
					} else {
						throw "Invalid date value, expected a String or an instance of java.util.Date, got " + value.getClass().toString();
					}
				}
			} else {
				var valueParsed = aa.util.parseDate(value);
				value = valueParsed != null ? valueParsed : new java.util.Date();
			}
		}
	}

	return value
}

ConfigEngine.prototype.searchBySQL = function (objClass, sql, params, asJson, allSubModels, includeAuditDate) {
	logDebug('searchBySQL .............................');
	logDebug('sql: ' + sql);
	logDebug('asJson: ' + asJson);
	logDebug('allSubModels: ' + allSubModels);
	logDebug('includeAuditDate: ' + includeAuditDate);
	
	var resArr = [];
	try{
		var result = aa.db.select(sqlString, parameters);
		if (result.getSuccess()) {
			resArr = result.getOutput();
		} 
	}catch(e){
		resArr = this.genDao.searchBySQL(objClass, sql, params, 0, 0).toArray();		
	}
	
	if (asJson) {
		logDebug('resArr.length: ' + resArr.length);
		logDebug('RES: '+ resArr.getClass());
		resArr = this.searchResultToJson(resArr, allSubModels, includeAuditDate);
	}
	return resArr;
}

ConfigEngine.prototype.updateBySQL = function (sqlString, parameters) {
	logDebug('updateBySQL .............................');
	logDebug('sqlString: ' + sqlString);
	
	var updateResult = '';
		
	try{
		updateResult = aa.db.update(sqlString, parameters);
		this.handleUpdateResult(updateResult);
	}catch(e){
		logDebug('Error updating using new DB API, Going to update using legacy DB API');
		logDebug('Update ERR: ' + e);
		this.updateBySQLLegacy(sqlString, parameters);
	}
}

ConfigEngine.prototype.deleteBySQL = function (sqlString, parameters) {
	logDebug('updateBySQL .............................');
	logDebug('sqlString: ' + sqlString);
	
	var updateResult = '';
		
	try{
		updateResult = aa.db.delete(sqlString, parameters);
		this.handleUpdateResult(updateResult);
	}catch(e){
		logDebug('Error deleting using new DB API, Going to update using legacy DB API');
		logDebug('Update ERR: ' + e)
		this.updateBySQLLegacy(sqlString, parameters);
	}
}

ConfigEngine.prototype.createByEntity = function(insertSql, params){
//	var resArr = this.genDao.update(entity);
	
	params = !params ? [] : params;
	
	var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
	var result = dba.update(insertSql, params);
	
	return result;
}

ConfigEngine.prototype.updateBySQLLegacy = function(sql, params) {
	logDebug('...............................updateBySQLLegacy...............................');
	params = params == null || params == undefined ? [] : params;
	var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
	var result = dba.update(sql, params);
	logDebug('updateBySQLLegacy:result: ' + result);
}

ConfigEngine.prototype.search = function (jsonObj, asJson, allSubModels, includeAuditDate, doCascade, getActive) {
	var entityObj = ConfigEngine.jsonToEntityClass(jsonObj, this.className, false);
	
	if (getActive) {
		if (entityObj instanceof com.accela.orm.model.AuditModelEnable) {
			var auditMod = new com.accela.orm.model.common.AuditModel();
			auditMod.setAuditStatus('A');
			entityObj.setAuditModel(auditMod);
		} else {
			if(this.className != 'com.accela.orm.model.common.UserSecurityModel'){
				entityObj.setRecStatus('A');
			}
		}
	}

	var resArr = [];
	if (doCascade) {
		var loader = new com.accela.orm.hibernate3.CascadeLoadImpl();
		resArr = loader.searchByModel(entityObj).toArray();
	} else {
		resArr = this.genDao.search(entityObj, 0, 0).toArray();
	}

	if (asJson) {
		resArr = this.searchResultToJson(resArr, allSubModels, includeAuditDate)
	}

	return resArr;
}

ConfigEngine.prototype.searchResultToJson = function (resArr, allSubModels, includeAuditDate) {
	var jsonResArr = [];
	for (var x = 0; x < resArr.length; x++) {
		var baseEntity = resArr[x];
		var jsonObj = ConfigEngine.entityClassToJson(resArr[x], this.subModels, allSubModels, includeAuditDate);
		jsonResArr.push(jsonObj);
	}
	return jsonResArr;
}

ConfigEngine.prototype.Delete = function (pkJsonObj, subModelsMap) {
	var searchRes = this.search(pkJsonObj, false, false, false, true);
	logDebug('DELETE::searchRes.length: ' + searchRes.length);
	for (var w = 0; w < searchRes.length; w++) {
		var entityObj = searchRes[w];
		this.deleteEntityCascade(entityObj, subModelsMap);
	}
}

ConfigEngine.prototype.DeleteEntities = function (searchRes, className) {
	for (var w = 0; w < searchRes.length; w++) {
		logDebug('deleting: searchRes[w]: ' + searchRes[w]);
		var entityObj = ConfigEngine.jsonToEntityClassCascade(searchRes[w], className);

		this.deleteEntityCascade(entityObj);
	}
}

ConfigEngine.prototype.create = function (pkJsonObj, jsonObj, subModelsMap, overrideExisting, skipDelete, active, isGenerator, doCascade, insertOnly) {
	if(isGenerator == null || isGenerator == undefined){
		isGenerator = true;
	}
	
	if(!active || active == null || active == undefined){
		active = "A";
	}
	
	if(doCascade == null || doCascade == undefined){
		doCascade = true;
	}
	
	var conf = this;

	// Search by PK for existing items
	var searchRes = [];
	if(pkJsonObj != null && pkJsonObj != undefined && pkJsonObj != "BATCH"){
		searchRes = this.search(pkJsonObj, false, false, false, doCascade, false);
		logDebug('CREATE::searchRes.length: ' + searchRes.length);
		logDebug('overrideExisting: ' + overrideExisting);
		logDebug('skipDelete: ' + skipDelete);
		
		
//		logDebug("pkJsonObj JSON:: " + JSON.stringify(stringifyJSType(pkJsonObj)));
//		logDebug("jsonObj JSON:: " + JSON.stringify(stringifyJSType(jsonObj)));
//		logDebug("subModelsMap JSON:: " + JSON.stringify(stringifyJSType(subModelsMap)));
//		logDebug("overrideExisting: " + overrideExisting);
//		logDebug("skipDelete: " + skipDelete);
//		logDebug("active: " + active);
		
		// If there's existing items we delete them or return an erorr based on
		// overrideExisting flag
		if (searchRes.length > 0) {
			logDebug('Search > 0');
			logDebug('overrideExisting: ' + overrideExisting);
			if (!overrideExisting) {
				return {
					"success": false,
					"exists": true
				}
			} else {
				// delete
				if(!skipDelete){
					for (var w = 0; w < searchRes.length; w++) {
						logDebug('Deleteing searchRes[w]: ' + searchRes[w]);
						var entityObj = searchRes[w];
						this.deleteEntityCascade(entityObj, subModelsMap);
					}
				}
			}
		}
	}
	
	var isBatch = false;
	if(pkJsonObj != null && pkJsonObj != undefined && pkJsonObj == "BATCH"){
		isBatch = true;
	}

	var jsonObjArr = jsonObj;
	if (!Array.isArray(jsonObj)) {
		jsonObjArr = [jsonObj];
	}

	logDebug('isBatch: ' + isBatch);
	
	// Go over the entites and create them
	if(isBatch == true){
		var entityObjArr = [];
		for (var w = 0; w < jsonObjArr.length; w++) {
			var entityObj = ConfigEngine.jsonToEntityClassCascade(jsonObjArr[w], this.className, subModelsMap, active);
//			logDebug("searchRes.length: " + searchRes.length);
//			logDebug("skipDelete: " + skipDelete);
			
			entityObjArr.push(entityObj);
		}
		
		this.createEntityCascadeBatch(entityObjArr, subModelsMap, false, isGenerator);
		
	}else{
		
		for (var w = 0; w < jsonObjArr.length; w++) {
			var entityObj = ConfigEngine.jsonToEntityClassCascade(jsonObjArr[w], this.className, subModelsMap, active);
			logDebug("searchRes.length: " + searchRes.length);
			logDebug("skipDelete: " + skipDelete);
	
			if(searchRes.length > 0){
				if(skipDelete && !insertOnly){
					this.createEntityCascade(entityObj, subModelsMap, true, isGenerator);
				}else{
					this.createEntityCascade(entityObj, subModelsMap, false, isGenerator);
				}
			}else{
				this.createEntityCascade(entityObj, subModelsMap, false, isGenerator);
			}
	
		}
	}

	return {
		"success": true,
		"exists": false
	}
}

ConfigEngine.prototype.update = function (pkJsonObj, jsonObj, subModelsMap, overrideExisting, doCascade, isGenerator) {
	if(doCascade == null || doCascade == undefined){
		doCascade = true;
	}
	
	if(isGenerator == null || isGenerator == undefined){
		isGenerator = true;
	}
	
	var conf = this;

	if(pkJsonObj == null || pkJsonObj == undefined){
		// Go over the entites and create them
		var jsonObjArr = jsonObj;
		if (!Array.isArray(jsonObj)) {
			jsonObjArr = [jsonObj];
		}
		
		for (var w = 0; w < jsonObjArr.length; w++) {
			var entityObj = ConfigEngine.jsonToEntityClassCascade(jsonObjArr[w], this.className, subModelsMap);
			this.createEntityCascade(entityObj, subModelsMap, true, isGenerator);
		}

		return {
			"success": true,
			"exists": true
		}
		
	}else{
	
		// Search by PK for existing items
		var searchRes = this.search(pkJsonObj, false, false, false, doCascade);
		logDebug('UPDATE::searchRes.length: ' + searchRes.length);
	
		// If there's existing items we delete them or return an erorr based on
		// overrideExisting flag
		if (searchRes.length > 0) {
			if (!overrideExisting) {
				return {
					"success": false,
					"exists": true
				}
			} else {
				var jsonObjArr = jsonObj;
				if (!Array.isArray(jsonObj)) {
					jsonObjArr = [jsonObj];
				}
	
				// Go over the entites and create them
				for (var w = 0; w < jsonObjArr.length; w++) {
					var entityObj = ConfigEngine.jsonToEntityClassCascade(jsonObjArr[w], this.className, subModelsMap);
					this.createEntityCascade(entityObj, subModelsMap, true, isGenerator);
				}
	
				return {
					"success": true,
					"exists": true
				}
			}
		} else {
			return {
				"success": false,
				"exists": false
			}
		}
	}
}

var deleteCount = 0;
ConfigEngine.prototype.deleteEntityCascade = function (entityObj, subModelsMap) {
	if (!subModelsMap) {
		subModelsMap = {};
	}

	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObj.getClass());
	var subModels = annotationsObj.getSubModelProperties().toArray();

	for (var i = 0; i < subModels.length; i++) {
		if (subModelsMap.hasOwnProperty(subModels[i].getName())) {
			var returnType = ConfigEngine.getReturnType(subModels[i].getGetterMethod());
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

	aa.print("Deleting " + deleteCount + " item " + entityObj.getClass())
	var deleteResult = this.genDao.delete(entityObj);
	logDebug("deleteResult: " + deleteResult);
	deleteCount++;
}

var createCount = 0;
var updateCount = 0;
ConfigEngine.prototype.createEntityCascade = function (entityObj, subModelsMap, updateObj, isGenerator) {
//	logDebug('createEntityCascade...................');
	if (!subModelsMap) {
		subModelsMap = {};
	}

	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObj.getClass());
	var subModels = annotationsObj.getSubModelProperties().toArray();
	// Main entityObj will be updated after this.genDao.create/this.genDao.update
	// clone to use for not isGenerator subModels
	var entityObjBeforeUpdate = com.accela.io.CloneUtil.deepClone(entityObj)
	var updateAll = (entityObj.getClass() == "class " + this.className) && updateObj;

	
	
	if (!updateObj) {
//		logDebug("entityObj to be create..........: " + JSON.stringify(stringifyJSType(entityObj)));
//		invokeGetters(entityObj);
		try{
			var resultModel = this.genDao.create(entityObj, isGenerator);
//			logDebug("resultModel:: " + JSON.stringify(stringifyJSType(resultModel)));
			createCount++;
		}catch(e){
			var error = "";
			if (e.getMessage) {
				error = e.getMessage()
			} else {
				error = e + "";
			}

			logDebug('error: ' + error);
			if (error.indexOf("Duplicated object") != -1 || error.indexOf("Cannot insert duplicate key") != -1 ) {
				logDebug("Duplicated object Going to update instead on insert");
				this.genDao.update(entityObj);
				updateCount++;
				logDebug("updateCount: " + updateCount);
			} else {
				logDebug('createEntityCascade : Error While call DAO.Create: ' + e);
				logDebug('createEntityCascade : entityObj: ' + entityObj);
				throw e;
			}
		}
		
	} else {
//		logDebug("entityObj to be update..........: " + JSON.stringify(stringifyJSType(entityObj)));
		this.genDao.update(entityObj);
		updateCount++;
//		logDebug('updateCount: ' + updateCount);
	}

//	logDebug("subModels.length: " + subModels.length);
	
	for (var i = 0; i < subModels.length; i++) {
		if (subModelsMap.hasOwnProperty(subModels[i].getName())) {
			var returnType = ConfigEngine.getReturnType(subModels[i].getGetterMethod());
//			logDebug("returnType: " + returnType);

			var childSubModelsMap = subModelsMap[subModels[i].getName()];

			var isGenerator = childSubModelsMap.hasOwnProperty("ISGENERATOR") ? childSubModelsMap["ISGENERATOR"] : true;
//			logDebug("isGenerator: " + isGenerator);

			var subModelValueCloned = subModels[i].getGetterMethod().invoke(entityObjBeforeUpdate, []);
//			logDebug("subModelValueCloned: " + subModelValueCloned);
			
			var subModelValue = subModels[i].getGetterMethod().invoke(entityObj, []);
//			logDebug("subModelValue: " + subModelValue);

			
			// If there's no value for the sub model, nothing to create
			if (subModelValue == null) {
//				logDebug("subModelValue == null");
				continue;
			}

			var isDefaultI18nCreated = false;
			// look for auto created sub model using the default system language
			// We need to detect this case and update the model instead of creating it again to avoid duplicates
			if (childSubModelsMap.hasOwnProperty("ISLANG") && childSubModelsMap["ISLANG"]) {
				try{
					isDefaultI18nCreated = this.isDefaultI18nCreated(entityObj);
				}catch(e){
					logDebug('isDefaultI18nCreated ERROR: ' + e);
				}
			}

			if (returnType["ISARRAY"]) {
//				logDebug('returnType IS ARRAY');
				var subModelJsonArr = [];

				subModelValue = subModelValue.toArray();
				subModelValueCloned = subModelValueCloned.toArray();

//				logDebug("subModelValue.length: " + subModelValue.length);
				for (var q = 0; q < subModelValue.length; q++) {
					var updateObj = false || updateAll;
					if (isDefaultI18nCreated) {
						var langId = ConfigEngine.getEntityColumnValue(subModelValue[q], "LANG_ID");
//						logDebug("langId: " + langId);
						if (ConfigEngine.getI18nLanguage() == langId) {
							updateObj = true;
						}
					} else if (ConfigEngine.isPolicyModel(subModelValue[q])) {
//						logDebug("isPolicyModel");
						subModelValue[q] = this.fillPolicyModel(subModelValue[q], entityObj)
					}

					if (!isGenerator) {
//						logDebug("!isGenerator");
						subModelValue[q] = ConfigEngine.mergeObjects(subModelValueCloned[q], subModelValue[q])
					}
					//pm(subModelValue[q])
					this.createEntityCascade(subModelValue[q], childSubModelsMap, updateObj, isGenerator);
				}
			} else {
//				logDebug('returnType IS NOT ARRAY');
				var updateObj = false || updateAll;
				if (isDefaultI18nCreated) {
					var langId = ConfigEngine.getEntityColumnValue(subModelValue, "LANG_ID");
					if (ConfigEngine.getI18nLanguage() == langId) {
						updateObj = false || updateAll;
					}
				} else if (ConfigEngine.isPolicyModel(subModelValue)) {
					subModelValue = this.fillPolicyModel(subModelValue, entityObj)
				}
				if (!isGenerator) {
					subModelValue[q] = ConfigEngine.mergeObjects(subModelValueCloned, subModelValue)
				}

				this.createEntityCascade(subModelValue, childSubModelsMap, updateObj, isGenerator);
			}
		}
	}
	
//	logDebug("After Loop............................");
}

////////////////////////////////////////BATCH////////////////////////////////////////////////////
ConfigEngine.prototype.createEntityCascadeBatch = function (entityObjArr, subModelsMap, updateObj, isGenerator) {
	logDebug('createEntityCascadeBatch...................');
	logDebug('createEntityCascadeBatch:entityObjArr.length: ' + entityObjArr.length);
	logDebug('createEntityCascadeBatch:Class: ' + entityObjArr[0].getClass());
	if (!subModelsMap) {
		subModelsMap = {};
	}

	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObjArr[0].getClass());
	var subModels = annotationsObj.getSubModelProperties().toArray();
	// Main entityObj will be updated after this.genDao.create/this.genDao.update
	// clone to use for not isGenerator subModels
	var entityObj = entityObjArr[0];
	var entityObjBeforeUpdate = com.accela.io.CloneUtil.deepClone(entityObj);
	var updateAll = (entityObj.getClass() == "class " + this.className) && updateObj;

	
	
	if (!updateObj) {
		try{
			var createdItemsCount = this.genDao.batchCreate(java.util.Arrays.asList(entityObjArr));
			logDebug("createdItemsCount:: " + createdItemsCount);
		}catch(e){
			var error = "";
			if (e.getMessage) {
				error = e.getMessage()
			} else {
				error = e + "";
			}

			logDebug('error: ' + error);
			if (error.indexOf("Duplicated object") != -1 || error.indexOf("Cannot insert duplicate key") != -1 ) {
				logDebug("Duplicated object Going to update instead on insert");
			} else {
				logDebug('createEntityCascadeBatch : Error While call DAO.batchCreate: ' + e);
				logDebug('createEntityCascadeBatch : entityObj: ' + entityObj);
				throw e;
			}
		}
		
	} else {
		for(var e in entityObjArr){
//			logDebug("entityObj to be update..........: " + JSON.stringify(stringifyJSType(entityObjArr[e])));
			this.genDao.update(entityObjArr[e]);
			updateCount++;
		}
	}

	for(var e in entityObjArr){
		var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObjArr[e].getClass());
		var subModels = annotationsObj.getSubModelProperties().toArray();
		logDebug("subModels.length: " + subModels.length);
		
		for (var i = 0; i < subModels.length; i++) {
			if (subModelsMap.hasOwnProperty(subModels[i].getName())) {
//				logDebug("subModels[i].getName(): " + subModels[i].getName());
				var returnType = ConfigEngine.getReturnType(subModels[i].getGetterMethod());
//				logDebug("returnType: " + returnType);
	
				var childSubModelsMap = subModelsMap[subModels[i].getName()];
	
				var isGenerator = childSubModelsMap.hasOwnProperty("ISGENERATOR") ? childSubModelsMap["ISGENERATOR"] : true;
//				logDebug("isGenerator: " + isGenerator);
	
				var subModelValueCloned = subModels[i].getGetterMethod().invoke(entityObjBeforeUpdate, []);
//				logDebug("subModelValueCloned: " + subModelValueCloned);
				
				var subModelValue = subModels[i].getGetterMethod().invoke(entityObjArr[e], []);
//				logDebug("subModelValue: " + subModelValue);
	
				
				// If there's no value for the sub model, nothing to create
				if (subModelValue == null) {
//					logDebug("subModelValue == null");
					continue;
				}
	
				var isDefaultI18nCreated = false;
				// look for auto created sub model using the default system language
				// We need to detect this case and update the model instead of creating it again to avoid duplicates
				if (childSubModelsMap.hasOwnProperty("ISLANG") && childSubModelsMap["ISLANG"]) {
					try{
						isDefaultI18nCreated = this.isDefaultI18nCreated(entityObjArr[e]);
					}catch(e){
						logDebug('isDefaultI18nCreated ERROR: ' + e);
					}
				}
	
				if (returnType["ISARRAY"]) {
//					logDebug('returnType IS ARRAY');
					
					var subModelJsonArr = [];

					subModelValue = subModelValue.toArray();
					subModelValueCloned = subModelValueCloned.toArray();

					var updateObj = false || updateAll;
					for (var q = 0; q < subModelValue.length; q++) {
						if (isDefaultI18nCreated) {
							var langId = ConfigEngine.getEntityColumnValue(subModelValue[q], "LANG_ID");
//							logDebug('langId: ' + langId);
							if (ConfigEngine.getI18nLanguage() == langId) {
								updateObj = true;
							}
						} else if (ConfigEngine.isPolicyModel(subModelValue[q])) {
//							logDebug('isPolicyModel');
							subModelValue[q] = this.fillPolicyModel(subModelValue[q], entityObj)
						}

						if (!isGenerator) {
//							logDebug('!isGenerator');
							subModelValue[q] = ConfigEngine.mergeObjects(subModelValueCloned[q], subModelValue[q])
						}
					}
					
//					logDebug("entityObjs to be create..........: " + JSON.stringify(stringifyJSType(subModelValue)));
					
					try{
						this.createEntityCascadeBatch(subModelValue, childSubModelsMap, updateObj, isGenerator);
					}catch(e){
						logDebug("Error Calling nested createEntityCascadeBatch: " + e);
					}
					
					
//					if(subModelValue.size() > 0){
//						subModelValue = subModelValue.toArray();
//						try{
//							this.createEntityCascadeBatch(subModelValue, childSubModelsMap, updateObj, isGenerator);
//						}catch(e){
//							logDebug("Error Calling nested createEntityCascadeBatch: " + e);
//						}
//					}
				} else {
//					logDebug('returnType IS NOT ARRAY');
					var updateObj = false || updateAll;
					if (isDefaultI18nCreated) {
						var langId = ConfigEngine.getEntityColumnValue(subModelValue, "LANG_ID");
						if (ConfigEngine.getI18nLanguage() == langId) {
							updateObj = false || updateAll;
						}
					} else if (ConfigEngine.isPolicyModel(subModelValue)) {
						subModelValue = this.fillPolicyModel(subModelValue, entityObj);
					}
					if (!isGenerator) {
						subModelValue = ConfigEngine.mergeObjects(subModelValueCloned, subModelValue);
					}
	
					this.createEntityCascade(subModelValue, childSubModelsMap, updateObj, isGenerator);
				}
			}
		}
	}
	
	logDebug("After Loop............................");
}

ConfigEngine.getEntityColumnValue = function (entityObj, column) {
	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObj.getClass());

	if (!annotationsObj.getColumnMap().containsKey(column)) {
		throw "Class " + entityObj.getClass() + " doesn't contain column " + column;
	}

	var getterMethod = annotationsObj.getColumnMap().get(column).getGetterMethod();
	return getterMethod.invoke(entityObj, []);
}

ConfigEngine.entityClassToJson = function (entityObj, subModelsMap, allSubModels, includeAudit) {
	if (!subModelsMap) {
		subModelsMap = {};
	}

	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObj.getClass());
	var jsonObj = ConfigEngine.getEntityClassValues(entityObj, annotationsObj);

	var subModels = annotationsObj.getSubModelProperties().toArray();
	var embeddedModels = annotationsObj.getEmbeddedProperties().toArray();

	subModels = subModels.concat(embeddedModels);
	for (var i = 0; i < subModels.length; i++) {
		if (subModelsMap.hasOwnProperty(subModels[i].getName()) || (allSubModels && !subModels[i].getName().equals("auditModel")) || (includeAudit && subModels[i].getName().equals("auditModel"))) {
			var returnType = ConfigEngine.getReturnType(subModels[i].getGetterMethod());
			var subModelValue = subModels[i].getGetterMethod().invoke(entityObj, []);
			var getSubModels = false
			if (subModelsMap.hasOwnProperty(subModels[i].getName())) {
				getSubModels = subModelsMap[subModels[i].getName()]["allSubModels"] == true
			}
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
					var subModelJsonValue = ConfigEngine.entityClassToJson(subModelValue[q], subModelsMap[subModels[i].getName()], getSubModels, false);
					subModelJsonArr.push(subModelJsonValue);
				}
				if (ConfigEngine.isPolicyModel(subModelValue[0])) {
					jsonObj["policyModel"] = subModelJsonArr;
				} else {
					jsonObj[subModels[i].getName()] = subModelJsonArr;
				}
			} else {
				var subModelJsonValue = ConfigEngine.entityClassToJson(subModelValue, subModelsMap[subModels[i].getName()], getSubModels, false);
				if (ConfigEngine.isPolicyModel(subModels[i])) {
					jsonObj["policyModel"] = subModelJsonValue;
				} else {
					jsonObj[subModels[i].getName()] = subModelJsonValue;
				}
			}
		}
	}

	return jsonObj;
}

ConfigEngine.getEntityClassValues = function (entityObj, annotations) {
	var jsonObj = {};

	var columnsArr = annotations.getColumnMap().keySet().toArray();
	columnsArr = columnsArr.sort(function (a, b) {
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

ConfigEngine.jsonToEntityClassCascade = function (jsonObj, classPath, subModelsMap, active) {
	if(!active || active == null || active == undefined){
		active = "A";
	}
	if (!subModelsMap) {
		subModelsMap = {};
	}

	var entityObj = ConfigEngine.jsonToEntityClass(jsonObj, classPath, true, null, active);

	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObj.getClass());
	var subModels = annotationsObj.getSubModelProperties().toArray();

	for (var i = 0; i < subModels.length; i++) {
		if (subModelsMap.hasOwnProperty(subModels[i].getName())) {
			var parameterType = ConfigEngine.getParameterType(subModels[i].getSetterMethod());
			var childJson = jsonObj[subModels[i].getName()];

			if (parameterType["ISARRAY"]) {
				var childEntityArr = aa.util.newArrayList();

				if (childJson) {
					for (var q = 0; q < childJson.length; q++) {
						var childEntity = ConfigEngine.jsonToEntityClassCascade(childJson[q], parameterType["CLASS"], subModelsMap[subModels[i].getName()]);
						childEntityArr.add(childEntity);
					}
				}

				subModels[i].getSetterMethod().invoke(entityObj, [childEntityArr]);
			} else {
				var childEntity = null;
				if (childJson) {
					childEntity = ConfigEngine.jsonToEntityClassCascade(childJson, parameterType["CLASS"], subModelsMap[subModels[i].getName()]);
				}

				subModels[i].getSetterMethod().invoke(entityObj, [childEntity]);
			}
		}
	}

	return entityObj;
}

ConfigEngine.jsonToEntityClass = function (jsonObj, classPath, addAuditModel, specificFields, active) {
	if(jsonObj == null || jsonObj == undefined){
		jsonObj = {};
	}
	var isActive = jsonObj["ISACTIVE"];
	
	if(isActive != null && isActive != undefined){
		if(isActive == false || isActive == 'false' || isActive == 'False' || isActive == 'FALSE' ){
			active = 'I';
		}else{
			active = "A";
		}
	}else{
		if(!active || active == null || active == undefined){
			active = "A";
		}
	}
	
//	logDebug("active: " + active);
	
	var obj = ConfigEngine.getInstance(classPath);

	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(java.lang.Class.forName(classPath));

	if (!annotationsObj.getColumnMap().containsKey("SERV_PROV_CODE") && classPath != 'com.accela.orm.model.user.PublicUserAPORelationModel' && classPath != 'com.accela.orm.model.user.PublicUserModel' && classPath != 'com.accela.orm.model.user.PublicUserQuestionModel') {
		throw "Class " + classPath + " doesn't contain mandatory column SERV_PROV_CODE";
	}

	try{
		jsonObj["SERV_PROV_CODE"] = aa.getServiceProviderCode();
	}catch(e){}

	if (addAuditModel) {
		// TODO: Convert it to use embedded models
//		logDebug("adding AuditModel.....................");
		if (annotationsObj.getPropertyList().containsKey("auditModel")) {
//			logDebug('contains AuditModel');
			obj.setAuditModel(new com.accela.orm.model.common.AuditModel(new Date(), aa.getAuditID(), active));
		} else {
//			logDebug('NOT contains AuditModel');
			// Some entities don't have an audit model, instead they have its
			// content directly on the object itself
			if (!annotationsObj.getColumnMap().containsKey("REC_DATE")
				|| !annotationsObj.getColumnMap().containsKey("REC_FUL_NAM")
				|| !annotationsObj.getColumnMap().containsKey("REC_STATUS")) {
				throw "Class " + classPath + " doesn't contain mandatory columns REC_DATE, REC_FUL_NAM, REC_STATUS nor does it contain a method to set Audit Model";
			}

			jsonObj["REC_DATE"] = new java.util.Date();
			jsonObj["REC_FUL_NAM"] = aa.getAuditID();
			jsonObj["REC_STATUS"] = active;
		}
	}
	
	
	
	var numberOfMappedParameters = 0;
	var columnsArr = annotationsObj.getColumnMap().keySet().toArray();
//	logDebug('columnsArr.length: ' +  columnsArr.length);
//	logDebug('jsonObj:: \n' + JSON.stringify(stringifyJSType(jsonObj)));
	
	for (var i = 0; i < columnsArr.length; i++) {
//		aa.print('columnsArr[i]: ' + columnsArr[i]);
		// if specificFields is provided then only the fields within this entity
		// are added to the object
		if (jsonObj.hasOwnProperty(columnsArr[i]) && (!specificFields || specificFields.hasOwnProperty(columnsArr[i]))) {
//			logDebug('FOUND.......................: ' + columnsArr[i]);
			
			var value = jsonObj[columnsArr[i]];
//			logDebug('value: ' + value);
			
			var setterMethod = annotationsObj.getColumnMap().get(columnsArr[i]).getSetterMethod();
//			logDebug('setterMethod: ' + setterMethod);
			
			var parameters = setterMethod.getGenericParameterTypes();
			if (parameters.length != 1) {
				logDebugug("Method name: " + setterMethod.getName() + " has " + parameters.length + ". Setter methods should have 1 parameter only.")
				continue;
			}

			//			 aa.print(setterMethod.getName() + ": " + parameters[0].getName())
			// JSON values are text, set proper data type
			value = ConfigEngine.parseJavaClassValue(parameters[0], value);
			
			try{
				setterMethod.invoke(obj, [value]);
			}catch(e){
				var error = "";
				if (e.getMessage) {
					error = e.getMessage()
				} else {
					error = e + "";
				}

				logDebug('error: ' + error);
				if (error.indexOf("ClassCastException") != -1){
					try{
						setterMethod.invoke(obj, [java.lang.String(value)]);
					}catch(e){
						logDebug('error##: ' + e);
					}
				}
			}
			numberOfMappedParameters++;
		}
	}

	if (numberOfMappedParameters == 0) {
		throw "Attempting to convert JSON obj into class: " + classPath + " has had 0 parameter set, aborting. "
	}

	return obj;
}

ConfigEngine.prototype.fillPolicyModel = function (entityObj, parentObj) {
	var type = String(entityObj.getClass());
	switch (type) {
		case "class com.accela.orm.model.timeaccounting.TimeGroupSecurityModel":
			entityObj.setLevelData(parentObj.getTimeGroupSeq());
			break;
		case "class com.accela.orm.model.timeaccounting.TimeTypeSecurityModel":
			entityObj.setLevelData(parentObj.getTimeTypeSeq());
			break;
	}
	entityObj.setStatus("A");
	return entityObj
}

ConfigEngine.mergeObjects = function (clonedObj, mainObj) {
	var clonedClass = clonedObj.getClass();
	var mainClass = mainObj.getClass();
	//pm(clonedObj)
	if (clonedClass === mainClass) {
		var clonedMethods = clonedClass.getMethods();
		for (var m in clonedMethods) {
			var cMethod = clonedMethods[m]
			var methodName = cMethod.getName();
			if (!methodName.startsWith("get")) {
				continue;
			}
			try {
				var setMethodStr = cMethod.getName().replace("get", "set");
				var setterMethod = clonedClass.getMethod(setMethodStr, cMethod.getReturnType());
				var mainModelMethod = mainClass.getMethod(methodName);

				// If value is not set, set from main object
				if (!cMethod.invoke(clonedObj)) {
					setterMethod.setAccessible(true);
					mainModelMethod.setAccessible(true);
					setterMethod.invoke(clonedObj, [mainModelMethod.invoke(mainObj)]);
					//aa.print(mainModelMethod.invoke(mainObj))
				}
			} catch (ex) {
				//Continue
			}

		}
		return clonedObj;
	} else {
		return obj;
	}
}

ConfigEngine.Trim = function(text){
	if(text == null || text == undefined || text == 'null' || text == 'Null' || text == 'NULL'){
		text = '';
	}
	
	return text.trim();
}
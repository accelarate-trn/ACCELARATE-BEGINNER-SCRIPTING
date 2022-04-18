/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_CONFIG.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MHASHAIKEH
| Created at	: 06/07/2020 13:05:45
|
/------------------------------------------------------------------------------------------------------*/
function ConfigEngine() {
	this.genDao = ConfigEngine.getInstance("com.accela.orm.jdbc.JDBCGenericDaoImpl");
}

ConfigEngine.prototype = {}

var asJson = true;
var isI18n = true;

var className = "";
var searchObj = "";
var subModels = "";

function logDebug(msg) {
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
	}, {});
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

//Removed ...
ConfigEngine.isObjI18n = function (obj) {
	return ConfigEngine.isI18n() && (obj instanceof com.accela.i18n.I18NEnable)
}

ConfigEngine.prototype.isDefaultI18nCreated = function (obj) {
	logDebug('obj: ' + obj);
	logDebug('isDefaultI18nCreated ...............  1');
	var i18nModelClass = com.accela.orm.util.GenericI18NModeUtil.getI18NModelClassName(obj)
	logDebug('isDefaultI18nCreated ...............  2');
	logDebug('i18nModelClass: ' + i18nModelClass);
	var i18NModel = com.accela.orm.util.GenericI18NModeUtil.copyModelToI18NModel(obj, i18nModelClass)
	logDebug('isDefaultI18nCreated ...............  3');

	if (i18NModel instanceof com.accela.orm.model.AuditModelEnable) {
		logDebug('isDefaultI18nCreated ...............  4');
		var i18NAuditModel = i18NModel.getAuditModel()
		logDebug('isDefaultI18nCreated ...............  5');
		i18NAuditModel.setAuditDate(null)
		logDebug('isDefaultI18nCreated ...............  6');
		i18NModel.setAuditModel(i18NAuditModel)
		logDebug('isDefaultI18nCreated ...............  7');
	} else {
		logDebug('isDefaultI18nCreated ...............  8');
		i18NModel.setRecDate(null)
		logDebug('isDefaultI18nCreated ...............  9');
	}
	logDebug('isDefaultI18nCreated ...............  10');
	var resArr = this.genDao.search(i18NModel, 0, 0)
	logDebug('isDefaultI18nCreated ...............  11');
	return resArr && resArr.size() > 0
}

ConfigEngine.isPolicyModel = function (obj) {
	return (obj instanceof com.accela.orm.model.common.PolicyModel)
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
		};
	}
}

ConfigEngine.parseJavaClassValue = function (cls, value) {
	if (value != null && value != '') {
		var describeObject = Object.prototype.toString.call(value);

		superClass = cls.getSuperclass();
		className = cls.getName();

		//		logDebug('parse className: ' + className);
		//		logDebug('parse value: ' + value);

		if (superClass != null && superClass.getName() == "java.lang.Enum") {
			value = java.lang.Enum.valueOf(cls, value)
		} else if (className == "java.lang.Double") {
			value = java.lang.Double.valueOf(value);
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

ConfigEngine.prototype.selectBySQL = function (sql, params) {
	logDebug('selectBySQL .............................');
	logDebug('sql: ' + sql);
	
	var resArr = [];
	try{
		var result = aa.db.select(sqlString, parameters);
		if (result.getSuccess()) {
			resArr = result.getOutput();
		} 
	}catch(e){
		var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
		resArr = dba.select(sql, params);
	}
	
	return resArr;
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

ConfigEngine.prototype.handleUpdateResult = function(result) {
	if (result.getSuccess()) {
		logDebug("Update Count: " + result.getOutput());
	} else {
		logDebug(result.getErrorMessage());
	}
}

ConfigEngine.prototype.updateBySQLLegacy = function(sql, params) {
	params = params == null || params == undefined ? [] : params;
	var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
	var result = dba.update(sql, params);
	logDebug('updateBySQLLegacy:result: ' + result);
}

ConfigEngine.prototype.search = function (jsonObj, asJson, allSubModels, includeAuditDate, doCascade, getActive) {
	logDebug('Search .............................');
	logDebug('jsonObj: ' + JSON.stringify(jsonObj));
	logDebug('asJson: ' + asJson);
	logDebug('allSubModels: ' + JSON.stringify(allSubModels));
	logDebug('includeAuditDate: ' + includeAuditDate);
	logDebug('doCascade: ' + doCascade);
	logDebug('className: ' + this.className);
	logDebug('subModels: ' + JSON.stringify(this.subModels));
	var entityObj = ConfigEngine.jsonToEntityClass(jsonObj, this.className, false);
	
	var isActive = 'I';
	if (getActive == null || getActive == undefined || getActive == true) {
		isActive = 'A';
	}
	
	if (entityObj instanceof com.accela.orm.model.AuditModelEnable) {
		var auditMod = new com.accela.orm.model.common.AuditModel();
		auditMod.setAuditStatus(isActive);
		entityObj.setAuditModel(auditMod);
	} else {
		try{
			entityObj.setRecStatus(isActive);
		}catch(e){}
	}
	

	var resArr = [];
	if (doCascade) {
		var loader = new com.accela.orm.hibernate3.CascadeLoadImpl();
		resArr = loader.searchByModel(entityObj).toArray();
	} else {
		resArr = this.genDao.search(entityObj, 0, 0).toArray();
	}

	//	if(resArr.length > 1){
	//		var arrN = [];
	//		arrN[0] = resArr[resArr.length-1];
	//		resArr = arrN;
	//	}

	if (asJson) {
		logDebug('resArr.length: ' + resArr.length);
		resArr = this.searchResultToJson(resArr, allSubModels, includeAuditDate);
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

ConfigEngine.prototype.createOrUpdate = function (pkJsonObj, jsonObjArr, subModelsMap, overrideExisting) {
	logDebug('update....................');
	logDebug('pkJsonObj: ' + JSON.stringify(pkJsonObj));
	var conf = this;
	
	if (!Array.isArray(jsonObjArr)) {
		jsonObjArr = [jsonObjArr];
	}

	// Search by PK for existing items
	this.subModels = subModelsMap;
	var searchRes = this.search(pkJsonObj, false, false, false, true);
	logDebug('searchRes.length: ' + searchRes.length);

	// If there's existing items we update them or return an error based on
	// overrideExisting flag
	if (searchRes.length > 0) {
		if (!overrideExisting) {
			return {
				"success": false,
				"exists": true
			}
		} else {
			// update
			// Go over the entites and update them
			for (var w = 0; w < jsonObjArr.length; w++) {
				var entityObj = ConfigEngine.jsonToEntityClassCascade(jsonObjArr[w], this.className, subModelsMap);
				logDebug('UPDATE : this.className: ' + this.className);
				if (this.className == "com.accela.orm.model.cap.CapTypeModel") {
					logDebug('UPDATE : CAP_MASK_NAME : ' + jsonObjArr[w]['capTypeMaskModel']['CAP_MASK_NAME']);
					logDebug('UPDATE : CAPKEY_MASK_NAME : ' + jsonObjArr[w]['capTypeMaskModel']['CAPKEY_MASK_NAME']);
					logDebug('UPDATE : PAR_CAP_MASK_NAME : ' + jsonObjArr[w]['capTypeMaskModel']['PAR_CAP_MASK_NAME']);
					logDebug('UPDATE : TMP_CAP_MASK_NAME : ' + jsonObjArr[w]['capTypeMaskModel']['TMP_CAP_MASK_NAME']);

					var capTypeMaskModel = new com.accela.orm.model.cap.CapTypeMaskModel();
					capTypeMaskModel.setCapMaskName(jsonObjArr[w]['capTypeMaskModel']['CAP_MASK_NAME']);
					capTypeMaskModel.setCapkeyMaskName(jsonObjArr[w]['capTypeMaskModel']['CAPKEY_MASK_NAME']);
					capTypeMaskModel.setPartialAltIdMask(jsonObjArr[w]['capTypeMaskModel']['PAR_CAP_MASK_NAME']);
					capTypeMaskModel.setTemporaryAltIdMask(jsonObjArr[w]['capTypeMaskModel']['TMP_CAP_MASK_NAME']);


					var method = entityObj.getClass().getMethod("setCapTypeMaskModel", capTypeMaskModel.getClass());
					method.invoke(entityObj, capTypeMaskModel);
				}
				this.updateEntityCascade(entityObj, subModelsMap, true);
			}
		}
	} else {
		// Go over the entites and create them
		logDebug('Going to Insert Item .....................');
		logDebug('jsonObjArr.length: ' + jsonObjArr.length);
		for (var w = 0; w < jsonObjArr.length; w++) {
			var entityObj = ConfigEngine.jsonToEntityClassCascade(jsonObjArr[w], this.className, subModelsMap);
			logDebug('INSERT : this.className: ' + this.className);
			if (this.className == "com.accela.orm.model.cap.CapTypeModel") {
				logDebug('INSERT : CAP_MASK_NAME : ' + jsonObjArr[w]['capTypeMaskModel']['CAP_MASK_NAME']);
				logDebug('INSERT : CAPKEY_MASK_NAME : ' + jsonObjArr[w]['capTypeMaskModel']['CAPKEY_MASK_NAME']);
				logDebug('INSERT : PAR_CAP_MASK_NAME : ' + jsonObjArr[w]['capTypeMaskModel']['PAR_CAP_MASK_NAME']);
				logDebug('INSERT : TMP_CAP_MASK_NAME : ' + jsonObjArr[w]['capTypeMaskModel']['TMP_CAP_MASK_NAME']);

				var capTypeMaskModel = new com.accela.orm.model.cap.CapTypeMaskModel();
				capTypeMaskModel.setCapMaskName(jsonObjArr[w]['capTypeMaskModel']['CAP_MASK_NAME']);
				capTypeMaskModel.setCapkeyMaskName(jsonObjArr[w]['capTypeMaskModel']['CAPKEY_MASK_NAME']);
				capTypeMaskModel.setPartialAltIdMask(jsonObjArr[w]['capTypeMaskModel']['PAR_CAP_MASK_NAME']);
				capTypeMaskModel.setTemporaryAltIdMask(jsonObjArr[w]['capTypeMaskModel']['TMP_CAP_MASK_NAME']);


				var method = entityObj.getClass().getMethod("setCapTypeMaskModel", capTypeMaskModel.getClass());
				method.invoke(entityObj, capTypeMaskModel);
			}
			this.createEntityCascade(entityObj, subModelsMap, false);
		}
	}

	return {
		"success": true,
		"exists": false
	};
}

ConfigEngine.prototype.Delete = function (searchRes, className) {
	for (var w = 0; w < searchRes.length; w++) {
		logDebug('deleting: searchRes[w]: ' + searchRes[w]);
		var entityObj = ConfigEngine.jsonToEntityClassCascade(searchRes[w], className);

		this.deleteEntityCascade(entityObj);
	}
}

ConfigEngine.prototype.findAndDelete = function(pkJsonObj, subModelsMap, overrideExisting){
	
	var searchRes = [];
	searchRes = this.search(pkJsonObj, false, false, false, false);
	logDebug('findAndDelete::searchRes.length: ' + searchRes.length);
	
	if (searchRes.length > 0) {
		if (overrideExisting) {
			for (var w = 0; w < searchRes.length; w++) {
				logDebug('Deleteing searchRes[w]: ' + searchRes[w]);
				var entityObj = searchRes[w];
				this.deleteEntityCascade(entityObj, subModelsMap);
			}
		}
	}
} 

ConfigEngine.prototype.create = function (pkJsonObj, jsonObjArr, subModelsMap, overrideExisting, skipDelete) {
	logDebug('create....................');
//	logDebug('pkJsonObj: ' + JSON.stringify(pkJsonObj));
	var conf = this;

	// Search by PK for existing items
	this.subModels = subModelsMap;
	
	if(pkJsonObj != null && pkJsonObj != undefined && pkJsonObj != "BATCH"){
		var searchRes = this.search(pkJsonObj, false, false, false, true);
		logDebug("searchRes.length: " + searchRes.length);
	//	logDebug("searchRes:: " + JSON.stringify(stringifyJSType(searchRes)));
	
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
				if(!skipDelete){
					for (var w = 0; w < searchRes.length; w++) {
						logDebug('Deleteing searchRes[w]: ' + searchRes[w]);
						//				try{
						var entityObj = searchRes[w];
						this.deleteEntityCascade(entityObj, subModelsMap);
						//				}catch(e){
						//					logDebug('ERRRRRR:::::  ' + e);
						//				}
					}
				}
			}
		}
	}
	
	var isBatch = false;
	if(pkJsonObj != null && pkJsonObj != undefined && pkJsonObj == "BATCH"){
		isBatch = true;
	}
	
	// Go over the entites and create them
//	logDebug('jsonObjArr.length: ' + jsonObjArr.length);
	
	if(isBatch == true){
		var entityObjArr = [];
		for (var w = 0; w < jsonObjArr.length; w++) {
			var entityObj = ConfigEngine.jsonToEntityClassCascade(jsonObjArr[w], this.className, subModelsMap);
			entityObjArr.push(entityObj);
		}
		this.createEntityCascadeBatch(entityObjArr, subModelsMap, false, true);
		
	}else{
		for (var w = 0; w < jsonObjArr.length; w++) {
			var entityObj = ConfigEngine.jsonToEntityClassCascade(jsonObjArr[w], this.className, subModelsMap);
//			logDebug("entityObj::: " + entityObj);
			this.createEntityCascade(entityObj, subModelsMap, false);
		}
	}
	
	return {
		"success": true,
		"exists": false
	};
}

////////////////////////////////////////BATCH////////////////////////////////////////////////////
ConfigEngine.prototype.createEntityCascadeBatch = function (entityObjArr, subModelsMap, updateObj, isGenerator) {
	logDebug('createEntityCascadeBatch...................');
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
					logDebug('returnType IS ARRAY');
					
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
					logDebug('returnType IS NOT ARRAY');
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

var deleteCount = 0;
ConfigEngine.prototype.deleteEntityCascade = function (entityObj, subModelsMap) {
	logDebug('deleteEntityCascade .................');
	if (!subModelsMap) {
		subModelsMap = {};
	}

	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObj.getClass());
	var subModels = annotationsObj.getSubModelProperties().toArray();

	logDebug('subModels.length: ' + subModels.length);

	for (var i = 0; i < subModels.length; i++) {
		logDebug('subModels[i].getName(): ' + subModels[i].getName());
		if (subModelsMap.hasOwnProperty(subModels[i].getName())) {
			logDebug('submodel IS found');
			var returnType = ConfigEngine.getReturnType(subModels[i].getGetterMethod());
			var subModelValue = subModels[i].getGetterMethod().invoke(entityObj, []);

			// If there's no value for the sub model, nothing to delete
			if (subModelValue == null) {
				logDebug('subModelValue == null');
				continue;
			}

			if (returnType["ISARRAY"]) {
				logDebug('returnType["ISARRAY"]');
				var subModelJsonArr = [];

				subModelValue = subModelValue.toArray();

				for (var q = 0; q < subModelValue.length; q++) {
					this.deleteEntityCascade(subModelValue[q], subModelsMap[subModels[i].getName()]);
				}
			} else {
				this.deleteEntityCascade(subModelValue, subModelsMap[subModels[i].getName()]);
			}
		} else {
			logDebug('submodel not found');
		}
	}

	logDebug("Deleting " + deleteCount + " item " + entityObj.getClass());
	
	var deleteResult;
	try{
		deleteResult = this.genDao.delete(entityObj);
	}catch(e){
		logDebug("Error While Deleting: " + e);
		//deleteResult = this.deleteCascade(entityObj);
	}
	logDebug("deleteResult: " + deleteResult);
	deleteCount++;
}

var createCount = 0;
var updateCount = 0;

ConfigEngine.prototype.updateEntityCascade = function (entityObj, subModelsMap, updateObj) {
	if (!subModelsMap) {
		subModelsMap = {};
	}

	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObj.getClass());
	var subModels = annotationsObj.getSubModelProperties().toArray();

	if (!updateObj) {
		try {
			this.genDao.create(entityObj, true);
			createCount++;
		} catch (e) {
			logDebug('updateEntityCascade : Error While call DAO.Create: ' + e);
			logDebug('updateEntityCascade : entityObj: ' + entityObj);
			throw e;
		}
	} else {
		logDebug('Going to update : entityObj: ' + entityObj);
		var updatedObject = this.genDao.update(entityObj);
		logDebug("updatedObject: " + JSON.stringify(stringifyJSType(ConfigEngine.entityClassToJson(updatedObject, this.subModels, subModelsMap, false))));
		updateCount++;
	}


	for (var i = 0; i < subModels.length; i++) {
		if (subModelsMap.hasOwnProperty(subModels[i].getName())) {
			var returnType = ConfigEngine.getReturnType(subModels[i].getGetterMethod());
			var subModelValue = subModels[i].getGetterMethod().invoke(entityObj, []);

			// If there's no value for the sub model, nothing to create
			if (subModelValue == null) {
				continue;
			}

			var childSubModelsMap = subModelsMap[subModels[i].getName()];

			if (returnType["ISARRAY"]) {
				var subModelJsonArr = [];

				subModelValue = subModelValue.toArray();

				for (var q = 0; q < subModelValue.length; q++) {
					this.updateEntityCascade(subModelValue[q], childSubModelsMap, true);
				}
			} else {
				this.updateEntityCascade(subModelValue, childSubModelsMap, true);
			}
		}
	}
}

ConfigEngine.prototype.createEntityCascade = function (entityObj, subModelsMap, updateObj) {
	logDebug('createEntityCascade.........................');
	if (!subModelsMap) {
		subModelsMap = {};
	}

	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObj.getClass());
	var subModels = annotationsObj.getSubModelProperties().toArray();

	logDebug('entityObj.getClass(): ' + entityObj.getClass());
	logDebug('updateObj ' + updateObj);

	if (!updateObj) {
		try {
			entityObj = this.genDao.create(entityObj, true);
			createCount++;
			logDebug('No Errors............');
		} catch (e) {
			var error = "";
			if (e.getMessage) {
				error = e.getMessage();
			} else {
				error = e + "";
			}

			logDebug('error: ' + error);
			if (error.indexOf("Duplicated object") != -1 || error.indexOf("Cannot insert duplicate key") != -1 ) {
				logDebug("Duplicated object Going to update instead on insert");
//				this.updateEntityCascade(entityObj, subModelsMap, true);
				if(error.indexOf("R3APPTYP_ALIAS_UIX") != -1){
					logDebug('##ALIAS_DUPLICATED##');
					throw 'ALIAS_DUPLICATED';
				}
			} else {
				logDebug('createEntityCascade : Error While call DAO.Create: ' + e);
				logDebug('createEntityCascade : entityObj: ' + entityObj);
				throw e;
			}
		}
	} else {
		entityObj = this.genDao.update(entityObj);
		updateCount++;
	}


	for (var i = 0; i < subModels.length; i++) {
		logDebug("subModels[i].getName(): " + subModels[i].getName());
		if (subModelsMap.hasOwnProperty(subModels[i].getName())) {
			var returnType = ConfigEngine.getReturnType(subModels[i].getGetterMethod());
			var subModelValue = subModels[i].getGetterMethod().invoke(entityObj, []);
			
			// If there's no value for the sub model, nothing to create
			if (subModelValue == null) {
				continue;
			}
			
			var childSubModelsMap = subModelsMap[subModels[i].getName()];
			
//			var isDefaultI18nCreated = false;
			var parentIsI18nObj = false;
			// look for auto created sub model using the default system language
			// We need to detect this case and update the model instead of creating it again to avoid duplicates
			if (childSubModelsMap.hasOwnProperty("ISLANG") && childSubModelsMap["ISLANG"]) {
				
//				isDefaultI18nCreated = this.isDefaultI18nCreated(entityObj);
				parentIsI18nObj = ConfigEngine.isObjI18n(entityObj);
			}
			
			if (returnType["ISARRAY"]) {
				var subModelJsonArr = [];
				
				subModelValue = subModelValue.toArray();
				
				for (var q = 0; q < subModelValue.length; q++) {
					var updateObj = false;
//					if (isDefaultI18nCreated) {
					if (parentIsI18nObj) {
						var langId = ConfigEngine.getEntityColumnValue(subModelValue[q], "LANG_ID");
						if (ConfigEngine.getI18nLanguage() == langId) {
							updateObj = true;
						}
					} else if (ConfigEngine.isPolicyModel(subModelValue[q])) {
						subModelValue[q] = this.fillPolicyModel(subModelValue[q], entityObj)
					}
					this.createEntityCascade(subModelValue[q], childSubModelsMap, updateObj);
				}
				
			} else {
				
				var updateObj = false;
				if (parentIsI18nObj) {
//				if (isDefaultI18nCreated) {
					var langId = ConfigEngine.getEntityColumnValue(subModelValue, "LANG_ID");
					if (ConfigEngine.getI18nLanguage() == langId) {
						updateObj = true;
					}
				} else if (ConfigEngine.isPolicyModel(subModelValue)) {
					subModelValue = this.fillPolicyModel(subModelValue, entityObj)
				}
				
				this.createEntityCascade(subModelValue, childSubModelsMap, updateObj);
			}
		}
	}
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

	//	logDebug('entityObj.getClass(): ' + entityObj.getClass());
	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(entityObj.getClass());
	var jsonObj = ConfigEngine.getEntityClassValues(entityObj, annotationsObj);

	var subModels = annotationsObj.getSubModelProperties().toArray();
	var embeddedModels = annotationsObj.getEmbeddedProperties().toArray();

	subModels = subModels.concat(embeddedModels);
	for (var i = 0; i < subModels.length; i++) {
		if (subModelsMap.hasOwnProperty(subModels[i].getName()) || allSubModels || (includeAudit && subModels[i].getName().equals("auditModel"))) {
			var returnType = ConfigEngine.getReturnType(subModels[i].getGetterMethod());
			//			logDebug('returnType["ISARRAY"]: ' + returnType["ISARRAY"]);
			var subModelValue = subModels[i].getGetterMethod().invoke(entityObj, []);
			//			logDebug('subModelValue: ' + subModelValue);

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
					//					logDebug('subModelValue[q]: ' + subModelValue[q]);
					var subModelJsonValue = ConfigEngine.entityClassToJson(subModelValue[q], subModelsMap[subModels[i].getName()], allSubModels);
					subModelJsonArr.push(subModelJsonValue);
				}

				//				logDebug('subModels[i].getName(): ' + subModels[i].getName());
				jsonObj[subModels[i].getName()] = subModelJsonArr;
			} else {
				var subModelJsonValue = ConfigEngine.entityClassToJson(subModelValue, subModelsMap[subModels[i].getName()], allSubModels);
				jsonObj[subModels[i].getName()] = subModelJsonValue;
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

ConfigEngine.jsonToEntityClassCascade = function (jsonObj, classPath, subModelsMap) {
	//	logDebug("PARAM:classPath: " + classPath);
	//	logDebug("PARAM:jsonObj: " + JSON.stringify(stringifyJSType(jsonObj)));
	if (!subModelsMap) {
		subModelsMap = {};
	}

	var entityObj = ConfigEngine.jsonToEntityClass(jsonObj, classPath, true);
	try {
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

					try {
						subModels[i].getSetterMethod().invoke(entityObj, [childEntity]);
					} catch (e) {
						logDebug('Error INvoking Method: ' + subModels[i].getSetterMethod());
						logDebug('EXCEPTION# ' + e);
					}
				}
			}
		}
	} catch (e) {
		logDebug("classPath: " + classPath);
		logDebug("jsonObj: " + JSON.stringify(stringifyJSType(jsonObj)));
		logDebug("ER##: " + e);
	}
	return entityObj;
}

ConfigEngine.jsonToEntityClass = function (jsonObj, classPath, addAuditModel, specificFields) {
	var obj = ConfigEngine.getInstance(classPath);

	//	logDebug('Class Name: ' + java.lang.Class.forName(classPath));
	var annotationsObj = com.accela.orm.util.AnnotationConfigurationUtil.getClassAnnotation(java.lang.Class.forName(classPath));

	if (!annotationsObj.getColumnMap().containsKey("SERV_PROV_CODE") && classPath != 'com.accela.orm.model.pageflow.ComponentModel') {
		throw "Class " + classPath + " doesn't contain mandatory column SERV_PROV_CODE";
	}

	jsonObj["SERV_PROV_CODE"] = aa.getServiceProviderCode();

	if (addAuditModel) {
		// TODO: Convert it to use embedded models
		var isActive = jsonObj["ISACTIVE"]; 
		
		if (annotationsObj.getPropertyList().containsKey("auditModel")) {
			logDebug("isActive#1: " + isActive);
			if(isActive != null && isActive != undefined && (isActive == false || isActive == 'false' || isActive == 'False' || isActive == 'FALSE' )){
				logDebug("isActive#1: Adding I");
				obj.setAuditModel(new com.accela.orm.model.common.AuditModel(new Date(), aa.getAuditID(), "I"));
			}else{
				logDebug("isActive#1: Adding A");
				obj.setAuditModel(new com.accela.orm.model.common.AuditModel(new Date(), aa.getAuditID(), "A"));
			}
		} else {
			// Some entities don't have an audit model, instead they have its
			// content directly on the object itself
			if (!annotationsObj.getColumnMap().containsKey("REC_DATE")
				|| !annotationsObj.getColumnMap().containsKey("REC_FUL_NAM")
				|| !annotationsObj.getColumnMap().containsKey("REC_STATUS")) {
				//				throw "Class " + classPath + " doesn't contain mandatory columns REC_DATE, REC_FUL_NAM, REC_STATUS nor does it contain a method to set Audit Model";
				
//				jsonObj["REC_DATE"] = new java.util.Date();
//				jsonObj["REC_FUL_NAM"] = aa.getAuditID();
//				jsonObj["REC_STATUS"] = "A";
				logDebug("Class " + classPath + " doesn't contain mandatory columns REC_DATE, REC_FUL_NAM, REC_STATUS nor does it contain a method to set Audit Model");
			} else {
				jsonObj["REC_DATE"] = new java.util.Date();
				jsonObj["REC_FUL_NAM"] = aa.getAuditID();
				if(isActive != null && isActive != undefined && (isActive == false || isActive == 'false' || isActive == 'False' || isActive == 'FALSE' )){
					logDebug("isActive#2: Adding I");
					jsonObj["REC_STATUS"] = "I";
				}else{
					logDebug("isActive#2: Adding A");
					jsonObj["REC_STATUS"] = "A";
				}
			}
		}
	}

	var numberOfMappedParameters = 0;
	var columnsArr = annotationsObj.getColumnMap().keySet().toArray();

	for (var i = 0; i < columnsArr.length; i++) {
		// if specificFields is provided then only the fields within this entity
		// are added to the object
		if (jsonObj.hasOwnProperty(columnsArr[i]) && (!specificFields || specificFields.hasOwnProperty(columnsArr[i]))) {
			var value = jsonObj[columnsArr[i]];

			try {
				var setterMethod = annotationsObj.getColumnMap().get(columnsArr[i]).getSetterMethod();

				var parameters = setterMethod.getGenericParameterTypes();
				if (parameters.length != 1) {
					logDebug("Method name: " + setterMethod.getName() + " has " + parameters.length + ". Setter methods should have 1 parameter only.")
					continue;
				}

				//			 logDebug(setterMethod.getName() + ": " + parameters[0].getName())
				// JSON values are text, set proper data type
				value = ConfigEngine.parseJavaClassValue(parameters[0], value);
//				logDebug('value: ' + value);
//				logDebug('Going to invoke: ' + setterMethod.getName());
				try {
					setterMethod.invoke(obj, [value]);
				} catch (e) {
					logDebug('Error invoking method: ' + setterMethod.getName());
					logDebug('cls: ' + parameters[0]);
					logDebug('value: ' + value);
					logDebug('Exception:: ' + e);
				}
				numberOfMappedParameters++;
			} catch (ee) {
				logDebug('Setting OBJ: ' + annotationsObj.getColumnMap().get(columnsArr[i]));
				logDebug('Error Getting Setting Method: ' + ee);
			}
		}
	}

	if (numberOfMappedParameters == 0) {
		throw "Attempting to convert JSON obj into class: " + classPath + " has had 0 parameter set, aborting.";
	}

	return obj;

}

ConfigEngine.prototype.getMaxRES_ID = function (seqName) {
	var context = new com.accela.orm.core.Context();
	var maxId = com.accela.aa.datamanager.util.DataManagerUtil.getSequenceFromDB(context, aa.getServiceProviderCode(), seqName);
	try {
		maxId = parseInt(maxId);
	} catch (e) { maxId = 0; }

	return maxId + 1;
}

ConfigEngine.prototype.fillPolicyModel = function (entityObj, parentObj) {
	var type = String(entityObj.getClass());
	switch (type) {
		case "class com.accela.orm.model.timeaccounting.TimeGroupSecurityModel":
			entityObj.setLevelType("User");
			entityObj.setPolicyName("TimeGroupSec");
			entityObj.setLevelData(parentObj.getTimeGroupSeq());
			break;
	}

	entityObj.setStatus("A");
	return entityObj
}

ConfigEngine.prototype.deleteCascade = function(entity){
	var context = new com.accela.orm.core.Context(); 
		
//	var cascadeDeleteImpl = new com.accela.orm.hibernate3.CascadeDeleteImpl();
//	var deleteResult = cascadeDeleteImpl.delete(entity, context);
	
	var accelaQueryDaoImpl = com.accela.orm.hibernate3.AccelaQueryDaoImpl();
	var deleteResult = accelaQueryDaoImpl.delete(entity);
	
	return deleteResult;
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

function getGeneralResponseJSON(operationStatus, statusDescription) {
	var retVal = {};
	retVal.OperationStatus = operationStatus;
	retVal.StatusDescription = statusDescription;

	return retVal;
}

function distinctList(list){
	var map = {};
	for(var c in list){
		if(!map[list[c]]){
			map[list[c]] = list[c];
		}
	}
	return json2array(map);
}

function contains(thisArr, v) {
	for (var i = 0; i < thisArr.length; i++) {
		if (thisArr[i] === v) return true;
	}
	return false;
};

function unique(thisArr) {
	var arr = [];
	for (var i = 0; i < thisArr.length; i++) {
		if (!contains(arr, thisArr[i])) {
			arr.push(thisArr[i]);
		}
	}
	return arr;
}

function json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
}

/* ------------------------------------------------------------------------------------------------------/
| Private methodes
/------------------------------------------------------------------------------------------------------ */


function getDeletedItems(keys, sysData, input) {
return sysData.filter(function (sysItem) {
	return input.filter(function (inItem) {
		exist = true
		for (var k in keys) {
			var key = keys[k]
			exist = exist && (inItem[key] == sysItem[key])
		}
		return exist
	}).length == 0
})
}

function getItemsByFilter(keys, input, filter) {
return input.filter(function (inItem) {
	exist = true
	for (var k in keys) {
		var key = keys[k];
		exist = exist && (inItem[key] == filter[key]);
	}
	return exist;
});
}

function getCreatedItems(keys, sysData, input) {
return input.filter(function (inItem) {
	return sysData.filter(function (sysItem) {
		exist = true
		for (var k in keys) {
			var key = keys[k]
			exist = exist && (inItem[key] == sysItem[key])
		}
		return exist
	}).length == 0
})
}

function getItemByKeyValue(sysData, key, value){
for(var s in sysData){
	if(sysData[s][key] == value){
		return sysData[s];
	}
}

return null;
}

function getExistsItems(keys, sysData, input) {
var existItems = input.filter(function (inItem) {
	return sysData.filter(function (sysItem) {
		exist = true;
		for (var k in keys) {
			var key = keys[k];
			exist = exist && (inItem[key] == sysItem[key]);
		}
		return exist;
	}).length > 0;
});

return existItems;
}

function getUpdatedItemsByFields(keys, sysData, input, fields) {
var existItems = input.filter(function (inItem) {
	return sysData.filter(function (sysItem) {
		exist = true;
		for (var k in keys) {
			var key = keys[k];
			exist = exist && (inItem[key] == sysItem[key]);
		}
		return exist;
	}).length > 0;
})

var updatedItems = existItems.filter(function (exItem) {
	var sysItem = sysData.filter(function (item) {
		exist = true;
		for (var k in keys) {
			var key = keys[k];
			exist = exist && (item[key] == exItem[key]);
		}
		return exist;
	})[0];
	return !compareObjectPropsByFields(exItem, sysItem, fields);
})
return updatedItems;
}

function getUpdatedItems(keys, sysData, input, subKeys, hasItems) {
	logDebug('getUpdatedItems......................');
	try{
		var existItems = input.filter(function (inItem) {
			return sysData.filter(function (sysItem) {
				exist = true;
				for (var k in keys) {
					var key = keys[k];
					exist = exist && (inItem[key] == sysItem[key]);
				}
				return exist;
			}).length > 0;
		})
		
		var updatedItems = existItems.filter(function (exItem) {
			
			if(hasItems != null && hasItems != undefined){
				logDebug('hasItems != null');
				for(var h in hasItems){
					if(exItem.hasOwnProperty(hasItems[h])){
						logDebug('hasItems != null');
						return true;
					}
				}
			}else{
				logDebug('hasItems == null');
			}
			
			var sysItem = sysData.filter(function (item) {
				exist = true;
				for (var k in keys) {
					var key = keys[k];
					exist = exist && (item[key] == exItem[key]);
				}
				return exist;
			})[0];
			return !compareObjectProps(exItem, sysItem, subKeys);
		})
		return updatedItems;
	}catch(e){
		logDebug("Error Getting Updated Items: " + e);
		return [];
	}
}

function compareObjectPropsByFields(obj1, obj2, fields) {
obj1 = stringifyJSType(obj1);
obj2 = stringifyJSType(obj2);

for (var p in obj1) {
	if (obj2.hasOwnProperty(p) && arrayincludes(fields, p)) {
		if (typeof obj1[p] === 'string') {
			if (!isNaN(obj1[p]) && !isNaN(obj2[p])) {
				if (parseFloat(obj1[p]) != parseFloat(obj2[p])){
					return false;
				}
			} else {
				if (obj1[p] != obj2[p]){
					return false;
				}
			}
		}else{
			if (!compareObjectPropsByFields(obj1[p], obj2[p], fields)){
				return false;
			}
		}
	}
}

return true;
}

function arrayincludes(array, val){
for(var r in array){
	if(array[r] === val){
		return true;
	}
}
return false;
}

function compareObjectProps(obj1, obj2, subKeys) {
obj1 = stringifyJSType(obj1)
obj2 = stringifyJSType(obj2)
for (var p in obj1) {
	if (!isNullOrEmpty(obj1[p])) {
		if (typeof obj1[p] === 'string') {
			if (obj2.hasOwnProperty(p)) {
				if (!isNaN(obj1[p]) && !isNaN(obj2[p])) {
					if (parseFloat(obj1[p]) != parseFloat(obj2[p])){
						return false;
					}
				} else {
					if (obj1[p] != obj2[p]) return false
				}
			}
		} else if (Array.isArray(obj1[p])) {
			if (subKeys[p]) {
				if (obj1[p].length != obj2[p].length) {
					return false;
				} else {
					var updated = getUpdatedItems([subKeys[p]], obj2[p], obj1[p])
					return updated.length == 0;
				}
			} else {
				return false;
			}
		} else {
			if (!compareObjectProps(obj1[p], obj2[p], subKeys)){
				return false;
			}
		}
	} else {
		if (!isNullOrEmpty(obj2[p])){
			return false;
		}
	}
}
return true;
}

var startTimeForDebug = (new Date).getTime();

function timeDebug(e) {
	var t = (new Date).getTime();
	var r = t - startTimeForDebug;
	startTimeForDebug = (new Date).getTime();
	logDebug("##TIMELOGGING::" + e + ": " + r + "ms");
	
}

function isNullUndefinedEmpty(val){
	return val == null || val == "null" || val == undefined || val == "undefined" || val.trim() == '';
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
};

function JSONObjectToKeysArray(obj){
	obj = Object.keys(obj);
	obj = JSON.stringify(obj);
	obj = obj.replace('[', '');
	obj = obj.replace(']', '');
	obj = replaceAll(obj, "\"", "'");
	return obj;
}
/*------------------------------------------------------------------------------------------------------/
| Program		: INCLUDE_CONFIG_WF.js
| Event			: 
|
| Usage			: 
| Notes			: auto generated Record Script by Accela Eclipse Plugin 
| Created by	: MHASHAIKEH
| Created at	: 31/03/2021 15:33:37
|
/------------------------------------------------------------------------------------------------------*/

function logDebug(msg) {
	aa.print(msg);
	java.lang.System.out.println(msg);
}

var departmentList;

function getWorkflowDetals(processCode){
	var ret = {};
	try {
		var service = com.accela.aa.util.EJBProxy.getRefWorkflowDesignerService()
		var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
		var utilProcessor = new JavaAdapter(com.accela.aa.datautil.DBResultSetProcessor, {
			processResultSetRow : function(rs) {
				var meta = rs.getMetaData();
				var numcols = meta.getColumnCount();
				var record = {}
				var result = null;

				for (var i = 0; i < numcols; i++) {
					var columnName = meta.getColumnName(i + 1);
					columnName = columnName.toUpperCase()
					result = rs.getObject(i + 1);
					if (result == null) {
						record[columnName] = String("");
					} else {

						if (result.getClass && result.getClass().getName() == "java.sql.Timestamp") {

							record[columnName] = String(new Date(rs.getTimestamp(i + 1).getTime()).toString("MM/dd/yyyy"));
						} else {
							record[columnName] = String(rs.getObject(i + 1));
						}
					}

				}

				return record;
			}
		});

		var graph = service.buildGraph(aa.getServiceProviderCode(), processCode);
		var deptArr = aa.people.getDepartmentList(aa.getServiceProviderCode()).getOutput();
		var deptMap = {};
		for (var q = 0; q < deptArr.length; q++) {
			deptMap[String(deptArr[q].getDepartmentModel())] = deptArr[q];
		}
		
		var tasksTranslations = {};
		var statusTranslations = {};
		var sqltasks = "select RES_ID, SD_PRO_DES  from SPROCESS_I18N where RES_ID in(select RES_ID from SPROCESS WHERE SERV_PROV_CODE = ? AND R1_PROCESS_CODE= ? AND REC_STATUS='A' ) and LANG_ID='ar_AE'";
		var sqlStatus = "SELECT RES_ID, R3_ACT_STAT_DES from R3STATYP_I18N where RES_ID in(SELECT RES_ID FROM R3STATYP WHERE SERV_PROV_CODE = ?  AND R3_PROCESS_CODE= ?)and LANG_ID='ar_AE'";
		var params = [ aa.getServiceProviderCode(), processCode ]
		var result = dba.select(sqltasks, params, utilProcessor, null);
		result = result.toArray();
		for ( var x in result) {
			tasksTranslations[result[x]["RES_ID"]] = result[x]["SD_PRO_DES"];

		}
		var result = dba.select(sqlStatus, params, utilProcessor, null);
		result = result.toArray();
		for ( var x in result) {
			statusTranslations[result[x]["RES_ID"]] = result[x]["R3_ACT_STAT_DES"];
		}
		// handle departments and translations
		var nodes = graph.getRoot().getNodes().toArray();
		var nodesMap = {};

		for ( var x in nodes) {
			var node = nodes[x];
			var cls = node.getClass().getSimpleName();
			var nodeObj = {
				obj : node,
				cells : null,
				type : cls,
				order : node.getId(),
				flows : [],
				addFlow : function(infos) {
					if (this.type == "Fork") {

					} else {
						if (this.cells["Flow Control"] == "") {
							for ( var i in infos) {
								this.cells[i] = infos[i];
							}
						} else {
							var flow = {
								"Step" : "",
								"Task (Time)" : "",
								"Task" : "",
								"TSI" : "",
								"Task [SECOND_LANG]" : "",
								"Status" : "",
								"Status [SECOND_LANG]" : "",
								"Flow Control" : "",
								"Timer Action" : "",
								"Application / Record Status" : "",
								"Department" : "",
								"Notification" : "",
								"Rule Description" : "",
								"User Groups with Assigned Access - English" : ""
							}
							for ( var i in infos) {
								flow[i] = infos[i];
							}
							this.flows.push(flow)
						}
					}

				}
			};

			nodesMap[node.getId()] = nodeObj

			if (cls == "Task") {
				var refTaskItemModel = node.getCustomObject();
				var deptCode = aa.getServiceProviderCode() + "/" + refTaskItemModel.getAssignedDepartmentModel().getAgencyCode() + "/" + refTaskItemModel.getAssignedDepartmentModel().getBureauCode() +
				"/" + refTaskItemModel.getAssignedDepartmentModel().getDivisionCode() +
				"/" + refTaskItemModel.getAssignedDepartmentModel().getSectionCode() + "/" + refTaskItemModel.getAssignedDepartmentModel().getGroupCode() + "/" + refTaskItemModel.getAssignedDepartmentModel().getOfficeCode();
				var departmentName = "";
				if (deptMap.hasOwnProperty(deptCode)) {
					departmentName = String(deptMap[deptCode].getDeptName());
				}
				var taskSeconLang = String(tasksTranslations[refTaskItemModel.getResId()]);
				taskSeconLang = taskSeconLang == null || taskSeconLang == undefined || taskSeconLang == "undefined" ? "" : taskSeconLang;
				nodeObj.cells = {
					"Step" : String(node.getId() * 10),
					"Task (Time)" : refTaskItemModel.getDueDate() != null ? String(refTaskItemModel.getDueDate()) : "",
					"Task" : String(refTaskItemModel.getTaskName()),
					"TSI" : refTaskItemModel.getCheckboxCode() == null ? "" : String(refTaskItemModel.getCheckboxCode()),
					"Task [SECOND_LANG]" : taskSeconLang,
					"Status" : "",
					"Status [SECOND_LANG]" : "",
					"Flow Control" : "",
					"Timer Action" : "",
					"Application / Record Status" : "",
					"Department" : departmentName,// refTaskItemModel.getAssignedDepartmentModel().
					"Notification" : "",
					"Rule Description" : "",
					"User Groups with Assigned Access - English" : ""
				}

			} else if (cls == "Join") {
				nodeObj.cells = {
					"Step" : String(node.getId() * 10),
					"Task (Time)" : "",
					"Task" : "JOIN",
					"TSI" : "",
					"Task [SECOND_LANG]" : "",
					"Status" : "",
					"Status [SECOND_LANG]" : "",
					"Flow Control" : "",
					"Timer Action" : "",
					"Application / Record Status" : "",
					"Department" : "",// refTaskItemModel.getAssignedDepartmentModel().
					"Notification" : "",
					"Rule Description" : "",
					"User Groups with Assigned Access - English" : ""
				}
			}
		}
		var flows = graph.getRoot().getFlows().toArray();

		for ( var x in flows) {
			var flow = flows[x];

			var source = flow.getCell().getSource();
			var target = flow.getCell().getTarget();
			var sourceNode = nodesMap[source];
			var targetNode = nodesMap[target];
			var statuses = flow.getCustomObject()

			if (sourceNode.type == "Start") {
				targetNode.order = 1;
			} else if (sourceNode.type == "Fork") {
				for (g in flows) {
					if (flows[g].getCell().getTarget() == sourceNode) {
						nodesMap[flows[g].getCell().getTarget()].addFlow({
							"Status" : "",
							"Status [SECOND_LANG]" : "",
							"Flow Control" : String(targetNode.cells.Step),
							"Timer Action" : "",
							"Application / Record Status" : "",
						})
						break;
					}
				}
			} else {
				if (statuses != null && statuses.size() > 0) {

					statuses = statuses.toArray();
					if (targetNode.type == "Fork") {
						// handle parallel
						var refTaskStatusModel = statuses[0]
						var flowcontrol = [];
						for (g in flows) {
							if (flows[g].getCell().getSource() == target) {
								flowcontrol.push(flows[g].getCell().getTarget() * 10)
							}
						}
						var statusSecondLang = String(statusTranslations[refTaskStatusModel.getResId()]);
						statusSecondLang = statusSecondLang == null || statusSecondLang == undefined || statusSecondLang == "undefined" ? "" : statusSecondLang;
						sourceNode.addFlow({
							"Status" : String(refTaskStatusModel.getStatusDescription()),
							"Status [SECOND_LANG]" : statusSecondLang,
							"Flow Control" : flowcontrol.join(","),
							"Timer Action" : refTaskStatusModel.getClockAction() == null ? "" : String(refTaskStatusModel.getClockAction()),
							"Application / Record Status" : String(refTaskStatusModel.getApplicationStatus()),
						})

					} else {
						for ( var s in statuses) {
							var refTaskStatusModel = statuses[s]

							var statusSecondLang = String(statusTranslations[refTaskStatusModel.getResId()]);
							statusSecondLang = statusSecondLang == null || statusSecondLang == undefined || statusSecondLang == "undefined" ? "" : statusSecondLang;
							sourceNode.addFlow({
								"Status" : String(refTaskStatusModel.getStatusDescription()),
								"Status [SECOND_LANG]" : statusSecondLang,
								"Flow Control" : targetNode.type == "End" ? "END" : String(targetNode.obj.getId() * 10),
								"Timer Action" : refTaskStatusModel.getClockAction() == null ? "" : String(refTaskStatusModel.getClockAction()),
								"Application / Record Status" : String(refTaskStatusModel.getApplicationStatus()),
							})

						}
					}
				} else {

					sourceNode.addFlow({
						"Status" : "",
						"Status [SECOND_LANG]" : "",
						"Flow Control" : String(targetNode.cells.Step),
						"Timer Action" : "",
						"Application / Record Status" : "",
					})

				}

			}

		}

		// export
		var asit = [];
		for ( var x in nodesMap) {
			var node = nodesMap[x];
			if (node.cells != null) {
				asit.push(node.cells)
				for ( var s in node.flows) {
					asit.push(node.flows[s])
				}
			}
		}
		asit.sort(function(a, b) {
			if (a.order < b.order) {
				return -1;
			}
			if (a.order > b.order) {
				return 1;
			}
			// a must be equal to b
			return 0;
		})
//		ret.SUCCESS = true;
//		ret.WKF = asit;
		
		ret = asit;

	} catch (e) {
//		ret.SUCCESS = false;
//		ret.ERROR = String(e);
		ret = [];
	}
	logDebug(JSON.stringify(ret, null, 2));
	
	return ret;
}

////////////////////////////////////////////////////////////////

function TASK(row) {
	this.type = "TASK";
	this.index = parseInt(WKF.validateMandatory(row["_ID"], "Index not found"), 10) + 1;
	this.step = WKF.validateMandatory(row["Step"], "Step not found at row " + this.index);
	this.nameEN = WKF.validateMandatory(row["Task"], "Task not found at row " + this.index);
	WKF.validateSpecialCharacters(this.nameEN, "Task cannot contains special characters at row " + this.index);
	WKF.validateLength(this.nameEN, 90, "Task Exeeded Max length 90 at row " + this.index)
	var duration = row["Task (Time)"];
	this.duration = "";
	if (duration != null && duration != "") {
		if (isNaN(duration)) {
			throw "Task (Time) should be numeric (days) at row " + this.index;
		}
		this.duration = parseInt(duration, 10);
	}
	this.displayInACA = row["Display in ACA"];
	if (!this.displayInACA) {
		this.displayInACA = "";
	} else {
		this.displayInACA = this.displayInACA.toUpperCase();
		if (this.displayInACA != "Y" && this.displayInACA != "N") {
			throw "Display in ACA is not valid at row  " + this.index + ". use Y or N";
		}
	}
	this.TSI = row["TSI"]
	if (!this.TSI) {
		this.TSI = "";
	}
	this.department = row["Department"];

	if (this.nameEN == "JOIN" || this.nameEN == "SPLIT") {
		this.nameAR = this.nameEN;
		this.type = this.nameEN;
	} else {
//		if (this.department && Object.keys(_instance.org.departments).length > 0 && !_instance.org.departments[this.department]) {
//			throw "Department " + this.department + " should be defined in departments sheet at row " + this.index;
//		}
//		if (this.department == "" && Object.keys(_instance.org.departments).length > 0) {
//			//	throw "Department should be selected at row " + this.index;
//		}
		
		if (row["Task [SECOND_LANG]"] == null || (row["Task [SECOND_LANG]"] + "").trim() == "") {
			this.nameAR = this.nameEN;
		}else{
			this.nameAR = WKF.validateMandatory(row["Task [SECOND_LANG]"], "Task [SECOND_LANG] not found at row " + this.index);
		}
		
		_instance.taskTranslations[this.nameEN] = this.nameAR;
	}
	_instance.tasks.push(this);
	this.flows = [];
	this.addFlow(row)
}
TASK.prototype.getFlowByDestination = function(destination) {
	var ret = null;
	for ( var z in this.flows) {
		var f = this.flows[z];
		if (f.destination == destination) {
			ret = f;
			break;
		}
	}
	return ret;
}
TASK.createSplit = function(destinations) {
	// parallel tasks
	var split = {
		"Flow Control" : destinations[0],
		"_ID" : -1,
		"Step" : _instance.generateSepecialSequence("SPLIT"),
		"Task" : "SPLIT"

	}
	var task = new TASK(split);
	for (var i = 1; i < destinations.length; i++) {
		var dest = (destinations[i] + "").trim();
		split["Flow Control"] = dest;
		split["Step"] = "";
		split["Task"] = "";
		task.addFlow(split)
	}

	return task;

}
TASK.prototype.addFlow = function(row) {
	var idx = parseInt(WKF.validateMandatory(row["_ID"], "Index not found"), 10) + 1;
	var destination = WKF.validateMandatory(row["Flow Control"], "Flow Control is required at row " + idx);
	destination = destination + "".toUpperCase();
	var destinations = [];
	if (destination != "END") {
		var destinations = (destination + "").split(",")
		for ( var d in destinations) {
			if (isNaN(destinations[d])) {
				throw "Flow Control is not valid at row " + idx + ". possible values numbers separated by comma or 'END'";
			}
		}
		if (destinations.length > 1) {

			var split = TASK.createSplit(destinations);
			destination = split.step;

		} else {
			destination = destinations[0]
		}
	}

	var flow = this.getFlowByDestination(destination)
	if (!flow) {
		var flow = {};
		this.flows.push(flow)
		flow.source = this.step;
		flow.index = idx;
		flow.destination = destination;
		flow.statuses = [];
	}
	if (this.type == "TASK") {
		var status = {};
		status.statusEN = WKF.validateMandatory(row["Status"], "Status is required at row " + flow.index);
		WKF.validateLength(status.statusEN, 30, "Status Exeeded Max length 30 at row " + flow.index);
		if (row["Status [SECOND_LANG]"] == null || (row["Status [SECOND_LANG]"] + "").trim() == "") {
			status.statusAR = status.statusEN;
		}else{
			status.statusAR = WKF.validateMandatory(row["Status [SECOND_LANG]"], "Status [SECOND_LANG] is required at row " + flow.index);
		}
		//WKF.validateLength(status.statusAR, 30, "Status [SECOND_LANG] Exeeded Max length 30 at row " + flow.index);
		status.recStatusEN = WKF.validateMandatory(row["Application / Record Status"], "Application / Record Status is required at row " + flow.index);
		WKF.validateLength(status.recStatusEN, 30, "Application / Record Status Exeeded Max length 30 at row " + flow.index)
		// status.recStatusAR = WKF.validateMandatory(row["Application / Record
		// Status [SECOND_LANG]"], "Application / Record Status [SECOND_LANG] is required
		// at row " + flow.index);
		// WKF.validateLength(status.recStatusAR, 30, "Application / Record
		// Status [SECOND_LANG] Exeeded Max length 30 at row " + flow.index)
		var timer = row["Timer Action"];
		if (timer != "" && timer != "Start" && timer != "Stop" && timer != "Close" && timer != "No Action") {
			throw "Invalid Timer Action [" + timer + "]: it can be only [No Action,Start,Stop,Close] at row " + flow.index
		}
		status.clockAction = timer;
		flow.statuses.push(status)
		_instance.statusTranslations[status.statusEN] = status.statusAR;
	}

}
function WKF(LANG_ID_PARAM) {
	_instance = this;
	this.tasks = [];
	this.statusTranslations = {};
	this.taskTranslations = {};
	this.sequence = 2;
	this.flowCodeSeq = 9;
	this.specialNumber = 0;
	if(LANG_ID_PARAM != null && LANG_ID_PARAM != undefined && LANG_ID_PARAM != ''){
		this.LANG_ID = LANG_ID_PARAM;
	}else{
		this.LANG_ID = null;
	}
}

WKF.ERRORCODES = {
	"V900001" : "RULE_GRAPH_ISNULL",
	"V900002" : "RULE_ROOT_ISNULL",
	"V100000" : "RULE_NODE_FAILED_ISNULL",
	"V100001" : "RULE_NODE_FAILED_NOCELL",
	"V110001" : "RULE_START_FAILED_DUPLICATE",
	"V110002" : "RULE_START_FAILED_NOEXISTING",
	"V110003" : "RULE_START_FAILED_INCOMING",
	"V110004" : "RULE_START_FAILED_OUTGOING_NOEXISTING",
	"V1100005" : "RULE_START_FAILED_OUTGOING_MULTIPLE",
	"V120001" : "RULE_END_FAILED_DUPLICATE",
	"V120002" : "RULE_END_FAILED_NOEXISTING",
	"V120003" : "RULE_END_FAILED_INCOMING",
	"V130001" : "RULE_TASK_FAILED_INCOMING",
	"V130002" : "RULE_TASK_FAILED_OUTGOING",
	"V130003" : "RULE_TASK_FAILED_NOOUTGOING",
	"V140001" : "RULE_FORK_FAILED_INCOMING",
	"V140002" : "RULE_FORK_FAILED_OUTGOING",
	"V140003" : "RULE_FORK_FAILED_FROMNODE",
	"V140004" : "RULE_FORK_FAILED_TONODE",
	"V150001" : "RULE_JOIN_FAILED_INCOMING",
	"V150002" : "RULE_JOIN_FAILED_OUTGOING",
	"V200000" : "RULE_FLOW_FAILED_ISNULL",
	"V200001" : "RULE_FLOW_FAILED_SOURCE",
	"V200002" : "RULE_FLOW_FAILED_TARGET",
	"V200003" : "RULE_FLOW_FAILED_NOCELL",
	"V210001" : "RULE_FLOW_FAILED_NEXT",
	"V210002" : "RULE_FLOW_FAILED_BRANCH",
	"V210003" : "RULE_FLOW_FAILED_LOOP",
	"V210004" : "RULE_FLOW_FAILED_TOOMORE",
	"V310000" : "RULE_WORKFLOWID_FAILED_ISNULL",
	"V310001" : "RULE_LAYERID_FAILED_ISNULL",
	"V310002" : "RULE_NODEID_FAILED_ISNULL",
	"V310003" : "RULE_FLOWID_FAILED_ISNULL",
	"V320000" : "RULE_ID_FAILED_DUPLICATE",
	"V610001" : "WORKFLOW_DUPLICATE",
	"V610002" : "PROCESS_DUPLICATE",
	"V610003" : "WORKFLOW_CODE_ISNULL"

}
WKF.prototype.generateSequence = function() {
	return this.sequence++;
}
WKF.prototype.generateSepecialSequence = function(type) {
	return type + this.specialNumber++;
}
WKF.prototype.generateStatusCode = function() {
	return "SCODE" + this.flowCodeSeq++;
}
WKF.validateSpecialCharacters = function(v, error) {
	var specialChars = [ '&', '\\', '"', ',' ];
	for ( var e in specialChars) {
		var char = specialChars[e];
		if (v.indexOf(char) > 0) {
			throw error;
		}
	}
	return v;

}
WKF.validateMandatory = function(v, error) {
	if (v == null || (v + "").trim() == "") {
		throw error;
	}
	return v;
}
WKF.validateLength = function(v, length, error) {
	if (v != null) {
		if (v.length > length) {
			throw error;
		}
	}
	return v;
}
WKF.prototype.validateGraph = function(metaDataDefinition) {
	var results = new com.accela.workflowdesigner.model.ValidationResult();
	logDebug("results.isSuccess(): " + results.isSuccess());
	var graph = com.accela.workflowdesigner.model.GraphAnalysis.toGraph(metaDataDefinition);
	logDebug("validateGraph::graph: " + graph);
	var root = graph.getRoot();
	logDebug("root: " + root);
	var nodes = root.getNodes();
	logDebug("nodes: " + nodes);
	logDebug("nodes.length: " + nodes.length);
	var flows = root.getFlows();
	logDebug("flows: " + flows);
	logDebug("flows.length: " + flows.length);
	com.accela.workflowdesigner.model.GraphAnalysis.buildRelationship4Graph(graph, results);
	logDebug("results.isSuccess(): " + results.isSuccess());
	com.accela.workflowdesigner.model.GraphAnalysis.validationGraph(graph, results);
	logDebug("results.isSuccess(): " + results.isSuccess());
	logDebug("results: " + results);
	logDebug("results.isSuccess(): " + results.isSuccess());
	if (!results.isSuccess()) {

		var map = results.getResults();
		var keys = map.keySet().toArray();
		logDebug("keys.length: " + keys.length);
		for (i in keys) {
			var key = keys[i]
			logDebug("Loop# " + i + " , key: " + key);
			var msgList = map.get(key);
			if (msgList != null && !msgList.isEmpty()) {
				logDebug("msgList: " + msgList);
				
				errorCode = msgList.get(0);
				logDebug("errorCode: " + errorCode);

				var node = String(WKF.getLabelByID(graph, key));
				logDebug("node: " + node);

				var msg = WKF.ERRORCODES[errorCode];
				var error = errorCode
				if (msg) {
					error += ":" + msg;
				}
				if (node) {
					error += " for node [" + node + "]"
				}
				
				logDebug("error: " + error);
				throw error;

			}
		}

	}

}
WKF.prototype.create = function(conf, processCode, flowStyle, override) {
	var ret = {};
	try {
		WKF.validateMandatory(processCode, "Workflow name cannot be empty")
		if (conf == null || conf == "" || conf.length == 0) {
			throw "Invalid Configuration";
		}
//		this.conf = conf;
		var lastTask = null;
		var GraphFactory = com.accela.workflowdesigner.model.GraphFactory;
		var JSONTool = com.accela.json.JSONTool;
//		for ( var x in this.conf) {
		logDebug('conf.length: ' + conf.length);
		conf = toJson(conf);
		logDebug('conf.length: ' + conf.length);
		for ( var x in conf) {
//			var row = this.conf[x];
			logDebug('conf['+x+']: ' + conf[x]);
			var row = conf[x];
			var step = row["Step"];
			if (step == null || step == "") {
				if (lastTask == null) {
					throw "Step is required at first row ";
				}
				lastTask.addFlow(row);
			} else {
				lastTask = new TASK(row);

			}
		}
		var graph = new com.accela.workflowdesigner.model.Graph();
		var root = GraphFactory.createRoot(aa.getServiceProviderCode(), processCode);
		logDebug("root: " + root);
		graph.setRoot(root);
		var start = GraphFactory.createStart(this.generateSequence());
		root.getNodes().add(start);
		var mappings = {};
		mappings["START"] = start.getId();
		var xaxe = 0;
		var yaxe = -70;
		var flip = true;
		for ( var t in this.tasks) {
			var taskInfo = this.tasks[t];
			yaxe += 80;
			if (taskInfo.type == "TASK") {

				xaxe = (flip) ? 100 : 300;
				flip = !flip;
				task = GraphFactory.createTask(this.generateSequence(), taskInfo.nameEN);

				var taskModel = WKF.createTaskItemModel(processCode, taskInfo)
				task.setCustomObject(taskModel)
				task.setCustomObjectString(JSONTool.toJSON(taskModel));

			} else if (taskInfo.type == "SPLIT") {
				xaxe += 20;
				task = GraphFactory.createFork(this.generateSequence())

			} else if (taskInfo.type == "JOIN") {
				xaxe += 20;
				task = GraphFactory.createJoin(this.generateSequence())
			} else {
				throw "INVALID task type at " + taskInfo.index;
			}
			task.getCell().getGeometry().setX(new java.lang.Double(xaxe));
			task.getCell().getGeometry().setY(new java.lang.Double(yaxe));
			taskInfo.node = task;

			mappings[taskInfo.step] = task.getId();
			root.getNodes().add(task);
		}
		// 3. generate a end for the graph
		end = GraphFactory.createEnd(this.generateSequence());
		yaxe = yaxe / 2;
		end.getCell().getGeometry().setX(new java.lang.Double(810));
		end.getCell().getGeometry().setY(new java.lang.Double(yaxe));
		start.getCell().getGeometry().setX(new java.lang.Double(10));
		start.getCell().getGeometry().setY(new java.lang.Double(yaxe))
		root.getNodes().add(end);
		mappings["END"] = end.getId();
		for ( var t in this.tasks) {
			var taskInfo = this.tasks[t];
			if (t == 0) {
				var flow = GraphFactory.createFlow(this.generateSequence(), mappings["START"], mappings[taskInfo.step]);
				flow.setLabel("");
				flow.setCustomObjectString("[]");
				root.getFlows().add(flow)
			}

			for ( var f in taskInfo.flows) {
				var flowInfo = taskInfo.flows[f];
				var sourceId = mappings[taskInfo.step];
				var targetId = mappings[flowInfo.destination];
				if (!targetId) {
					throw "Invalid flow at row " + flowInfo.index + ". Target [" + flowInfo.destination + "] not found";
				}
				var flow = GraphFactory.createFlow(this.generateSequence(), sourceId, targetId);

				var customStausList = aa.util.newArrayList();
				var statuses = flowInfo.statuses;
				var labels = [];
				for ( var s in statuses) {
					var statInfo = statuses[s]
					var statusModel = WKF.createStatusModel(processCode, taskInfo.nameEN, this.generateStatusCode(), statInfo)
					customStausList.add(statusModel);
					labels.push(statusModel.getStatusDescription())
				}

				flow.setLabel(labels.join(", "));
				if (flowStyle) {
					flow.getCell().setStyle(flowStyle + ";elbow=" + flowStyle)
				}

				flow.setCustomObject(customStausList);
				flow.setCustomObjectString(JSONTool.toJSON(customStausList));
				root.getFlows().add(flow)
			}
		}
		logDebug("graph: " + graph);
		var metaDataDefinition = com.accela.workflowdesigner.model.GraphAnalysis.toXML(graph);
		logDebug("metaDataDefinition: " + metaDataDefinition);
		try{
			this.validateGraph(metaDataDefinition);
		}catch(e){
			logDebug("ERR Validating Grapth: " + e);
		}//TBR
		var refProcessRelationModel = new com.accela.orm.model.workflow.RefProcessRelationModel();
		refProcessRelationModel.setServiceProviderCode(aa.getServiceProviderCode());
		refProcessRelationModel.setWorkflowName(processCode);
		refProcessRelationModel.setProcessCode(processCode);
		refProcessRelationModel.setParentProcessID(new java.lang.Long("0"));
		refProcessRelationModel.setStepNumber(new java.lang.Integer(0));
		logDebug('WF..............   1');
		refProcessRelationModel.setTaskActivation("I");
		refProcessRelationModel.setAuditModel(new com.accela.orm.model.common.AuditModel())
		logDebug('WF..............   2');
		refProcessRelationModel.getAuditModel().setAuditID(aa.getAuditID());
		refProcessRelationModel.getAuditModel().setAuditDate(new Date());
		refProcessRelationModel.getAuditModel().setAuditStatus("A");
		var refWorkflowMetadataModel = new com.accela.orm.model.workflow.RefWorkflowMetadataModel();
		refWorkflowMetadataModel.setServiceProviderCode(aa.getServiceProviderCode());
		refWorkflowMetadataModel.setMetaDataCode(processCode);
		refWorkflowMetadataModel.setMetaDataDefinition(metaDataDefinition);
		refWorkflowMetadataModel.setNeedLayout(true);
		refProcessRelationModel.setWorkflowMetadata(refWorkflowMetadataModel);
		logDebug('WF..............   3');
		var service = com.accela.aa.util.EJBProxy.getRefWorkflowDesignerService();
		var results = null;
		if (override == true) {
			logDebug('WF..............   4 1');
			results = service.updateWorkflow(refProcessRelationModel, true);
		} else {
			logDebug('WF..............   4 2');
			results = service.createWorkflow(refProcessRelationModel, false);
		}
		logDebug('WF..............   5');
		if (results == null || results == undefined || !results.isSuccess()) {
			logDebug('WF..............   6');
			var map = results.getResults();
			var keys = map.keySet().toArray();

			for (i in keys) {
				var key = keys[i]
				var msgList = map.get(key);
				if (msgList != null && !msgList.isEmpty()) {
					errorCode = msgList.get(0);

					var node = String(WKF.getLabelByID(graph, key));

					var msg = WKF.ERRORCODES[errorCode];
					var error = errorCode
					if (msg) {
						error += ":" + msg;
					}
					if (node) {
						error += " for node [" + node + "]"
					}
					throw error;

				}
			}

		}
		
		if(this.LANG_ID != null){
			this.translateTasks(processCode);
		}
		if(this.LANG_ID != null){
			this.translateStatus(processCode);
		}
		
		ret = {
				"success": true,
				"exists": true
			};
		
	} catch (e) {
		logDebug("WF:GERR: " + e);
		ret = {
				"success": false,
				"exists": true,
				"error": String(e)
			};
	}
	return ret;
}
WKF.prototype.translateTasks = function(process) {

	var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
	var utilProcessor = new JavaAdapter(com.accela.aa.datautil.DBResultSetProcessor, {
		processResultSetRow : function(rs) {
			var meta = rs.getMetaData();
			var numcols = meta.getColumnCount();
			var record = {}
			var result = null;

			for (var i = 0; i < numcols; i++) {
				var columnName = meta.getColumnName(i + 1);
				columnName = columnName.toUpperCase()
				result = rs.getObject(i + 1);
				if (result == null) {
					record[columnName] = String("");
				} else {

					if (result.getClass && result.getClass().getName() == "java.sql.Timestamp") {

						record[columnName] = String(new Date(rs.getTimestamp(i + 1).getTime()).toString("MM/dd/yyyy"));
					} else {
						record[columnName] = String(rs.getObject(i + 1));
					}
				}

			}

			return record;
		}
	});

	var sql = "select RES_ID, SD_PRO_DES from SPROCESS WHERE SERV_PROV_CODE = ? AND R1_PROCESS_CODE= ? AND REC_STATUS='A'"
	var deleteSql = "delete from SPROCESS_I18N where RES_ID in(select RES_ID from SPROCESS WHERE SERV_PROV_CODE = ? AND R1_PROCESS_CODE= ? AND REC_STATUS='A' and LANG_ID=?)";
	var insertSql = "INSERT INTO SPROCESS_I18N(SERV_PROV_CODE,RES_ID,LANG_ID,SD_PRO_DES,R1_PROCESS_CODE,REC_DATE,REC_FUL_NAM,REC_STATUS)  VALUES (?,?,?,?,?,?,?,?) ";
	var params = [ aa.getServiceProviderCode(), process ]
	var result = dba.select(sql, params, utilProcessor, null);
	params.push(this.LANG_ID);
	dba.update(deleteSql, params);
	ret = result.toArray()
	for ( var s in ret) {
		var task = ret[s];
		var trans = this.taskTranslations[task.SD_PRO_DES]
		if (!trans) {
			trans = task.SD_PRO_DES;
		}
		var params = [ aa.getServiceProviderCode(), new java.lang.Long(task.RES_ID), this.LANG_ID, trans, process, aa.util.formatDate(new Date(), "MM/dd/yyyy"), aa.getAuditID(), "A" ];
		dba.update(insertSql, params);

	}

}
WKF.prototype.translateStatus = function(process) {

	var dba = com.accela.aa.datautil.AADBAccessor.getInstance();
	var utilProcessor = new JavaAdapter(com.accela.aa.datautil.DBResultSetProcessor, {
		processResultSetRow : function(rs) {
			var meta = rs.getMetaData();
			var numcols = meta.getColumnCount();
			var record = {}
			var result = null;

			for (var i = 0; i < numcols; i++) {
				var columnName = meta.getColumnName(i + 1);
				columnName = columnName.toUpperCase()
				result = rs.getObject(i + 1);
				if (result == null) {
					record[columnName] = String("");
				} else {

					if (result.getClass && result.getClass().getName() == "java.sql.Timestamp") {

						record[columnName] = String(new Date(rs.getTimestamp(i + 1).getTime()).toString("MM/dd/yyyy"));
					} else {
						record[columnName] = String(rs.getObject(i + 1));
					}
				}

			}

			return record;
		}
	});
	var sql = "SELECT RES_ID,R3_ACT_STAT_DES,APPLICATION_STATUS,REC_DATE FROM R3STATYP WHERE SERV_PROV_CODE = ?  AND R3_PROCESS_CODE= ?";
	var deleteSql = "delete from R3STATYP_I18N where RES_ID in(SELECT RES_ID FROM R3STATYP WHERE SERV_PROV_CODE = ?  AND R3_PROCESS_CODE= ? and LANG_ID=?)";
	var insertSql = "INSERT INTO R3STATYP_I18N(SERV_PROV_CODE, RES_ID, LANG_ID, R3_ACT_STAT_DES, APPLICATION_STATUS, REC_DATE, REC_FUL_NAM, REC_STATUS) VALUES(?,?,?,?,?,?,?,?)"
	var params = [ aa.getServiceProviderCode(), process ]
	var result = dba.select(sql, params, utilProcessor, null);
	params.push(this.LANG_ID);
	dba.update(deleteSql, params);
	ret = result.toArray()
	for ( var s in ret) {
		var status = ret[s];
		var trans = this.statusTranslations[status.R3_ACT_STAT_DES];
		if (!trans || trans == null || trans == undefined) {
			trans = status.R3_ACT_STAT_DES;
		}
		var params = [ aa.getServiceProviderCode(), new java.lang.Long(status.RES_ID), this.LANG_ID, trans, status.APPLICATION_STATUS, aa.util.formatDate(new Date(), "MM/dd/yyyy"),
				aa.getAuditID(), "A" ];
		dba.update(insertSql, params);

	}

}
WKF.getLabelByID = function(graph, id) {
	if (graph == null || id == null) {
		return "";
	}
	var root = graph.getRoot();
	if (root == null) {
		return "";
	}
	var label = null;
	var nodes = root.getNodes().toArray();
	if (nodes != null) {
		for ( var nodeidx in nodes) {
			var node = nodes[nodeidx]
			if (id == node.getId()) {
				label = node.getLabel();
				return label;
			}
		}
	}

	var flows = root.getFlows().toArray();
	if (flows != null) {
		for ( var flowidx in flows) {
			var flow = flows[flowidx]
			if (id == flow.getId()) {
				label = flow.getLabel();
				return label;
			}
		}
	}

	return "";
}
WKF.createTaskItemModel = function(processCode, taskinfo) {

	var refTaskItemModel = com.accela.orm.model.workflow.RefTaskItemModel();
	refTaskItemModel.setServiceProviderCode(aa.getServiceProviderCode());
	refTaskItemModel.setProcessCode(processCode);
	refTaskItemModel.setTaskName(taskinfo["nameEN"]);
	refTaskItemModel.setAuditModel(new com.accela.orm.model.common.AuditModel())

	refTaskItemModel.setDisplayInACA(taskinfo["displayInACA"])
	refTaskItemModel.getAuditModel().setAuditID(aa.getAuditID());
	refTaskItemModel.getAuditModel().setAuditDate(new Date());
	refTaskItemModel.getAuditModel().setAuditStatus("A");
	refTaskItemModel.setAssignedDepartmentModel(new com.accela.orm.model.workflow.RefTaskAssignedDepartmentModel());
	var departmentID = taskinfo["department"];

	if (departmentID && departmentList[departmentID]) {
//	if (departmentID && _instance.org.departments[departmentID]) {
//		var depModel = _instance.org.departments[departmentID];

//		refTaskItemModel.getAssignedDepartmentModel().setAgencyCode(depModel.getAgencyCode());
//		refTaskItemModel.getAssignedDepartmentModel().setBureauCode(depModel.getBureauCode());
//		refTaskItemModel.getAssignedDepartmentModel().setDivisionCode(depModel.getDivisionCode());
//		refTaskItemModel.getAssignedDepartmentModel().setGroupCode(depModel.getGroupCode());
//		refTaskItemModel.getAssignedDepartmentModel().setSectionCode(depModel.getSectionCode());
//		refTaskItemModel.getAssignedDepartmentModel().setOfficeCode(depModel.getOfficeCode());
		
		var depModel = departmentList[departmentID];
		logDebug("depModel: " + depModel);
		depModel = depModel.split('/');
		
		refTaskItemModel.getAssignedDepartmentModel().setAgencyCode(depModel[1]);
		refTaskItemModel.getAssignedDepartmentModel().setBureauCode(depModel[2]);
		refTaskItemModel.getAssignedDepartmentModel().setDivisionCode(depModel[3]);
		refTaskItemModel.getAssignedDepartmentModel().setGroupCode(depModel[5]);
		refTaskItemModel.getAssignedDepartmentModel().setSectionCode(depModel[4]);
		refTaskItemModel.getAssignedDepartmentModel().setOfficeCode(depModel[6]);
		
	} else {
		refTaskItemModel.getAssignedDepartmentModel().setAgencyCode("NA");
		refTaskItemModel.getAssignedDepartmentModel().setBureauCode("NA");
		refTaskItemModel.getAssignedDepartmentModel().setDivisionCode("NA");
		refTaskItemModel.getAssignedDepartmentModel().setGroupCode("NA");
		refTaskItemModel.getAssignedDepartmentModel().setSectionCode("NA");
		refTaskItemModel.getAssignedDepartmentModel().setOfficeCode("NA");
	}

	if (taskinfo.duration) {
		refTaskItemModel.setDueDate(taskinfo.duration)
	}
	if (taskinfo.TSI) {
		refTaskItemModel.setCheckboxCode(taskinfo.TSI)
	}

	return refTaskItemModel;
}
WKF.createStatusModel = function(processCode, taskName, code, info) {
	var refTaskStatusModel = new com.accela.orm.model.workflow.RefTaskStatusModel();
	refTaskStatusModel.setProcessName(processCode);
	refTaskStatusModel.setStatusCode(code);
	refTaskStatusModel.setServiceProviderCode(aa.getServiceProviderCode())
	refTaskStatusModel.setStatusDescription(info.statusEN);
	refTaskStatusModel.setApplicationStatus(info.recStatusEN);
	refTaskStatusModel.setTaskName(taskName);
	refTaskStatusModel.setDisplayInACA("Y")
	if (info.clockAction) {
		refTaskStatusModel.setClockAction(info.clockAction)
	}
	return refTaskStatusModel;
}

function toJson(obj) {
    try {
        return JSON.parse(obj);
    } catch (e) {
    	logDebug("ERR Parsing JSON: " + e);
        return obj;
    }
}

function printJson(title, json){
	try{
		logDebug(title + "1: " + JSON.stringify(json));
	}catch(e){
		logDebug(title + "2: " + json);
	}
}

function createUpdateWorkflow(departmentListParam, json, wfCode, flowStyle, override, langId){
	logDebug('..............createUpdateWorkflow.............');
	logDebug('departmentList: ' + departmentListParam);
	logDebug('json: ' + json);
	printJson('createUpdateWorkflow::JSON', json);
	logDebug('wfCode: ' + wfCode);
	logDebug('flowStyle: ' + flowStyle);
	logDebug('override: ' + override);
	
	departmentList = departmentListParam;
	
	var ret = new WKF(langId).create(json, wfCode, flowStyle, override);
	logDebug('Create/Update Workflow Result: ' + JSON.stringify(ret));
	
//	return JSON.stringify(ret);
	return ret;
}
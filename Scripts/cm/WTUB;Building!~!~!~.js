if (wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0
) {
	showDebug = true;
	comment("Cannot Issue Permit until balance is paid.");
	 cancel = true;
}

/*var eventName = "WorkflowTaskUpdateBefore";  wfTask = "Permit Issuance";  wfStatus = "Issued";  wfDateMMDDYYYY = "10/08/2019";*/
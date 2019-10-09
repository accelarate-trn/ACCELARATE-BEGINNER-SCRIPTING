if (wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0) {
	showDebug = true;
	//let balDue = balanceDue;
	comment('This action cannot be taken. Balance remaining: $');
	cancel = true;
}
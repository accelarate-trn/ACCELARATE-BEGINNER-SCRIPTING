if (wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0) {
	showDebug = true;
	comment("This action cannot be done with balance due on the record.");
	cancel = true;
}
if (wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0) {
	showDebug = true;
	comment("Permit cannot be issued until all fees have been paid!");
	cancel = true;
}	
if (wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0) {
	showDebug = true;
	comment("This action cannot be taken due to a remaining balance.");
	cancel = true;
}

if (wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0) {
	showDebug = true;
	comment("Please pay the cash!");
}
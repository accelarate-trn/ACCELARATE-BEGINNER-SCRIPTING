if (wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0) {
		showDebug = true;
		comment("Get your money!!!");
		cancel = true;
}

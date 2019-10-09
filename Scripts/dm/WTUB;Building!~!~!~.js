if (wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0) {
	showDebug = true;
	comment("xxxxPayment due before permit can be issued.xxxx);
	cancel = true;
}
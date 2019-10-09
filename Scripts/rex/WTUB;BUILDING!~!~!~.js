{If (wftask == "Permit Issuance"&& wfStatus == "Issued"&& balanceDue > 0)
	showDebug - true;
    comment("Need a Credit Card before permit can be issued");
	cancel = true;
}
{If (wftask == "Permit Issuance"&& wfStatus == "Issued"&& balanceDue > 0)
	showMessge - true;
    comment("Need a Credit Card before permit can be issued");
	cancel = true;
}
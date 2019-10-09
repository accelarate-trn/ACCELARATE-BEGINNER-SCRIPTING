if (wfTask == "Permit Issuance" && wfStatus == "Issued"  && balanceDue > 0){
	showDebug = True;
	comment("Pay the $$ Please!");
	cancel = true;
}
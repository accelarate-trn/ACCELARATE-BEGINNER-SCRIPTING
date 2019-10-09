if (wfTask == "Permit Issuance" && wfStatus == "Issued"  && balanceDue > 0){
	showMessage = True;
	comment("Pay the $$ Please!");
	cancel = true;
}
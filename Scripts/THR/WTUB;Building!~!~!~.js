if (wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0) {
	showMessage = true;
	comment("Permit cannot be issued until all fees have been paid!");
	cancel = true;
}	

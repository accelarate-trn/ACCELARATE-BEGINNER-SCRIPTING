if (balance > 0 && wfTask == "Permit Issuance" && wfStatus == "Issued") {
	showMessage = true;
	comment ("This action cannot be taken until all outstanding fees are paid in full.");
	cancel = true;
}
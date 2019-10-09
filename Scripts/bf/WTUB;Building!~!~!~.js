if (wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0) {
	showMessage = true;
	comment ("This action cannot be done with a balance due on the record.");
cancel = true;
}
	

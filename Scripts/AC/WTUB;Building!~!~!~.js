if(wfTask == "Pertmit Issuance" &&  wfStatus == "Issued" && balanceDue > 0){
	showDebug = true;
	comment("There is a balance due");
	cancel = true;
}
if (wfTask == "Permit Issuance" && wfStatus == "Issue" && balanceDue > 0) {
	  showDebug = true;
	  comment("you have balance due");
	  cancel = true;
}

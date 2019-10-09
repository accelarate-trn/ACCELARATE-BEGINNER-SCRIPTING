if(wfTask == "Permit Issuance" &&  wfStatus == "Issued" && balanceDue > 0)
{
	
	showDebug = true;
	comment("**There is a balance due, do not issue***");
	cancel = true;
	
	
	
}







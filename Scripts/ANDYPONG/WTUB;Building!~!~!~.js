
	if(wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0)
	{
		showDebug = true;
		comment("Balance is due ; Do not issue Permit.");
		cancel = true;
	}
	

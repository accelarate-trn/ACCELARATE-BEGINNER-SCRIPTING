
	if(wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0)
	{
		showMessage = true;
		comment("Balance is due ; Do not issue Permit.");
		cancel = true;
	}
	

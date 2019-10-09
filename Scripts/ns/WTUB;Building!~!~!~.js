if (wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0)
	{
		showDebug = true;
		comment("Pay the amount due for the record");
		cancel = true;
	}
	
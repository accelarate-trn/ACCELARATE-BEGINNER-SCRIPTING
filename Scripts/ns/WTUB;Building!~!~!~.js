if (wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0)
	{
		showMessage = true;
		comment("Pay the amount due for the record");
		cancel = true;
	}
	
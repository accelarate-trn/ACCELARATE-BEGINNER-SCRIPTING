if (wfTask =="Permit Issuance" && wfStatus == "Issued" && balanceDue > 0){
	showDebug = true;
	comment( "If status is issued and no balance due then pay it Saher" );
	cancel = true;
}

if(wfTask == "Application Intake" && wfStatus == "Accepted - Plan Review Req"){
	updateFee("BLDGCOMALT04","BLDG_COM_ALT","FINAL",1,"Y");
	showMessage("Fee applied");
}else{
	showMessage("Fee not applied");
}
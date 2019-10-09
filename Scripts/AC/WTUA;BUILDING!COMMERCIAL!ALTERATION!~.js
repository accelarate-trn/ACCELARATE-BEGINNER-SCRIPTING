showMessage = true;
if(wfTask == "Application Intake" && wfStatus == "Accepted - Plan Review Req"){
	updateFee("BLDGCOMALT04","BLDG_COM_ALT","FINAL",1,"Y");
	comment("Fee applied");
}else{
	comment("Fee not applied");
}
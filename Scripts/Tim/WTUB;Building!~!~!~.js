if (wfTask == "Permit Issuance" && wfStatus == "Issued" && balanceDue > 0) {
showMessage = true;
comment("Pay Up");
cancel = true;
}

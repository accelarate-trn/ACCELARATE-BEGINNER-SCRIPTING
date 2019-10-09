If (wfTask == "Permit Issuance" &amp;&amp; wfStatus == "Issued" &amp;&amp; balanceDue> 0) {
showDebug = true;
comment("This action cannot be done with balance due on the record.");
cancel = true;
}
if (wfTask === "Permit Issuance" && wfStatus === "Issued" && balanceDue > 0) {
    showMessage = true;
    comment("Nice permit you got there. Shame if something happened to it.");
    cancel = true;
}

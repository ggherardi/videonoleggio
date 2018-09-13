class Modal {
/** modalOptions = {
 *      title,
 *      body,
 *      cancelButton: {
 *          text,
 *          action
 *      }
 *      confirmButton: {
 *          text,
 *          action
 *      }
 */ 
    constructor(modalOptions) {
        $("#SharedModalTitle").text(modalOptions.title);
        $("#SharedModalBody").html(modalOptions.body);
        if(modalOptions.cancelButton) {
            $("#ShareModalCancelButton").innerText(modalOptions.cancelButton.text);
            $("#ShareModalCancelButton").click(modalOptions.cancelButton.action);
        }
        if(modalOptions.confirmButton) {
            $("#ShareModalConfirmButton").innerText(modalOptions.confirmButton.text);        
            $("#ShareModalConfirmButton").click(modalOptions.confirmButton.action);
        }
    }

    open() {
        // $("#ButtonOpenSharedModal").click();
        $("#SharedModal").modal();
    }
}
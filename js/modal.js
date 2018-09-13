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
        this.modalOptions = modalOptions;
        this.sharedModal = $("#SharedModal");
        this.title = $("#SharedModalTitle");
        this.body = $("#SharedModalBody");
        this.cancelButton = $("#ShareModalCancelButton");
        this.confirmButton = $("#ShareModalConfirmButton");
        this.reset();
        this.buildModal();
    }

    reset() {
        this.cancelButton.text("Annulla");
        this.cancelButton.off("click")
        this.confirmButton.text("Conferma");        
        this.confirmButton.off("click");
        this.title.text("");
        this.body.html("");
    }

    buildModal() {
        this.title.text(this.modalOptions.title);
        this.body.html(this.modalOptions.body);
        if(modalOptions.cancelButton) {
            this.cancelButton.text(this.modalOptions.cancelButton.text);
            this.cancelButton.click(this.modalOptions.cancelButton.action);
        }
        if(modalOptions.confirmButton) {
            this.confirmButton.text(this.modalOptions.confirmButton.text);        
            this.confirmButton.click(this.modalOptions.confirmButton.action);
        }
    }

    open() {
        this.sharedModal.modal();
    }

    close() {
        this.sharedModal.modal(`toggle`);
    }
}
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
 *      onHide: {
 *          delegate
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
        this.sharedModal.off("hide.bs.modal");
        this.cancelButton.text("Chiudi");
        this.cancelButton.off("click")
        this.confirmButton.text("");        
        this.confirmButton.off("click");
        this.confirmButton.hide();
        this.title.text("");
        this.body.html("");
    }

    buildModal() {
        this.title.text(this.modalOptions.title);
        this.body.html(this.modalOptions.body);
        if(this.modalOptions.cancelButton) {
            this.cancelButton.text(this.modalOptions.cancelButton.text);
            this.cancelButton.click(this.modalOptions.cancelButton.action);
        }
        if(this.modalOptions.confirmButton) {
            this.confirmButton.show();
            this.confirmButton.text(this.modalOptions.confirmButton.text);        
            this.confirmButton.click(this.modalOptions.confirmButton.action);
        }
        if(this.modalOptions.onHide) {
            this.sharedModal.on("hide.bs.modal", this.modalOptions.onHide.action);
        }
    }

    open() {
        this.sharedModal.modal();
    }

    close() {
        this.sharedModal.modal(`toggle`);
    }

    openSuccessModal() {
        this.reset();
        this.modalOptions = {
            title: "Operazione completata",
            body: "<span>L'operazione è stata completata con successo</span>"            
        }
        this.buildModal();
        this.open();
    }
}
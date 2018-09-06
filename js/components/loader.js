class Loader {
    constructor(containerSelector) {
        this.container = $(containerSelector);
        this.containerChildren = this.container.children();
        this.spinnerClassName = "loader-spinner";
        this.spinnerImg = $(`<img class="${this.spinnerClassName}" src='/images/spinner-loader.gif' width='100'>`);
    }

    showLoader() {
        // this.tempHtml = $(this.container).html();
        for(var i = 0; i < this.containerChildren.length; i++) {
            $(this.containerChildren[i]).hide();
        }
        this.spinnerImg.insertBefore(this.container[0].firstElementChild);
        // $(this.container).html();
        // setTimeout(() => { $(this.container).html(this.tempHtml); }, 1000);
    }

    hideLoader() {
        for(var i = 0; i < this.containerChildren.length; i++) {
            $(this.containerChildren[i]).show();
        }
        var firstChild = this.container[0].firstElementChild;
        if($(firstChild).hasClass(this.spinnerClassName)) {
            firstChild.remove();
        } else {
            // this.container.children()
        }
    }
}
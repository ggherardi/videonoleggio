class Loader {
    constructor(containerSelector, width = 100, height = 100) {
        this.container = $(containerSelector);
        this.containerChildren = this.container.children();
        this.spinnerClassName = "loader-spinner";
        this.spinnerImg = $(`<img class="${this.spinnerClassName}" src='/images/spinner-loader.gif' width='${width}' height='${height}'>`);
    }

    showLoader() {
        for(var i = 0; i < this.containerChildren.length; i++) {
            $(this.containerChildren[i]).hide();
        }
        if(this.container[0].firstElementChild) {
            this.spinnerImg.insertBefore(this.container[0].firstElementChild);
        } else {
            this.container.append(this.spinnerImg);
        }
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
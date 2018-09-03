class ViewManager{
    constructor(containerSelector){
        this.baseUrl = window.location.host;
        this.containerSelector = containerSelector;
    }

    menuClick(menuVoice){
        console.log(menuVoice);
        this.render(menuVoice.innerText.toLowerCase());
    }

    setView(view){
        var renderSuccess = function(data) {
            $(this.containerSelector).html(data);
        }

        var renderError = function(error) {
            console.log(error);
        }

        var ajaxOptions = {
            url: `${view}.html`,
            success: renderSuccess.bind(this),
            error: renderError.bind(this)
        }

        $.ajax(ajaxOptions);
    }
}

class Menu{
    constructor(menuItems){
        this.menuItems = menuItems;
    }
    
    buildMenu(){
        for(i = 0; i < this.menuItems.length; i++){
            
        }
    }
}
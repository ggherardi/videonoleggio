class ViewManager{
    constructor(containerSelector){
        this.baseUrl = window.location.host;
        this.containerSelector = containerSelector;
    }

    menuClick(menuVoice){
        console.log(menuVoice);
        this.render(menuVoice.innerText.toLowerCase());
    }

    render(view){
        var renderSuccess = function(data){
            $(this.containerSelector).html(data);
        }

        var renderError = function(error){
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

$().ready(function(){
    viewManager = new ViewManager("#content_zone_0");
    viewManager.render("home");
})
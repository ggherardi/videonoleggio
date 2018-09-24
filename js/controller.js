class Controller {
    constructor(containerSelector) {
        this.baseUrl = window.location.host;
        this.containerSelector = containerSelector;
        this.renderSuccess = function(data) {
            this.loadCorrelatedScript();
            $(this.containerSelector).html(data);
        }
        this.renderError = function(error) {
            console.log(error);
        }
        this.ajaxOptions = {
            success: this.renderSuccess.bind(this),
            error: this.renderError.bind(this)
        };
    }

    setView(view) {
        this.correlatedScripUrl = `js/views/${view.name.toLowerCase()}.js`;
        this.ajaxOptions.url = `/views/${view.name.toLowerCase()}.html`;
        return this.set();
    }

    setComponent(component) {
        this.correlatedScripUrl = `js/components/${component.title.toLowerCase()}.js`;
        this.ajaxOptions.url = `/components/${component.title.toLowerCase()}.html`;
        return this.set();
    }

    set() {
        return $.ajax(this.ajaxOptions);
    }

    loadCorrelatedScript() {
        var allScripts
        // try {
        //     allScripts = [...document.scripts];
        // } catch {
            allScripts = [].slice.call(document.scripts)
        // }
        var alreadyLoadedScript = allScripts.find((el) => { return el.src == this.correlatedScripUrl});
        if(!alreadyLoadedScript) {
            var script = document.createElement("script");
            script.setAttribute("src", this.correlatedScripUrl);
            document.head.appendChild(script);
        }
    }
}

class Menu {
    constructor(menuItems) {
        this.menuItems = menuItems;
        this.activeClassName = "active";
    }
    
    buildMenu() {
        this.html = "";
        for(var key in this.menuItems) {
            var item = this.menuItems[key];
            var arePermissionsValid = item.needPermissions ? sharedStorage.loginContext.delega_codice >= item.needPermissions : true;
            if(arePermissionsValid && item.showInMenu == undefined || item.showInMenu) {          
                this.html += 
                    `<li id='NavItem_${item.name}'>` +
                    `   <span onclick='menuClick(this);' data-view='${item.name}'>${item.title}</span>` +
                    `</li>`;   
            }                
        }
        this.appendMenu();
    }

    appendMenu() {
        $("#DesktopNav").html(this.html);
        $("#MobileNav").html(this.html);
    }

    setMenuItemActive(view) {
        var findActiveItem = function(el) { return el.className == this.activeClassName };
        var items = $("#DesktopNav").children();
        var prevItem = items.toArray().find(findActiveItem.bind(this));    
        if(prevItem){
            $(prevItem).removeClass(this.activeClassName);
        }
        var currItem = $(`#NavItem_${view.name}`);
        if(currItem){
            $(currItem).addClass(this.activeClassName);
        }
    }
}
export class Controller {
    constructor(containerSelector) {
        this.baseUrl = window.location.host;
        this.containerSelector = containerSelector;
        this.renderSuccess = function(data) {
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
        this.ajaxOptions.url = `/views/${view.toLowerCase()}.html`;
        return this.set();
    }

    setComponent(component) {
        this.ajaxOptions.url = `/components/${component.toLowerCase()}.html`;
        return this.set();
    }

    set() {
        return $.ajax(this.ajaxOptions);
    }
}

export class Menu {
    constructor(menuItems) {
        this.menuItems = menuItems;
        this.html = "";
        this.activeClassName = "active";
    }
    
    buildMenu() {
        for(var key in this.menuItems) {
            var item = this.menuItems[key];
            if(item.showInMenu == undefined || item.showInMenu) {
                var itemText = this.menuItems[key].title;
                this.html += 
                    `<li id='NavItem_${itemText}'>` +
                    `   <span onclick='menuClick(this);'>${itemText}</span>` +
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
        var currItem = $(`#NavItem_${view}`);
        if(currItem){
            $(currItem).addClass(this.activeClassName);
        }
    }
}
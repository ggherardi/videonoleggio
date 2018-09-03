viewManager = {};
menu = {};

$().ready(function(){
  initView();
})

function initView(){
    viewManager = new ViewManager("#content_zone_0");
    viewManager.setView("home");  
}

function initMenu(){
    var menuItems = [
        "Home",
        "Noleggi"
    ];
    menu = new Menu();
} 
/* Settings */
var views = {
    home: { title: "Home" },
    login: { title: "Login", showInMenu: false },
    noleggi: { title: "Noleggi" }
};

var components = {
    navbar: { title: "Navbar" },
    sidebar: { title: "Sidebar" }
};

/* Properties */
mainContentController = {};
sidebarController = {};
menu = {};
cookiesManager = {};
authService = {};

/* Document ready */
$().ready(function() {
    initClasses();
    if(authService.isUserLogged()) {
        initHomepage();
    } else {
        initLogin();
    }
})

/* Init functions */
function initClasses(){
    menu = new Menu(views);
    mainContentController = new Controller("#ContentZone0");
    sidebarController = new Controller("#Sidebar");
    navbarController = new Controller("#Navbar");
    cookiesManager = new CookiesManager();
    authService = new AuthenticationService(cookiesManager);
}

function initHomepage() {
    initMasterpageComponents();
}

function initMasterpageComponents() {
    sidebarController.setComponent(components.sidebar.title);
    $.when(navbarController.setComponent(components.navbar.title)).then(() => menu.buildMenu()).done(initView)
} 

function initView() {
    mainContentController.setView(views.home.title);
    menu.setMenuItemActive(views.home.title);
}

function initLogin() {
    mainContentController.setView(views.login.title);
}

/* Events */
function menuClick(menuItem) {
    mainContentController.setView(menuItem.innerText);
    menu.setMenuItemActive(menuItem.innerText);
}
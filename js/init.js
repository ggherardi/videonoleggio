/* Settings */
var views = {
    home: "Home", 
    login: "Login",
    noleggi: "Noleggi"
};

var components = {
    navbar: "Navbar",
    sidebar: "Sidebar"
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
    if(!authService.isUserLogged()) {
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
    initView();
}

function initMasterpageComponents() {
    sidebarController.setComponent(components.sidebar);
    navbarController.setComponent(components.navbar, () => menu.buildMenu());
} 

function initView() {
    mainContentController.setView(views.home);
    menu.setMenuItemActive(views.home);
}

function initLogin() {
    mainContentController.setView(views.login);
}

/* Events */
function menuClick(menuItem) {
    mainContentController.setView(menuItem.innerText);
    menu.setMenuItemActive(menuItem.innerText);
}
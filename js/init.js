/* Settings */
var views = {
    home: { title: "Home", name: "home" },
    login: { title: "Login", name: "login", showInMenu: false },
    rentals: { title: "Noleggi", name: "rentals" },
    storage: { title: "Magazzino", name: "storage", needPermissions: permissions.levels.responsabile },
    accounts: { title: "Gestione utenti", name: "accounts", needPermissions: permissions.levels.proprietario }
};

var components = {
    navbar: { title: "Navbar" },
    sidebar: { title: "Sidebar" }
};

/* Classes */
var menu = new Menu(views);
var mainContentController = new Controller(placeholders.mainContentZone);
var sidebarController = new Controller("#Sidebar");
var navbarController = new Controller("#Navbar");
var cookiesManager = new CookiesManager();
var authenticationManager = new AuthenticationManager(cookiesManager);

/* Properties */
var mainContentLoader;

/* Document ready */
$().ready(function() {
    if(authenticationManager.isUserLogged()) {
        initHomepage();
    } else {
        initLogin();
    }
})

/* Init functions */
function initHomepage() {
    initUser();
    initMasterpageComponents();
}

function initUser() {
    if(!sharedStorage.loginContext) {
        sharedStorage.loginContext = cookiesManager.getObjectFromCookie(authenticationManager.loginContext);
    }
}

function initMasterpageComponents() {
    $.when(navbarController.setComponent(components.navbar), 
        sidebarController.setComponent(components.sidebar))
        .then(() => { menu.buildMenu() })
        .done(initView)
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
    var view = views[menuItem.dataset["view"]];
    mainContentController.setView(view);
    menu.setMenuItemActive(view);
}

/* Shared functions */
function validateForm(formId) {
    return $(formId)[0].checkValidity();
}
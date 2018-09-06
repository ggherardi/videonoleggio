/* Settings */
var views = {
    home: { title: "Home" },
    login: { title: "Login", showInMenu: false },
    noleggi: { title: "Noleggi" },
    accounts: { title: "Gestione utenti", needPermissions: permissions.levels.proprietario }
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
var authManager = new AuthenticationManager(cookiesManager);

/* Properties */
var mainContentLoader;

/* Document ready */
$().ready(function() {
    if(authManager.isUserLogged()) {
        initHomepage();
    } else {
        initLogin();
    }
    mainContentLoader = new Loader(placeholders.mainContentZone);
})

/* Init functions */
function initHomepage() {
    mainContentLoader.showLoader();
    initMasterpageComponents();
}

function initMasterpageComponents() {
    $.when(navbarController.setComponent(components.navbar.title))
        .then(() => { sidebarController.setComponent(components.sidebar.title); menu.buildMenu() })
        .done(initView)
        .then(endInitHome.bind(this));
} 

function endInitHome() {
    mainContentLoader.hideLoader();
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
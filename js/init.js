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
    if(!sharedStorage.user) {
        sharedStorage.user = cookiesManager.getObjectFromCookie(authenticationManager.userCookieName);
    }
}

function initMasterpageComponents() {
    $.when(navbarController.setComponent(components.navbar.title), 
        sidebarController.setComponent(components.sidebar.title))
        .then(() => { menu.buildMenu() })
        .done(initView)
} 

function initView() {
    mainContentController.setView(views.home.title);
    menu.setMenuItemActive(views.home.title);
    initSidebarResize();
}

function initSidebarResize() {
    // sideBarResize();
    // window.removeEventListener("resize", sideBarResize);
    // window.addEventListener("resize", sideBarResize);
}

function sideBarResize() {
    var contentHeight = $(placeholders.mainContentZone).height();
    $(placeholders.sidebar).height(contentHeight);
}

function initLogin() {
    mainContentController.setView(views.login.title);
}

/* Events */
function menuClick(menuItem) {
    mainContentController.setView(menuItem.innerText);
    menu.setMenuItemActive(menuItem.innerText);
}
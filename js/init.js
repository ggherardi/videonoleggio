/* Import */
import { Menu, Controller } from "./controller.js"
import { CookiesManager } from "./cookiesmanager.js"
import { AuthenticationManager } from "./authenticationmanager.js"

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

/* Classes */
var menu = new Menu(views);
var mainContentController = new Controller("#ContentZone0");
var sidebarController = new Controller("#Sidebar");
var navbarController = new Controller("#Navbar");
var cookiesManager = new CookiesManager();
var authManager = new AuthenticationManager(cookiesManager);

/* Document ready */
$().ready(function() {
    if(!authManager.isUserLogged()) {
        initHomepage();
    } else {
        initLogin();
    }
})

/* Init functions */

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
/* Settings */
var views = {
    home: { title: "Home", name: "home" },
    login: { title: "Login", name: "login", showInMenu: false },
    rentals: { title: "Noleggi", name: "rentals" },
    // returns: { title: "Restituzioni", name: "returns" },
    // bookings: { title: "Prenotazioni", name: "bookings" },
    customers: { title: "Gestione clienti", name: "customers" },
    storage: { title: "Magazzino", name: "storage", needPermissions: permissions.levels.responsabile },
    accounts: { title: "Gestione dipendenti", name: "accounts", needPermissions: permissions.levels.proprietario }
};

var components = {
    navbar: { title: "Navbar" },
    sidebar: { title: "Sidebar" }
};

/* Classes */
var menu = new Menu(views);
var authenticationService = new AuthenticationService();
var mainContentController = new Controller(placeholders.mainContentZone);
var sidebarController = new Controller("#Sidebar");
var navbarController = new Controller("#Navbar");
var cookiesManager = new CookiesManager();
var authenticationManager = new AuthenticationManager(cookiesManager);

/* Properties */
var mainContentLoader;

/* Document ready */
$().ready(function() {
    authenticationService.authenticateUser()
        .done((data) => {
            var res = JSON.parse(data);
            if(res) {
                initHomepage(res);
            } else {
                initLogin();
            }
        })
        .fail((data) => {
            initLogin();
        });
})

/* Init functions */
function initHomepage(loginContext) {
    initUser(loginContext);
    initMasterpageComponents();
}

function initUser(loginContext) {
    if(!sharedStorage.loginContext) {
        sharedStorage.loginContext = loginContext;
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

function restCallError(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR.status);
}

function formatDateFromString(dateString) {
    var date = new Date(dateString);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${year}`;
}

function switchDateDigitsPosition(dateString) {
    var arr = dateString.split("-");
    var newDateString = `${arr[2]}-${arr[1]}-${arr[0]}`;
    return newDateString;
}

function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
       var ascii = binaryString.charCodeAt(i);
       bytes[i] = ascii;
    }
    return bytes;
 }

 function saveByteArray(reportName, byte) {
    var blob = new Blob([byte], {type: "application/pdf"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    return link;
    // link.click();
};
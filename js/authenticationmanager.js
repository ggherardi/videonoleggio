/* Requires: cookiesmanager.js */
class AuthenticationManager {
    constructor(cookiesManager) {
        this.cookiesManager = cookiesManager;
        this.loginContext = 'loginContext';
    }

    isUserLogged() {
        return this.cookiesManager.getCookie(this.loginContext) != undefined;
    }
}
/* Requires: cookiesmanager.js */
class AuthenticationService {
    constructor(cookiesManager) {
        this.cookiesManager = cookiesManager;
        this.userCookieName = 'user';
    }

    isUserLogged() {
        return this.cookiesManager.getCookie(this.userCookieName) != undefined;
    }
}
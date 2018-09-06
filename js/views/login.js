var authService = new AuthenticationService();

function login(sender) {
    Loader.showLoader("#"+$(sender).parent()[0].id);
    authService.login("admin", "admin").then(loginSuccess);
}

function loginSuccess(data) {
    // initHomepage();
}
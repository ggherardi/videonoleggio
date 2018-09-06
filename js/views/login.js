var authService = new AuthenticationService();
var formLoader = new Loader("#LoginForm");

function login(sender) {
    formLoader.showLoader("#"+$(sender).parent()[0].id);
    authService.login("admin", "admin").done(loginSuccess).then(() => formloader.hideLoader());
}

function loginSuccess(data) {
    initHomepage();
}
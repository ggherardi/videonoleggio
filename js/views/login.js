var formId = "#LoginForm"
var authService = new AuthenticationService();
var formLoader = new Loader(formId);

function login(sender) {
    formLoader.showLoader(formId);
    var username = $("#Inputusername").val();
    var password = $("InputPassword").val(); 
    authService.login(username, password)
        .done(loginSuccess)
        .fail(() => console.log("fail"))
        .then(endLogin.bind(this));
}

function loginSuccess(data) {
    initHomepage();
}

function endLogin() {
    formLoader.hideLoader();
}
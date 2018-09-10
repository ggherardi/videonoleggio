var formId = "#LoginForm"
var errorSpanId = "#LoginErrorSpan";
var authService = new AuthenticationService();
var formLoader = new Loader(formId);

function login(sender) {
    $(errorSpanId).hide();
    formLoader.showLoader(formId);
    var username = $("#InputUsername").val();
    var password = $("#InputPassword").val(); 
    authService.login(username, password)
        .done(loginSuccess)
        .fail(loginFail)
        .always(endLogin.bind(this));
}

function loginSuccess(data) {
    sharedStorage.user = JSON.parse(data);
    cookiesManager.setEncodedCookie(authenticationManager.loginContext, sharedStorage.user, 10);
    $("#LoginForm").remove();
    initHomepage();
}

function loginFail(jqXHR, textStatus, errorThrown) {
    var errorSpan = $(errorSpanId);
    var errorText = "";
    switch(jqXHR.status) {
        case httpUtilities.httpStatusCodes.unauthorized:
            errorText = "I dati inseriti non sono corretti.";
            break;
        case httpUtilities.httpStatusCodes.internalServerError:
            errorText = "Si è verificato un errore interno.";
            break;
        default: 
            errorText = "Si è verificato un errore."
            break;
    }
    errorSpan.show();
    errorSpan.text(errorText);
}

function endLogin() {
    formLoader.hideLoader();
}
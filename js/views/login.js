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
        .always(() => formLoader.hideLoader());
}

function loginSuccess(data) {
    sharedStorage.loginContext = JSON.parse(data);
    sharedStorage.loginContext.isAdmin = sharedStorage.loginContext.delega_codice >= 30;
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

function openGuide() {
    body = "<h3>Credenziali per l'accesso al sito</h3>";
    body += `<table class="table mt-2">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Ruolo</th>
                        <th>P. vendita</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>guest</td>
                        <td>password</td>
                        <td>Proprietario</td>
                        <td>Roma01</td>
                    </tr>
                    <tr>
                        <td>marrosroma01</td>
                        <td>password</td>
                        <td>Responsabile</td>
                        <td>Roma01</td>
                    </tr>
                    <tr>
                        <td>luiverroma01</td>
                        <td>password</td>
                        <td>Addetto</td>
                        <td>Roma01</td>
                    </tr>
                </tbody>
            </table>
            <div>
                <span>Una volta effettuato l'accesso al sito come proprietario, è possibile reperire le altre utenze dalla pagina "Gestione dipendenti". La password è uguale per tutti ed è "password".</span><br>
                <span>Utilizzare i link di seguito, invece, per scaricare la documentazione e gli zip contenti gli script PHP, i file JS e gli schema SQL.</span>
            </div>
            <div class="mt-3">
                <a href="/documentazione/RelazioneTecnicaWebApplication RentNet.pdf" download>Scarica la documentazione</a><br>
                <a href="/documentazione/source/scriptPHP.7z" download>Scarica i servizi PHP</a><br>
                <a href="/documentazione/source/scriptJS.7z" download>Scarica i file JS</a><br>
                <a href="/documentazione/source/scriptSQL.7z" download>Scarica gli script SQL</a>
            </div>`;
    modalOptions = {
        title: "Guida all'accesso al sito",
        body: body,
        cancelButton: {
            text: "Chiudi"
        }
    }

    modal = new Modal(modalOptions);
    modal.open(); 
}
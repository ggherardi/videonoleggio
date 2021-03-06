var authenticationService = authenticationService || new AuthenticationService();

function buildSidebarDetails() {
    var details = [
        { key: "Punto vendita", value: sharedStorage.loginContext.punto_vendita_nome },
        { key: "Città", value: sharedStorage.loginContext.citta_nome },
        { key: "Indirizzo", value: sharedStorage.loginContext.punto_vendita_indirizzo }
    ];
    var html = "";
    html += `<span id="SidebarUsername" class="general_info_title">${sharedStorage.loginContext.username}</span>`;
    html += `<div id="SidebarDelega" class="general_info_title">(${sharedStorage.loginContext.delega_nome})</div>`;
    html += `<div class="simple-button simple-button-small" onclick="logout();">Logout</div>`;
    html += `<ul class="general_info_list">`;
    for(var i = 0; i < details.length; i++) {
        html += `   <li class="d-flex flex-row align-items-center justify-content-start">`;
        html += `       <div class="general_info_text">${details[i].key}: <span>${details[i].value}</span></div>`;
        html += `   </li>`;
    }
    html += `</ul>`;
    $("#SidebarDetails").html(html);
}

function logout() {
    authenticationService.logout()
        .done(() => {
            sharedStorage.user = null;
            $(placeholders.sidebar).html("");
            $(placeholders.navbar).html("");
            mainContentController.setView(views.login);
        })
        .fail(RestClient.redirectIfUnauthorized);
}

/* Init */
buildSidebarDetails();
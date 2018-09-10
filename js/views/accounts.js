var accountManagementService = new AccountManagementService();

initAccountManager();

function initAccountManager() {
    accountManagementService.getCities()
        .done(getCitiesSuccess)
        .fail(restCallError);
}

function getCitiesSuccess(data) {
    var cities = JSON.parse(data);
    var citiesSelectHtml = "<option>-seleziona-</option>";
    for(var i = 0; i < cities.length; i++) {
        citiesSelectHtml += `<option value='${cities[i].citta_id}'>${cities[i].citta_nome}</option>`;
    }
    var select = $("#AccountsSelectCity");
    if(select[0]) {
        select.html(citiesSelectHtml);
    }
}

function getStores(select) {
    var option = $(`#${select.id} option:selected`);
    var value = option.val();
    if(!isNaN(value)) {
        accountManagementService.getStores()
            .done()
            .fail(restCallError);
    }
}

function restCallError(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR.status);
}
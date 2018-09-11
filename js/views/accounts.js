var accountManagementService = new AccountManagementService();
var selectStoreContainer =  $("#SelectStoreContainer");
var employeesTable = $("#EmployeesTable");
var selectLoader;

initAccountManager();

function initAccountManager() {
    selectLoader = new Loader("#SelectCityContainer", 25, 25);
    selectLoader.showLoader();
    accountManagementService.getCities()
        .done(getCitiesSuccess)
        .fail(restCallError)
        .always(() => selectLoader.hideLoader());
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
    loader = new Loader("#SelectStoreContainer", 25, 25);
    var option = $(`#${select.id} option:selected`);
    var cityId = option.val();
    if(!isNaN(cityId)) {
        loader.showLoader();
        accountManagementService.getStores(cityId)
            .done(getStoresSuccess)
            .fail(restCallError)
            .always(() => loader.hideLoader());
    } else {
        selectStoreContainer.html("");
    }
}

function getStoresSuccess(data) {
    var stores = JSON.parse(data);
    var html = "";
    if(stores.length > 0) {
        html += `<div class="row">
                    <span class="col-sm-6">Selezionare il punto vendita:</span>
                    <div class="col-sm-6 row">
                        <select id="AccountsSelectStore" class="col-sm-12" onchange="getEmployees(this);">
                            <option>-seleziona-</option>`;
        for(var i = 0; i < stores.length; i++) {
            html += `       <option value='${stores[i].punto_vendita_id}'>${stores[i].punto_vendita_nome}</option>`
        }
        html += `       </select>
                    </div>
                </div>`;
    } else {
        html += `<span>Nessun punto vendita trovato per la città selezionata.</span>`;
    }
    selectStoreContainer.html(html);
}

function getEmployees(select) {
    loader = new Loader("#EmployeesTable", 25, 25);
    var option = $(`#${select.id} option:selected`);
    var storeId = option.val();
    if(!isNaN(storeId)) {
        loader.showLoader();
        accountManagementService.getEmployees(storeId)
            .done(getEmployeesSuccess)
            .fail(restCallError)
            .always(() => loader.hideLoader());
    } else {
        selectStoreContainer.html("");
    }
}

function getEmployeesSuccess(data) {
    var employees = JSON.parse(data);
    console.log(employees);
    var html = `<thead>
                    <tr>
                    <th scope="col">Punto vendita</th>
                    <th scope="col">Username</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Cognome</th>
                    <th scope="col">Ruolo</th>
                    </tr>
                </thead>`;
    for(var i = 0; i < employees.length; i++) {
        html += "";
    }
    employeesTable.html(html);
}

function restCallError(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR.status);
}
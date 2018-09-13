var accountManagementService = new AccountManagementService();
var getAllItemsService;
var selectStoreContainer =  $("#SelectStoreContainer");
var employeesTableContainer = $("#EmployeesTableContainer");
var employeesDataTable;
var allRoles;
var allStores;
var dataTableOptions = {
        dom: 'Bftpil',
        buttons: true,
        select: true,
        columnDefs: [{
            targets: 0,
            visible: false,
            searchable: false
        }, {
            targets: 1,
            visible: false,
            searchable: false
        }],
        buttons: [
            { extend: 'copy', text: "Copia" },
            { extend: 'selectedSingle', text: "Resetta password", action: resetPassword },
            { extend: 'selectedSingle', text: "Modifica", action: editEmployee },
            { extend: 'selected', text: "Cancella", action: (e, dt, node, config, a, b, c, d) => console.log(config) },
            { text: "Nuovo", action: (e, dt, node, config) => console.log("Nuovo") },
        ]
};

function initAccountManager() {
    loader = new Loader("#SelectCityContainer", 25, 25);
    loader.showLoader();
    accountManagementService.getCities()
        .done(getCitiesSuccess)
        .fail(restCallError)
        .always(() => loader.hideLoader());
}

function getCitiesSuccess(data) {
    var cities = JSON.parse(data);
    var citiesSelectHtml =  "<option>-seleziona-</option>";
    citiesSelectHtml += "<option value='-1'>Tutte</option>";
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
                            <option>-seleziona-</option>
                            <option value="-1">Tutti</option>`;
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
    loader = new Loader(`#${employeesTableContainer.attr("id")}`, 100, 100);
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
    var html = `<table class="table mt-3" id="EmployeesTable">`
    html +=         getEmployeeTableHtml();
    html +=        `<tbody>`;            
    for(var i = 0; i < employees.length; i++) {
            html +=     `<tr>
                            <td>${employees[i].dipendente_id}</td>
                            <td>${employees[i].punto_vendita_id}</td>
                            <td>${employees[i].punto_vendita_nome}</td>
                            <td>${employees[i].dipendente_username}</td>
                            <td>${employees[i].dipendente_nome}</td>
                            <td>${employees[i].dipendente_cognome}</td>
                            <td>${employees[i].delega_nome}</td>
                        </tr>`;
    }	
    html += `       </tbody>
                </table>`;
    employeesTableContainer.html(html);
    employeesDataTable = $("#EmployeesTable").DataTable(dataTableOptions);
    setManageAccountMaxWidth();
}

function setManageAccountMaxWidth() {
    var containerMaxWidth = $("#EmployeesTable").width();
    var childrenArray = $("#ManageAccountContainer").children();
    for(var i = 0; i < childrenArray.length; i++) {
        $(childrenArray[i]).css(`max-width`, `${containerMaxWidth}px`);
    }
}

function getEmployeeTableHtml() {
    return `<thead>
                <tr>
                    <th scope="col">Id dipendente</th>
                    <th scope="col">Id punto vendita</th>
                    <th scope="col">Punto vendita</th>
                    <th scope="col">Username</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Cognome</th>
                    <th scope="col">Ruolo</th>
                </tr>
            </thead>`;
}

function restCallError(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR.status);
}

/* Edit Employee */
function editEmployee(e, dt, node, config) {
    var row = dt.rows({ selected: true }).data()[0];    
    var editModalBody = buildEmployeeForm(row);

    modalOptions = {
        title: "Modifica account",
        body: editModalBody,
        cancelButton: {
            text: "Annulla"
        },
        confirmButton: {
            text: "Applica modifiche",
            action: editItem
        }
    }
    modal = new Modal(modalOptions);
    modal.open();  
    selectStoreLoader = new Loader("#EmployeeForm_punto_vendita_container", 25, 25);
    selectStoreLoader.showLoader();
    selectRoleLoeader = new Loader("#EmployeeForm_ruolo_container", 25, 25);
    selectRoleLoeader.showLoader();
    getAllItemsService = new GetAllItemsService();
    $.when(getAllItemsService.getAllStores(), getAllItemsService.getAllRoles())
        .done(buildSelects.bind(row))
        .always(() => { selectStoreLoader.hideLoader(); selectRoleLoeader.hideLoader(); });   
}

function buildEmployeeForm(row) {
    var html = `<form class="form-signin">
                    <input id="EmployeeForm_dipendente_id" type="hidden" value="${row[0]}">
                    <label for="EmployeeForm_punto_vendita" class="mt-2">Punto vendita</label>
                    <div id="EmployeeForm_punto_vendita_container">
                        <select id="EmployeeForm_punto_vendita" type="text" class="form-control"></select>
                    </div>
                    <label for="EmployeeForm_username" class="mt-2">Username</label>
                    <input id="EmployeeForm_username" type="text" class="form-control" value="${row[3]}" text="${row[3]}">
                    <label for="EmployeeForm_nome" class="mt-2">Nome</label>
                    <input id="EmployeeForm_nome" type="text" class="form-control" value="${row[4]}" text="${row[4]}">
                    <label for="EmployeeForm_cognome" class="mt-2">Cognome</label>
                    <input id="EmployeeForm_cognome" type="text" class="form-control" value="${row[5]}" text="${row[5]}">
                    <label for="EmployeeForm_ruolo" class="mt-2">Punto vendita</label>
                    <div id="EmployeeForm_ruolo_container">
                        <select id="EmployeeForm_ruolo" type="text" class="form-control"></select>
                    </div>
                </form>`;
    return html;
}

function buildSelects(stores, roles) {
    allStores = JSON.parse(stores[0]);
    allRoles = JSON.parse(roles[0]);
    buildOptions({ title: "stores", items: allStores }, this, "#EmployeeForm_punto_vendita");
    buildOptions({ title: "roles", items: allRoles }, this, "#EmployeeForm_ruolo");
}

function buildOptions(table, row, selectId) {
    var array = table.items;
    var html = "";
    for(var i = 0; i < array.length; i++) {
        if(table.title == "stores") {
            html += `<option value="${array[i].id_punto_vendita}" ${array[i].id_punto_vendita == row[1] ? "selected" : ""}>${array[i].nome}</option>`;
        } else {
            html += `<option value="${array[i].id_delega}" ${array[i].nome == row[6] ? "selected" : ""}>${array[i].nome}</option>`;
        }
    }    
    $(selectId).html(html);
}

function editItem() {
    var employee = {
        id_dipendente: $("#EmployeeForm_dipendente_id").val(),
        id_punto_vendita: $("#EmployeeForm_punto_vendita option:selected").val(),
        username: $("#EmployeeForm_username").val(),
        nome: $("#EmployeeForm_nome").val(),
        cognome: $("#EmployeeForm_cognome").val(),
        id_delega: $("#EmployeeForm_ruolo option:selected").val(),
    };
    accountManagementService.editEmployee(employee)
        .done(editItemSuccess)
        .fail(restCallError);
}

function editItemSuccess(data) {
    if(data) {
        modal.close();
        getEmployees($("#AccountsSelectStore")[0]);
    }
}

/* Reset Password */
function resetPassword(e, dt, node, config) {
    var row = dt.rows({ selected: true }).data()[0];    
    modalOptions = {
        title: "Resetta password",
        body: `<span>Si desidera resettare la password dell'utente ${row[3]}?</span>`,
        cancelButton: {
            text: "Annulla"
        },
        confirmButton: {
            text: "Conferma",
            action: resetItem.bind(row)
        }
    }
    modal = new Modal(modalOptions);
    modal.open();  
}

function resetItem() {
    accountManagementService.resetPassword(this[0])
        .done(resetPasswordSuccess)
        .fail(restCallError);
}

function resetPasswordSuccess(data) {
    modal.close();
    console.log(data);
}

/** Init */
initAccountManager();
var accountManagementService = new AccountManagementService();
var selectStoreContainer =  $("#SelectStoreContainer");
var employeesTableContainer = $("#EmployeesTableContainer");
var employeesDataTable;
var dataTableOptions = {
        dom: 'Bftpil',
        buttons: true,
        select: true,
        columnDefs: [{
            targets: 0,
            visible: false,
            searchable: false
        }],
        buttons: [
            { extend: 'copy', text: "Copia" },
            { extend: 'selectedSingle', text: "Modifica", action: editEmployee },
            { extend: 'selected', text: "Cancella", action: (e, dt, node, config, a, b, c, d) => console.log(config) },
            { text: "Nuovo", action: (e, dt, node, config) => console.log("Nuovo") },
        ]
};

function editEmployee(e, dt, node, config) {
    var row = dt.rows({ selected: true }).data()[0];
    // var editModalBody = `<table>`;
    // editModalBody +=     getEmployeeTableHtml();
    // editModalBody += `  <tr>
    //                         <td><input type="text"></td>
    //                         <td><input type="text"></td>
    //                     </tr>
    //                 </table>`;
    var editModalBody = `<form class="form-signin">`;
    editModalBody += `      <input id="dipendente_id" type="hidden" value="${row != undefined ? row[0] : ''}">`;
    for(var i = 0; i < 4; i++) {
        editModalBody += `  <label for="InputUsername" class="sr-only">Username</label>`;
        editModalBody += `  <input type="text" class="form-control" value="${row != undefined ? row[i] : ''}" text="${row != undefined ? row[i] : ''}" />`;
    }
    // editModalBody += `      <input type="text" class="form-control" value="${row[1]}" text="${row[1]}" />`;
    // editModalBody += `      <input type="text" class="form-control" value="${row[2]}" text="${row[2]}" />`;
    // editModalBody += `      <input type="text" class="form-control" value="${row[3]}" text="${row[3]}" />`;
    // editModalBody += `      <input type="text" class="form-control" value="${row[4]}" text="${row[4]}" />`;
    editModalBody += `      <select type="text" class="form-control" />`;
    editModalBody += `  </form>`;
    modalOptions = {
        title: "Modifica account",
        body: editModalBody
    }
    modal = new Modal(modalOptions);
    modal.open();     
    console.log(dt.rows({selected: true}).data());
}

initAccountManager();

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
    console.log(employees);
    var html = `<table class="table mt-3" id="EmployeesTable">`
    html +=         getEmployeeTableHtml();
    html +=        `<tbody>`;            
    for(var i = 0; i < employees.length; i++) {
            html +=     `<tr>
                            <td>${employees[i].dipendente_id}</td>
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
    employeesDataTable.on("select", dtSelectEvent);
}

function getEmployeeTableHtml() {
    return `<thead>
                <tr>
                    <th scope="col">Id dipendente</th>
                    <th scope="col">Punto vendita</th>
                    <th scope="col">Username</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Cognome</th>
                    <th scope="col">Ruolo</th>
                </tr>
            </thead>`;
}

function dtSelectEvent(e, dt, type, indexes) {
    console.log(dt.rows(indexes).data());
}

function restCallError(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR.status);
}
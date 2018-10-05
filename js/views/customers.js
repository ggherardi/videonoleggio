var getAllItemsService = getAllItemsService || new GetAllItemsService();
var customersManagementService = customersManagementService || new CustomersManagementService();
var manageCustomersContainer = $("#ManageCustomersContainer");
var customersDataTable;
var customerForm_showFileHtml;
var dataTableOptions = {
    dom: 'Bftpil',
    buttons: true,
    select: true,
    columns: [
        { data: "indirizzo" },
        { data: "email" },
        { data: "telefono_casa" },
        { data: "liberatoria" },
        { data: "id_fidelizzazione" },
        { data: "nome_fidelizzazione" },
        { data: "percentuale" },
        {
            class: "more-details",
            orderable: false,
            data: null,
            defaultContent: ""
        },
        { data: "id_cliente" },
        { data: "cognome" },
        { data: "nome" },
        { data: "data_nascita" },
        { data: "telefono_cellulare" }
    ],
    columnDefs: [{
        targets: [ 0, 1, 2, 3, 4, 5, 6 ],
        visible: false,
        searchable: false
    }],
    buttons: [
        { extend: 'copy', text: "Copia" },
        { text: "Nuovo cliente", action: addCustomerAction },
        { extend: 'selectedSingle', text: "Modifica cliente", action: editCustomerAction },
        { extend: 'selectedSingle', text: "Cancella cliente", action: deleteCustomerAction },
    ],
    language: {
        "emptyTable": "Nessun cliente trovato."
      }
};
    
function initCustomersTable() {
    var loader = new Loader(`#${manageCustomersContainer.attr("id")}`);
    loader.showLoader();
    customersManagementService.getAllCustomersWithPremiumCode()
        .done(getAllCustomersWithPremiumCode)
        .fail(RestClient.redirectIfUnauthorized)
        .always(() => loader.hideLoader());
}

function getAllCustomersWithPremiumCode(data) {
    var customers = JSON.parse(data);
    var html = `<table class="table mt-3" id="CustomersTable">`
    html +=         BuildVideosTableHead();
    html +=        `<tbody>`;            
    for(var i = 0; i < customers.length; i++) {
        if(customers[i].liberatoria != null) {
            var liberatoriaBlobUrl = getLiberatoriaBlob(customers[i].liberatoria);
            customers[i].liberatoria = liberatoriaBlobUrl;
        }
            html +=     `<tr>
                            <td>${customers[i].indirizzo}</td>
                            <td>${customers[i].email}</td>
                            <td>${customers[i].telefono_casa}</td>
                            <td>${customers[i].liberatoria}</td> 
                            <td>${customers[i].id_fidelizzazione}</td>                             
                            <td>${customers[i].nome_fidelizzazione}</td>   
                            <td>${customers[i].percentuale}</td>                     
                            <td></td>
                            <td>${customers[i].id_cliente}</td>
                            <td>${customers[i].cognome}</td>
                            <td>${customers[i].nome}</td>
                            <td>${formatDateFromString(customers[i].data_nascita)}</td>
                            <td>${customers[i].telefono_cellulare}</td>
                        </tr>`;
    }	
    html += `       </tbody>
                </table>`;
    manageCustomersContainer.html(html);
    customersDataTable = $("#CustomersTable").DataTable(dataTableOptions);
    attachCollapseRowEvent();
}

function BuildVideosTableHead() {
    var html = `<thead>
                    <tr>`;
    for(var i = 0; i < dataTableOptions.columnDefs[0].targets.length + 1; i++) {
        html += `       <th scope="col"></th>`;
    }
    html += `           <th scope="col">Matricola</th>
                        <th scope="col">Cognome</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Data di nascita</th>
                        <th scope="col">Cellulare</th>
                    </tr>
                </thead>`;
    return html;
}


function getLiberatoriaBlob(base64Liberatoria) {
    var bytes = base64ToArrayBuffer(base64Liberatoria);
    var blobUrl = saveByteArray("cliente.pdf", bytes);
    return blobUrl;
}

function attachCollapseRowEvent() {
    $('#CustomersTable tbody').on('click', 'td.more-details', function() {
        var tr = $(this).closest('tr');
        var row = customersDataTable.row(tr);
    
        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            row.child(formatCollapsedDetails(row.data())).show();
            tr.addClass('shown');
        }
    });
}

function formatCollapsedDetails (row) {
    var html = `<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">
                    <tr>
                        <td>Indirizzo</td>
                        <td>${row.indirizzo}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>${row.email}</td>
                    </tr>
                    <tr>
                        <td>Telefono casa</td>
                        <td>${row.telefono_casa}</td>
                    </tr>
                    <tr>
                        <td>Sottoscrizione</td>
                        <td>${row.nome_fidelizzazione} (sconto del ${row.percentuale}%)</td>
                    </tr>`;
    if(row.liberatoria != "null") {
        html +=     `<tr>
                        <td>Liberatoria</td>
                        <td><a href="${row.liberatoria}" download="liberatoria_${row.cognome}_${row.nome}.pdf"><img src="images/adobe.ico" width="25"/></a></td>
                    </tr>`
    }
    html +=     `</table>`;
    return html;
}

/* ACTIONS */
/* Insert Customer Action */
function addCustomerAction(e, dt, node, config) {
    var rows = dt.rows({ selected: true }).data();
    var modalOptions = {};
    var body = buildCustomerForm();

    modalOptions = {
        title: "Crea nuovo cliente",
        body: body,
        cancelButton: {
            text: "Annulla"
        },
        confirmButton: {
            text: "Crea cliente",
            action: formClickDelegate
        }
    }

    modal = new Modal(modalOptions);
    modal.open(); 
    loadSelect();
}

function insertItem() {
    var files = $("#CustomerForm_liberatoria")[0].files;
    var customer = getCustomerFromForm();
    customersManagementService.insertNewCustomer(customer, files[0])
        .done(actionSuccess)
        .fail(RestClient.redirectIfUnauthorized);
}

function getCustomerFromForm() {
    var customer = {
        id_cliente: $("#CustomerForm_id_cliente").val(),
        nome: $("#CustomerForm_nome").val(),
        cognome: $("#CustomerForm_cognome").val(),
        indirizzo: $("#CustomerForm_indirizzo").val(),
        telefono_cellulare: $("#CustomerForm_telefono_cellulare").val(),
        telefono_casa: $("#CustomerForm_telefono_casa").val(),
        email: $("#CustomerForm_email").val(),
        data_nascita: $("#CustomerForm_data_nascita").val(),        
        id_fidelizzazione: $("#CustomerForm_fidelizzazione_container option:selected").val(),
    };
    return customer;
}

function actionSuccess(data) {
    if(data) {
        modal.openSuccessModal();
        customersManagementService = new CustomersManagementService()
        initCustomersTable();
    }
}

/* Delete Customer Action */
function deleteCustomerAction(e, dt, node, config) {
    var row = dt.rows({ selected: true }).data()[0];    
    modalOptions = {
        title: "Cancella cliente",
        body: `<span>Si desidera eliminare il cliente ${row.nome} ${row.cognome}?</span>`,
        cancelButton: {
            text: "Annulla"
        },
        confirmButton: {
            text: "Conferma",
            action: deleteItem.bind(row)
        }
    }
    modal = new Modal(modalOptions);
    modal.open();  
}

function deleteItem() {
    customersManagementService.deleteCustomer(this.id_cliente)
        .done(actionSuccess)
        .fail(RestClient.redirectIfUnauthorized);
}

/* Edit Customer Action */
function editCustomerAction(e, dt, node, config) {
    var row = dt.rows({ selected: true }).data()[0];    
    var editModalBody = buildCustomerForm(row);

    modalOptions = {
        title: "Modifica cliente",
        body: editModalBody,
        cancelButton: {
            text: "Annulla"
        },
        confirmButton: {
            text: "Applica modifiche",
            action: formClickDelegate
        }
    }
    modal = new Modal(modalOptions);
    modal.open();  
    loadSelect(row);
}

function editItem() {
    var fileInput = $("#CustomerForm_liberatoria");
    var customer = getCustomerFromForm();
    var files = [];
    if(fileInput.length > 0) {
        files = $("#CustomerForm_liberatoria")[0].files;
    } else {
        customer.keepExistingFile = true;
    }
    var loader = new Loader("#SharedModalBody");
    loader.showLoader();
    customersManagementService.editCustomer(customer, files[0])
        .done((data) => { 
            loader.hideLoader(); 
            actionSuccess(data);
        })
        .fail(RestClient.redirectIfUnauthorized);
}

/* Actions shared functions  */
function buildCustomerForm(row) {
    var isEditForm = row != undefined;
    var html = `<form class="form-signin" onsubmit="${isEditForm ? "editItem()" : "insertItem()"};return false;">
                    <input id="CustomerForm_id_cliente" type="hidden" value="${isEditForm ? row.id_cliente : ""}">
                    <label for="CustomerForm_nome" class="mt-2">Nome</label>
                    <input id="CustomerForm_nome" type="text" class="form-control" value="${isEditForm ? row.nome : ""}" text="${isEditForm ? row.nome : ""}" required>
                    <label for="CustomerForm_cognome" class="mt-2">Cognome</label>
                    <input id="CustomerForm_cognome" type="text" class="form-control" value="${isEditForm ? row.cognome : ""}" text="${isEditForm ? row.cognome : ""}" required>
                    <label for="CustomerForm_indirizzo" class="mt-2">Indirizzo</label>
                    <input id="CustomerForm_indirizzo" type="text" class="form-control" value="${isEditForm ? row.indirizzo : ""}" text="${isEditForm ? row.indirizzo : ""}" required>
                    <label for="CustomerForm_telefono_cellulare" class="mt-2">Cellulare</label>
                    <input id="CustomerForm_telefono_cellulare" type="number" class="form-control" value="${isEditForm ? row.telefono_cellulare : ""}" text="${isEditForm ? row.telefono_cellulare : ""}" required>
                    <label for="CustomerForm_telefono_casa" class="mt-2">Telefono fisso</label>
                    <input id="CustomerForm_telefono_casa" type="number" class="form-control" value="${isEditForm ? row.telefono_casa : ""}" text="${isEditForm ? row.telefono_casa : ""}">
                    <label for="CustomerForm_email" class="mt-2">Email</label>
                    <input id="CustomerForm_email" type="text" class="form-control" value="${isEditForm ? row.email : ""}" text="${isEditForm ? row.email : ""}" required>
                    <label for="CustomerForm_data_nascita" class="mt-2">Data di nascita</label>
                    <input id="CustomerForm_data_nascita" type="date" class="form-control" value="${isEditForm ? switchDateDigitsPosition(row.data_nascita) : ""}" text="${isEditForm ? switchDateDigitsPosition(row.data_nascita) : ""}" required>
                    <label for="CustomerForm_liberatoria" class="mt-2">Liberatoria</label>
                    <div id="CustomerForm_fileInputContainer" class="row px-3">
                        ${isEditForm && row.liberatoria != "null" ? 
                            buildLiberatoriaDynamicTag(row) :
                            `<input id="CustomerForm_liberatoria" type="file" class="form-control" accept="pdf">`}
                    </div>
                    <label for="CustomerForm_fidelizzazione" class="mt-2">Tipo fidelizzazione</label>
                    <div id="CustomerForm_fidelizzazione_container">
                        <select id="CustomerForm_fidelizzazione" class="form-control"></select>
                    </div>
                    <button id="CustomerForm_insert_button" class="d-none" type="submit">
                </form>`;
    return html;
}

function buildLiberatoriaDynamicTag(row) {
    var fileName = `liberatoria_${row.cognome}_${row.nome}.pdf`;
    return `<div id="CustomerForm_showFile">
                <a href="${row.liberatoria}" download="${fileName}"><img src="images/adobe.ico" width="25"/><span class="ml-2">${fileName}<span></a>
                <button class="btn btn-light ml-3" type="button" onclick="showFileInput();" title="Il file verrà eliminato dal server cliccando il pulsante 'Applica modifiche'">Elimina file</button>
            </div>`;
}

function showFileInput() {
    var fileInputContainer = $("#CustomerForm_fileInputContainer");
    customerForm_showFileHtml = fileInputContainer.html();
    var inputFileHtml = `<input id="CustomerForm_liberatoria" type="file" class="form-control col-sm-8" accept="pdf">
                         <span class="col-sm-4">
                            <button class="btn btn-light" type="button" onclick="restoreShowFile();" title="Annulla il nuovo caricamento ripristinando il file precedente">Ripristina file</button>
                        <span>`;
    $("#CustomerForm_fileInputContainer").html(inputFileHtml);
}

function restoreShowFile() {
    $("#CustomerForm_fileInputContainer").html(customerForm_showFileHtml);
}

function loadSelect(row) {
    selectLoader = new Loader("#CustomerForm_fidelizzazione_container", 25, 25);
    selectLoader.showLoader();
    getAllItemsService = new GetAllItemsService();
    getAllItemsService.getAllDiscounts()
        .done(buildSelects.bind(row))
        .fail(RestClient.redirectIfUnauthorized)
        .always(() => selectLoader.hideLoader());   
}

function buildSelects(data) {
    allDiscounts = JSON.parse(data);
    allDiscounts = allDiscounts.sort((a, b) => { if(a.percentuale > b.percentuale) return 1; return -1; })
    var html = "";
    for(var i = 0; i < allDiscounts.length; i++) {
            html += `<option value="${allDiscounts[i].id_fidelizzazione}" ${this ? allDiscounts[i].id_fidelizzazione == this.id_fidelizzazione ? "selected" : "" : ""}>
                        ${allDiscounts[i].nome_fidelizzazione} (sconto ${allDiscounts[i].percentuale}%)
                    </option>`;
    }    
    $("#CustomerForm_fidelizzazione").html(html);
}

function formClickDelegate() {
    $("#CustomerForm_insert_button").click();
}

/* VIEW INIT */
initCustomersTable();


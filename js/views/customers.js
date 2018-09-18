var getAllItemsService = getAllItemsService || new GetAllItemsService();
var customersManagementService = customersManagementService || new CustomersManagementService();
var customersTableContainer = $("#ManageCustomersContainer");
var customersDataTable;
var dataTableOptions = {
    dom: 'Bftpil',
    buttons: true,
    select: true,
    columns: [
        { data: "id_cliente" },
        { data: "indirizzo" },
        { data: "email" },
        { data: "telefono_casa" },
        { data: "liberatoria" },
        { data: "nome_fidelizzazione" },
        { data: "percentuale" },
        {
            class: "more-details",
            orderable: false,
            data: null,
            defaultContent: ""
        },
        { data: "cognome" },
        { data: "nome" },
        { data: "data_nascita" },
        { data: "telefono_cellulare" }
    ],
    columnDefs: [{
        targets: [ 0, 1, 2, 3, 4, 5, 6],
        visible: false,
        searchable: false
    }],
    buttons: [
        { extend: 'copy', text: "Copia" },
        { text: "Inserisci nuovo contatto", action: addCustomerAction },
        { extend: 'selectedSingle', text: "Modifica contatto", action: editCustomerAction },
        { extend: 'selectedSingle', text: "Cancella contatto", action: deleteCustomerAction },
    ]
};
    
function initCustomersTable() {
    var loader = new Loader(`#${customersTableContainer.attr("id")}`);
    loader.showLoader();
    customersManagementService.getAllCustomersWithPremiumCode()
        .done(getAllCustomersWithPremiumCode)
        .fail(restCallError)
        .always(() => loader.hideLoader());
}

function getAllCustomersWithPremiumCode(data) {
    var customers = JSON.parse(data);
    var html = `<table class="table mt-3" id="CustomersTable">`
    html +=         buildCustomersTableHead();
    html +=        `<tbody>`;            
    for(var i = 0; i < customers.length; i++) {
        if(customers[i].liberatoria != null) {
            var liberatoriaBlobUrl = getLiberatoriaBlob(customers[i].liberatoria);
            customers[i].liberatoria = liberatoriaBlobUrl;
        }
            html +=     `<tr>
                            <td>${customers[i].id_cliente}</td>
                            <td>${customers[i].indirizzo}</td>
                            <td>${customers[i].email}</td>
                            <td>${customers[i].telefono_casa}</td>
                            <td>${customers[i].liberatoria}</td>                            
                            <td>${customers[i].nome_fidelizzazione}</td>   
                            <td>${customers[i].percentuale}</td>                     
                            <td></td>
                            <td>${customers[i].cognome}</td>
                            <td>${customers[i].nome}</td>
                            <td>${new Date(customers[i].data_nascita).toLocaleDateString()}</td>
                            <td>${customers[i].telefono_cellulare}</td>
                        </tr>`;
    }	
    html += `       </tbody>
                </table>`;
    customersTableContainer.html(html);
    customersDataTable = $("#CustomersTable").DataTable(dataTableOptions);
    attachCollapseRowEvent();
}

function buildCustomersTableHead() {
    return `<thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">Cognome</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Data di nascita</th>
                    <th scope="col">Cellulare</th>
                </tr>
            </thead>`;
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
                        <td>Email</td>
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
        .fail(restCallError);
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
        title: "Cancella contatto",
        body: `<span>Si desidera eliminare il contatto ${row.nome} ${row.cognome}?</span>`,
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
        .fail(restCallError);
}

/* Edit Customer Action */
function editCustomerAction(e, dt, node, config) {
    var row = dt.rows({ selected: true }).data()[0];    
    var editModalBody = buildCustomerForm(row);

    modalOptions = {
        title: "Modifica contatto cliente",
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
    var files = $("#CustomerForm_liberatoria")[0].files;
    var customer = getCustomerFromForm();
    customersManagementService.editCustomer(customer, files[0])
        .done(actionSuccess)
        .fail(restCallError);
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
                    <input id="CustomerForm_data_nascita" type="date" class="form-control" value="${isEditForm ? row.data_nascita : ""}" text="${isEditForm ? row.data_nascita : ""}" required>
                    <label for="CustomerForm_liberatoria" class="mt-2">Liberatoria</label>
                    <input id="CustomerForm_liberatoria" type="file" class="form-control" accept="pdf">
                    <label for="CustomerForm_fidelizzazione" class="mt-2">Punto vendita</label>
                    <div id="CustomerForm_fidelizzazione_container">
                        <select id="CustomerForm_fidelizzazione" class="form-control"></select>
                    </div>
                    <button id="CustomerForm_insert_button" class="d-none" type="submit">
                </form>`;
    return html;
}

function loadSelect(row) {
    selectLoader = new Loader("#CustomerForm_fidelizzazione_container", 25, 25);
    selectLoader.showLoader();
    getAllItemsService = new GetAllItemsService();
    getAllItemsService.getAllDiscounts()
        .done(buildSelects.bind(row))
        .fail(restCallError)
        .always(() => selectLoader.hideLoader());   
}

function buildSelects(data) {
    allDiscounts = JSON.parse(data);
    allDiscounts = allDiscounts.sort((a, b) => { if(a.percentuale > b.percentuale) return 1; return -1; })
    var html = "";
    for(var i = 0; i < allDiscounts.length; i++) {
            html += `<option value="${allDiscounts[i].id_fidelizzazione}" ${this ? allDiscounts[i].id_fidelizzazione == this[1] ? "selected" : "" : ""}>
                        ${allDiscounts[i].nome_fidelizzazione} (${allDiscounts[i].percentuale})
                    </option>`;
    }    
    $("#CustomerForm_fidelizzazione").html(html);
}

function formClickDelegate() {
    $("#CustomerForm_insert_button").click();
}

/* VIEW INIT */
initCustomersTable();


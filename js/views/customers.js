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
        { data: "email" },
        { data: "telefono_casa" },
        { data: "liberatoria" },
        { data: "nome_fidelizzazione" },
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
        targets: [ 0, 1, 2, 3, 4 ],
        visible: false,
        searchable: false
    }],
    buttons: [
        { extend: 'copy', text: "Copia" },
        { extend: 'selectedSingle', text: "Modifica contatto", action: editCustomer },
        { text: "Inserisci nuovo contatto", action: () => {} },
    ]
};
    
function initCustomersTable() {
    var loader = new Loader(`#${customersTableContainer.attr("id")}`);
    loader.showLoader();
    customersManagementService.getAllPremiumCustomers()
        .done(getAllPremiumCustomersSuccess)
        .fail(restCallError)
        .always(() => loader.hideLoader());
}

function getAllPremiumCustomersSuccess(data) {
    var customers = JSON.parse(data);
    var html = `<table class="table mt-3" id="CustomersTable">`
    html +=         buildCustomersTableHead();
    html +=        `<tbody>`;            
    for(var i = 0; i < customers.length; i++) {
            html +=     `<tr>
                            <td>${customers[i].id_cliente}</td>
                            <td>${customers[i].email}</td>
                            <td>${customers[i].telefono_casa}</td>
                            <td>${customers[i].liberatoria}</td>
                            <td>${customers[i].nome_fidelizzazione}</td>                       
                            <td></td>
                            <td>${customers[i].cognome}</td>
                            <td>${customers[i].nome}</td>
                            <td>${customers[i].data_nascita}</td>
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
                    <th scope="col">Cognome</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Data di nascita</th>
                    <th scope="col">Cellulare</th>
                </tr>
            </thead>`;
}

function editCustomer(e, dt, node, config) {
    console.log(dt);
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
    return `<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">
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
                    <td>${row.nome_fidelizzazione}</td>
                </tr>
            </table>`;
}

initCustomersTable();


var storageManagementService = new AccountManagementService();
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
            { extend: 'selected', text: "Cancella", action: deleteEmployee },
            { text: "Nuovo", action: insertEmployee },
        ]
    };
    
function getEmployeesSuccess(data) {
    var employees = JSON.parse(data);
    var html = `<table class="table mt-3" id="EmployeesTable">`
    html +=         buildEmployeeTableHtml();
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

function buildEmployeeTableHtml() {
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
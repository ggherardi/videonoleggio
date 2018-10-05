var salesManagementService = salesManagementService || new SalesManagementService();
var dateStart;
var dateEnd;
var daysRange;
var salesDataTableContainer = $("#SalesTableContainer");
var salesDataTable;
var salesDataTableOptions = {
    dom: 'Bftpil',
    buttons: true,
    select: true,
    columns: [
        { data: "id_punto_vendita" },
        { data: "id_cliente" },
        { data: "id_noleggio" },
        { data: "id_noleggio" },
        { data: "percentuale" }
    ],
    columnDefs: [{
        targets: [ 0 ],
        visible: false,
        searchable: false
    }],
    buttons: [
        { extend: 'selectedSingle', text: "Visualizza incassi dipendenti", action: getSalesForEmployees }
    ]
};
var employeesSalesTable;
var employeesSalesTableOptions = {
    dom: 'ftpil',
    columns: [
        { data: "id_punto_vendita" },
        { data: "nome" },
        { data: "cognome" },
        { data: "incasso" },
    ],
    order: [
        [3, "desc"]
    ]
};

function initSalesView() {
    prefillDates();
    initSalesTable();
}

function prefillDates() {
    var today = formatDateGenericToday();
    $("#inputSalesStartDate").val(today);
    $("#inputSalesEndDate").val(today);
}

function initSalesTable() {
    var filters = getFilters();
    filters.id_punto_vendita = sharedStorage.loginContext.isAdmin ? 0 : filters.id_punto_vendita;
    var loader = new Loader(`#${salesDataTableContainer.attr("id")}`);
    loader.showLoader();
    salesManagementService.getStoresAndSales(filters)
        .done(initSalesTableSuccess)
        .fail(RestClient.redirectIfUnauthorized)
        .always(() => loader.hideLoader());
}

function initSalesTableSuccess(data) {
    if(data) {
        sales = JSON.parse(data);
        buildSalesTableHead();
    } else {
        console.error("ERRORE");
    }
}

function initSalesTableSuccess(data) {
    if(data) {
        sales = JSON.parse(data);
        var html = `<table class="table mt-3" id="SalesTable">`
        html +=         buildSalesTableHead();
        html +=        `<tbody>`;            
        for(var i = 0; i < sales.length; i++) {
            var sale = sales[i];            
                html +=     `<tr>
                                <td>${sale.id_punto_vendita}</td>
                                <td>${sale.nome}</td>                             
                                <td>${sale.citta}</td>
                                <td>${sale.indirizzo}</td>   
                                <td><span>${new Number(sale.incasso_giornaliero).toFixed(2)}</span> €</td>
                            </tr>`;
        }	
        html += `       </tbody>
                    </table>`;
        salesDataTableContainer.html(html);
        salesDataTable = $("#SalesTable").DataTable(salesDataTableOptions);
    }
}

function buildSalesTableHead() {
    var html = `<thead>
                    <tr>`;
    for(var i = 0; i < salesDataTableOptions.columnDefs[0].targets.length; i++) {
        html += `       <th scope="col"></th>`;
    }
    html += `           <th scope="col">Nome punto vendita</th>
                        <th scope="col">Città</th>
                        <th scope="col">Indirizzo</th>
                        <th scope="col">Incasso</th>
                    </tr>
                </thead>`;
    return html;
}

/* ACTIONS */
/* Action Get Sales for Employees */
function getSalesForEmployees(e, dt, node, config) {
    var filters = getFilters();
    filters.id_punto_vendita = dt.rows({ selected: true }).data()[0].id_punto_vendita;
    salesManagementService.getSalesForEmployees(filters)
        .done(getSalesForEmployeesSuccess)
        .done(RestClient.redirectIfUnauthorized);
}

function getSalesForEmployeesSuccess(data) {
    var result = JSON.parse(data);
    sortByIdDipendente = function(a, b) { return a.id_dipendente > b.id_dipendente ? 1 : 0; };
    var employeesArray = result[0].sort(sortByIdDipendente);
    var salesArray = [...result[1], ...result[2]].sort(sortByIdDipendente);
    var salesArrayWithSums = getSalesArrayWithSums(salesArray);
    console.log(salesArrayWithSums);
    var titleNumberOfDays = `(${daysRange > 1 ? `${daysRange} giorni` : "1 giorno"}:`;
    var titleDatesRange = `${daysRange > 1 ? `dal ${dateStart} al ${dateEnd}` : `${dateStart}`})`;
    var title = `Incassi ${titleNumberOfDays} ${titleDatesRange}`;
    var body = `<div id="EmployeesSalesTableContainer"></div>`;
    modalOptions = {
        title: title,
        body: body,
        cancelButton: {
            text: "Chiudi"
        }
    }
    modal = new Modal(modalOptions);
    modal.open();
    var loader = new Loader("#EmployeesSalesTableContainer");
    loader.showLoader();
    buildEmployeesSalesTable(employeesArray);
    fillEmployeesSalesTableWithSums(salesArrayWithSums);
    employeesSalesTable = $("#EmployeesSalesTable").DataTable(employeesSalesTableOptions);
    loader.hideLoader();
}

function getSalesArrayWithSums(salesArray) {
    var newArray = [];
    for(var i = 0; i < salesArray.length; i++) {
        var sale = salesArray[i];
        var id = sale.id_dipendente;
        newArray[id] = newArray[id] == undefined 
            ? { id_dipendente: id, incasso_totale: parseFloat(sale.incasso_totale) } 
            : { id_dipendente: id, incasso_totale: newArray[id].incasso_totale + parseFloat(sale.incasso_totale) };
    }
    return newArray.filter((a) => a);
}

function buildEmployeesSalesTable(employees) {
    var html = `<table class="table mt-3" id="EmployeesSalesTable">`
    html +=         buildEmployeesSalesTableHead();
    html +=        `<tbody>`;            
    for(var i = 0; i < employees.length; i++) {
        var employee = employees[i];            
            html +=     `<tr>
                            <td>${employee.id_dipendente}</td>                             
                            <td>${employee.nome}</td>                             
                            <td>${employee.cognome}</td>
                            <td><span id="SalesForEmployee_${employee.id_dipendente}" class="SalesForEmployeeClass">0.00</span> €</td>
                        </tr>`;
    }	
    html += `       </tbody>
                </table>`;
    $("#EmployeesSalesTableContainer").html(html);
}

function buildEmployeesSalesTableHead() {
    var html = `<thead>
                    <tr>
                        <th scope="col">Matricola</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Cognome</th>
                        <th scope="col">Incasso</th>
                    </tr>
                </thead>`;
    return html;
}

function fillEmployeesSalesTableWithSums(array) {
    var minSalesForBonus = {
        noBonus: 50 * daysRange,
        bonus1: 100 * daysRange,
        bonus2: 150 * daysRange,
        bonus3: 200 * daysRange
    }
    $(".SalesForEmployeeClass").length;
    for(var i = 0; i < array.length; i++) {
        var incasso = array[i].incasso_totale;
        var saleSpan =  $(`#SalesForEmployee_${array[i].id_dipendente}`);
        saleSpan.text(new Number(incasso).toFixed(2));
        saleSpan.removeClass("alert alert-danger");
        saleSpan.parent().addClass(`alert ${
            incasso < minSalesForBonus.noBonus 
            ? "alert-danger"
            : incasso < minSalesForBonus.bonus1 ? "alert-warning" 
            : incasso < minSalesForBonus.bonus2 ? "alert-info" : "alert-success"}`)
    }
}

/* Shared functions */
function getFilters() {
    var dates = getDatesFromInputs();
    dateStart = dates.data_inizio;
    dateEnd = dates.data_fine;
    calculateDaysRange();
    return {
        id_punto_vendita: sharedStorage.loginContext.punto_vendita_id_punto_vendita,
        data_inizio: dates.data_inizio,
        data_fine: dates.data_fine
    };
}

function getDatesFromInputs() {
    return {
        data_inizio: $("#inputSalesStartDate").val(),
        data_fine: $("#inputSalesEndDate").val()
    }        
}

function calculateDaysRange() {
    daysRange = (new Date(dateEnd) - new Date(dateStart)) / (1000 * 3600 * 24);
}
/* Init */
initSalesView();
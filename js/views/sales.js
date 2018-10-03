var salesManagementService = salesManagementService || new SalesManagementService();
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
function getSalesForEmployees() {
    var filters = getFilters();
    salesManagementService.getSalesForEmployees(filters)
        .done(getSalesForEmployeesSuccess)
        .done(RestClient.redirectIfUnauthorized);
}

function getSalesForEmployeesSuccess(data) {
    console.log(data);
}

/* Shared functions */
function getFilters() {
    var dates = getDatesFromInputs();
    return {
        id_punto_vendita: sharedStorage.loginContext.isAdmin ? 0 : sharedStorage.loginContext.punto_vendita_id_punto_vendita,
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

/* Init */
initSalesView();
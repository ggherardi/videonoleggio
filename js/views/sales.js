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
        { data: "percentuale" }
    ],
    columnDefs: [{
        targets: [ 0 ],
        visible: false,
        searchable: false
    }],
    buttons: [
        { extend: 'selected', text: "Visualizza incassi dipendenti", action: undefined }
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
    var dates = getDatesFromInputs();
    var filters = {
        id_punto_vendita: sharedStorage.loginContext.isAdmin ? 0 : sharedStorage.loginContext.punto_vendita_id_punto_vendita,
        data_inizio: dates.data_inizio,
        data_fine: dates.data_fine
    };
    salesManagementService.getStoresAndSales(filters)
        .done(initSalesTableSuccess)
        .fail(RestClient.redirectIfUnauthorized)
}

function initSalesTableSuccess(data) {
    if(data && data[0].id_punto_vendita != null) {
        console.log(data);
    } else {
        console.error("ERRORE");
    }
}

/* Shared functions */
function getDatesFromInputs() {
    return {
        data_inizio: $("#inputSalesStartDate").val(),
        data_fine: $("#inputSalesEndDate").val()
    }        
}

/* Init */
initSalesView();
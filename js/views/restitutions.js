var restitutionManagementService = restitutionManagementService || new RestitutionManagementService();
var getAllItemsService = getAllItemsService || new GetAllItemsService();
var rentedCopiesTableContainer = $("#RentedCopiesTableContainer");
var rentedVideosDataTable;
var rentedVideosDataTableOptions = {
    dom: 'Bftpil',
    buttons: true,
    select: true,
    columns: [
        { data: "percentuale" },
        { data: "prezzo_giornaliero" },
        { data: "tariffa" },
        { data: "id_copia" },
        { data: "titolo" },
        { data: "cliente" },
        { data: "data_inizio" },
        { data: "data_fine" },
        { data: "giorni_ritardo" }
    ],
    columnDefs: [{
        targets: [ 0, 1, 2 ],
        visible: false,
        searchable: false
    }],
    buttons: [
        { extend: 'selected', text: "Effettua restituzione", action: returnCopyAction }
    ]
};
 
function findRentedCopiesForUser() {
    var input = $("#RestitutionCustomerIdInput");
    var filters = {
        id_punto_vendita: sharedStorage.loginContext.punto_vendita_id_punto_vendita,
        id_cliente: input.val()
    }
    var loader = new Loader(`#${rentedCopiesTableContainer.attr("id")}`);
    loader.showLoader();
    restitutionManagementService.getRentedVideoForUser(filters)
        .done(findRentedCopiesForUserSuccess)
        .fail(restCallError);
}

function findRentedCopiesForUserSuccess(data) {
    var buildCustomerRow = function(row) {
        return `${row.id_cliente} - ${row.cognome} ${row.nome}`;
    }
    var buildRestitutionDelay = function(row) {
        var oDelay = {
            days: 0,
            cssCalss: ""
        }
        var rentEndDate = new Date(row.data_fine);
        var today = new Date();   
        var delayMilliseconds = today - rentEndDate;     
        if(delayMilliseconds > 0) {
            oDelay.days = Math.floor(delayMilliseconds / (1000 * 60 * 60 * 24));
            if(oDelay.days > 0 && oDelay.days < 3) {
                oDelay.cssClass = "alert alert-warning";
            } else if (oDelay.days >= 3) {
                oDelay.cssClass = "alert alert-danger";
            }
        }
        return oDelay;
    }
    var videos = JSON.parse(data);
    var tableName = "RentedvideoTable";
    var html = `<table class="table mt-3" id="${tableName}">`
    html +=         BuildRentedCopiesTableHead();
    html +=        `<tbody>`;            
    for(var i = 0; i < videos.length; i++) {
        var oDelay = buildRestitutionDelay(videos[i])
        html +=         `<tr>
                            <td>${videos[i].percentuale}</td>
                            <td>${videos[i].prezzo_giornaliero}</td>
                            <td>${videos[i].tariffa}</td>
                            <td>${videos[i].id_copia}</td>                             
                            <td>${videos[i].titolo}</td>
                            <td>${buildCustomerRow(videos[i])}</td>      
                            <td>${formatDateFromString(videos[i].data_inizio)}</td>
                            <td>${formatDateFromString(videos[i].data_fine)}</td>  
                            <td class="${oDelay.cssClass}">${oDelay.days}</td>
                        </tr>`;
    }	
    html += `       </tbody>
                </table>`;
    rentedCopiesTableContainer.html(html);
    rentedVideosDataTable = $(`#${tableName}`).DataTable(rentedVideosDataTableOptions);
}

function BuildRentedCopiesTableHead() {
    var html = `<thead>
                    <tr>`;
    for(var i = 0; i < rentedVideosDataTableOptions.columnDefs[0].targets.length; i++) {
        html += `       <th scope="col"></th>`;
    }
    html += `           <th scope="col">Cod. copia</th>
                        <th scope="col">Titolo film</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">Inizio noleggio</th>
                        <th scope="col">Fine noleggio</th>
                        <th scope="col">Ritardo gg.</th>
                    </tr>
                </thead>`;
    return html;
}

/* ACTIONS */
/* Return video action */
function returnCopyAction(e, dt, node, config) {
    var rows = dt.rows({ selected: true }).data();
    var editModalBody = buildRestitutionForm();
    var modalOptions = {
        title: "Restituzione film",
        body: editModalBody,
        cancelButton: {
            text: "Annulla"
        },
        confirmButton: {
            text: "Conferma restituzione",
            action: formClickDelegate
        },
        size: "large"
    }              
    modal = new Modal(modalOptions);
    modal.open();
    loadAndBuildVideosTable(rows);
}

function loadAndBuildVideosTable(copies) {
    var calculateExtra = function(copy) {
        var tariffa = JSON.parse(copy.tariffa);
        var price = parseFloat(copy.prezzo_giornaliero);
        var data_fine_noleggio = new Date(switchDateDigitsPosition(copy.data_fine));
        var data_inizio_noleggio = new Date(switchDateDigitsPosition(copy.data_inizio));
        var initialRentDays = ((new Date(data_fine_noleggio) - new Date(data_inizio_noleggio)) / (1000 * 60 * 60 * 24));
        var totalRentDays = parseInt(copy.giorni_ritardo) + initialRentDays;
        var sum = 0;
        for(var i = initialRentDays; i < (totalRentDays); i++) {
            sum += price - ((price * tariffa[i < tariffa.length - 1 ? i : tariffa.length - 1].s) / 100);
        }
        return (sum -= (sum * parseFloat(copy.percentuale)) / 100).toFixed(2);
    }

    var html = ``; 
    for(var i = 0; i < copies.length; i++) {
        html += `<tr class="RestitutionForm_row">
                    <td id="RestitutionForm_row_id_copia_${i}">${copies[i].id_copia}</td>                                                      
                    <td>${copies[i].titolo}</td>  
                    <td>${copies[i].giorni_ritardo}</td>
                    <td><input id="RestitutionForm_row_cattivo_stato_${i}" type="checkbox" onchange="badStateClick(this, ${copies[i].prezzo_giornaliero});"/></td>
                    <td><span id="RestitutionForm_row_extra_${i}" class="RestitutionForm_row_extra_class">${calculateExtra(copies[i])}</span> €</td>
                </tr>`;
    }
    $("#RestitutionForm_table_body").html(html);
    calculateTotalExtra();
}

function badStateClick(input, prezzo_giornaliero) {
    var splittedInputId = input.id.split("_");
    var rowNumber = splittedInputId[splittedInputId.length - 1];
    var price = parseFloat($(`#RestitutionForm_row_extra_${rowNumber}`).text());
    var badStateFee = prezzo_giornaliero * 2;
    if(input.checked) {
        price += badStateFee;
    } else {
        price -= badStateFee;
    }
    $(`#RestitutionForm_row_extra_${rowNumber}`).text(price.toFixed(2));
    calculateTotalExtra();
}

function calculateTotalExtra() {
    var totalExtraAmountContainer = $("#RestitutionForm_importo_totale_container");
    var totalExtraAmount = 0;
    var allExtras = $(".RestitutionForm_row_extra_class");
    for(var i = 0; i < allExtras.length; i++) {
        totalExtraAmount += parseFloat(allExtras[i].innerText);
    }
    if(totalExtraAmount > 0) {
        totalExtraAmountContainer.css("display", "flex");
    } else {
        totalExtraAmountContainer.hide();
    }
    $("#RestitutionForm_importo_totale").text(totalExtraAmount.toFixed(2));
}

/* Actions shared functions  */
function buildRestitutionForm() {
    var html = `<form class="form" onsubmit="returnVideo();return false;">
                    <div id="RestitutionFormTableContainer">
                        <table class="table" id="RestitutionFormTable">
                            <thead>
                                <th>Codice copia</th>
                                <th>Film</th>
                                <th>Ritardo gg.</th>
                                <th>Cattivo stato copia</th>
                                <th>Totale extra</th>
                            </thead>
                            <tbody id="RestitutionForm_table_body"></tbody>
                        </table>
                    </div>
                    <div class="contaner">
                        <div id="RestitutionForm_importo_totale_container" class="hidden mt-3 row">
                            <div class="col-sm-5">
                                <h3>Totale extra da pagare:</h3>
                                <h4><span id="RestitutionForm_importo_totale">0</span> €</h4>                        
                            </div>
                            <div class="col-sm-5">
                                <button>download pdf</button>                      
                            </div>
                        </div>
                    </div>
                    <button id="RestitutionForm_submit_button" class="d-none" type="submit">
                </form>`;
    return html;
}

function formClickDelegate() {
    $("#RestitutionForm_submit_button").click();
}
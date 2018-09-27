var rentalManagementService = rentalManagementService || new RentalManagementService();
var storageManagementService = storageManagementService || new StorageManagementService();
var getAllItemsService = getAllItemsService || new GetAllItemsService();
var countDownInterval;
var timeoutOperationEnd;
var timeoutOperationEndTime = 300000; /* 5 minuti */ 
var closedFromTimeout = false;
var videosTableContainer = $("#VideosTableContainer");
var RentVideoForm_id_cliente;
var rentRates;
var customerDiscount = 0;
var rentedVideosDataTable;
var videosDataTableOptions = {
    dom: 'Bftpil',
    buttons: true,
    select: true,
    columns: [
        { data: "id_film" },
        { data: "casa_produttrice_nome" },
        { data: "regista_nome" },
        { data: "regista_cognome" },
        { data: "cast" },
        { data: "copie_disponibili" },
        { data: "copie_noleggiate" },
        { data: "copie_danneggiate" },
        {
            class: "more-details",
            orderable: false,
            data: null,
            defaultContent: ""
        },
        { data: "titolo" },
        { data: "durata" },
        { data: "prezzo_giornaliero" },
        { data: "tipo" },
        { data: "copie_totali" },
    ],
    columnDefs: [{
        targets: [ 0, 1, 2, 3, 4, 5, 6 , 7],
        visible: false,
        searchable: false
    }],
    buttons: [
        { extend: 'copy', text: "Copia" },
        { extend: 'selected', text: "Noleggia film", action: rentVideoAction }
    ]
};
 
function initVideosTable() {
    var initVideoPreviewTablesSuccess = function() {
        var filters = {
            id_punto_vendita: sharedStorage.loginContext.punto_vendita_id_punto_vendita
        }
        rentalManagementService.getVideosInStorageWithCount(filters)
            .done(getVideosInStorageWithCountSuccess)
            .fail(restCallError)
            .always(() => loader.hideLoader());
    }

    var loader = new Loader(`#${videosTableContainer.attr("id")}`);
    loader.showLoader();
    $.when(rentalManagementService.clearRentalBookingsForUser(sharedStorage.loginContext.id_dipendente), rentalManagementService.clearRentalBookings())
        .done(initVideoPreviewTablesSuccess)
        .fail();
}

function getVideosInStorageWithCountSuccess(data) {
    var videos = JSON.parse(data);
    var html = `<table class="table mt-3" id="VideosTable">`
    html +=         BuildVideosTableHead();
    html +=        `<tbody>`;            
    for(var i = 0; i < videos.length; i++) {
        var oAvailCopiesCell = formatAvailableCopiesCellObject(videos[i])
        var castCellRender = formatCastCell(videos[i].cast); 
        videos[i].cast = castCellRender;
            html +=     `<tr>
                            <td>${videos[i].id_film}</td>
                            <td>${videos[i].casa_produttrice_nome}</td>                             
                            <td>${videos[i].regista_nome}</td>   
                            <td>${videos[i].regista_cognome}</td>  
                            <td>${videos[i].cast}</td>    
                            <td>${videos[i].copie_totali - videos[i].copie_danneggiate - videos[i].copie_noleggiate}</td>
                            <td>${videos[i].copie_noleggiate}</td>
                            <td>${videos[i].copie_danneggiate}</td>                            
                            <td></td>
                            <td>${videos[i].titolo}</td>
                            <td>${videos[i].durata} minuti</td>
                            <td>${videos[i].prezzo_giornaliero} €</td>
                            <td>${videos[i].tipo}</td> 
                            <td class="${oAvailCopiesCell.cssClass}">${oAvailCopiesCell.availableCopies} su ${oAvailCopiesCell.totalCopies} disponibili</td>
                        </tr>`;
    }	
    html += `       </tbody>
                </table>`;
    videosTableContainer.html(html);
    rentedVideosDataTable = $("#VideosTable").DataTable(videosDataTableOptions);
    attachCollapseRowEvent();
}

function BuildVideosTableHead() {
    var html = `<thead>
                    <tr>`;
    for(var i = 0; i < videosDataTableOptions.columnDefs[0].targets.length + 1; i++) {
        html += `       <th scope="col"></th>`;
    }
    html += `           <th scope="col">Titolo</th>
                        <th scope="col">Durata</th>
                        <th scope="col">Prezzo giornaliero</th>
                        <th scope="col">Genere</th>
                        <th scope="col">Copie</th>
                    </tr>
                </thead>`;
    return html;
}

function formatAvailableCopiesCellObject(row) {
    var cssClass = "";
    var availableCopies = row.copie_totali - row.copie_danneggiate - row.copie_noleggiate;
    var availableCopiesPercentage = (availableCopies / (parseInt(row.copie_totali) + 2)) * 100;;
    if(availableCopiesPercentage <= 50 && availableCopiesPercentage > 25) {
        cssClass = "alert alert-warning";
    } else if (availableCopiesPercentage <= 25) {
        cssClass = "alert alert-danger";
    }
    return {
        availableCopies: availableCopies,
        totalCopies: row.copie_totali,
        cssClass: cssClass
    };
}

function formatCastCell(cast) {
    var cellRender = "";
    for(var i = 0; i < cast.length; i++) {
        cellRender += `${cast[i].nome_attore} ${cast[i].cognome_attore}, `;
    }
    cellRender = cellRender.trim().substring(0, cellRender.lastIndexOf(","));
    return cellRender;
}

function attachCollapseRowEvent() {
    $('#VideosTable tbody').on('click', 'td.more-details', function() {
        var tr = $(this).closest('tr');
        var row = rentedVideosDataTable.row(tr);
    
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
                        <td>Casa produttrice</td>
                        <td>${row.casa_produttrice_nome}</td>
                    </tr>
                    <tr>
                        <td>Regista</td>
                        <td>${row.regista_nome} ${row.regista_cognome}</td>
                    </tr>
                    <tr>
                        <td>Attori</td>
                        <td>${row.cast}</td>
                    </tr>`;
    html +=     `</table>`;
    return html;
}

/* ACTIONS */
/* Rent Video Action */
function rentVideoAction(e, dt, node, config) {
    var canRentAllSelectedVideos = function(rows) {
        for(var i = 0; i < rows.length; i++) {
            if(rows[i].copie_disponibili == 0) {
                return false;
            }        
        }
        return true;
    }

    var rows = dt.rows({ selected: true }).data();    
    var editModalBody = buildRentVideoForm();
    if(canRentAllSelectedVideos(rows)) {
        modalOptions = {
            title: "Noleggia film",
            body: editModalBody,
            cancelButton: {
                text: "Annulla"
            },
            confirmButton: {
                text: "Conferma noleggio",
                action: formClickDelegate
            },
            onHide: {
                action: () => {
                    if(closedFromTimeout) {
                        resetTimers();
                        return;
                    } else {
                        if(window.confirm("Uscendo dalla finestra i film selezionati verranno resi nuovamente disponibili.")) {
                            resetTimers();
                            rentalManagementService.clearRentalBookingsForUser(sharedStorage.loginContext.id_dipendente);
                        } else {
                            return false;
                        }
                    }
                }
            },
            size: "large"
        }          
    } else {
        var body = `<span>Sono stati selezionati uno o più video non disponibili. Si prega di deselezionarli e riprovare</span>`;
        modalOptions = {
            title: "Attenzione",
            body: body,
            cancelButton: {
                text: "Annulla"
            }
        }
    }     
    modal = new Modal(modalOptions);
    modal.open();

    timeoutOperationEnd = setTimeout(() => {
        window.alert("Il tempo a disposizione per l'operazione è scaduto, si prega di iniziarne una nuova."); 
        closedFromTimeout = true;
        modal.close(); 
    }, timeoutOperationEndTime);
    countDownInterval = setInterval(countdown, 1000);
    loadAndBuildVideosTable(rows);
}

function countdown() {
    timeoutOperationEndTime -= 1000;
    var minutes = Math.floor((timeoutOperationEndTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeoutOperationEndTime % (1000 * 60)) / 1000);
    var time = `${minutes}m ${seconds}s`;
    $("#RentVideoForm_countdown").text(time);
}

function resetTimers() {
    clearTimeout(timeoutOperationEnd);
    clearInterval(countDownInterval);
    timeoutOperationEndTime = 300000;
    closedFromTimeout = false;
}

function loadAndBuildVideosTable(rows) {
    var buildFilters = function(rows) {
        var filters = {};
        filters.films = [];
        filters.id_punto_vendita = sharedStorage.loginContext.punto_vendita_id_punto_vendita;
        filters.id_dipendente = sharedStorage.loginContext.id_dipendente;
        for(var i = 0; i < rows.length; i++) {
            filters.films.push({ id_film: rows[i].id_film, prezzo_giornaliero: rows[i].prezzo_giornaliero, titolo: rows[i].titolo });
        }
        return filters;
    }

    var loadAndBuildVideosTableSuccess = function(data) {   
        if(data) {
            var copies = JSON.parse(data);
            copies = buildCopiesTableObject(copies);
            var html = ``; 
            for(var i = 0; i < copies.length; i++) {
                html += `<tr class="RentVideoForm_row">
                            <td id="RentVideoForm_id_film_${i}" class="d-none">${copies[i].id_film}</td>   
                            <td id="RentVideoForm_id_copia_${i}" class="d-none">${copies[i].id_copia}</td>                                                      
                            <td>${copies[i].titolo}</td>  
                            <td><span id="RentVideoForm_price_row_${i}">${copies[i].prezzo_giornaliero}</span> €</td>
                            <td><input id="RentVideoForm_date_control_${i}" type="date" class="form-control RentVideoForm_date_control" onchange="validateAndCalculatePrice_change(this);" required></td>
                            <td id="RentVideoForm_days_${i}">0</td>
                            <td class="d-none"><span id="RentVideoForm_partial_price_${i}_hidden" class="RentVideoForm_partial_price_hidden_class">0</span></td>
                            <td><span id="RentVideoForm_partial_price_${i}" class="RentVideoForm_partial_price_class">0</span> €</td>
                        </tr>`;
            }
            $("#RentVideoForm_videos_table_body").html(html);
            loadDiscounts();
        }
    }

    var loader = new Loader("#RentVideoFormPreviewTableContainer");
    loader.showLoader();
    var filters = buildFilters(rows);
    Global_FilmPrices = filters.films;
    rentalManagementService.getMostRecentCopies(filters)
        .done(loadAndBuildVideosTableSuccess)
        .fail(restCallError)
        .always(() => loader.hideLoader());
}

function validateAndCalculatePrice_change(input) {
    var setPriceInTable = function(daysOfRent) {
        var splittedInputId = input.id.split("_");
        var rowNumber = splittedInputId[splittedInputId.length - 1];
        var price = parseFloat($(`#RentVideoForm_price_row_${rowNumber}`).text());
        var sum = 0;
        for(var i = 0; i < daysOfRent; i++) {
            sum += price - ((price * rentRates.tariffa[i < rentRates.tariffa.length - 1 ? i : rentRates.tariffa.length - 1].s) / 100);
        }
        $(`#RentVideoForm_partial_price_${rowNumber}`).text(sum.toFixed(2));
        $(`#RentVideoForm_partial_price_${rowNumber}_hidden`).text(sum.toFixed(2));
        $(`#RentVideoForm_days_${rowNumber}`).text(daysOfRent);
        applyDiscountToPrices();
    }

    var selectedDate = new Date(`${input.value} 00:00`);
    var today = new Date();
    var daysOfRent = Math.ceil((selectedDate - today) / (1000 * 3600 * 24));
    if(daysOfRent < 1) {
        input.setCustomValidity("Selezionare almeno un giorno di noleggio")
    } else {
        input.setCustomValidity("")
    }
    setPriceInTable(daysOfRent);
}

function applyDiscountToPrices() {
    var allOriginalPrices = $(".RentVideoForm_partial_price_hidden_class");
    var allDiscountablePrices = $(".RentVideoForm_partial_price_class");
    var totalAmount = 0;
    for(var i = 0; i < allOriginalPrices.length; i++) {        
        var newSubtotal = parseFloat(allOriginalPrices[i].innerText);
        newSubtotal -= ((newSubtotal * customerDiscount) / 100);
        totalAmount += newSubtotal;
        $(allDiscountablePrices[i]).text(newSubtotal.toFixed(2));
    }
    $(`#RentVideoForm_importo_totale`).text(totalAmount.toFixed(2));
}

function buildCopiesTableObject(copies) {
    var ret = [];
    var sortByFilmId = (a, b) => { return parseInt(a.id_film) > b.id_film ? 1 : 0 };
    var tempCopies = copies.sort(sortByFilmId);
    var tempGlobal_FilmPrices = Global_FilmPrices.sort(sortByFilmId);
    for(var i = 0; i < tempCopies.length; i++) {
        if(tempGlobal_FilmPrices[i].id_film == tempCopies[i].id_film) {
            var copiesTableObject = {};
            copiesTableObject.id_film = tempCopies[i].id_film;
            copiesTableObject.id_copia = tempCopies[i].id_copia;
            copiesTableObject.titolo = tempGlobal_FilmPrices[i].titolo;
            copiesTableObject.prezzo_giornaliero = tempGlobal_FilmPrices[i].prezzo_giornaliero.replace("€", "").trim();
            ret.push(copiesTableObject)
        }
    }
    return ret;
}

function loadDiscounts() {
    rentalManagementService.getActiveDiscount()
        .done((data) => { 
            rentRates = JSON.parse(data); 
            rentRates.tariffa = JSON.parse(rentRates.tariffa); })
        .fail(restCallError);
}

/* Find Customer Form Action */
function findCustomerById() {
    var findCustomerSuccess = function(data) {
        loader.hideLoader();
        if(data != "null") {
            $("#RentVideoForm_user_not_found").hide();
            var customerLightModel = JSON.parse(data);
            RentVideoForm_id_cliente = $("#RentVideoForm_id_cliente_container").html();
            buildCustomerTable(customerLightModel)
            customerDiscount = customerLightModel.percentuale;
            applyDiscountToPrices();
        } else {
            $("#RentVideoForm_user_not_found").show();
        }
    }

    var buildCustomerTable = function(customer) {
        var html = `<div id="RentVideoForm_user" class="col-sm-10 py-3 call-success">
                        <input id="RentVideoForm_id_cliente" type="hidden" value="${customer.id_cliente}">
                        <span>${customer.nome} ${customer.cognome} - ${customer.indirizzo} (sconto ${customer.percentuale}%)</span>
                    </div>`;
        html += `<button class="btn btn-light ml-3 col-sm-1" type="button" onclick="restoreFindCustomerInput();">X</button>`;
        $("#RentVideoForm_id_cliente_container").html(html);
        setTimeout(() => $("#RentVideoForm_user").css("color", "#7D7D7D"), 500);
    }

    var id_cliente = $("#RentVideoForm_id_cliente").val();
    var loader = new Loader("#RentVideoForm_id_cliente_container", 50, 50);
    loader.showLoader();
    var customersManagementService = new CustomersManagementService();
    customersManagementService.findCustomerById(id_cliente)
        .done(findCustomerSuccess)
        .fail(restCallError);
}

function restoreFindCustomerInput() {
    $("#RentVideoForm_id_cliente_container").html(RentVideoForm_id_cliente);
    customerDiscount = 0;
    applyDiscountToPrices();
}

function rentVideo() {
    var rentVideoSuccess = function(data) {
        if(data) {
            resetTimers();
            modal.openSuccessModal();    
            rentalManagementService.clearRentalBookings()
                .done(initVideosTable)
                .fail(restCallError);                    
        }
    }

    if($("#RentVideoForm_user").length == 0) {
        $("#RentVideoForm_id_cliente")[0].setCustomValidity("Selezionare un utente");
        return false;
    }
    if(window.confirm("Confermi il noleggio dei film selezionati?")) {
        var videos = getVideosFromForm();
        if(videos) {
            rentalManagementService.rentVideos(videos)
            .done(rentVideoSuccess)
            .fail(restCallError);
        } else {
            return false;
        }
    } else {
        return false;
    }    
}

function getVideosFromForm() {
    var videos = [];
    var rows = $(".RentVideoForm_row");
    for(var i = 0; i < rows.length; i++) {
        try {
            var video = {
                id_dipendente: sharedStorage.loginContext.id_dipendente,
                id_punto_vendita: sharedStorage.loginContext.punto_vendita_id_punto_vendita,
                id_tariffa: rentRates.id_tariffa,
                id_cliente: $("#RentVideoForm_id_cliente").val(),
                id_film: $(`#RentVideoForm_id_film_${i}`).text(),
                id_copia: $(`#RentVideoForm_id_copia_${i}`).text(),
                prezzo_totale: $(`#RentVideoForm_importo_totale`).text(),            
                data_fine: $(`#RentVideoForm_date_control_${i}`).val()
            }        
            videos.push(video);
        }
        catch(ex) {
            console.error(ex);
            return false;
        }
    }
    return videos;
}

/* Actions shared functions  */
function buildRentVideoForm() {
    var html = `<form class="form" onsubmit="rentVideo();return false;">
                    <input id="RentVideoForm_id_copia" type="hidden">
                    <div id="RentVideoFormPreviewTableContainer">
                        <table class="table" id="RentVideoFormPreviewTable">
                            <thead>
                                <th class="d-none">Id film</th>
                                <th class="d-none">Codice copia</th>
                                <th>Film</th>
                                <th>Prezzo/giorno</th>
                                <th>Data riconsegna</th>
                                <th>N. giorni</th>
                                <th>Importo</th>
                            </thead>
                            <tbody id="RentVideoForm_videos_table_body"></tbody>
                        </table>
                    </div>
                    <label for="3" class="mt-2">Cliente che effettua il noleggio</label>
                    <div><span id="RentVideoForm_user_not_found" class="errorSpan">Utente non trovato.</span></div>
                    <div id="RentVideoForm_id_cliente_container" class="row px-3">
                        <input id="RentVideoForm_id_cliente" type="number" class="form-control col-sm-8" placeholder="Inserire la matricola del cliente" required>
                        <button class="btn btn-dark ml-3" type="button" onclick="findCustomerById();">Cerca cliente</button>
                    </div>
                    <div class="mt-3">
                        <h3>Totale da pagare:</h3>
                        <h4><span id="RentVideoForm_importo_totale">0</span> €</h4>                        
                    </div>
                    <div class="countdown"><span>Tempo disponibile per portare a termine l'operazione: </span><span id="RentVideoForm_countdown">5m 00s</span></div>
                    <button id="RentVideoForm_insert_button" class="d-none" type="submit">
                </form>`;
    return html;
}

function formClickDelegate() {
    $("#RentVideoForm_insert_button").click();
}


/** Init */
initVideosTable();
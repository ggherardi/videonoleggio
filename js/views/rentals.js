var rentalManagementService = rentalManagementService || new RentalManagementService();
var storageManagementService = storageManagementService || new StorageManagementService();
var getAllItemsService = getAllItemsService || new GetAllItemsService();
var videosTableContainer = $("#VideosTableContainer");
var RentVideoForm_id_cliente;
var videosDataTable;
var videosDataTableOptions = {
    dom: 'Bftpil',
    buttons: true,
    select: true,
    columns: [
        { data: "id_film" },
        { data: "casa_produttrice_nome" },
        { data: "regista_nome" },
        { data: "regista_cognome" },
        {   data: "cast"},
     
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
        targets: [ 0, 1, 2, 3, 4, 5, 6 ],
        visible: false,
        searchable: false
    }],
    buttons: [
        { extend: 'copy', text: "Copia" },
        { extend: 'selected', text: "Noleggia film", action: rentVideoAction }
        // { extend: 'selectedSingle', text: "Resetta password", action: resetPassword },
        // { extend: 'selectedSingle', text: "Modifica account", action: editEmployee },
        // { extend: 'selectedSingle', text: "Cancella account", action: deleteEmployee }
    ]
};
 
function initVideoPreviewTable() {
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
    videosDataTable = $("#VideosTable").DataTable(videosDataTableOptions);
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
        var row = videosDataTable.row(tr);
    
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
    var rows = dt.rows({ selected: true }).data();    
    var editModalBody = buildRentVideoForm();
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
                if(window.confirm("Uscendo dalla finestra i film selezionati verranno resi nuovamente disponibili.")) {
                    rentalManagementService.clearRentalBookingsForUser(sharedStorage.loginContext.id_dipendente);
                } else {
                    return false;
                }
            }
        }
    }        
    modal = new Modal(modalOptions);
    modal.open();  
    loadAndBuildVideosTable(rows);
}

function loadAndBuildVideosTable(rows) {
    var buildFilters = function(rows) {
        var filters = {};
        filters.films = [];
        filters.id_punto_vendita = sharedStorage.loginContext.punto_vendita_id_punto_vendita;
        for(var i = 0; i < rows.length; i++) {
            filters.films.push({ id_film: rows[i].id_film, prezzo_giornaliero: rows[i].prezzo_giornaliero, titolo: rows[i].titolo });
        }
        return filters;
    }

    var loadAndBuildVideosTableSuccess = function(data) {   
        if(data) {
            var copies = JSON.parse(data);
            copies = mapCopiesWithFilms(copies);
            var html = ``; 
            for(var i = 0; i < copies.length; i++) {
                html += `<tr>
                            <td>${copies[i].id_copia}</td>
                            <td>${copies[i].titolo}</td>
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

function mapCopiesWithFilms(copies) {
    var ret = [];
    var sortByFilmId = (a, b) => { return parseInt(a.id_film) > b.id_film ? 1 : 0 };
    var tempCopies = copies.sort(sortByFilmId);
    var tempGlobal_FilmPrices = tempGlobal_FilmPrices.sort(sortByFilmId);
    for(var i = 0; i < tempCopies; i++) {
        if(tempGlobal_FilmPrices[i].id_film == tempCopies.id_film) {
            ret.push({ id_film: tempCopies[i].id_film, titolo: tempGlobal_FilmPrices[i].titolo })
        }
    }
    return ret;
}

function loadDiscounts() {
    var discountController = new Controller("#RentVideoForm_tariffe_container");
    discountController.setComponent(components.discountTable);
}

function rentVideo() {
    // not implemented yet
    if(window.confirm("Confermi il noleggio dei film selezionati?")) {
        console.log("rented");
        return false;
    } else {
        return false;
    }
    rentalManagementService.clearRentalBookings();
    var customer = getCustomerFromForm();
    var files = [];
    if(fileInput.length > 0) {
        files = $("#CustomerForm_liberatoria")[0].files;
    } else {
        customer.keepExistingFile = true;
    }
    customersManagementService.editCustomer(customer, files[0])
        .done(actionSuccess)
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
        } else {
            $("#RentVideoForm_user_not_found").show();
        }
    }

    var buildCustomerTable = function(customer) {
        var html = `<div id="customer-preview" class="col-sm-10 py-3 call-success">${customer.nome} ${customer.cognome} - ${customer.indirizzo}</div>`;
        html += `<button class="btn btn-light ml-3 col-sm-1" type="button" onclick="restoreFindCustomerInput();">X</button>`;
        $("#RentVideoForm_id_cliente_container").html(html);
        setTimeout(() => $("#customer-preview").css("color", "#7D7D7D"), 500);
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
}

/* Actions shared functions  */
function buildRentVideoForm() {
    var html = `<form class="form-signin" onsubmit="rentVideo();return false;">
                    <input id="RentVideoForm_id_copia" type="hidden">
                    <div id="RentVideoFormPreviewTableContainer">
                        <table class="table">
                            <thead>
                                <th>Codice copia</th>
                                <th>Film</th>
                            </thead>
                            <tbody id="RentVideoForm_videos_table_body"></tbody>
                        </table>
                    </div>
                    <label for="3" class="mt-2">Cliente che effettua il noleggio</label>
                    <div><span id="RentVideoForm_user_not_found" class="errorSpan">Utente non trovato.</span></div>
                    <div id="RentVideoForm_id_cliente_container" class="row px-3">
                        <input id="RentVideoForm_id_cliente" type="number" class="form-control col-sm-8" placeholder="Inserire la matricola del cliente">
                        <button class="btn btn-light ml-3" type="button" onclick="findCustomerById();">Cerca cliente</button>
                    </div>
                    <div id="RentVideoForm_tariffe_container" class="row px-3"></div>
                    <button id="RentVideoForm_insert_button" class="d-none" type="submit">
                </form>`;
    return html;
}

function formClickDelegate() {
    $("#RentVideoForm_insert_button").click();
}

/** Init */
initVideoPreviewTable();
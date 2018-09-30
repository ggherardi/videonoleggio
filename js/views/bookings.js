var bookingsManagementService = bookingsManagementService || new BookingManagementService();
var bookingsTableContainer = $("#BookingsTableContainer");
var RentVideoForm_id_cliente;
var bookingsDataTable;
var bookingsDataTableOptions = {
    dom: 'Bftpil',
    buttons: true,
    select: true,
    columns: [
        { data: "id_film" },
        { data: "casa_produttrice_nome" },
        { data: "regista_nome" },
        { data: "regista_cognome" },
        { data: "cast" },
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
        { data: "data_uscita" },
    ],
    columnDefs: [{
        targets: [ 0, 1, 2, 3, 4 ],
        visible: false,
        searchable: false
    }],
    buttons: [
        { extend: 'selected', text: "Prenota film", action: bookMovieAction },
        { extend: 'selectedSingle', text: "Visualizza prenotazioni", action: getActiveBookingsAction }
    ]
};

function initBookingsTable() {
    var loader = new Loader(`#${bookingsTableContainer.attr("id")}`);
    loader.showLoader();
    bookingsManagementService.getComingSoonMovies()
        .done(getComingSoonMoviesSuccess)
        .fail();
}

function getComingSoonMoviesSuccess(data) {
    var bookings = JSON.parse(data);
    var html = `<table class="table mt-3" id="BookingsTable">`
    html +=         buildBookingsTableHead();
    html +=        `<tbody>`;            
    for(var i = 0; i < bookings.length; i++) {
        var oMovieRelease = formatMovieReleaseObject(bookings[i])
        var castCellRender = formatCastCell(bookings[i].cast); 
        bookings[i].cast = castCellRender;
            html +=     `<tr>
                            <td>${bookings[i].id_film}</td>
                            <td>${bookings[i].casa_produttrice_nome}</td>                             
                            <td>${bookings[i].regista_nome}</td>   
                            <td>${bookings[i].regista_cognome}</td>  
                            <td>${bookings[i].cast}</td>                                
                            <td></td>
                            <td>${bookings[i].titolo}</td>
                            <td>${bookings[i].durata} minuti</td>
                            <td>${bookings[i].prezzo_giornaliero} €</td>
                            <td>${bookings[i].tipo}</td> 
                            <td class="${oMovieRelease.cssClass}">${oMovieRelease.value}</td>
                        </tr>`;
    }	
    html += `       </tbody>
                </table>`;
    bookingsTableContainer.html(html);
    bookingsDataTable = $("#BookingsTable").DataTable(bookingsDataTableOptions);
    attachCollapseRowEvent();
}

function buildBookingsTableHead() {
    var html = `<thead>
                    <tr>`;
    for(var i = 0; i < bookingsDataTableOptions.columnDefs[0].targets.length + 1; i++) {
        html += `       <th scope="col"></th>`;
    }
    html += `           <th scope="col">Titolo</th>
                        <th scope="col">Durata</th>
                        <th scope="col">Prezzo giornaliero</th>
                        <th scope="col">Genere</th>
                        <th scope="col">Data uscita</th>
                    </tr>
                </thead>`;
    return html;
}

function formatMovieReleaseObject(row) {
    var oMovieRelease = {
        value: formatDateFromString(row.data_uscita),
        cssClass: ""
    };
    var releaseDate = new Date(row.data_uscita);
    var today = new Date();
    if(today > releaseDate) {
        oMovieRelease.value = `Uscito il ${oMovieRelease.value}`;
        oMovieRelease.cssClass = "alert alert-success";
    }
    return oMovieRelease;
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
    $('#BookingsTable tbody').on('click', 'td.more-details', function() {
        var tr = $(this).closest('tr');
        var row = bookingsDataTable.row(tr);
    
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
/* BookMovie Action */
function bookMovieAction(e, dt, node, config) {
    var canBookMovies = function(rows) {
        for(var i = 0; i < rows.length; i++) {
            if(rows[i].data_uscita.toLowerCase().indexOf("uscito") > -1) {
                return false;
            }        
        }
        return true;
    }
    var rows = dt.rows({ selected: true }).data();
    if(canBookMovies(rows)) {
        var row = dt.rows({ selected: true }).data();    
        var editModalBody = buildBookingVideoForm(row);
        modalOptions = {
            title: "Prenota film",
            body: editModalBody,
            cancelButton: {
                text: "Annulla"
            },
            confirmButton: {
                text: "Conferma prenotazione",
                action: formClickDelegate
            }
        }          
        modal = new Modal(modalOptions);
        modal.open();
        loadAndBuildBookingsTable(row);
    } else {
        var body = `<span>Sono stati selezionati uno o più film già usciti. Si prega di deselezionarli e riprovare.</span>`;
        modalOptions = {
            title: "Attenzione",
            body: body,
            cancelButton: {
                text: "Annulla"
            }
        }
        modal = new Modal(modalOptions);
        modal.open();
    }
}

function buildBookingVideoForm() {
    var html = `<form class="form" onsubmit="rentVideo();return false;">
                    <div id="BookMovieFormPreviewTableContainer">
                        <table class="table" id="BookMovieFormPreviewTable">
                            <thead>
                                <th class="d-none">Id film</th>
                                <th>Film</th>
                                <th>Prezzo/giorno</th>
                                <th>Data uscita</th>
                            </thead>
                            <tbody id="BookMovieForm_videos_table_body"></tbody>
                        </table>
                    </div>
                    <label for="3" class="mt-2">Cliente che effettua la prenotazione</label>
                    <div><span id="BookMovieForm_user_not_found" class="errorSpan">Utente non trovato.</span></div>
                    <div id="BookMovieForm_id_cliente_container" class="row px-3">
                        <input id="BookMovieForm_id_cliente" type="number" class="form-control col-sm-8" placeholder="Inserire la matricola del cliente" required>
                        <button class="btn btn-dark ml-3" type="button" onclick="findCustomerAndBookingsByCustomerId();">Cerca cliente</button>
                    </div>
                    <button id="BookMovieForm_insert_button" class="d-none" type="submit">
                </form>`;
    return html;
}

function loadAndBuildBookingsTable(rows) {
    var html = ``;
    for(var i = 0; i < rows.length; i++) {
        html += `<tr class="BookMovieForm_row">
                    <td id="BookMovieForm_id_film_${i}" class="d-none">${rows[i].id_film}</td>   
                    <td>${rows[i].titolo}</td>                                                      
                    <td>${rows[i].prezzo_giornaliero}</td>  
                    <td>${rows[i].data_uscita}</td>
                </tr>`;
    }
    $("#BookMovieForm_videos_table_body").html(html);
}

function findCustomerAndBookingsByCustomerId() {
    var customerId = $("#BookMovieForm_id_cliente").val();
    
}

function formClickDelegate() {
    $("#BookMovieForm_insert_button").click();
}

/* GetActiveBookings Action */
function getActiveBookingsAction() {

}

/* Init */
initBookingsTable();
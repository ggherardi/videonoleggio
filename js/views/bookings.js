var bookingsManagementService = bookingsManagementService || new BookingManagementService();
var bookingsTableContainer = $("#BookingsTableContainer");
var BookMovieForm_id_cliente;
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
        { data: "numero_prenotazioni" },
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
var usersForBookingDataTable;
var usersForBookingDataTableOptions = {
    dom: 'Bftpi',
    buttons: true,
    select: true,
    columns: [
        { data: "id_prenotazione" },
        { data: "id_cliente" },
        { data: "nome" },
        { data: "cognome" },
    ],
    buttons: [
        { extend: 'selected', text: "Annulla prenotazione", action: deleteBookings },
    ]
};

function initBookingsTable() {
    var loader = new Loader(`#${bookingsTableContainer.attr("id")}`);
    loader.showLoader();
    bookingsManagementService.getComingSoonMovies(sharedStorage.loginContext.punto_vendita_id_punto_vendita)
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
                            <td>${bookings[i].numero_prenotazioni}</td>
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
                        <th scope="col">Prezzo/giorno</th>
                        <th scope="col">Genere</th>
                        <th scope="col">Prenotazioni</th>
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
        var editModalBody = buildBookingVideoForm();
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
        loadAndBuildBookingsTable(rows);
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
    var html = `<form class="form" onsubmit="bookMovie();return false;">
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
                    <div><span id="BookMovieForm_user_already_booked" class="errorSpan">L'utente selezionato ha già prenotato i film evidenziati.</span></div>
                    <div id="BookMovieForm_id_cliente_container" class="row px-3 mt-2">
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
                    <td id="BookMovieForm_id_film_${rows[i].id_film}" class="d-none BookMovieForm_id_film_class">${rows[i].id_film}</td>
                    <td>${rows[i].titolo}</td>
                    <td>${rows[i].prezzo_giornaliero}</td>
                    <td>${rows[i].data_uscita}</td>
                </tr>`;
    }
    $("#BookMovieForm_videos_table_body").html(html);
}

function findCustomerAndBookingsByCustomerId() {
    var resetForm = function() {
        var tdArray = $(".BookMovieForm_id_film_class");
        for(var i = 0; i < tdArray.length; i++) {
            $(tdArray[i]).parent().removeClass("alert alert-danger");
        }
        $("#BookMovieForm_user_not_found").hide();
        $("#BookMovieForm_user_already_booked").hide();
    }

    var getCustomerBookingsAndIdSuccess = function(data) {
        data = JSON.parse(data);
        if(data) {
            if(data == -1) {
                $("#BookMovieForm_user_not_found").show();
            } else if(!data.id_cliente) {
                flagAlreadyBookedMovies(data);
            } else {
                BookMovieForm_id_cliente = $("#BookMovieForm_id_cliente_container").html();
                buildCustomerTable(data);
            }
        }
    }

    resetForm();
    var filters = {
        id_cliente: $("#BookMovieForm_id_cliente").val(),
        id_punto_vendita: sharedStorage.loginContext.punto_vendita_id_punto_vendita,
        array_id_film: []
    };
    $(".BookMovieForm_id_film_class").each((index, el) => filters.array_id_film.push(el.innerText));
    bookingsManagementService.getCustomerBookingsAndId(filters)
        .done(getCustomerBookingsAndIdSuccess)
        .fail(RestClient.redirectIfUnauthorized);
}

function buildCustomerTable(customer) {
    var html = `<div id="BookMovieForm_user" class="col-sm-10 py-3 call-success">
                    <input id="BookMovieForm_id_cliente" type="hidden" value="${customer.id_cliente}">
                    <span>${customer.nome} ${customer.cognome} - ${customer.indirizzo}</span>
                </div>`;
    html += `<button class="btn btn-light ml-3 col-sm-1" type="button" onclick="restoreFindCustomerInput();">X</button>`;
    $("#BookMovieForm_id_cliente_container").html(html);
    setTimeout(() => $("BookMovieForm_user").css("color", "#7D7D7D"), 500);
}

function restoreFindCustomerInput() {
    $("#BookMovieForm_id_cliente_container").html(BookMovieForm_id_cliente);
}

function flagAlreadyBookedMovies(moviesIds) {
    for(var i = 0; i < moviesIds.length; i++) {
        $(`#BookMovieForm_id_film_${moviesIds[i].id_film}`).parent().addClass("alert alert-danger");
    }
    $("#BookMovieForm_user_already_booked").show();
}

function formClickDelegate() {
    $("#BookMovieForm_insert_button").click();
}

function bookMovie() {
    var bookMovieSuccess = function(data) {
        if(data) {
            initBookingsTable();
            modal.openSuccessModal();
        }
    }

    if($("#BookMovieForm_user").length == 0) {
        $("#BookMovieForm_id_cliente")[0].setCustomValidity("Selezionare un utente");
        return false;
    }
    if(window.confirm("Confermi la prenotazione dei film selezionati?")) {
        var bookings = getBookingsFromForm();
        if(bookings) {
            bookingsManagementService.bookMovies(bookings)
            .done(bookMovieSuccess)
            .fail(RestClient.redirectIfUnauthorized);
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function getBookingsFromForm() {
    var bookings = [];
    var rows = $(".BookMovieForm_row");
    for(var i = 0; i < rows.length; i++) {
        try {
            var booking = {
                id_dipendente: sharedStorage.loginContext.id_dipendente,
                id_punto_vendita: sharedStorage.loginContext.punto_vendita_id_punto_vendita,
                id_cliente: $("#BookMovieForm_id_cliente").val(),
                id_film: $(`.BookMovieForm_id_film_class`)[i].innerText
            }
            bookings.push(booking);
        }
        catch(ex) {
            console.error(ex);
            return false;
        }
    }
    return bookings;
}

/* GetActiveBookings Action */
function getActiveBookingsAction(e, dt, node, config) {
    var row = dt.rows({ selected: true }).data()[0];
    var booking = {
        id_film: row.id_film,
        id_punto_vendita: sharedStorage.loginContext.punto_vendita_id_punto_vendita
    }
    bookingsManagementService.getUsersForBooking(booking)
        .done(getActiveBookingsActionSuccess.bind(row))
        .fail(RestClient.redirectIfUnauthorized);
}

function getActiveBookingsActionSuccess(data) {
    data = JSON.parse(data);
    if(data) {
        var body = buildUsersForBookingTable(data[0].id_film);
        modalOptions = {
            title: `Prenotazioni attive: ${this.titolo}`,
            body: body
        }
        modal = new Modal(modalOptions);
        modal.open();
        loadAndFillUsersForBookingsTable(data);
        usersForBookingDataTable = $("#UsersForBookingTable").DataTable(usersForBookingDataTableOptions);
    } else {
        modalOptions = {
            title: `Nessuna prenotazione trovata`,
            body: "<span>Non è stata trovata nessuna prenotazione per il film selezionato.</span>"
        }
        modal = new Modal(modalOptions);
        modal.open();
    }
}

function buildUsersForBookingTable(id_film) {
    var html = `<div>
                    <div id="UsersForBookingContainer">
                        <table class="table" id="UsersForBookingTable">
                            <thead>
                                <th>Codice prenotazione</th>
                                <th>Matricola cliente</th>
                                <th>Nome</th>
                                <th>Cognome</th>
                            </thead>
                            <tbody id="UsersForBookingTable_body"></tbody>
                        </table>
                        <input id="UsersForBooking_id_film" type="hidden" value="${id_film}">
                    </div>
                </div>`;
    return html;
}

function loadAndFillUsersForBookingsTable(rows) {
    var html = ``;
    for(var i = 0; i < rows.length; i++) {
        html += `<tr class="UsersForBookingRow">
                    <td id="UsersForBooking_id_prenotazione_${rows[i].id_prenotazione}" class="UsersForBooking_id_prenotazione_class">${rows[i].id_prenotazione}</td>
                    <td id="UsersForBooking_id_cliente_${rows[i].id_cliente}" class="UsersForBooking_id_cliente_class">${rows[i].id_cliente}</td>
                    <td>${rows[i].nome}</td>
                    <td>${rows[i].cognome}</td>
                </tr>`;
    }
    $("#UsersForBookingTable_body").html(html);
}

function deleteBookings(e, dt, node, config) {
    var deleteBookingsSuccess = function(data) {
        if(data) {
            bookingsManagementService.getUsersForBooking(this)
                .done(getActiveBookingsActionSuccess.bind(this))
                .fail(RestClient.redirectIfUnauthorized);
        }
    }

    var booking = {
        id_film: $("#UsersForBooking_id_film").val(),
        id_punto_vendita: sharedStorage.loginContext.punto_vendita_id_punto_vendita
    }
    var bookingsIdsArray = [];
    var rows = dt.rows({selected: true}).data();
    for(var i = 0; i < rows.length; i++) {
        bookingsIdsArray.push(rows[i].id_prenotazione);
    }
    bookingsManagementService.deleteBookings(bookingsIdsArray)
        .done(deleteBookingsSuccess.bind(booking))
        .fail(RestClient.redirectIfUnauthorized);
}

function getBookingIds() {
    var ids = $(".UsersForBooking_id_prenotazione_class");
    var array = [];
    for(var i = 0; i < ids.length; i++) {
        array.push(ids[i].innerText);
    }
    return array;
}

/* Init */
initBookingsTable();
var rentalManagementService = rentalManagementService || new RentalManagementService();
var storageManagementService = storageManagementService || new StorageManagementService();
var getAllItemsService;
var videosTableContainer = $("#VideosTableContainer");
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
        { text: "Noleggia film", action: rentVideo }
        // { extend: 'selectedSingle', text: "Resetta password", action: resetPassword },
        // { extend: 'selectedSingle', text: "Modifica account", action: editEmployee },
        // { extend: 'selectedSingle', text: "Cancella account", action: deleteEmployee }
    ]
};
 
function initCustomersTable() {
    var filters = {
        id_punto_vendita: sharedStorage.loginContext.punto_vendita_id_punto_vendita
    }
    var loader = new Loader(`#${videosTableContainer.attr("id")}`);
    loader.showLoader();
    rentalManagementService.getVideosInStorageWithCount(filters)
        .done(getVideosInStorageWithCountSuccess)
        .fail(restCallError)
        .always(() => loader.hideLoader());
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
    var row = dt.rows({ selected: true }).data()[0];    
    var editModalBody = buildCustomerForm(row);

    modalOptions = {
        title: "Noleggia film",
        body: editModalBody,
        cancelButton: {
            text: "Annulla"
        },
        confirmButton: {
            text: "Conferma noleggio",
            action: formClickDelegate
        }
    }
    modal = new Modal(modalOptions);
    modal.open();  
    loadSelect(row);
}

function rentVideo() {
    var fileInput = $("#CustomerForm_liberatoria");
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

/* Actions shared functions  */
function buildCustomerForm(row) {
    var isEditForm = row != undefined;
    var html = `<form class="form-signin" onsubmit="${isEditForm ? "editItem()" : "insertItem()"};return false;">
                    <input id="CustomerForm_id_cliente" type="hidden" value="${isEditForm ? row.id_cliente : ""}">
                    <label for="CustomerForm_nome" class="mt-2">Nome</label>
                    <input id="CustomerForm_nome" type="text" class="form-control" value="${isEditForm ? row.nome : ""}" text="${isEditForm ? row.nome : ""}" required>
                    <label for="CustomerForm_cognome" class="mt-2">Cognome</label>
                    <input id="CustomerForm_cognome" type="text" class="form-control" value="${isEditForm ? row.cognome : ""}" text="${isEditForm ? row.cognome : ""}" required>
                    <label for="CustomerForm_indirizzo" class="mt-2">Indirizzo</label>
                    <input id="CustomerForm_indirizzo" type="text" class="form-control" value="${isEditForm ? row.indirizzo : ""}" text="${isEditForm ? row.indirizzo : ""}" required>
                    <label for="CustomerForm_telefono_cellulare" class="mt-2">Cellulare</label>
                    <input id="CustomerForm_telefono_cellulare" type="number" class="form-control" value="${isEditForm ? row.telefono_cellulare : ""}" text="${isEditForm ? row.telefono_cellulare : ""}" required>
                    <label for="CustomerForm_telefono_casa" class="mt-2">Telefono fisso</label>
                    <input id="CustomerForm_telefono_casa" type="number" class="form-control" value="${isEditForm ? row.telefono_casa : ""}" text="${isEditForm ? row.telefono_casa : ""}">
                    <label for="CustomerForm_email" class="mt-2">Email</label>
                    <input id="CustomerForm_email" type="text" class="form-control" value="${isEditForm ? row.email : ""}" text="${isEditForm ? row.email : ""}" required>
                    <label for="CustomerForm_data_nascita" class="mt-2">Data di nascita</label>
                    <input id="CustomerForm_data_nascita" type="date" class="form-control" value="${isEditForm ? switchDateDigitsPosition(row.data_nascita) : ""}" text="${isEditForm ? switchDateDigitsPosition(row.data_nascita) : ""}" required>
                    <label for="CustomerForm_liberatoria" class="mt-2">Liberatoria</label>
                    <div id="CustomerForm_fileInputContainer" class="row px-3">
                        ${isEditForm && row.liberatoria != "null" ? buildLiberatoriaDynamicTag(row) : `<input id="CustomerForm_liberatoria" type="file" class="form-control" accept="pdf">`}
                    </div>
                    <label for="CustomerForm_fidelizzazione" class="mt-2">Tipo fidelizzazione</label>
                    <div id="CustomerForm_fidelizzazione_container">
                        <select id="CustomerForm_fidelizzazione" class="form-control"></select>
                    </div>
                    <button id="CustomerForm_insert_button" class="d-none" type="submit">
                </form>`;
    return html;
}

/** Init */
initCustomersTable();
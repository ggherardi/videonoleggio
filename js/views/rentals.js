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
        { data: "cast.0" },        
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
        { extend: 'copy', text: "Copia" }
        // { text: "Nuovo dipendente", action: insertEmployee },
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
        var oCell = formatAvailableCopiesCellObject(videos[i])
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
                            <td class="${oCell.cssClass}">${oCell.availableCopies} su ${oCell.totalCopies} disponibili</td>
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
    var availableCopiesPercentage = (availableCopies / (parseInt(row.copie_totali) + 2)) * 100;
    console.log(availableCopiesPercentage);
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
                        <td>`;
                    for(var i = 0; i < row.cast.length; i++) {
                        html += `${row.cast[i].nome_attore} ${row.cast[i].cognome_attore}, `;
                    }
                        `</td>
                    </tr>`;
    html +=     `</table>`;
    return html;
}

/** Init */
initCustomersTable();
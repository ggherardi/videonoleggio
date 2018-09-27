var restitutionManagementService = restitutionManagementService || new RestitutionManagementService();
var getAllItemsService = getAllItemsService || new GetAllItemsService();
var rentedCopiesTableContainer = $("#RentedCopiesTableContainer");
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
        // { extend: 'copy', text: "Copia" },
        // { extend: 'selected', text: "Noleggia film", action: rentVideoAction }
    ]
};
 
function findRentedCopiesForUser(input) {
    var filters = {
        id_punto_vendita: sharedStorage.loginContext.punto_vendita_id_punto_vendita,
        id_cliente: input.value
    }
    var loader = new Loader(`#${rentedCopiesTableContainer.attr("id")}`);
    loader.showLoader();
    restitutionManagementService.getRentedVideoForUser(filters)
        .done(findRentedCopiesForUserSuccess)
        .fail(restCallError);
}

function findRentedCopiesForUserSuccess(data) {
    var videos = JSON.parse(data);
    var html = `<table class="table mt-3" id="RentedvideoTable">`
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
    videosDataTable = $("#VideosTable").DataTable(videosDataTableOptions);
    attachCollapseRowEvent();
}
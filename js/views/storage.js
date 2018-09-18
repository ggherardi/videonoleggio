var storageManagementService = new StorageManagementService();
var getAllItemsService;
var storageTableContainer = $("#StorageTableContainer");
var storageDataTable;
var storageTableColumns = {
    id_copia: 0,
    id_film: 1,
    titolo: 2,
    fornitore: 3,
    data_scarico: 4,
    giorniRiconsegna: 5,
    danneggiato: 6,
    noleggiato: 7
}
var dataTableOptions = {
    dom: 'Bftpil',
    buttons: true,
    select: true,
    columnDefs: [{
        targets: 0,
        visible: false,
        searchable: false
    }, {
        targets: 1,
        visible: false,
        searchable: false
    }],
    buttons: [
        { extend: 'copy', text: "Copia" },
        { extend: 'selected', text: "Carico merce", action: loadVideos },
        { text: "Scarico merce", action: unloadVideos },
    ]
};
    
function initStorageTable() {
    var filters = {
        id_punto_vendita: sharedStorage.loginContext.punto_vendita_id_punto_vendita,        
    }
    var loader = new Loader(`#${storageTableContainer.attr("id")}`);
    loader.showLoader();
    storageManagementService.getVideosInStorage(filters)
        .done(getVideosInStorageSuccess)
        .fail(restCallError)
        .always(() => loader.hideLoader());
}

function getVideosInStorageSuccess(data) {
    var copies = JSON.parse(data);
    var html = `<table class="table mt-3" id="StorageTable">`
    html +=         buildStorageTableHead();
    html +=        `<tbody>`;            
    for(var i = 0; i < copies.length; i++) {
        var oMissingDays = getMissingDaysCellObject(copies[i].data_scarico);
            html +=     `<tr>
                            <td>${copies[i].id_copia}</td>
                            <td>${copies[i].id_film}</td>
                            <td>${copies[i].titolo}</td>
                            <td>${copies[i].fornitore}</td>
                            <td>${new Date(copies[i].data_scarico).toLocaleDateString()}</td>
                            <td class="${oMissingDays.cssClass}">${oMissingDays.days}</td>
                            <td>${parseInt(copies[i].danneggiato) ? "Sì" : "No"}</td>
                            <td>${parseInt(copies[i].noleggiato) ? "Sì" : "No"}</td>
                        </tr>`;
    }	
    html += `       </tbody>
                </table>`;
    storageTableContainer.html(html);
    storageDataTable = $("#StorageTable").DataTable(dataTableOptions);
}

function getMissingDaysCellObject(startDate) {
    var maxRentDays = 90; ////////////////////////////////////// Dopo aver creato tabella config, prendere il dato da lì
    var cssClass = "";
    var daysSinceLoad = Math.floor((new Date() - new Date(startDate)) / 1000 / 60 / 60 / 24);
    var missingDays = maxRentDays - daysSinceLoad;
    if(missingDays <= 30 && missingDays > 14) {
        cssClass = "alert alert-warning";
    } else if(missingDays <= 14) {
        cssClass = "alert alert-danger";
    }
    return {
        days: missingDays,
        cssClass: cssClass
    };
}

function buildStorageTableHead() {
    return `<thead>
                <tr>
                    <th scope="col">Id copia</th>
                    <th scope="col">Id film</th>
                    <th scope="col">Titolo</th>
                    <th scope="col">Fornitore</th>
                    <th scope="col">Data scarico</th>
                    <th scope="col">Giorni a riconsegna</th>
                    <th scope="col">Danneggiato</th>
                    <th scope="col">Noleggiato</th>
                </tr>
            </thead>`;
}

/* Load Videos Action */
function loadVideos(e, dt, node, config) {
    var rows = dt.rows({ selected: true }).data();
    var modalOptions = {};
    if(containsRentedVideos(rows)) {
        var body = `<span>Tra gli elementi selezionati è presente un video noleggiato:
                    deselezionare i video noleggiati e riprovare.</span><br>
                    <span>Qualora il video fosse stato già restituito, effettuare la restituzione dal 
                    cliente al punto vendita tramite l'apposito tab "Noleggi".</span>`;
        modalOptions = {
            title: "Attenzione",
            body: body,
            cancelButton: {
                text: "Annulla"
            }
        }
    } else {
        modalOptions = {
            title: "Riconsegna copie",
            body: "<span>Confermi la riconsegna delle copie ai fornitori?</span>",
            cancelButton: {
                text: "Annulla"
            },
            confirmButton: {
                text: "Conferma carico",
                action: loadVideosAction.bind(rows)
            }
        }
    }

    modal = new Modal(modalOptions);
    modal.open(); 
}

function containsRentedVideos(rows) {
    for(var i = 0; i < rows.length; i++) {
        if(rows[i][storageTableColumns.noleggiato] == "Sì") {
            return true;
        }            
    }
    return false;
}

function loadVideosAction() {
    var rows = this;
    var idsToUpdate = [];
    for(var i = 0; i < rows.length; i++) {
        idsToUpdate.push(rows[i][storageTableColumns.id_copia]);
    }
    storageManagementService.loadCopies(idsToUpdate)
        .done(insertItemSuccess)
        .fail(restCallError);
}

/* Unload Videos Actions */
function unloadVideos() {
    var body = buildStorageForm();
    modalOptions = {
        title: "Scaricamento nuove copie",
        body: body,
        cancelButton: {
            text: "Annulla"
        },
        confirmButton: {
            text: "Carica copie",
            action: insertItemDelegate
        }
    }
    modal = new Modal(modalOptions);
    modal.open(); 
    loadSelects();
}

function buildStorageForm(row) {
    var isEditForm = row != undefined;
    var html = `<form id="StorageForm" class="form-signin" onsubmit="insertItem();return false;">
                    <label for="StorageForm_film_container" class="mt-2">Film da scaricare</label>
                    <div id="StorageForm_film_container">
                        <select id="StorageForm_film" class="form-control"></select>
                    </div>
                    <label for="StorageForm_fornitore_container" class="mt-2">Fornitore</label>
                    <div id="StorageForm_fornitore_container">
                        <select id="StorageForm_fornitore" class="form-control"></select>
                    </div>
                    <label for="StorageForm_numero_copie" class="mt-2">Numero copie</label>
                    <input id="StorageForm_numero_copie" data-missing- type="number" min="1" max="20" class="form-control" placeholder="massimo 20 copie" required>
                    <button id="StorageForm_insert_button" class="d-none" type="submit">
                </form>`;
    return html;
}

function loadSelects() {
    selectStoreLoader = new Loader("#StorageForm_film_container", 25, 25);
    selectStoreLoader.showLoader();
    selectRoleLoeader = new Loader("#StorageForm_fornitore_container", 25, 25);
    selectRoleLoeader.showLoader();
    getAllItemsService = new GetAllItemsService();
    $.when(storageManagementService.getAlreadyAvailableMovies(), getAllItemsService.getAllSuppliers())
        .done(buildSelects)
        .always(() => { selectStoreLoader.hideLoader(); selectRoleLoeader.hideLoader(); });   
}

function buildSelects(films, suppliers) {
    allFilms = JSON.parse(films[0]);
    allSuppliers = JSON.parse(suppliers[0]);
    buildOptions({ title: "films", items: allFilms }, "#StorageForm_film");
    buildOptions({ title: "suppliers", items: allSuppliers }, "#StorageForm_fornitore");
}

function buildOptions(table, selectId) {
    var array = table.items;
    var html = "";
    for(var i = 0; i < array.length; i++) {
        if(table.title == "films") {
            html += `<option value="${array[i].id_film}" >${array[i].titolo}</option>`;
        } else {
            html += `<option value="${array[i].id_fornitore}">${array[i].nome}</option>`;
        }
    }    
    $(selectId).html(html);
}

/* Form actions */
function insertItemDelegate() {
    $("#StorageForm_insert_button").click();
}

function insertItem() {
    var storageForm = getStorageFormData(); 
    storageManagementService.unloadCopies(storageForm)
        .done(insertItemSuccess)
        .fail(restCallError);
}

function getStorageFormData() {
    var copy = {
        id_film: $("#StorageForm_film").val(),
        id_punto_vendita: sharedStorage.loginContext.punto_vendita_id_punto_vendita,
        id_fornitore: $("#StorageForm_fornitore").val(),
        numberOfCopies: $("#StorageForm_numero_copie").val()
    };
    return copy;
}

function insertItemSuccess(data) {
    if(data) {
        modal.openSuccessModal();
        initStorageTable();
    }
}

function restCallError(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR.status);
}

initStorageTable();
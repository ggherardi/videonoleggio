var getAllItemsService = getAllItemsService || new GetAllItemsService();
var settingsManagementService = settingsManagementService || new SettingsManagementService();
var settingsTableContainer = $("#SettingsTableContainer");
var settingsDataTable;
var settingsTableOptions = {
    dom: 'Bftpil',
    buttons: true,
    select: true,
    columns: [
        { data: "id_impostazione" },
        { data: "chiave" },
        { data: "valore" }
    ],
    columnDefs: [{
        targets: [ 0 ],
        visible: false,
        searchable: false
    }],
    buttons: [
        { extend: 'selectedSingle', text: "Modifica", action: editSetting }
    ],
    language: {
        "emptyTable": "Nessuna impostazione trovata."
      }
};

function initSettings() {
    var loader = new Loader(`#${settingsTableContainer.attr("id")}`)
    getAllItemsService.getAllSettings()
        .done(getAllSettingsSuccess)
        .fail(RestClient.redirectIfUnauthorized)
        .always(() => loader.hideLoader());
}

function getAllSettingsSuccess(data) {
    var settings = JSON.parse(data);
    var html = `<table class="table mt-3" id="SettingsTable">`
    html +=         BuildSettingsTableHead();
    html +=        `<tbody>`;            
    for(var i = 0; i < settings.length; i++) {
            html +=     `<tr>
                            <td>${settings[i].id_impostazione}</td>
                            <td>${settings[i].chiave}</td>
                            <td>${settings[i].valore}</td>
                        </tr>`;
    }	
    html += `       </tbody>
                </table>`;
    settingsTableContainer.html(html);
    settingsDataTable = $("#SettingsTable").DataTable(settingsTableOptions);
}

function BuildSettingsTableHead() {
    var html = `<thead>
                    <tr>`;
    for(var i = 0; i < settingsTableOptions.columnDefs[0].targets.length; i++) {
        html += `       <th scope="col"></th>`;
    }
    html += `           <th scope="col">Impostazione</th>
                        <th scope="col">Valore</th>
                    </tr>
                </thead>`;
    return html;
}

/* ACTIONS */
function editSetting(e, dt, node, config) {
    var row = dt.rows({ selected: true }).data()[0];
    var modalOptions = {};
    var body = buildSettingForm(row);

    modalOptions = {
        title: "Modifica impostazione",
        body: body,
        cancelButton: {
            text: "Annulla"
        },
        confirmButton: {
            text: "Modifica",
            action: formClickDelegate
        }
    }

    modal = new Modal(modalOptions);
    modal.open(); 
}

function buildSettingForm(row) {
    var html = `<form class="form-signin" onsubmit="editSettingItem();return false;">
                    <input id="Setting_id_impostazione" type="hidden" value="${row.id_impostazione}">
                    <span id="Setting_chiave">${row.chiave}<span>
                    <input id="Setting_valore" type="text" class="form-control" value='${row.valore}'>
                    <button id="Setting_edit_button" class="d-none" type="submit">
                </form>`;
    return html;
}

function editSettingItem() {
    var setting = getSettingFromForm();
    settingsManagementService.editSettings(setting)
        .done(actionSuccess)
        .fail(RestClient.redirectIfUnauthorized);
}

function getSettingFromForm() {
    var setting = {
        id_impostazione: $("#Setting_id_impostazione").val(),
        valore: $("#Setting_valore").val(),
    };
    return setting;
}

function actionSuccess(data) {
    if(data) {
        modal.openSuccessModal();
        initSettings();
    }
}

function formClickDelegate() {
    $("#Setting_edit_button").click();
}

/* Init */
initSettings();
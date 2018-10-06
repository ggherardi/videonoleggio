var restitutionManagementService = restitutionManagementService || new RestitutionManagementService();
var getAllItemsService = getAllItemsService || new GetAllItemsService();
var rentedCopiesTableContainer = $("#RentedCopiesTableContainer");
var rentedVideosDataTable;
var rentedVideosDataTableOptions = {
    dom: 'Bftpil',
    buttons: true,
    select: true,
    columns: [
        { data: "id_cliente" },
        { data: "id_noleggio" },
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
        targets: [ 0, 1, 2, 3, 4 ],
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
        .fail(RestClient.redirectIfUnauthorized);
}

function findRentedCopiesForUserSuccess(data) {
    var buildCustomerRow = function(row) {
        return `${row.id_cliente} - ${row.cognome} ${row.nome}`;
    }
    var buildRestitutionDelay = function(row) {
        var oDelay = {
            days: 0,
            cssClass: ""
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
                            <td>${videos[i].id_cliente}</td>
                            <td>${videos[i].id_noleggio}</td>
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
    var doRowsHaveMultipleCustomers = function(rows) {
        var check = false;
        var firstCustomerId = rows[0].id_cliente;
        for(var i = 1; i < rows.length; i++) {
            if(rows[i].id_cliente != firstCustomerId) {
                check = true;
            }
        }
        return check;
    }

    var rows = dt.rows({ selected: true }).data();
    if(doRowsHaveMultipleCustomers(rows)) {
        var body = `<span>Attenzione, le copie selezionate sono attualmente noleggiate da clienti diversi.
                    Si prega di selezionare copie noleggiate da un unico cliente e riprovare.</span>`;
        modalOptions = {
            title: "Attenzione",
            body: body,
            cancelButton: {
                text: "Annulla"
            }
        }
        modal = new Modal(modalOptions);
        modal.open();
    } else {
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
        var extra = calculateExtra(copies[i]);
        html += `<tr class="RestitutionForm_row">              
                    <td data-showfield="${copies[i].id_noleggio}" id="RestitutionForm_row_id_noleggio_${i}" class="d-none">${copies[i].id_noleggio}</td>      
                    <td data-showfield="${copies[i].id_copia}" id="RestitutionForm_row_id_copia_${i}">${copies[i].id_copia}</td>                                                      
                    <td data-showfield="${copies[i].titolo}">${copies[i].titolo}</td>  
                    <td data-showfield="${copies[i].giorni_ritardo}">${copies[i].giorni_ritardo}</td>
                    <td data-showfield="${copies[i].prezzo_giornaliero * 2} €" data-type="checkbox">
                        <input id="RestitutionForm_row_cattivo_stato_${i}" type="checkbox" onchange="badStateClick(this, ${copies[i].prezzo_giornaliero});"/>
                    </td>
                    <td data-showfield="${extra} €"><span id="RestitutionForm_row_extra_${i}" class="RestitutionForm_row_extra_class">${extra}</span> €</td>                   
                </tr>`;
    }
    $("#RestitutionForm_table_body").html(html);
    $("#RestitutionForm_row_id_cliente").val(copies[0].id_cliente);
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
    var extraCell = $(`#RestitutionForm_row_extra_${rowNumber}`);
    extraCell.text(price.toFixed(2));
    extraCell.parent()[0].dataset["showfield"] = `${price.toFixed(2)} €`;
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
        totalExtraAmountContainer.css("display", "block");
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
                                <th data-cellwidth="70" data-showfield="Cod. noleggio" class="d-none"></th>
                                <th data-cellwidth="60" data-showfield="Mat. copia">Codice copia</th>
                                <th data-cellwidth="150" data-showfield="Film">Film</th>
                                <th data-cellwidth="70" data-showfield="Ritardo gg.">Ritardo gg.</t>
                                <th data-cellwidth="100" data-showfield="Add. cattivo stato">Cattivo stato copia</th>
                                <th data-cellwidth="70" data-showfield="Totale extra">Totale extra</th>
                            </thead>
                            <tbody id="RestitutionForm_table_body"></tbody>
                        </table>
                    </div>
                    <div>
                        <div id="RestitutionForm_importo_totale_container" class="hidden">
                            <h3>Totale extra da pagare:</h3>
                            <h4><span id="RestitutionForm_importo_totale">0</span> €</h4>                        
                        </div>
                        <div class="mt-4">
                            <div class="c-pointer" onclick="initPDF();"><img src="images/adobe.ico" width="25"/><span class="ml-2">Scarica ricevuta<span></div>                     
                        </div>
                    </div>
                    <button id="RestitutionForm_submit_button" class="d-none" type="submit">
                    <input type="hidden" id="RestitutionForm_row_id_cliente"></inputt>      
                </form>`;
    return html;
}

function formClickDelegate() {
    if(window.confirm("ATTENZIONE: ricordarsi di salvare la ricevuta prima di procedere con la restituzione.")) {
        $("#RestitutionForm_submit_button").click();
    } else {
        return false;
    }
}

function returnVideo() {
    var returnCopiesSuccess = function(data) {
        if(data) {
            modal.openSuccessModal();    
            findRentedCopiesForUser();                 
        }
    }

    var copies = getCopiesFromForm();
    restitutionManagementService.returnCopies(copies)
        .done(returnCopiesSuccess)
        .fail(RestClient.redirectIfUnauthorized);
}

function getCopiesFromForm() {
    var copies = [];
    var rows = $(".RestitutionForm_row");
    for(var i = 0; i < rows.length; i++) {
        try {
            var copy = {
                id_noleggio: $(`#RestitutionForm_row_id_noleggio_${i}`).text(),
                id_copia: $(`#RestitutionForm_row_id_copia_${i}`).text(),
                danneggiato: $(`#RestitutionForm_row_cattivo_stato_${i}`).prop(`checked`) ? 1 : 0,
                prezzo_extra: $(`#RestitutionForm_row_extra_${i}`).text(),
            }        
            copies.push(copy);
        }
        catch(ex) {
            console.error(ex);
            return false;
        }
    }
    return copies;
}

/* PDF Receipt Generator */
function initPDF() {
    var id_cliente = $("#RestitutionForm_row_id_cliente").val();
    var customersManagementService = customersManagementService || new CustomersManagementService();
    customersManagementService.findCustomerById(id_cliente)
        .done(generatePDF)
        .fail(RestClient.redirectIfUnauthorized);
}

function generatePDF(customer) {
    this.getAndUpdateHeight = function(extraMargin) {
        this.currentHeight += 20;
        if(extraMargin) {
            this.currentHeight += extraMargin;
        }
        return this.currentHeight;
    }

    this.buildPDFLogoImage = function() {
        return new Promise((resolve, reject) => {
            pdf = this.pdfDocument;
            var img = new Image();
            img.src = `/images/rentnet-logo.jpeg`;
            img.onload = function() {
                resolve(this);
            }
        });
    }

    this.buildPDFHeader = function() {
        this.pdfDocument.setFontSize(15);
        this.pdfDocument.text("Rent Net - Videonoleggi", 160, this.getAndUpdateHeight(10));
    }

    this.buildPDFCustomerDetails = function() {
        this.pdfDocument.text("Ricevuta restituzione noleggi", this.marginLeft, this.getAndUpdateHeight(100));
        this.pdfDocument.setFontSize(10);
        this.pdfDocument.text(`Sig./Sig.ra ${this.customer.cognome} ${this.customer.nome}`, this.marginLeft, this.getAndUpdateHeight());
        this.pdfDocument.text(`${this.customer.indirizzo}`, this.marginLeft, this.getAndUpdateHeight(-5));
    }

    this.buildPDFBody = function() {
        this.pdfDocument.setFontSize(8);
        var body = [`Per ogni giorno di ritardo viene applicata la tariffa giornaliera, sulla quale vengono applicate le scontistiche della propria sottoscrizione e quelle`];
        body.push(` relative alla tariffa che è stata applicata al momento del noleggio della copia.`);
        body.push(`I film riconsegnati in cattivo stato o danneggiati dovranno essere rimborsati per un importo pari a due giorni di noleggio senza scontistiche`);
        body.push(` applicate.`);
        this.pdfDocument.text(body, this.marginLeft, this.getAndUpdateHeight(50));
    }

    this.buildPDFTable = function() {
        this.pdfDocument.setFontSize(10);
        var oTable = this.buildTableObject();
        var totalAmount = $("#RestitutionForm_importo_totale").text();
        var lastCell = {};
        for(var i = 0; i < oTable.length; i++) {
            lastCell.totalWidth = 0;     
            $.each(oTable[i], (key, obj) => {          
                this.pdfDocument.cell(35, this.getAndUpdateHeight(80), parseInt(obj.cellWidth), 20, obj.value, i);        
                lastCell.width = parseInt(obj.cellWidth);
                lastCell.totalWidth += lastCell.width;
            });
            this.pdfDocument.setFontSize(6);
            lastCell.index = i;
        }
        this.pdfDocument.setFontSize(10);
        this.pdfDocument.cell((35 + (lastCell.totalWidth - lastCell.width)), this.getAndUpdateHeight(), lastCell.width, 20, `${totalAmount} €`, lastCell.index + 1);
    }

    this.buildTableObject = function() {
        HTMLTableCellElement.prototype.getFieldValue = function() {
            return this.dataset["showfield"];
        }
        HTMLTableCellElement.prototype.getFieldType = function() {
            return this.dataset["type"];
        }
        HTMLTableCellElement.prototype.getCellWidth = function() {
            return this.dataset["cellwidth"];
        }
        var getCorrectIndex = function(array, index) {
            if(!array[index]) {
                return getCorrectIndex(array, index - 1);
            }
            return index;
        }

        var table = $("#RestitutionFormTable")[0];
        var oTable = [];
        var headers = [];
        var headerRow = table.rows[0].cells;
        for(var i = 0; i < headerRow.length; i++) {
            if(headerRow[i].getFieldValue()) {
                headers.push({ value: headerRow[i].getFieldValue(), cellWidth: headerRow[i].getCellWidth() });
            }
        }
        oTable.push(headers);
        for(var i = 1; i < table.rows.length; i++) {
            var row = table.rows[i];
            var rowData = {};
            for(var j = 0; j < row.cells.length; j++) {
                if(row.cells[j].getFieldValue()) {
                    if(row.cells[j].getFieldType() == "checkbox") {
                        rowData[headers[getCorrectIndex(headers, j)].value] = { value: row.cells[j].children[0].checked ? row.cells[j].getFieldValue() : `-`, cellWidth: headers[getCorrectIndex(headers, j)].cellWidth };
                    } else {
                        rowData[headers[getCorrectIndex(headers, j)].value] = { value: row.cells[j].getFieldValue(), cellWidth: headers[getCorrectIndex(headers, j)].cellWidth };
                    }                
                }
            }
            oTable.push(rowData);
        }
        return oTable;
    }

    /* Init PDF creation */
    this.customer = JSON.parse(customer);
    this.pdfDocument = new jsPDF({unit: "pt"});
    this.currentHeight = 50;
    this.marginLeft = 30;
    this.pdfDocument.cellInitialize();
    this.buildPDFHeader();
    this.buildPDFCustomerDetails();
    this.buildPDFBody();
    this.buildPDFTable();
    this.buildPDFLogoImage().then((data) => { 
        this.pdfDocument.addImage(data, "JPEG", 30, 40);
        this.pdfDocument.save(`Ricevuta_restituzione_noleggio_${this.customer.nome}_${this.customer.cognome}.pdf`);
    });
}
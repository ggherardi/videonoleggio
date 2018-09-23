class Discount {
    constructor(containerId) {
        this.containerId = containerId;
        this.discountDTOptions = {
            dom: 't',
            order: [],
            columns: [
                { data: "Giorno", orderable: false },
                { data: "Sconto", orderable: false }
            ],
        };
        if(Global_FilmPrices) {
            
        }
    }

    init() {
        this.retrieveActiveDiscount();
    }

    retrieveActiveDiscount() {
        var loader = new Loader(this.containerId, 50, 50);
        loader.showLoader();
        rentalManagementService.getActiveDiscount()
            .done(this.buildHtml.bind(this))
            .fail(restCallError)
            .always(() => loader.hideLoader())
    }
    
    buildHtml(data) {
        var html = ``;
        if(data) {
            var discount = JSON.parse(data);
            var discountRates = JSON.parse(discount.tariffa);
            html += `<table id="DiscountTable" class="table" data-TariffaId="${discount.id_tariffa}">
                        <thead>
                            <tr>
                                <th>Giorno</th>
                                <th>Sconto</th>
                            </tr>
                        </thead>
                        <tbody>`;
            for(var i = 0; i < discountRates.length; i++) {
                html += `   <tr>
                                <td>${discountRates[i].g}${i + 1 == discountRates.length ? "+" : ""}</td>
                                <td>${discountRates[i].s}%</td>
                            </tr>`;
            }
            html += `   </tbody>
                    </table>`;
        }
        $(this.containerId).html(html);
        $("#DiscountTable").DataTable(this.discountDTOptions);
    }
}
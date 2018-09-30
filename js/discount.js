class Discount {
    constructor(containerId) {
        this.isRentModalWithMoviesToShow = Global_FilmPrices && Global_FilmPrices.length > 0;
        this.containerId = containerId;
        this.discountDTOptions = {
            dom: 't',
            order: [],
            columns: [
                { data: "Giorno", orderable: false },
                { data: "Sconto", orderable: false }
            ],
        };
        if(this.isRentModalWithMoviesToShow) {
            var extraColumns = [];
            for(var i = 0; i < Global_FilmPrices.length; i++) {
                extraColumns.push({ data: `Film_${i}`, orderable: false });
            }
            this.discountDTOptions.columns.push(extraColumns);
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
            .fail(RestClient.redirectIfUnauthorized)
            .always(() => loader.hideLoader())
    }
    
    /** discountRates.g = Numero Giorni, discountRates.s = Sconto */
    buildHtml(data) {
        var html = ``;
        if(data) {
            var discount = JSON.parse(data);
            var discountRates = JSON.parse(discount.tariffa);
            html += `<table id="DiscountTable" class="table" data-TariffaId="${discount.id_tariffa}">
                        <thead>
                            <tr>
                                <th>Giorno</th>
                                <th>Sconto</th>`
            if(this.isRentModalWithMoviesToShow) {
                for(var i = 0; i < Global_FilmPrices.length; i++) {
                    var titleAbstract = this.getMovieTitleAbstract(Global_FilmPrices[i].titolo);
                    html +=     `<th>${titleAbstract}</th>`   
                }
            }
                            `</tr>
                        </thead>
                        <tbody>`;
            for(var i = 0; i < discountRates.length; i++) {
                html += `   <tr>
                                <td>${discountRates[i].g}${i + 1 == discountRates.length ? "+" : ""}</td>
                                <td>${discountRates[i].s}%</td>`
            if(this.isRentModalWithMoviesToShow) {
                for(var j = 0; j < Global_FilmPrices.length; j++) {
                    var discountedPrice = this.calculateDiscountedPrices(Global_FilmPrices[j].prezzo_giornaliero.replace("€", "").trimEnd(), discountRates[i].s);
                    html+=  `   <td><span id="Rates_day_${i}_Movie_${j}" class="priceForMovies">${discountedPrice}</span> €</td>`
                }                      
            }                        
                            `</tr>`;
            }
            html += `   </tbody>
                    </table>`;
        }
        $(this.containerId).html(html);
        // $("#DiscountTable").DataTable(this.discountDTOptions);
    }

    getMovieTitleAbstract(title) {        
        return `${title.substring(0, 4)}...${title.substring(title.length - 4, title.length)}`;
    }

    calculateDiscountedPrices(price, rates) {
        var discountedPrice = price - ((price * rates) / 100);
        return discountedPrice;
    }
}
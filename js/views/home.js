var bookingManagementService = bookingManagementService || new BookingManagementService();

function initHome() {
    bookingManagementService.getComingSoonMovies(sharedStorage.loginContext.punto_vendita_id_punto_vendita)
        .done(initHomeSuccess)
        .fail(RestClient.redirectIfUnauthorized);
}

function initHomeSuccess(data) {
    if(data) {
        var array = JSON.parse(data);
        $("#ComingSoonMoviesAlert").append("<h1><h3>Film in uscita</h3><br>")
        for(var i = 0; i < array.length; i++) {
            var movie = array[i];
            $("#ComingSoonMoviesAlert").append(`
            <div>
                Il film ${movie.titolo} esce il ${movie.data_uscita}
                ${movie.numero_prenotazioni == 1 ? `ed è stata prenotata ${movie.numero_prenotazioni} copia` : `e sono state prenotate ${movie.numero_prenotazioni} copie`}. Accertarsi di avere sufficienti copie in magazzino.
            </div><br>`);
        }
    }    
}

/* Init */
initHome();
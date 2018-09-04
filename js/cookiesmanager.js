class CookiesManager{
    constructor() { }

    // Codifica il cookie in base64
    encodeObject(object) {
        return btoa(JSON.stringify(object));
    }

    // Decodifica il cookie da base64
    decodeObject(encodedObject) {
        const objString = atob(encodedObject);
        return JSON.parse(objString);
    }

    // Restituisce il cookie richiesto
    getCookie(cookieName) {
        const cookiesArray = this.getAllCookiesAsArray();
        return cookiesArray.find(c => c.startsWith(cookieName));
    }

    // Restituisce i cookie come array di stringhe senza whitespaces
    getAllCookiesAsArray() {
        const allCookies = document.cookie;
        return allCookies.replace(/\s/g, '').split(';');
    }

    // Setta il cookie codificato in base 64
    setEncodedCookie(cookieName, object, hours, path) {
        const encodedObject = this.encodeObject(object);
        this.setCookie(cookieName, encodedObject, hours, path);
    }

    // Setta il cookie. Formato cookie: name=value; expires=expirationDate; path=selectedPath
    setCookie(cookieName, cookieValue, hours, path) {
        const date = new Date();
        const daysInMilliseconds = hours * 60 * 60 * 1000;
        date.setTime(date.getTime() + daysInMilliseconds);
        const expirationString = date.toUTCString();
        let cookie = cookieName + '=' + cookieValue;
        cookie += '; expires=' + expirationString;
        cookie += path ? '; path=' + path : '';
        document.cookie = cookie;
    }

    // Restituisce l'oggetto immagazzinato nel cookie
    getObjectFromCookie(cookieName) {
        let encodedCookie = this.getCookie(cookieName);
        let object;
        if (encodedCookie !== undefined) {
            encodedCookie = encodedCookie.split('=')[1];
            object = this.decodeObject(encodedCookie);
        }
        return object;
    }

    // Estende la durata del cookie
    refreshCookie(cookie) {
        const data = this.getObjectFromCookie(cookie);
        this.setEncodedCookie(cookie, data, 0.5);
    }

    // Elimina il cookie dalla lista dei cookies
    disposeCookie(cookieName) {
        this.setCookie(cookieName, '', -1);
    }
}
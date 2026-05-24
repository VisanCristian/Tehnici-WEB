function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        let maxAge = Math.floor(days * 86400);
        expires = "; expires=" + date.toUTCString() + "; max-age=" + maxAge;
    }
    document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function deleteAllCookies() {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}

window.addEventListener("load", function () {
    if (!getCookie("cookiesAccepted")) {
        let banner = document.getElementById("cookie-banner");
        if (banner) {
            banner.classList.remove("hidden");
            banner.classList.add("banner-animation");
        }
    }

    let btnOk = document.getElementById("btn-accept-cookies");
    if (btnOk) {
        btnOk.addEventListener("click", function () {
            // Set for 5 seconds for testing purposes as requested
            let date = new Date();
            date.setTime(date.getTime() + (5 * 1000));
            document.cookie = "cookiesAccepted=true; expires=" + date.toUTCString() + "; path=/";
            // setCookie("cookiesAccepted", "true", 0.5); // normally half a day

            let banner = document.getElementById("cookie-banner");
            if (banner) {
                banner.classList.add("hidden");
                banner.classList.remove("banner-animation");
            }
        });
    }
});

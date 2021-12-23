function fadeIn(element, display) {
    element.style.opacity = "0";
    element.style.display = display ?? "flex";

    (function fade() {
        let value = parseFloat(element.style.opacity);
        value += 0.2;
        if (value <= 1) {
            element.style.opacity = String(value);
            requestAnimationFrame(fade);
        }
    })();
}

function fadeOut(element, display) {
    element.style.opacity = "1";
    element.style.display = display ?? "flex";

    (function fade() {
        let value = parseFloat(element.style.opacity);
        value -= 0.2;
        if (value <= 1) {
            element.style.opacity = String(value);
            requestAnimationFrame(fade);
        }
    })();
}

function showCookiePopup() {
    const cookiePopup = document.getElementById("cookie-popup");
    if (cookiePopup) {
        fadeIn(cookiePopup);
    }
}

function closeCookiePopup() {
    const cookiePopup = document.getElementById("cookie-popup");
    if (cookiePopup) {
        fadeOut(cookiePopup);
    }
}

window.onload = () => {
    showCookiePopup("cookie-popup");
};
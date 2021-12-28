const track = document.querySelector(".slider .track");
const stepTo = 10;
const intervalValue = 10;
let index = 1;

function getSlides() {
    return document.querySelectorAll(".slider .slide");
}

function enableButtons(enabled) {
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    prevButton.disabled = !enabled;
    nextButton.disabled = !enabled;
}

function prevButtonHandler() {
    const slides = getSlides();
    const slideWidth = slides[0].clientWidth;

    if (slides[index].id === 'last-clone') {
        index = slides.length - 2;
        track.style.transform = `translateX(${-slideWidth * index}px)`;
    }

    enableButtons(false);

    let step = 1;
    let intervalHandle = setInterval(() => {
        if (step >= slideWidth) {
            clearInterval(intervalHandle);

            enableButtons(true);
            --index;
            track.style.transform = `translateX(${-slideWidth * index}px)`;

            return;
        }
        step += stepTo;
        track.style.transform = `translateX(${-(slideWidth * index) + step}px)`;
    }, intervalValue);
}

function nextButtonHandler() {
    const slides = getSlides();
    const slideWidth = slides[0].clientWidth;

    if (slides[index].id === 'first-clone') {
        index = 1;
        track.style.transform = `translateX(${-slideWidth * index}px)`;
    }

    enableButtons(false);

    let step = 1;
    let intervalHandle = setInterval(() => {
        if (step >= slideWidth) {
            clearInterval(intervalHandle);

            enableButtons(true);
            ++index;
            track.style.transform = `translateX(${-(slideWidth * index)}px)`;

            return;
        }
        step += stepTo;
        track.style.transform = `translateX(${-(slideWidth * index) - step}px)`;
    }, intervalValue);
}

function initSlider() {
    const slides = getSlides();
    const slideWidth = slides[0].clientWidth;

    const firstClone = slides[0].cloneNode(true);
    firstClone.id = "first-clone";
    track.append(firstClone);

    const lastClone = slides[slides.length - 1].cloneNode(true);
    lastClone.id = "last-clone";
    track.prepend(lastClone);

    track.style.width = `${slideWidth * slides.length + slideWidth  + slideWidth}px`;
    track.style.transform = `translateX(${-slideWidth}px)`;

    const prevButton = document.querySelector(".prev");
    prevButton.addEventListener("click", prevButtonHandler);

    const nextButton = document.querySelector(".next");
    nextButton.addEventListener("click", nextButtonHandler);
}

window.onload = () => initSlider();
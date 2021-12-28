const track = document.querySelector(".slider .track");
const firstCloneId = 'first-clone';
const lastCloneId = 'last-clone';
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

    if (slides[index].id === lastCloneId) {
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

    if (slides[index].id === firstCloneId) {
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

function dotButtonHandler(e) {
    if (e.currentTarget.id == index) {
        return;
    }
    const currentDot = document.querySelector(".dots-line .dot-active");
    currentDot.classList.remove("dot-active");

    e.currentTarget.classList.add("dot-active");
}

function initSlides() {
    const slides = getSlides();
    const slideWidth = slides[0].clientWidth;

    const firstClone = slides[0].cloneNode(true);
    firstClone.id = firstCloneId;
    track.append(firstClone);

    const lastClone = slides[slides.length - 1].cloneNode(true);
    lastClone.id = lastCloneId;
    track.prepend(lastClone);

    track.style.width = `${slideWidth * slides.length + slideWidth  + slideWidth}px`;
    track.style.transform = `translateX(${-slideWidth}px)`;
}

function initControlButtons() {
    const prevButton = document.querySelector(".prev");
    prevButton.addEventListener("click", prevButtonHandler);

    const nextButton = document.querySelector(".next");
    nextButton.addEventListener("click", nextButtonHandler);
}

function createDots(number) {
    const dotsLine = document.querySelector(".dots-line");
    [...Array(number).keys()].forEach((_, index) => {
        let dot = document.createElement("div");
        dot.id = String(index + 1);
        dot.classList.add("dot");
        if (index == 0) {
            dot.classList.add("dot-active");
        }
        dot.addEventListener("click", dotButtonHandler);

        dotsLine.append(dot);
    });
}

function initDotsLine() {
    const slides = getSlides();
    createDots(slides.length - 2);
}

function initSlider() {
    initSlides();
    initControlButtons();
    initDotsLine();
}

window.onload = () => initSlider();
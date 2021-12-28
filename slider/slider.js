const track = document.querySelector(".slider .track");
const firstCloneId = 'first-clone';
const lastCloneId = 'last-clone';
let stepTo = 30;
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

function getDot(index) {
    return document.querySelector(`.dots-line div[id='${index}']`);
}

function getDots() {
    return [...document.querySelectorAll(".dots-line .dot")];
}

function getActiveDot() {
    return document.querySelector(".dots-line .dot-active");
}

function resetDots() {
    const dots = getDots();
    if (dots) {
        dots.map(dot => dot.classList.remove("dot-active"));
    }
}

function setDotActive(index) {
    const dot = getDot(index);
    if (dot) {
        dot.classList.add("dot-active");
    }
}

function prevButtonHandler() {
    const slides = getSlides();
    const slideWidth = slides[0].clientWidth;

    if (slides[index].id === lastCloneId) {
        index = slides.length - 2;
        setDotActive(index);
        track.style.transform = `translateX(${-slideWidth * index}px)`;
    }

    enableButtons(false);

    let step = 1;
    stepTo = (stepTo < 0) ? -stepTo : stepTo;

    let intervalHandle = setInterval(() => {
        if (step >= slideWidth) {
            clearInterval(intervalHandle);

            enableButtons(true);
            resetDots();

            --index;
            if (index == 0) {
                setDotActive(slides.length - 2);
            } else {
                setDotActive(index);
            }
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
        setDotActive(index);
        track.style.transform = `translateX(${-slideWidth * index}px)`;
    }

    enableButtons(false);

    let step = 1;
    stepTo = (stepTo < 0) ? -stepTo : stepTo;

    let intervalHandle = setInterval(() => {
        if (step >= slideWidth) {
            clearInterval(intervalHandle);

            enableButtons(true);
            resetDots();

            ++index;
            if (index == slides.length - 1) {
                setDotActive(1);
            } else {
                setDotActive(index);
            }
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

    resetDots();
    setDotActive(e.currentTarget.id);

    let diff = e.currentTarget.id - index;
    moveTo(diff);
}

function moveTo(indexDiff) {
    const slides = getSlides();
    const slideWidth = slides[0].clientWidth;

    if (slides[index].id === firstCloneId) {
        index = 1;
        setDotActive(index);
        track.style.transform = `translateX(${-slideWidth * index}px)`;
    } else if (slides[index].id === lastCloneId) {
        index = slides.length - 2;
        setDotActive(index);
        track.style.transform = `translateX(${-slideWidth * index}px)`;
    }

    enableButtons(false);

    let step = 1;
    if (indexDiff < 0) {
        step = -1;
        stepTo = -stepTo;
    } else {
        step = 1;
        stepTo = (stepTo < 0) ? -stepTo : stepTo;
    }

    let intervalHandle = setInterval(() => {
        if (Math.abs(step) >= Math.abs(indexDiff) * slideWidth) {
            clearInterval(intervalHandle);

            enableButtons(true);
            resetDots();

            index += indexDiff;
            if (index == 0) {
                setDotActive(slides.length - 2);
            } else if (index == slides.length - 1) {
                setDotActive(1);
            } else {
                setDotActive(index);
            }
            track.style.transform = `translateX(${-(slideWidth * index)}px)`;

            return;
        }
        step += stepTo;
        track.style.transform = `translateX(${-(slideWidth * index) - step}px)`;
    }, intervalValue);
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
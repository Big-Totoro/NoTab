const track = document.querySelector(".slider .track");
const FIRST_CLONE_ID = 'first-clone';
const LAST_CLONE_ID = 'last-clone';
const STEP_TO = 30;
const INTERVAL_DELAY = 10;
let index = 1;

function getSlides() {
    return document.querySelectorAll(".slider .slide");
}

function enableControlButtons(enabled) {
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

function enableDots(enabled) {
    const dots = [...getDots()];
    const pointerEvent = (enabled) ? "auto" : "none";
    if (dots) {
        dots.map(dot => dot.style.pointerEvents = pointerEvent);
    }
}

function prevButtonHandler() {
    const slides = getSlides();
    const slideWidth = slides[0].clientWidth;

    if (slides[index].id === LAST_CLONE_ID) {
        index = slides.length - 2;
        setDotActive(index);
        track.style.transform = `translateX(${-slideWidth * index}px)`;
    }

    enableControlButtons(false);
    enableDots(false);

    let step = 1;
    let stepTo = STEP_TO;

    let intervalHandle = setInterval(() => {
        step += stepTo;
        if (step >= slideWidth) {
            clearInterval(intervalHandle);

            enableControlButtons(true);
            enableDots(true);
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
        track.style.transform = `translateX(${-(slideWidth * index) + step}px)`;
    }, INTERVAL_DELAY);
}

function nextButtonHandler() {
    const slides = getSlides();
    const slideWidth = slides[0].clientWidth;

    if (slides[index].id === FIRST_CLONE_ID) {
        index = 1;
        setDotActive(index);
        track.style.transform = `translateX(${-slideWidth * index}px)`;
    }

    enableControlButtons(false);
    enableDots(false);

    let step = 1;
    let stepTo = STEP_TO;

    let intervalHandle = setInterval(() => {
        step += stepTo;
        if (step >= slideWidth) {
            clearInterval(intervalHandle);

            enableControlButtons(true);
            enableDots(true);
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
        track.style.transform = `translateX(${-(slideWidth * index) - step}px)`;
    }, INTERVAL_DELAY);
}

function dotButtonHandler(e) {
    if (e.currentTarget.id == index) {
        return;
    }

    resetDots();
    setDotActive(e.currentTarget.id);

    moveTo(e.currentTarget.id);
}

function moveTo(selectedDotIndex) {
    const slides = getSlides();
    const slideWidth = slides[0].clientWidth;

    if (slides[index].id === FIRST_CLONE_ID) {
        index = 1;
        setDotActive(index);
        track.style.transform = `translateX(${-slideWidth * index}px)`;
    } else if (slides[index].id === LAST_CLONE_ID) {
        index = slides.length - 2;
        setDotActive(index);
        track.style.transform = `translateX(${-slideWidth * index}px)`;
    }

    enableControlButtons(false);
    enableDots(false);

    let step = 1;
    let stepTo = STEP_TO;
    selectedDotIndex -= index;
    if (selectedDotIndex < 0) {
        step = -1;
        stepTo = -STEP_TO;
    }

    let intervalHandle = setInterval(() => {
        step += stepTo;
        if (Math.abs(step) >= Math.abs(selectedDotIndex) * slideWidth) {
            clearInterval(intervalHandle);

            enableControlButtons(true);
            enableDots(true);
            resetDots();

            index += selectedDotIndex;
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
        track.style.transform = `translateX(${-(slideWidth * index) - step}px)`;
    }, INTERVAL_DELAY);
}

function initSlides() {
    const slides = getSlides();
    const slideWidth = slides[0].clientWidth;

    const firstClone = slides[0].cloneNode(true);
    firstClone.id = FIRST_CLONE_ID;
    track.append(firstClone);

    const lastClone = slides[slides.length - 1].cloneNode(true);
    lastClone.id = LAST_CLONE_ID;
    track.prepend(lastClone);

    track.style.width = `${slideWidth * slides.length + slideWidth  + slideWidth}px`;
    track.style.transform = `translateX(${-slideWidth}px)`;
}

function initControlButtons() {
    const prevButton = document.querySelector(".prev");
    prevButton.addEventListener("click", prevButtonHandler);

    const nextButton = document.querySelector(".next");
    nextButton.addEventListener("click", nextButtonHandler);

    if (getSlides().length == 0) {
        enableControlButtons(false);
    }
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
const track = document.querySelector(".slider .track");
let index = 1;

function getSlides() {
    return document.querySelectorAll(".slider .slide");
}

function prevButtonHandler() {
    const slides = getSlides();
    const slideWidth = slides[0].clientWidth;

    if (slides[index].id === 'last-clone') {
        index = slides.length - 2;
        track.style.transform = `translateX(${-slideWidth * index}px)`;
    }

    --index;
    track.style.transform = `translateX(${-slideWidth * index}px)`;
}

function nextButtonHandler() {
    const slides = getSlides();
    const slideWidth = slides[0].clientWidth;

    if (slides[index].id === 'first-clone') {
        index = 1;
        track.style.transform = `translateX(${-slideWidth * index}px)`;
    }

    ++index;
    track.style.transform = `translateX(${-slideWidth * index}px)`;
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
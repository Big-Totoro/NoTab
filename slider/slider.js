const BACKWARD = -1;
const FORWARD = 1;
const slides = document.querySelectorAll(".slider-container .slide");
let currentSlide = 0;

function showNextSlide(index, direction) {
    if (index < 0) {
        index = slides.length - 1;
        slides[0].classList.remove("active");
        slides[index].classList.add("active");
    } else if (index === slides.length) {
        slides[index - 1].classList.remove("active");
        slides[0].classList.add("active");
        index = 0;
    } else {
        slides[index - direction].classList.remove("active");
        slides[index].classList.add("active");
    }

    return index;
}

function prevButtonClick() {
    --currentSlide;
    currentSlide = showNextSlide(currentSlide, BACKWARD);
}

function nextButtonClick() {
    ++currentSlide;
    currentSlide = showNextSlide(currentSlide, FORWARD);
}
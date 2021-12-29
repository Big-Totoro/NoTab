const FIRST_CLONE_ID = 'first-clone';
const LAST_CLONE_ID = 'last-clone';
const STEP_TO = 30;
const INTERVAL_DELAY = 10;

class Slider {
    #index = 1;
    #rootElement;
    #track;

    constructor(rootElement) {
        this.#rootElement = rootElement;
        this.#track = rootElement.querySelector(".slider .track");

        this.#initSlides();
        this.#initControlButtons();
        this.#initDotsLine();
    }

    #getSlides() {
        return this.#rootElement.querySelectorAll(".slider .slide");
    }

    #enableControlButtons(enabled) {
        const prevButton = this.#rootElement.querySelector(".prev");
        const nextButton = this.#rootElement.querySelector(".next");

        prevButton.disabled = !enabled;
        nextButton.disabled = !enabled;
    }

    #getDot(dotIndex) {
        return this.#rootElement.querySelector(`.dots-line div[id='${dotIndex}']`);
    }

    #getDots() {
        return [...this.#rootElement.querySelectorAll(".dots-line .dot")];
    }

    #resetDots() {
        const dots = this.#getDots();
        if (dots) {
            dots.forEach(dot => dot.classList.remove("dot-active"));
        }
    }

    #setDotActive(dotIndex) {
        const dot = this.#getDot(dotIndex);
        if (dot) {
            dot.classList.add("dot-active");
        }
    }

    #enableDots(enabled) {
        const dots = [...this.#getDots()];
        const pointerEvent = (enabled) ? "auto" : "none";
        if (dots) {
            dots.forEach(dot => { dot.style.pointerEvents = pointerEvent; });
        }
    }

    prevButtonHandler = (e) => {
        const slides = this.#getSlides();
        const slideWidth = slides[0].clientWidth;

        if (slides[this.#index].id === LAST_CLONE_ID) {
            this.#index = slides.length - 2;
            this.#setDotActive(this.#index);
            this.#track.style.transform = `translateX(${-slideWidth * this.#index}px)`;
        }

        this.#enableControlButtons(false);
        this.#enableDots(false);

        let step = 1;
        let stepTo = STEP_TO;

        let intervalHandle = setInterval(() => {
            step += stepTo;
            if (step >= slideWidth) {
                clearInterval(intervalHandle);

                this.#enableControlButtons(true);
                this.#enableDots(true);
                this.#resetDots();

                --this.#index;
                if (this.#index == 0) {
                    this.#setDotActive(slides.length - 2);
                } else {
                    this.#setDotActive(this.#index);
                }
                this.#track.style.transform = `translateX(${-slideWidth * this.#index}px)`;

                return;
            }
            this.#track.style.transform = `translateX(${-(slideWidth * this.#index) + step}px)`;
        }, INTERVAL_DELAY);
    }

    nextButtonHandler = (e) => {
        const slides = this.#getSlides();
        const slideWidth = slides[0].clientWidth;

        if (slides[this.#index].id === FIRST_CLONE_ID) {
            this.#index = 1;
            this.#setDotActive(this.#index);
            this.#track.style.transform = `translateX(${-slideWidth * this.#index}px)`;
        }

        this.#enableControlButtons(false);
        this.#enableDots(false);

        let step = 1;
        let stepTo = STEP_TO;

        let intervalHandle = setInterval(() => {
            step += stepTo;
            if (step >= slideWidth) {
                clearInterval(intervalHandle);

                this.#enableControlButtons(true);
                this.#enableDots(true);
                this.#resetDots();

                ++this.#index;
                if (this.#index == slides.length - 1) {
                    this.#setDotActive(1);
                } else {
                    this.#setDotActive(this.#index);
                }
                this.#track.style.transform = `translateX(${-(slideWidth * this.#index)}px)`;

                return;
            }
            this.#track.style.transform = `translateX(${-(slideWidth * this.#index) - step}px)`;
        }, INTERVAL_DELAY);
    }

    dotButtonHandler = (e) => {
        if (e.currentTarget.id == this.#index) {
            return;
        }

        this.#resetDots();
        this.#setDotActive(e.currentTarget.id);

        this.#moveTo(e.currentTarget.id);
    }

    #moveTo(selectedDotIndex) {
        const slides = this.#getSlides();
        const slideWidth = slides[0].clientWidth;

        if (slides[this.#index].id === FIRST_CLONE_ID) {
            this.#index = 1;
            this.#setDotActive(this.#index);
            this.#track.style.transform = `translateX(${-slideWidth * this.#index}px)`;
        } else if (slides[this.#index].id === LAST_CLONE_ID) {
            this.#index = slides.length - 2;
            this.#setDotActive(this.#index);
            this.#track.style.transform = `translateX(${-slideWidth * this.#index}px)`;
        }

        this.#enableControlButtons(false);
        this.#enableDots(false);

        let step = 1;
        let stepTo = STEP_TO;
        selectedDotIndex -= this.#index;
        if (selectedDotIndex < 0) {
            step = -1;
            stepTo = -STEP_TO;
        }

        let intervalHandle = setInterval(() => {
            step += stepTo;
            if (Math.abs(step) >= Math.abs(selectedDotIndex) * slideWidth) {
                clearInterval(intervalHandle);

                this.#enableControlButtons(true);
                this.#enableDots(true);
                this.#resetDots();

                this.#index += selectedDotIndex;
                if (this.#index == 0) {
                    this.#setDotActive(slides.length - 2);
                } else if (this.#index == slides.length - 1) {
                    this.#setDotActive(1);
                } else {
                    this.#setDotActive(this.#index);
                }
                this.#track.style.transform = `translateX(${-(slideWidth * this.#index)}px)`;

                return;
            }
            this.#track.style.transform = `translateX(${-(slideWidth * this.#index) - step}px)`;
        }, INTERVAL_DELAY);
    }

    #initSlides() {
        const slides = this.#getSlides();
        const slideWidth = slides[0].clientWidth;

        const firstClone = slides[0].cloneNode(true);
        firstClone.id = FIRST_CLONE_ID;
        this.#track.append(firstClone);

        const lastClone = slides[slides.length - 1].cloneNode(true);
        lastClone.id = LAST_CLONE_ID;
        this.#track.prepend(lastClone);

        this.#track.style.width = `${slideWidth * slides.length + slideWidth  + slideWidth}px`;
        this.#track.style.transform = `translateX(${-slideWidth}px)`;
    }

    #initControlButtons() {
        const prevButton = this.#rootElement.querySelector(".prev");
        prevButton.addEventListener("click", this.prevButtonHandler);

        const nextButton = this.#rootElement.querySelector(".next");
        nextButton.addEventListener("click", this.nextButtonHandler);

        if (this.#getSlides().length == 0) {
            this.#enableControlButtons(false);
        }
    }

    #createDots(number) {
        const dotsLine = this.#rootElement.querySelector(".dots-line");
        [...Array(number).keys()].forEach((_, dotIndex) => {
            let dot = document.createElement("div");
            dot.id = String(dotIndex + 1);
            dot.classList.add("dot");
            if (dotIndex == 0) {
                dot.classList.add("dot-active");
            }
            dot.addEventListener("click", this.dotButtonHandler);

            dotsLine.append(dot);
        });
    }

    #initDotsLine() {
        const slides = this.#getSlides();
        this.#createDots(slides.length - 2);
    }
}

const sliders = [];
document.addEventListener("DOMContentLoaded", () => {
    sliders.push(new Slider(document.getElementById("slider1")));
    sliders.push(new Slider(document.getElementById("slider2")));
    sliders.push(new Slider(document.getElementById("slider3")));
});
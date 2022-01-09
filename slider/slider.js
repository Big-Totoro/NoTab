const PREV_BUTTON = 1;
const NEXT_BUTTON = 2;
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

    /**
     * Returns all slides elements
     * @returns {NodeListOf<HTMLElementTagNameMap[string]> | NodeListOf<Element> | NodeListOf<SVGElementTagNameMap[string]>}
     */
    #getSlides() {
        return this.#rootElement.querySelectorAll(".slider .slide");
    }

    /**
     * Changes enable state of the Left/Right buttons
     * @param enabled
     */
    #enableControlButtons(enabled) {
        const prevButton = this.#rootElement.querySelector(".prev");
        const nextButton = this.#rootElement.querySelector(".next");

        prevButton.disabled = !enabled;
        nextButton.disabled = !enabled;
    }

    /**
     * Returns the dot element with the specific index
     * @param dotIndex
     * @returns {any}
     */
    #getDot(dotIndex) {
        return this.#rootElement.querySelector(`.dots-line div[id='${dotIndex}']`);
    }

    /**
     * Returns all dot elements
     * @returns {*[]}
     */
    #getDots() {
        return [...this.#rootElement.querySelectorAll(".dots-line .dot")];
    }

    /**
     * Sets all dot elements to inactive state
     */
    #resetDots() {
        const dots = this.#getDots();
        if (dots) {
            dots.forEach(dot => dot.classList.remove("dot-active"));
        }
    }

    /**
     * Sets the specific element with the index as active
     * @param dotIndex
     */
    #setDotActive(dotIndex) {
        const dot = this.#getDot(dotIndex);
        if (dot) {
            dot.classList.add("dot-active");
        }
    }

    /**
     * Changes enable state of the dot elements
     * @param enabled
     */
    #enableDots(enabled) {
        const dots = [...this.#getDots()];
        const pointerEvent = (enabled) ? "auto" : "none";
        if (dots) {
            dots.forEach(dot => { dot.style.pointerEvents = pointerEvent; });
        }
    }

    /**
     * Moves the slide with the specific index by the slideWidth
     * @param slideWidth
     * @param slideIndex
     */
    #moveSlide(slideWidth, slideIndex) {
        this.#track.style.transform = `translateX(${-slideWidth * slideIndex}px)`;
    }

    /**
     * Moves the slide by small step (pixels)
     * @param slideWidth
     * @param slideIndex
     * @param step
     */
    #moveSlideWithStep(slideWidth, slideIndex, step) {
        this.#track.style.transform = `translateX(${-(slideWidth * this.#index) + step}px)`;
    }

    /**
     * Disables Previous/Next control buttons and Dots
     */
    #doBefore = () => {
        this.#enableControlButtons(false);
        this.#enableDots(false);
    }

    /**
     * Enables Previous/Next control buttons and Dots
     */
    #doAfter = () => {
        this.#enableControlButtons(true);
        this.#enableDots(true);
        this.#resetDots();
    }

    /**
     * Performs the slide moving with animation by clicking on the Previous/Next buttons
     * @param buttonType is Previous or Next button that was clicked by the user
     * @param beforeAction is the action before the animation will be started
     * @param afterAction is the action upon the animation completion
     */
    #moveStep(buttonType, beforeAction, afterAction) {
        const slides = this.#getSlides();
        const slideWidth = slides[0].clientWidth;

        if (slides[this.#index].id === FIRST_CLONE_ID) {
            this.#index = 1;
            this.#setDotActive(this.#index);
            this.#moveSlide(slideWidth, this.#index);
        } else if (slides[this.#index].id === LAST_CLONE_ID) {
            this.#index = slides.length - 2;
            this.#setDotActive(this.#index);
            this.#moveSlide(slideWidth, this.#index);
        }

        beforeAction();

        let step = 1;
        let stepTo = STEP_TO;

        let intervalHandle = setInterval(() => {
            step += stepTo;
            if (step >= slideWidth) {
                clearInterval(intervalHandle);

                afterAction();

                if (buttonType == PREV_BUTTON) {
                    --this.#index;
                    if (this.#index == 0) {
                        this.#setDotActive(slides.length - 2);
                    } else {
                        this.#setDotActive(this.#index);
                    }
                } else {
                    ++this.#index;
                    if (this.#index == slides.length - 1) {
                        this.#setDotActive(1);
                    } else {
                        this.#setDotActive(this.#index);
                    }
                }
                this.#moveSlide(slideWidth, this.#index);

                return;
            }
            if (buttonType == PREV_BUTTON) {
                this.#moveSlideWithStep(slideWidth, this.#index, step);
            } else {
                this.#moveSlideWithStep(slideWidth, this.#index, -step);
            }
        }, INTERVAL_DELAY);
    }

    /**
     * Previous button click handler
     * @param e
     */
    prevButtonHandler = (e) => {
        this.#moveStep(PREV_BUTTON, this.#doBefore, this.#doAfter);
    }

    /**
     * Next button click handler
     * @param e
     */
    nextButtonHandler = (e) => {
        this.#moveStep(NEXT_BUTTON, this.#doBefore, this.#doAfter);
    }

    /**
     * Dot button click handler
     * @param e
     */
    dotButtonHandler = (e) => {
        if (e.currentTarget.id == this.#index) {
            return;
        }

        this.#resetDots();
        this.#setDotActive(e.currentTarget.id);

        this.#moveTo(e.currentTarget.id, this.#doBefore, this.#doAfter);
    }

    /**
     * Performs the slide moving with animation by clicking on the dot buttons
     * @param selectedDotIndex
     * @param beforeAction is the action before the animation will be started
     * @param afterAction is the action upon the animation completion
     */
    #moveTo(selectedDotIndex, beforeAction, afterAction) {
        const slides = this.#getSlides();
        const slideWidth = slides[0].clientWidth;

        if (slides[this.#index].id === FIRST_CLONE_ID) {
            this.#index = 1;
            this.#setDotActive(this.#index);
            this.#moveSlide(slideWidth, this.#index);
        } else if (slides[this.#index].id === LAST_CLONE_ID) {
            this.#index = slides.length - 2;
            this.#setDotActive(this.#index);
            this.#moveSlide(slideWidth, this.#index);
        }

        beforeAction();

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

                afterAction();

                this.#index += selectedDotIndex;
                if (this.#index == 0) {
                    this.#setDotActive(slides.length - 2);
                } else if (this.#index == slides.length - 1) {
                    this.#setDotActive(1);
                } else {
                    this.#setDotActive(this.#index);
                }
                this.#moveSlide(slideWidth, this.#index);

                return;
            }
            this.#moveSlideWithStep(slideWidth, this.#index, -step);
        }, INTERVAL_DELAY);
    }

    /**
     * Initializes Slides
     */
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

    /**
     * Initializes Previous/Next buttons
     */
    #initControlButtons() {
        const prevButton = this.#rootElement.querySelector(".prev");
        prevButton.addEventListener("click", this.prevButtonHandler);

        const nextButton = this.#rootElement.querySelector(".next");
        nextButton.addEventListener("click", this.nextButtonHandler);

        if (this.#getSlides().length == 0) {
            this.#enableControlButtons(false);
        }
    }

    /**
     * Creates dot elements
     * @param number of dot elements
     */
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

    /**
     * Initializes dots
     */
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
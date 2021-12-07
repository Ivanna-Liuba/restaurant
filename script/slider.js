class Slides {
    constructor({title, category, url}) {
        this.title = title
        this.category = category
        this.url = url

        this.slideElem = document.createElement('div');
        this.slideBtnElem = document.createElement('button');
    }

    createSlides() {
        const slideTitle = document.createElement('p');

        this.slideElem.style.backgroundImage = `url(${this.url})`;
        this.slideElem.classList.add('slide')

        this.slideBtnElem.innerText = 'открыть меню';
        this.slideBtnElem.classList.add('menu__button');
        this.slideBtnElem.setAttribute('data-category',`${this.category}`)

        this.slideBtnElem.addEventListener('click', (e)=> {
            e.preventDefault()
            localStorage.setItem('category', `${this.category}`)
            console.log('click')

            Slides.changeLocation()
        })

        slideTitle.innerText = `${this.title}`;
        slideTitle.classList.add('menu__slider--title');
    
        this.slideElem.append(this.slideBtnElem, slideTitle)
    }

    pushSlide(container) {
        this.createSlides()
        container.push(this.slideElem)
    }

    static changeLocation() {
        const currentLocation = document.location.href
        const currentUrlPath = document.location.pathname
        const newLocation = currentUrlPath.indexOf("index.html") > -1 ? currentLocation.replace("index.html", "menu-page/menu.html") : `${currentLocation}menu-page/menu.html`

        document.location.replace(newLocation)
    }
}

export class SliderCarousel {
    constructor({ sliderContainer, slidesArr, slidesAmountToShow = 5}) { 
        this.sliderContainer = sliderContainer    
        this.slidesArr = slidesArr
        this.slidesAmountToShow = slidesAmountToShow

        this.count = 0;
        this.slides = [];
        this.chosenSlideIndex = 2;
        this.oneSlideWidth = null
        this.sliderShift = null;
        this.deviceWidth = document.documentElement.clientWidth

        this.sliderLine = document.createElement('div')
    }

    createSlider() {
        const btnsContainer = document.createElement('div')
        const prevBtn = document.createElement('button')
        const nextBtn = document.createElement('button')

        this.sliderLine.classList.add('menu__slider--line')

        btnsContainer.classList.add('container', 'menu__slider--btns')
        prevBtn.classList.add('menu__slider--btn')
        nextBtn.classList.add('menu__slider--btn')

        prevBtn.addEventListener('click', this.rollSliderBack.bind(this))
        nextBtn.addEventListener('click', this.rollSliderForward.bind(this))

        this.setMenuSlidesSize()
        
        btnsContainer.append(prevBtn, nextBtn)
        this.sliderContainer.append(this.sliderLine, btnsContainer)

        
    }
    createSlides() {
        this.slidesArr.forEach(slide => {
            const slideElem = new Slides(slide)
            slideElem.pushSlide(this.slides)
        })
    }
    changeSlidesAmount() {
        this.sliderLine.innerHTML = ""
        this.slides = []

        if (this.deviceWidth > 800) {
            this.createSlides()
            this.createSlides()
            this.createSlides()
        } else {
            this.createSlides()
        }
        
        this.sliderLine.append(...this.slides)
    }

    getSliderWidth() {
        const { width } = this.sliderContainer.getBoundingClientRect()
        return width
    }
    getDeviceWidth() {
        this.deviceWidth = document.documentElement.clientWidth
    }

    setMenuSlidesSize() {
        this.getDeviceWidth()
        this.changeSlidesAmount()

        let sliderWidth = this.getSliderWidth();
        let sliderLineWidth = null;
    
        if (this.deviceWidth > 800) {

            this.oneSlideWidth = sliderWidth / this.slidesAmountToShow;
            sliderLineWidth = this.oneSlideWidth * this.slides.length;
            this.sliderShift =  - this.oneSlideWidth / 2
        } else {
            this.oneSlideWidth = sliderWidth;
            this.sliderShift = 0;
        }
    
        this.sliderLine.style.width = sliderLineWidth + 'px';
        this.sliderLine.style.left = this.sliderShift  + 'px';
    
        this.slides.forEach(slide => {
            slide.style.width = this.oneSlideWidth + 'px';
    
        });
        
        this.showChosenSlide()
    }

    showChosenSlide() {
        if (this.deviceWidth > 800) {
            this.slides.forEach(slide => slide.classList.add('notchosen'))
            this.slides[this.chosenSlideIndex].classList.remove('notchosen') 
        } else {
            this.slides.forEach(slide => slide.classList.remove('notchosen'))
        }   
    }

    addBtnHandlersForClone() {
        this.cloneBtns.forEach(btn => btn.classList.add('notchosen'))
        this.cloneBtns[this.chosenSlideIndex].classList.remove('notchosen') 
    }

    moveSliderClone() {
        if (this.count >= this.slidesArr.length - this.slidesAmountToShow ) {
            this.sliderLineClone.style.transform = `translate(-${this.oneSlideWidth * this.count - this.oneSlideWidth * this.slidesArr.length}px)`
            this.sliderContainer.insertBefore(this.sliderLineClone, this.sliderLine.nextSibling)
        }

        if (this.count >= this.slidesArr.length) {

        }
    }

    rollSliderForward() {
        this.count++
        this.chosenSlideIndex++
        
        if (this.count >= (this.slidesArr.length * 3) - this.slidesAmountToShow ) {
            this.count = 0
            this.chosenSlideIndex = 2
        }
        
        this.sliderLine.style.transform = `translate(-${this.oneSlideWidth * this.count}px)`

        this.showChosenSlide()
    }

    rollSliderBack() {
        this.count--
        this.chosenSlideIndex--
        
        if (this.count < 0 ) {
            this.count = (this.slidesArr.length * 3) - this.slidesAmountToShow - 1
            this.chosenSlideIndex = (this.slidesArr.length * 3) - this.slidesAmountToShow - 1 + 2
        }
        
        this.sliderLine.style.transform = `translate(-${this.oneSlideWidth * this.count}px)`

        this.showChosenSlide()
    }
}

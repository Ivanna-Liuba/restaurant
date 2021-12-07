import { SliderCarousel } from "./slider.js"

const dish_lists = [
    {
        title: 'Холодные закуски',
        url: './img/menu/cold__cuts.png',
        category: 'coldCuts'
    },
    {
        title: 'Салаты',
        url: './img/menu/salad.png',
        category: 'salad'
    },
    {
        title: 'Выпечка',
        url: './img/menu/pastry.png',
        category: 'pastry'
    },
    {
        title: 'Супы',
        url: './img/menu/soup.png',
        category: 'soup'
    },
    {
        title: 'Блюда на мангале',
        url: './img/menu/grill.png',
        category: 'grill'
    },
    {
        title: 'Горячие блюда',
        url: './img/menu/hot__meal.png',
        category: 'hotDishes'
    },
    {
        title: 'Соусы',
        url: './img/menu/sauce.png',
        category: 'sauce'
    },
]
const dishesSliderArr = [
    {
        picture: 'dish__1.png',
        alt: 'a photo of dish'
    },
    {
        picture: 'dish__2.png',
        alt: 'a photo of dish'
    },
    {
        picture: 'dish__3.png',
        alt: 'a photo of dish'
    },
    {
        picture: 'dish__4.png',
        alt: 'a photo of dish'
    },
    {
        picture: 'dish__5.png',
        alt: 'a photo of dish'
    },
    {
        picture: 'dish__6.png',
        alt: 'a photo of dish'
    },
    {
        picture: 'dish__7.png',
        alt: 'a photo of dish'
    },
    {
        picture: 'dish__8.png',
        alt: 'a photo of dish'
    },
]

const barBtn = document.getElementById('bar__holder')
const menuLinks = document.getElementById('header_links')
const dishesSlider = document.getElementById('dishes__slider');
const dotsContainer = document.getElementById('dishes__slider--dots');
let deviceWidth = document.documentElement.clientWidth;
const menuSlider = document.getElementById('menu__slider');
export let chosenCategory = null;

document.documentElement.ondragstart = function(e) {
    if(e.target.tagName === 'IMG') {
        return false
    }
}
function closeMenu() {
    if (!barBtn.classList.contains('active')) {
        return
    }

    barBtn.classList.toggle('active')
    menuLinks.style.paddingTop = ""
    menuLinks.style.height = ''
    document.body.classList.remove('stop-scrolling')
}
// відкриття бургер-меню
barBtn.addEventListener('click', function() {
    const deviceHeight = document.documentElement.clientHeight

    this.classList.toggle('active')

    if (this.classList.contains('active')) {
        menuLinks.style.paddingTop = '240px'
        menuLinks.style.height = `${deviceHeight}px`
        document.body.classList.add('stop-scrolling')
    } else {
        menuLinks.style.paddingTop = ""
        menuLinks.style.height = ''
        document.body.classList.remove('stop-scrolling')
    }
})

//дзвінок на маленькому девайсі
const phoneIcon = document.querySelectorAll('.phone-icon')
const showPhoneNumber = (clickElem) => {
    const telNum = clickElem.nextElementSibling

    telNum.classList.toggle('contact--tel--shown')

    setTimeout(() => {
        if(!telNum.classList.contains('contact--tel--shown')) {
            return
        }
        telNum.classList.remove('contact--tel--shown')
    }, 10000)
}

phoneIcon.forEach(icon => {
    icon.addEventListener('click', () => showPhoneNumber(icon))
})

//другий слайдер
const slider = new SliderCarousel({
    sliderContainer: menuSlider, 
    slidesArr: dish_lists,
    slidesAmountToShow: 4
})
slider.createSlider()

const showAllSliderPicture = () => {
    dishesSlider.innerHTML = '';
    dishesSliderArr.forEach(({picture, alt}) => {
        if(picture) {
            if(!alt) {
                alt = ""
            }
            const imgElem = document.createElement('img');
            imgElem.setAttribute('src', `./img/dishes__photo/${picture}`)
            imgElem.setAttribute('alt', alt)
            imgElem.classList.add('dishes__img')
            dishesSlider.append(imgElem)
        } 
    })
}
const showSeveralPicture = (arr, showedPicIndex, showedPicAmount) => {
    arr.forEach(item => item.classList.add('hidden'))
    for (let i=0; i<showedPicAmount; i++) {
        arr[showedPicIndex].classList.remove('hidden')
        showedPicIndex++;
    }
}

const createDots = (renderedImgAmount, images) => {
    const dotsAmount = dishesSliderArr.length / renderedImgAmount;
    const dotsArr = []

    dotsContainer.innerHTML = '';
    for (let i=0; i< dotsAmount; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot')
        dotsArr.push(dot)
    }
    dotsContainer.append(...dotsArr)

    const dots = document.querySelectorAll('.dot')
    dots[0].classList.add('active')

    dotsContainer.addEventListener('click', (e) => {
        const clickedElem = e.target;
        if(!clickedElem.classList.contains('dot')) {
            return
        }

        let dotIndex = [...dots].findIndex(elem =>  elem===clickedElem)
        if(dotIndex === -1) {
            dotIndex = 0;
        }
        const showedPictureIndex = dotIndex * renderedImgAmount;

        dots.forEach(dot => dot.classList.remove('active'))
        clickedElem.classList.add('active')

        showSeveralPicture(images, showedPictureIndex, 2)
    })
}


const createSmallDishSlider = () => {
    let imgAmount = 2;
    let imgArr = [];
    let index = 0;

    for (let i=1; i<=imgAmount; i++) {
        let img = document.createElement('img');
        imgArr.push(img)
    }
    dishesSlider.append(...imgArr)
}

const renderDishSlider = () => {
    showAllSliderPicture()

    const allPicture = dishesSlider.querySelectorAll('img')

    if (deviceWidth <= 560) {
        showSeveralPicture(allPicture, 0, 2)
        createDots(2, allPicture)
    } 
}

 
window.addEventListener('resize', (e) => {
    deviceWidth = document.documentElement.clientWidth;
    slider.setMenuSlidesSize()
    renderDishSlider()
})

renderDishSlider()


const scrollPage = (containerScrollTo, scrolledContainer) => {
    const alreadyScrolled = window.scrollY
    const {bottom} = containerScrollTo.getBoundingClientRect()
    const {top} = scrolledContainer.getBoundingClientRect()
    let result = 0

    if (top < 0) {
        result = alreadyScrolled + top - bottom
    } else if (top >= 0 && top < bottom) {
        result = alreadyScrolled  - (bottom - top)
    }  else if (top >= 0 && top >= bottom) {
        result = alreadyScrolled + top
    } else {
        return
    }

    window.scrollTo({
        behavior: "smooth",
        top: result
    })
}

const header = document.querySelector('header')
const deliveryMeansSection = document.getElementById('means')
const contactLink = document.getElementById('contact-link')
contactLink.addEventListener('click', async (e)=> {
    e.preventDefault()
    await closeMenu()
    window.scrollTo({
        behavior: "smooth",
        top: document.body.scrollHeight
    })
})

const deliveryLinks = document.querySelectorAll('.delivery-link')
deliveryLinks.forEach(link => {
    link.addEventListener('click', (e)=> {
        e.preventDefault()
        closeMenu()
        scrollPage(header, deliveryMeansSection)
    })
})

const upArrow = document.getElementById('up-arrow')
upArrow.addEventListener('click', ()=> {
    window.scrollTo({
        behavior: "smooth",
        top: 0
    })
})

window.addEventListener('scroll', function() {
    if (window.scrollY > 150) {
        upArrow.classList.add("shown")
    } else {
        upArrow.classList.remove("shown")

    }
});

const discountLink = document.getElementById('discount-link')

const createToolTip = () => {
    const { bottom, left, width } = discountLink.getBoundingClientRect()
    const toolTipElem = document.createElement('p')

    toolTipElem.innerText = "На данный момент акций нет"
    toolTipElem.classList.add('tooltip')
    
    toolTipElem.style.width = `200px`
    toolTipElem.style.top = `${bottom + 25}px`
    toolTipElem.style.left = `${left + (width / 2) - (200 / 2) }px`

    document.body.prepend(toolTipElem)

    setTimeout(()=>{
        if (toolTipElem) {
            toolTipElem.remove()
        }
    }, 1700)
}

discountLink.addEventListener('click', (e)=> {
    e.preventDefault()
 
    createToolTip()
})


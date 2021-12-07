import * as coldCuts from "./cold-cuts.js";
import * as salad from "./salad.js";
import * as pastry from "./pastry.js";
import * as soup from "./soup.js";
import * as grill from "./grill.js";
import * as hotDishes from "./hot-dishes.js";
import * as sauce from "./sauce.js";
import { cart, cartIcon, addCartElem, renderCart, shakeCartIcon, getTotalSum, cartItemsContainer} from "./cart.js"
import { orderCartList, renderOrderList} from "./order__form.js"

let chosenCategory = localStorage.getItem('category')
if (!chosenCategory) {
    chosenCategory = 'salad'
}

const headerImgs = [
    {
        url: "./menu-img/img-1.png"
    },
    {
        url: "./menu-img/img-2.png"
    },
    {
        url: "./menu-img/img-3.png"
    },
    {
        url: "./menu-img/img-4.png"
    },
]

const footerImgs = [
    {
        url: "./menu-img/img-5.png"
    },
    {
        url: "./menu-img/img-6.png"
    },
    {
        url: "./menu-img/img-7.png"
    },
    {
        url: "./menu-img/img-8.png"
    },
]

const headerImgContainer = document.getElementById('header__imgs')
const footerImgContainer = document.getElementById('footer__imgs')
const dishesCategory = document.getElementById('dishes__category')
const dishesList = document.getElementById('dishes__list')
const categoriesBtnContainer = document.getElementById('categories__list')
const categories = categoriesBtnContainer.querySelectorAll('li')

const createImgs = (imgArr, imgsContainer) => {
    let images = []

    imgArr.forEach(img => {
        const imgElem = document.createElement('div');

        imgElem.classList.add('menu__img')
        imgElem.style.backgroundImage = `url(${img.url})`
        images.push(imgElem)
    })

    imgsContainer.append(...images)
}
createImgs(headerImgs, headerImgContainer)
createImgs(footerImgs, footerImgContainer)

export let cartElemList = {}

class DishCard {
    constructor(dishInfo) {
        
        this.dishInfo = dishInfo;
        this.dishCardElem = document.createElement('div'); 
        this.dishElemHeader = document.createElement('div')
        this.dishTitle = document.createElement('span')
        this.dishPrice = document.createElement('span')
        this.dishSize = document.createElement('span')
        this.dishNutrition = document.createElement('span')
        this.dishComposition = document.createElement('p')
        this.dishBtnsContainer = document.createElement('div')
        this.ordeBtn = `<button class="dish__card-btn dish__card-order" data-cart-action="plus">Заказать</button>`
    }

    createCard() {
        this.dishTitle.innerText = `${this.dishInfo.title}`
        this.dishPrice.innerText = `${this.dishInfo.price} грн.`
        this.dishSize.innerText = `${this.dishInfo.size}`
        this.dishNutrition.innerText = `${this.dishInfo.nutrition}`
        this.dishComposition.innerText = `Состав: ${this.dishInfo.composition}`
        this.dishBtnsContainer.innerHTML = this.ordeBtn

        this.dishCardElem.classList.add('dish__card')
        this.dishElemHeader.classList.add('dish__header')
        this.dishPrice.classList.add('dish__price')
        this.dishSize.classList.add('dish__size')
        this.dishComposition.classList.add('dish__composition')
        this.dishBtnsContainer.classList.add('dish__btn-container')

        this.dishBtnsContainer.addEventListener('click', (e) => {
            const clickedElem = e.target
            if(!clickedElem.classList.contains('dish__card-btn')) {
                return
            }
            addCartElem(this.dishInfo.title, this.dishInfo.price)
            renderCart()
            shakeCartIcon()
        })
        
        this.dishElemHeader.append(this.dishTitle, this.dishPrice)
        this.dishCardElem.append(this.dishElemHeader, this.dishSize, this.dishNutrition, this.dishComposition, this.dishBtnsContainer)

        return this.dishCardElem
    }

    static renderCard(arr, container) {
        container.innerHTML = '';
        container.prepend(...arr)
    }
}

const scrollPage = (containerScrollTo, scrolledContainer) => {
    const alreadyScrolled = window.scrollY
    const { bottom } = containerScrollTo.getBoundingClientRect()
    const { top } = scrolledContainer.getBoundingClientRect()
    let result = 0

    if (top < 0) {
        result = alreadyScrolled + top - bottom
    } else if (top >= 0 && top < bottom) {
        result = alreadyScrolled  - (bottom - top)
    } else {
        return
    }

    window.scrollTo({
        behavior: "smooth",
        top: result
    })
}

const categoriesElem = document.getElementById('categories')
const dishesElem = document.getElementById('dishes')

const createDishCards = (dishesArr) => {
    let dishes = []

    dishesArr.forEach(dish => {
        const card = new DishCard(dish)
        const dishCard = card.createCard()
        dishes.push(dishCard)
    })
    DishCard.renderCard(dishes, dishesList)
    scrollPage(categoriesElem, dishesElem)
}

function lightenDishCategory(dish) {
    categories.forEach(dishCategory => {
        dishCategory.classList.remove('active')

        if (dishCategory.dataset.category === dish)
        dishCategory.classList.add('active')
    })
}

const renderDishes = (dishType) => {
    dishesCategory.innerText = dishType.title
    createDishCards(dishType.dishesList)
}

const switchDishCategory = (dishCategory) => {

    switch (dishCategory) {
        case 'coldCuts': 
            renderDishes(coldCuts)
            break;
        case 'salad': 
            renderDishes(salad)
            break;
        case 'pastry': 
            renderDishes(pastry)
            break;
        case 'soup': 
            renderDishes(soup)
            break;
        case 'grill': 
            renderDishes(grill)
            break;
        case 'hotDishes': 
            renderDishes(hotDishes)
            break;
        case 'sauce': 
            renderDishes(sauce)
            break;
    }
}

lightenDishCategory(chosenCategory)
switchDishCategory(chosenCategory)

categoriesBtnContainer.addEventListener('click', (e) => {
    const clickedCategory = e.target;
    if(!clickedCategory) {
        return
    }

    const dishType = clickedCategory.dataset.category
    
    categories.forEach(category => category.classList.remove('active'))
    clickedCategory.classList.add('active')

    switchDishCategory(dishType)
})

const orderForm = document.getElementById('order__form')

const showAccordion = (form, shownElemId, hiddenElemId) => {
    form.querySelector(`#${shownElemId}`).style.display = "block"
    form.querySelector(`#${hiddenElemId}`).style.display = "none"

}

const checkClickedElem = (form, input) => {
    switch (input.id) {
        case "onown": 
            showAccordion(form, "order__address", "order__carrier")
            break
        case "get__delivery": 
            showAccordion(form, "order__carrier", "order__address")
            break
        case "time_set": 
            showAccordion(form, "time__setted", "time__unsetted")
            break
        case "time_notset": 
            showAccordion(form, "time__unsetted", "time__setted")
            break
    }
}

const inputsRadio = orderForm.querySelectorAll('input[type="radio"]')
inputsRadio.forEach(input => {
    input.addEventListener('input', () => {
        if(!input.checked) {
            return
        }
        checkClickedElem(orderForm, input)
    })
})

document.getElementById('massage').addEventListener('input', function() {
    if(!this.checked) {
        orderForm.querySelector('#comment').style.display = "none"
        return
    }
    orderForm.querySelector('#comment').style.display = "block"
})

const hour = orderForm.querySelector('#hour')
const minute = orderForm.querySelector('#minute')

const createTimeOption = (container, start, end, stem, selected) => {
    let options ="";
    let num =""
    for (let i=start; i<end; i+=stem) {
        num = ( i<10) ? `0${i}` : i

        if (i=== selected) {
            options += `<option value=${num} selected>${num}</option>`
            continue
        }
        options += `<option value=${num}>${num}</option>`
    }
    container.innerHTML = options
}
createTimeOption(hour, 1, 23, 1, 16)
createTimeOption(minute, 0, 60, 10, 0)

const dateInput = document.getElementById('date')
function setUpDateInput(elem) {
    const data = new Date()
    const today = data.getDate()
    const month = data.getMonth()
    const year = data.getFullYear()
    const todayData = `${(month+1) < 9 ? `0${month+1}` : month+1}-${today < 9 ? `0${today}` : today}`
    
    elem.value = `${year}-${todayData}`
    elem.min = `${year}-${todayData}`
    elem.max = `${year + 1}-${todayData}`
}

setUpDateInput(dateInput)

//корзина
const orderSection = document.getElementById('order')
const categoriesSection = document.getElementById('categories')
const dishesSection = document.getElementById('dishes')
const cartOrderBtn = cart.querySelector('#cart__order')
const cartCancelBtn = cart.querySelector('#cart__cancel')
const carMinimizeBtn = cart.querySelector('#cart__minimize')
export const orderCartTotal = document.getElementById('order__cart-total')

cart.addEventListener('click', (e)=> {
    const clickedElem = e.target

    if (clickedElem.classList.contains('cart__cancel')) {
        e.preventDefault()

        cart.classList.add('hidden')
        cartItemsContainer.innerHTML = ''

        for (var dish in cartElemList) delete cartElemList[dish];
        totalPrice = 0
    } 
})

cartOrderBtn.addEventListener('click', (e)=> {
    cart.classList.add('hidden')
    orderSection.classList.remove('hidden')
    categoriesSection.classList.add('hidden')
    dishesSection.classList.add('hidden')

    orderFormSubmit.removeAttribute('disabled')
    orderCartList.innerHTML = ""

    renderOrderList()
    getTotalSum(orderCartTotal)

    clientOrderElem.classList.remove('hidden')
    orderMassageElem.classList.add('hidden')
})

cartCancelBtn.addEventListener('click', (e)=> {
    e.preventDefault()
    
    cart.classList.add('hidden')
    cartItemsContainer.innerHTML = ''
    for (var member in cartElemList) delete cartElemList[member];
    totalPrice = 0
})

carMinimizeBtn.addEventListener('click', (e)=> {
    cart.classList.add('mini')
})

cartIcon.addEventListener('click', (e)=> {
    cart.classList.remove('mini')
})


export const orderFormSubmit = document.getElementById('order__form-submit')
const inputs = orderForm.querySelectorAll('input')

inputs.forEach(input => {
    input.addEventListener('input', (e)=> {
        if(e.target.value) {
            e.target.parentElement.classList.add('label-moved')
        } else {
            e.target.parentElement.classList.remove('label-moved')
        }
    })
})

const validationRule = {
    name: [
        {
            validator: value => Boolean(value), 
            errorMessage: "Вы не ввели имя"
        },
    ],
    tel: [
        {
            validator: value => {
                const regexp = /(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?/ //для тел
                value = value.trim()
                return regexp.test(value) ? true : false  
            }, 
            errorMessage: `Вы ввели не валидный номер тел.`
        },
        {
            validator: value => Boolean(value.trim()), 
            errorMessage: "Вы не ввели телефон"
        }
        
    ],
    city: [
        {
            validator: value => Boolean(value), 
            errorMessage: "Вы не ввели свой город"
        }
    ],
}

const validateForm = (values, rules) => {
    let error = {}
    let isFormValid = true

    for (let name in values) {
        const value = values[name]
        const currentRule = rules[name]
        
        if (!currentRule) {
            continue
        }

        currentRule.forEach(rule => {
            const isValid = rule.validator(value)

            if (!isValid) {
                isFormValid = false
                error[name] = rule.errorMessage
            }
        })
    }
    return {
        isFormValid,
        error
    }
}

const highlightErroredInputs = (errors) => {
    for (let name in errors) {
        const text = errors[name]
        const erroredInput = orderForm.querySelector(`input[name=${name}]`)
        const erroredElem = document.createElement('span')

        erroredElem.classList.add('error__massage')
        erroredElem.innerText = text

        erroredInput.after(erroredElem)
    }
}

const convertFormDataToObj = (formData) => {
    const formValues = {}

    for (let [key, value] of formData.entries()) {
        formValues[key] =  value
    }
    return formValues
}

let windowSize = window.screen.width
window.addEventListener('resize', ()=> {
    windowSize = window.screen.width
})

const header = document.querySelector('header')
const clientOrderElem = orderForm.querySelector('.order__info-cart__ordered-list')
const orderMassageElem = orderForm.querySelector('.order__info-cart__massage')

const clearContentAfterValidation = () => {
    orderFormSubmit.setAttribute('disabled', '')
    inputs.forEach(input => {
        input.value =''
    })
    
    orderCartList.innerHTML = ``
    clientOrderElem.classList.add('hidden')
    orderMassageElem.classList.remove('hidden')

}

const handelFormSubmit = (form) => {
    const formData = new FormData(form)
    const values = convertFormDataToObj(formData)
    const validationResult = validateForm(values, validationRule)

    if (!validationResult.isFormValid) {
        highlightErroredInputs(validationResult.error)
        if (windowSize < 800) {
            scrollPage(header, orderSection)
        }
        orderFormSubmit.setAttribute("disabled", "")
        return false  
    }
    clearContentAfterValidation()

    console.log("Отправлено заказ:", {
        "данные клиента" : values,
        "заказ" : cartElemList
    })

    return true 
}

orderFormSubmit.addEventListener('click', (e)=> {
    e.preventDefault()
    const isFormSubmitted = handelFormSubmit(orderForm)  
    if (isFormSubmitted) {
        cartElemList = {}
        cart.classList.add('hidden')
        cartItemsContainer.innerHTML = '' 
    } else {
        return
    }
     
})

const mustBeInputs = orderForm.querySelectorAll('.must__be')
mustBeInputs.forEach(input => {
    input.addEventListener("input", (e)=> {
        const sibling = e.target.nextElementSibling

        if(!sibling || !sibling.classList.contains('error__massage')) {
            return
        }
        sibling.remove()
        const allErrorMassages = orderForm.querySelectorAll('.error__massage')
        if(!allErrorMassages.length) {
            orderFormSubmit.removeAttribute('disabled')
        }
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


const menuLink = document.getElementById('menu-link')
const isEmpty = (obj) => {
    for (let key in obj) {
        return false
    }
    return true
}

menuLink.addEventListener('click', ()=> {
    orderSection.classList.add('hidden')
    categoriesSection.classList.remove('hidden')
    dishesSection.classList.remove('hidden')
    const isCartEmpty = isEmpty(cartElemList)
    console.log('isCartEmpty', isCartEmpty)

    if(isCartEmpty) {
        return
    }
    renderCart()
})




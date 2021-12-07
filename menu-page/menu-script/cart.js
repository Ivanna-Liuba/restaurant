import { cartElemList, orderFormSubmit, orderCartTotal} from "./script.js"
import {  orderCartList } from "./order__form.js"

export const cart = document.getElementById('cart')
export const cartItemsContainer = document.getElementById('cart__elems')
export const cartIcon = cart.querySelector('#cart__icon')
const totalPriceElem = document.getElementById('cart__total')

export const addCartElem = (dishName, dishPrice) => {
    dishPrice = Number(dishPrice)
    if (cartElemList.hasOwnProperty(dishName)) {
        cartElemList[dishName].count++
        
    } else {
        cartElemList[dishName] = {
            price: dishPrice,
            count: 1
        }
    } 
}

export const shakeCartIcon = () => {
    if (cartIcon.classList.contains('animation_1')) {
        cartIcon.classList.remove('animation_1')
        cartIcon.classList.add('animation_2')
    } else {
        cartIcon.classList.remove('animation_2')
        cartIcon.classList.add('animation_1')
    }
    
}
export const getTotalSum = (totalSumContainer) => {
    console.log("totalSumContainer", totalSumContainer)
    console.log("cartElemList", cartElemList)

    let total = 0
    for (let elem in cartElemList) {
        console.log("elem", elem)
        console.log("total in elem", total)

        total = Number(total) +  ( cartElemList[elem].price * cartElemList[elem].count)
    }
    console.log("total", total)
    totalSumContainer.innerText = total
}

export const minusCartElem = (dishName) => {
    if (!cartElemList.hasOwnProperty(dishName)) {
        return
    }
    if (cartElemList[dishName].count === 1) {
         
            delete cartElemList[dishName]
    } else {
        cartElemList[dishName].count--
    }
}

export  class CartElem {
    constructor(list, elem, containerName) {
        this.containerName = containerName
        this.list = list
        this.elem = elem
        this.price = list[elem].price
        this.count = list[elem].count
        this.dishContainer = document.createElement('div')
        this.dishTitle = document.createElement('p')
        this.dishPrice = document.createElement('p')
        this.dishAmount = document.createElement('p')
        this.amountContainer = document.createElement('div')
        this.btnsContainer = document.createElement('div')
        this.btnMinus = document.createElement('button')
        this.btnPlus = document.createElement('button')
        
    }

    refreshCartInfo() {
        getTotalSum(totalPriceElem)
    
        if (!this.list.hasOwnProperty(this.dishTitle.innerText)) {
            this.dishContainer.remove()
            delete this
            if(!cartItemsContainer.children.length) { //відношення до корзини
                cart.classList.add('hidden')
            }
            return
        }
        
        this.dishAmount.innerText = `Количество: ${this.list[this.dishTitle.innerText].count}`
    }

    refreshOrderInfo() {
        getTotalSum(orderCartTotal)

        if (!this.list.hasOwnProperty(this.dishTitle.innerText)) {
            this.dishContainer.remove()
            delete this
            if(!orderCartList.children.length) { 
                const orderAbsentElem = document.createElement('p')
                orderAbsentElem.innerText = 'Ви ничего не заказали'
                orderAbsentElem.classList.add('info__massage')
                orderCartList.append(orderAbsentElem)
                orderFormSubmit.setAttribute('disabled', "")
            }
            return
        }
        this.dishAmount.innerText = `Количество: ${this.list[this.dishTitle.innerText].count}`
    }

    handleBtn() {
        this.btnMinus.addEventListener("click", (e) => {
            e.preventDefault()
            minusCartElem(this.dishTitle.innerText)

            this.containerName === "cart" ? this.refreshCartInfo() : this.refreshOrderInfo()
        })

        this.btnPlus.addEventListener("click", (e) => {
            e.preventDefault()
    
            addCartElem(this.dishTitle.innerText, this.dishPrice.innerText)
            this.containerName === "cart" ?  getTotalSum(totalPriceElem) : getTotalSum(orderCartTotal)
            getTotalSum(totalPriceElem)
            this.dishAmount.innerText = `Количество: ${this.list[this.dishTitle.innerText].count}`
            shakeCartIcon()
    
        })
    }
    
    renderCartElem() {
        this.dishTitle.innerText = this.elem
        this.dishPrice.innerText = `Цена: ${this.list[this.elem].price} грн.`
        this.dishAmount.innerText = `Количество: ${this.list[this.elem].count}`
        this.btnMinus.innerText = '-'
        this.btnPlus.innerText = '+'

        this.dishContainer.classList.add('cart__dish-container')
        this.dishTitle.classList.add('cart__dish-title')
        this.amountContainer.classList.add('cart__amount-container')
        this.btnMinus.classList.add('dish__card-btn')
        this.btnPlus.classList.add('dish__card-btn')

        this.btnsContainer.append(this.dishAmount, this.btnMinus, this.btnPlus)
        this.amountContainer.append(this.dishAmount, this.btnsContainer)
        this.dishContainer.append(this.dishTitle, this.dishPrice, this.amountContainer)
        
        this.handleBtn()

        return this.dishContainer
    }  
}

export const renderCart = () => {
    cart.classList.remove('hidden')
    cartItemsContainer.innerHTML = ''

    for (let elem in cartElemList) {
        const newCard = new CartElem(cartElemList, elem, "cart")
        const createdElem = newCard.renderCartElem()

        cartItemsContainer.prepend(createdElem)
    }
    getTotalSum(totalPriceElem)
}




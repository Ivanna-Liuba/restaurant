import { cartElemList } from "./script.js"
import { CartElem } from "./cart.js"

export const orderCartList = document.getElementById('order__cart-list')

export const renderOrderList = () => {
    orderCartList.innerHTML = ''

    for (let elem in cartElemList) {
        const newCard = new CartElem(cartElemList, elem, "order")
        const createdElem = newCard.renderCartElem()
        orderCartList.prepend(createdElem)
    }
}


import products from './items.js'

const totalPrice = document.querySelector('.result')
const cartItemsArea = document.querySelector('.cartItemsArea')
const buyBtn = document.querySelector('.buyBtn')
const modal = document.querySelector('.modalConfirm')
const foodItemsArea = document.querySelector('.foodItemsArea')
const selectOptions = document.querySelector('#category')
const searchInput = document.querySelector('.search input')

let cartItems = []

loadProducts(products)

// listeners

buyBtn.addEventListener("click", () => {
    modal.style.display = 'flex'
})

selectOptions.addEventListener('change', e => {
    let selectedOption = e.target.value
    changeByValueSelected(selectedOption)
})

searchInput.addEventListener("keyup", (e) => {
    let searchValue = e.target.value.toLowerCase()
    search(searchValue)
})

// functions

function loadProducts(listProductArray) {
    foodItemsArea.innerHTML = ""
    let productsHTML = listProductArray.map(product => {
        return (
            `
            <div class="foodItem">
                <div class="foodImg">
                    <img class="foodImgScr"
                        src="${product.img}"
                        alt="${product.name}">
                </div>
                <div class="foodOptions">
                    <b class="foodName">${product.name}</b>
                    <p class="foodPrice">${product.price}$</p>
                </div>`
        )
    })
    insertAllElementsInHTML(productsHTML, foodItemsArea)
    setListenerFoodItems()
}

function setListenerFoodItems() {
    let foodItems = document.querySelectorAll('.foodItem')
    foodItems.forEach(e => {
        e.addEventListener('click', e => {
            let path = e.composedPath()
            let itemInfo = []
            path.pop()
            if (path[0].classList[0] == 'foodItem') {
                itemInfo.push(path[0])
            } else {
                itemInfo.push(path.find(e => e.classList[0] == 'foodItem'))
            }
            let nameProduct = itemInfo[0].children[1].children[0].innerText
            let priceProduct = Number(itemInfo[0].children[1].children[1].innerText.slice(0, -1))
            let imgProduct = itemInfo[0].children[0].children[0].src

            let productObj = createFoodItem(nameProduct, priceProduct, imgProduct)
            addToCart(productObj)
        })
    })
}

function createFoodItem(name, price, img) {
    return {
        name,
        price,
        img,
        count: 1
    }
}

function addToCart(currentFood) {
    if (cartItems.find(e => e.name == currentFood.name)) {
        cartItems.find(e => e.name == currentFood.name).count++
        readCart()
        updateTotal()
        return
    }
    cartItems.push(currentFood)
    readCart()
    updateTotal()
}

function updateTotal() {
    let total = cartItems.reduce((acc, e) => acc + (e.price * e.count), 0)
    totalPrice.innerText = total.toFixed(2)
}

function readCart() {
    let currentCart = cartItems.map(currentItem => {
        return (
            `<div class="cartItem">
                <div class="foodAreaInfo">
                    <div class="countArea">
                        <b>${currentItem.count}x</b>
                    </div>
                    <div class="imgArea">
                        <img src="${currentItem.img}"
                        alt="${currentItem.name}">
                    </div>
                    <div class="cartFoodInfo">
                        <b class="nameFoodInfo">${currentItem.name}</b>
                        <p>${currentItem.price}$</p>
                    </div>
                </div>
                <div class="sideB">
                    <div class="total">
                        <p>${(currentItem.price * currentItem.count).toFixed(2)}$</p>
                    </div>
                    <div class="trashBtn">
                        <img src="https://cdn3.iconfinder.com/data/icons/linecons-free-vector-icons-pack/32/trash-512.png"
                        alt="Trash Icon"
                    </div>
                </div>
        </div>`
        )
    })

    insertAllElementsInHTML(currentCart, cartItemsArea)
    updateTrashButtons()
}

function insertAllElementsInHTML(currentElement, currentArea) {
    currentArea.innerHTML = ""
    currentElement.forEach(currentItem => {
        currentArea.insertAdjacentHTML("beforeend", currentItem)
    })
}

function updateTrashButtons() {
    let trashBtn = document.querySelectorAll('.trashBtn')
    trashBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let pathItem = e.composedPath()
            let currentTrashItem = pathItem[3].children[0].children[2].children[0].innerText
            if (cartItems.find(e => e.name == currentTrashItem).count > 1) {
                cartItems.find(e => e.name == currentTrashItem).count--
                readCart()
                updateTotal()
                return
            }
            let newCart = cartItems.filter(e => {
                return e.name != currentTrashItem
            })
            cartItems = newCart
            pathItem[3].remove()
            updateTotal()
        })
    })
}

function changeByValueSelected(value) {
    switch (value) {
        case "combos": {
            let comboProducts = products.filter(e => e.category == "combo")
            loadProducts(comboProducts)
            break
        }
        case "acompanhamentos": {
            let acompanhamentosProducts = products.filter(e => e.category == "acompanhamento")
            loadProducts(acompanhamentosProducts)
            break
        }
        case "carne": {
            let carneProducts = products.filter(e => e.category == "carne")
            loadProducts(carneProducts)
            break
        }
        case "sobremesa": {
            let sobremesaProducts = products.filter(e => e.category == "sobremesa")
            loadProducts(sobremesaProducts)
            break
        }
        default: {
            loadProducts(products)
            break
        }
    }
}

function search(searchStr) {
    let productsLowerCase = products.map(e => {
        let arrayMapped = {
            name: e.name.toLocaleLowerCase(),
            id: e.id
        }
        return arrayMapped
    })
    let ids = productsLowerCase.filter(e => e.name.includes(searchStr)).map(e => e.id)
    let productsResults = []
    for (let i = 0; i < ids.length; i++) {
        let currentFind = products.find(e => e.id == ids[i])
        productsResults.push(currentFind)
    }
    loadProducts(productsResults)
}
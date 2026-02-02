import { menuArray, combos } from './data.js'

let orders = []

document.addEventListener('click', (e)=>{
    if(e.target.dataset.add !== undefined){
        addToOrder(e.target.dataset.add)
    }

    if(e.target.dataset.remove !== undefined){
        removeFromOrder(e.target.dataset.remove)
    }

    if(e.target.dataset.complete !== undefined){
        showPaymentForm()
    }

    if(e.target.classList.contains('modal-form')){
        closeModal()
    }

    if(e.target.dataset.pay !== undefined){
        e.preventDefault()
        handlePayment()
    }

    if(e.target.dataset.star !== undefined){
        handleStarRating(e.target.dataset.star)
    }
})


function checkForCombos(){
    const orderIds = orders.map(item => item.id)
    let activeCombo = null

    for(let combo of combos){
        const hasAllItems = combo.items.every(itemId => orderIds.includes(itemId))
        if(hasAllItems){
            activeCombo = combo
            break // Use first matching combo
        }
    }

    return activeCombo
}

function calculateTotal(){
    let total = orders.reduce((sum, item) => sum + item.price, 0)
    const activeCombo = checkForCombos()

    if(activeCombo){
        const discount = total * activeCombo.discount
        return {
            subtotal: total,
            discount: discount,
            total: total - discount,
            comboName: activeCombo.name
        }
    }

    return {
        subtotal: total,
        discount: 0,
        total: total,
        comboName: null
    }
}

function handlePayment(){
    const nameInput = document.getElementById('name')
    const name = nameInput ? nameInput.value : ''
    
    if(name){
        closeModal()

        const totalPriceDiv = document.querySelector('.total-price')
        totalPriceDiv.innerHTML = getSuccessMessage(name)
        totalPriceDiv.classList.remove('hidden')

    }
}

function handleStarRating(rating){
    const stars = document.querySelectorAll('[data-star]')
    stars.forEach((star, index) => {
        if(index < rating){
            star.classList.add('filled')
        } else {
            star.classList.remove('filled')
        }
    })

    setTimeout(() => {
        const totalPriceDiv = document.querySelector('.total-price')
        totalPriceDiv.innerHTML = `
            <div class="success-message">
                <h2>Thank you for your ${rating}-star rating! 🎉</h2>
                <p>We appreciate your feedback!</p>
            </div>
        `
        orders = [] // Now clear orders
    }, 1000)
}

function getSuccessMessage(name){
    return `
        <div class="success-message">
            <h2>Thanks, ${name}! Your order is on its way!</h2>
            <div class="rating-section">
                <p>How was your experience?</p>
                <div class="stars">
                    <i class="fa-regular fa-star" data-star="1"></i>
                    <i class="fa-regular fa-star" data-star="2"></i>
                    <i class="fa-regular fa-star" data-star="3"></i>
                    <i class="fa-regular fa-star" data-star="4"></i>
                    <i class="fa-regular fa-star" data-star="5"></i>
                </div>
            </div>
        </div>
    `
}

function closeModal(){
    const modal = document.querySelector('.modal-form')
    if(modal){
        modal.remove()
    }
}

function removeFromOrder(index){
    orders.splice(index, 1)
    render()
}

function addToOrder(itemId){
    const targetItem = menuArray.find((item)=>{
        return item.id === Number(itemId)
    })

    if(targetItem){
        orders.push(targetItem)
        render()
    }
}

function showPaymentForm(){
    const modal = document.createElement('div')
    modal.classList.add('modal-form')
    modal.innerHTML = getPayment()
    document.body.appendChild(modal)
}

function getPayment(){
    return `
    <section class="form">
        <form id="payment-form">
            <h2>Enter card details</h2>
            <input type="text" name="name" id="name" placeholder="Enter your name" required>
            <input type="text" name="card-number" id="card-number" placeholder="Enter card number" required>
            <input type="text" name="cvv" id="cvv" placeholder="Enter CVV" required>
            <button type="button" data-pay>Pay</button>
        </form>
    </section>
    `
}

function getYourCheck(){
    const pricing = calculateTotal()

    const orderHtml = orders.map((item, index)=>{
        return `
        <div class="order-item">
            <div class="order-price">
                <h2>${item.name}</h2>
                <button class="remove-btn" data-remove="${index}">remove</button>
            </div>
            <h3>$${item.price}</h3>
        </div>
        `
    }).join('')

    let discountSection = ''
    if(pricing.comboName){
        discountSection = `
            <div class="combo-alert">
                🎉 ${pricing.comboName} Deal Applied! Save $${pricing.discount.toFixed(2)}
            </div>
            <div class="price-line">
                <p>Subtotal:</p>
                <p>$${pricing.subtotal.toFixed(2)}</p>
            </div>
            <div class="price-line discount">
                <p>Discount (50%):</p>
                <p>-$${pricing.discount.toFixed(2)}</p>
            </div>
        `
    }

    return `
        <div class="check-section">
            <h2 class="order-title">Your order</h2>
            ${orderHtml}
            ${discountSection}
            <div class="total-line">
                <h2>Total price:</h2>
                <h3>$${pricing.total.toFixed(2)}</h3>
            </div>
            <button class="complete-order-btn" data-complete>Complete order</button>
        </div>
    `
}

function getMenu(){
    return menuArray.map((gelato)=>{
        return `
            <div class="menu-section">
                <div class="item">
                    <img src="${gelato.images}" alt="${gelato.name}">
                    <div class="gelato">
                        <h2>${gelato.name}</h2>
                        <p>${gelato.ingredients.join(', ')}</p>
                        <h3>$${gelato.price}</h3>
                    </div>
                </div>
                <i class="fa-solid fa-circle-plus" data-add="${gelato.id}"></i>   
            </div>  
        `
    }).join('')
}

function render(){
    document.getElementById('menu').innerHTML = getMenu()

    const totalPriceDiv = document.querySelector('.total-price')

    if(orders.length > 0){
        totalPriceDiv.innerHTML = getYourCheck()
        totalPriceDiv.classList.remove('hidden')
    } else {
        totalPriceDiv.classList.add('hidden')
    }
}

render()
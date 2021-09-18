
/* *
    Name Haawain Pizza
    Size: Large or medium or small
    Crust: crispy, stuffed, Glutten free
    Topings: bacon checken cheese
*/

const pizzaSizes = ["Small", "Medium", "Large"];
function pizzaTypes(name, image, description) {
    this.name = name;
    this.image = image;
    this.description = description;

    this.prices = {
        "Large": 1000,
        "Medium": 800,
        "Small": 500
    }
}
pizzaTypes.prototype.price = 0;
pizzaTypes.prototype.crust = null;
pizzaTypes.prototype.topping = null;

function crusts(name, price) {
    this.name = name;
    this.price = price;
}

function toppings(name, price) {
    this.name = name;
    this.price = price;
}

function Cart(){
    const cart = this;
    this.cartItems = [];
    /* item = pizza */
    this.addToCart = function(item){
        cart.cartItems.push(item);
        $("#cartItems").html(cartItems.length);
    }
}

const cart = new Cart();
let selectedPizza;

const pizzaListing = [
    new pizzaTypes("Haawain",
        "delish-homemade-pizza-horizontal-1542312378.png",
        "This is haawain pizza"),
    new pizzaTypes("Peperuni", "intro-1571237396.jpg", "This is peperuni"),
    new pizzaTypes("BBQ Chicken", "pizza-recipe-1-500x375.jpg", "This BBQ Chicken")
];

const crustList = [
    new crusts("Crispy", 100),
    new crusts("stuffed", 120),
    new crusts("Glutten free", 200)
];

const topingsList = [
    new toppings("bacon", 120),
    new toppings("checken", 150),
    new toppings("cheese", 200)
];

function populateDropdowns(sizeElement, items, valueFiled, textField, extraField){
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let extras = extraField ? '('+item[extraField]+')' : '';
        let value = valueFiled ? item[valueFiled] : item;
        let text = textField ? item[textField] : item;
        sizeElement.append(`<option value="` + value + `">` + text + extras+`</option>`);
    }
}

function updateUI(){
    $('#cartItems').html(cart.cartItems.length);
    if(selectedPizza){
        console.log(selectedPizza);
        let pizzaPrice = 0;
        if(selectedPizza.price){
            pizzaPrice += selectedPizza.price;
            $('#addToCartBtn').removeAttr('disabled');
        }
        else{
            $('#addToCartBtn').attr('disabled', true);
        }
        if(selectedPizza.crust) pizzaPrice += selectedPizza.crust.price;
        if(selectedPizza.topping) pizzaPrice += selectedPizza.topping.price;
                
        $('#pizzaPrice').html(pizzaPrice);

    }

    let totalPrice = 0;
    for(let i=0; i<cart.cartItems.length; i++){
        const item = cart.cartItems[i];
        totalPrice += item.price + item.crust.price + item.topping.price;
    }
    $('#totalPrice').html(totalPrice);
}

$(document).ready(function () {

    const cartItemHtml = $('#shoppingCart .cartItem').prop('outerHTML');
    $('#shoppingCart .cartItem').remove();

    /* Populating pizza list */
    const pizzaListDiv = $('#pizzalisting');
    let pizzaItems = '';

    for (let i = 0; i < pizzaListing.length; i++) {
        let pizzaItem = pizzaListing[i];

        pizzaItems += `<div class="col-md-4 p-3">
        <div class="card" style="width: 18rem;">
        <div class="pizzaImage">
        <img src="./assets/images/${pizzaItem.image}" class="card-img-top" alt="...">
        </div>
        <div class="card-body">
          <h5 class="card-title">`+ pizzaItem.name + `</h5>
          <p class="card-text">`+ pizzaItem.description + `</p>

          <a href="#" data-index="`+ i + `" 
            class="btn btn-primary orderBtn"
            data-bs-toggle="offcanvas"
            data-bs-target="#pizzaCustomazation"
            aria-controls="offcanvasBottom">Order</a>

        </div>
      </div>
        </div>`;
        pizzaItem = undefined;
    }

    pizzaListDiv.html(pizzaItems);
    pizzaListDiv.find('a.orderBtn').each(function () {
        $(this).on('click', function () {
            let pizzaIndex = $(this).data('index');
            selectedPizza = pizzaListing[pizzaIndex];
            $('#pizzaCustomazation img').attr('src', './assets/images/' + selectedPizza.image);
            
            $('select#size').val('');
            $('select#toppings').val('');
            $('select#crust').val('');
            $('#pizzaPrice').html('');
        });
    });
    /* end of Populating pizza list */

    /* Populate sizes */
    populateDropdowns($('select#size'), pizzaSizes);
    $('select#size').on('change', function(){
        const size =$(this).val();
        if(selectedPizza){
            selectedPizza.price = selectedPizza.prices[size];
        }
        updateUI()
    });
    /* end of Populate sizes */

    /* Populate Toppings */
    populateDropdowns($('select#toppings'), topingsList, 'name', 'name', 'price');
    $('select#toppings').on('change', function(){
        const selectedToppingValue = $(this).val();
        let topping = topingsList.find(function(topping){
            if(topping.name == selectedToppingValue) return true;
            else return false;
        });
        selectedPizza.topping = topping;
        updateUI()
    });
    /* end of Populate sizes */

    /* Populate crust */
    populateDropdowns($('select#crust'), crustList, 'name', 'name', 'price');
    $('select#crust').on('change', function(){
        const selectedCrustValue = $(this).val();
        let crust = crustList.find(function(crust){
            if(crust.name == selectedCrustValue) return true;
            else return false;
        });
        console.log(crust);
        selectedPizza.crust = crust;
        updateUI();
    });
    /* end of Populate sizes */

    /* add to cart action */
    const addToCartBtn = $('#addToCartBtn');
    addToCartBtn.click(function(){        
        cart.addToCart(selectedPizza);
        alert(selectedPizza.name +' has been added to cart');
        updateUI();
    });

    $('#shoppingCartBtn').on('click', function(){
        $('#shoppingCart').toggle();
    });

});
import Customer from './Customer.js';
import Product from './Product.js';

class Sale {
    constructor(customer) {
        this.customer = customer;
        this.products = [];
        this.total = 0;
    }

    addProduct(product, quantity) {
        if (product.reduceStock(quantity)) {
            this.products.push({ product, quantity });
            this.total += product.price * quantity;
            return true;
        } else {
            return false;
        }
    }

    confirmSale() {
        this.customer.incrementPurchaseCount();
    }
}

export default Sale;
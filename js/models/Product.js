class Product {
    constructor(name, price, stock) {
        this.name = name;
        this.price = price;
        this.stock = stock;
    }

    updateStock(newStock) {
        this.stock = newStock;
    }

    reduceStock(quantity) {
        if (this.stock >= quantity) {
            this.stock -= quantity;
            return true;
        } else {
            return false;
        }
    }
}

export default Product;
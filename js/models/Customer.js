class Customer {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.purchaseCount = 0;
    }

    updateEmail(newEmail) {
        this.email = newEmail;
    }

    incrementPurchaseCount() {
        this.purchaseCount += 1;
    }
}

export default Customer;
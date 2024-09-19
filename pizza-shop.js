class PizzaShop{
    constructor(){
        this.orderNumber=0;
    }
    order(){
        this.orderNumber++;
    }

    displayOrder(){
        console.log(`Current Order Number:${this.orderNumber} `);
    }
}
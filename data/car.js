class Car {
    #brand;
    #model;
    speed = 0;
    isTrunkOpen;

    constructor(brand, model) {
        this.brand = brand;
        this.model = model;
    }

    displayInfo() {
        console.log(
            `${this.brand} ${this.model}, Speed: ${this.speed} km/h, Trunk: ${this.isTrunkOpen? 'open' : 'close'}`
        );
    }
    go() {
        if(this.speed <= 195 && !this.isTrunkOpen) this.speed += 5;
    }
    break() {
        if(this.speed >= 5) this.speed -= 5;
    }
    openTrunk() { 
       if(!this.speed) this.isTrunkOpen = true; 
    }
    closeTrunk() { this.isTrunkOpen = false; }
};

class RaceCar extends Car {
    acceleration;
    
    constructor(brand, model, acceleration) {
        super(brand, model);
        this.acceleration = acceleration;
    }

    go() {
        const speedIncreaseBy = this.speed + this.acceleration;
        if(speedIncreaseBy <= 300) this.speed = speedIncreaseBy;
    }

    displayInfo() {
        console.log(`${this.brand} ${this.model}, Acceleration: ${this.acceleration}`);
    }

    openTrunk() {this.isTrunkOpen = false}
    closeTrunk() {this.isTrunkOpen = false}
};

const newRaceCar = new RaceCar('McLaren', 'F1', '20');

newRaceCar.displayInfo();

/* const date = new Date();
console.log(date);
console.log(date.toLocaleTimeString()); */

/* 
console.log(this); // we can access "this" anywhere even in outside of class. by default, "this" points to no one. so its set to undefined. but originally "this" pointed to "Window" object but it created confusions, so it was removed.

const obj = {
  a : 78,
  // b : this.a // obj is not created yet, so "this" is undefined
} 
*/

/* this;
const obj2 = {
  method : () => {
    console.log(this);
  }
}
obj2.method(); */


/* function logThis(team) {
  console.log(this.a); // this points to obj and we can access a.
  console.log(team);
}
// logThis();
logThis.call(obj,'kkr'); */

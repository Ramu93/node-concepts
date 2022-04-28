const radii = [3, 2, 2, 5]

// compute diameter, area, and circumference of the circle

// Functions are first-class citizens in JavaScript.

// JS 'map' function is also a Higher Order Function. Other examples: filter, reduce.
// There are 4 different implementations of the logics in this experiment.
// All the three implementations provide the same result.


// ------------------ IMPLEMENTATION WITHOUT HIGHER ORDER FUNCTIONS -------------------

const computeArea = (radii) => {
    const output = [];
    for (let i = 0; i < radii.length; i++) {
        output.push(Math.PI * radii[i] * radii[i])
    }
    return output
}


const computeCircumference = (radii) => {
    const output = [];
    for (let i = 0; i < radii.length; i++) {
        output.push(2 * Math.PI * radii[i])
    }
    return output
}


const computeDiameter = (radii) => {
    const output = [];
    for (let i = 0; i < radii.length; i++) {
        output.push(2 * radii[i])
    }
    return output
}

console.log(computeArea(radii))
console.log(computeCircumference(radii))
console.log(computeDiameter(radii))

console.log('******************************************')

// ------------------ IMPLEMENTATION WITH HIGHER ORDER FUNCTIONS -------------------

const area = (radius) => Math.PI * radius * radius
const circumference = (radius) => 2 * Math.PI * radius
const diameter = (radius) => 2 * radius

// Very similar to the functioning of js 'map' function
// In other words, this is our own implementation of the 'map' function!
const compute = (arr, logic) => {
    const output = [];
    for (let i = 0; i < arr.length; i++) {
        output.push(logic(arr[i]))
    }
    return output
}

console.log(compute(radii, area))
console.log(compute(radii, circumference))
console.log(compute(radii, diameter))

console.log('******************************************')

// ------------------ IMPLEMENTATION WITH JS map FUNCTION -------------------

console.log(radii.map(area))
console.log(radii.map(circumference))
console.log(radii.map(diameter))

console.log('******************************************')

// ------------------ IMPLEMENTATION WITH Prototype Inheritance -------------------

// Same function redefined as 'calculate'.

const calculate = function (logic) {
    const output = [];
    for (let i = 0; i < this.length; i++) {
        output.push(logic(this[i]))
    }
    return output
}

Array.prototype.calculate = calculate

console.log(radii.calculate(area))
console.log(radii.calculate(circumference))
console.log(radii.calculate(diameter))
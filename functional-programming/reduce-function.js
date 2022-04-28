const arr = [5, 3, 2, 2]

const sum = arr.reduce((a, b) => a + b)
console.log(sum)

const max = arr.reduce((a, b) => Math.max(a, b))
console.log(max)

// -------------------------------------------------------------

const users = [
    {firstName: 'Ramu', lastName: 'Ramasamy', age: 28},
    {firstName: 'Rakshana', lastName: 'Ramu', age: 26},
    {firstName: 'Ramu Ramu', lastName: 'Rama', age: 28},
    {firstName: 'Roni', lastName: 'Roni', age: 27},
]

// should output  {28: 2, 26: 1, 27: 1}
const find = users.reduce((acc, curr) => {
    if(acc[curr.age]) {
        acc[curr.age] += 1;
    } else {
        acc[curr.age] = 1;
    }

    return acc
}, {})

console.log(find)
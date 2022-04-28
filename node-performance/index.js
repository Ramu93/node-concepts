const express = require('express')
const app = express()

// the purpose of this function is to do some task for a certain duration
// the task uses as much as CPU possible
// duration in milliseconds
// we are simple blocking the event loop with this function call
// when this function is called, the server will not be able to do anything else
function doWork(duration) {
    const start = Date.now()
    // continue running the loop until the duration
    while (Date.now() - start < duration) {
    //  does nothing
    }
}

app.get('/', (req, res) => {
    doWork(5000)
    res.send('Hello there!')
})

app.get('/fast', (req, res) => {
    res.send('This was fast!')
})

app.listen(3000)

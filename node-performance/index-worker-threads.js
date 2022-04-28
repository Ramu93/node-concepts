const express = require('express')
const app = express()
const Worker = require('worker_threads')


app.get('/', (req, res) => {

    // ------------------------------------- WORKERS -------------------------------------
    // Worker threads are created from our node application but these threads execute totally independently of our application.

    // We are not using the arrow function instead we use 'function' keyword.
    // 'this' value inside an arrow function always equals this value from the outer function.
    // In other words, the     arrow function resolves 'this' lexically.
    // We do not want this to happen to our worker threads.
    // Refer for more on the arrow functions https://dmitripavlutin.com/differences-between-arrow-and-regular-functions/#12-arrow-function
    const worker = new Worker(function () {
        //    This function cannot access the variables declared outside this function.
        //    This function even though a closure, it cannot access variable outside.
        //    That is why we use onmessage and postMessage functions to communicate to and fro with the worker
        //    and our application (which is running in an event loop)

        // This function will be called by our application when it wants to send a message.
        this.onmessage = function () {
            // computational task handled here

            // simulate counter as some amount of work
            let counter = 0
            while (counter < 1e9) {
                //    1e9 is 1 billion --> 10 followed by nine 0s
                counter++;
            }

            // This function will post message to our application.
            // This function will call the 'onmessage' handler defined in our application.
            postMessage(counter)
        }
    })

    // ------------------------------------- OUR APPLICATION -------------------------------------

    // This function will be called when worker sends a message to our application.
    worker.onmessage = (counter) => {
        res.send(`Counter: ${counter}`)
    }

    // push work to the worker thread, posting a message to worker thread.
    // This will call the 'onmessage' handler defined inside the worker.
    worker.postMessage()
})

app.get('/fast', (req, res) => {
    res.send('This was fast!')
})

app.listen(3000)

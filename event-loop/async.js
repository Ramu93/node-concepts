// this example describes that some node functions does not use the libuv thread pool

// refer OS-tasks.png

const https = require('https')
const start = Date.now()

function doRequest() {
    https.request('https://www.google.com/', res => {
        res.on('data', () => {
        })
        res.on('end', () => {
            console.log(Date.now() - start)
        })
    }).end()
}

doRequest()
doRequest()
doRequest()
doRequest()
doRequest()
doRequest()
doRequest()

// all the calls gets completed in almost the same time
// this is a distinct behaviour unlike the thread pool
// by default the thread pool has 4 threads and only 4 tasks can be completed in the same time
// but here, there are 7 tasks that are completed in the same time

// libuv, apart from the thread pool, it has methods that can make use of the underlying OS's functions.
// in this use case, libuv understands that we are making a http request.
// neither libuv nor node has code for super low-level operations like handling network requests
// instead libuv delegates network requests to the underlying OS
// it is the OS that actually executes the http request
// libuv emits the http request and waits for the response from the OS
// as the actual request is handled by the OS, the OS itself decides weather to make use of the threads to handle the requests and not libuv
// therefore, no blocking of JS code in our application

// Discussion

// What functions in the node std library makes use of the OS's async features?
// All networking

// How does the node async stuff fit into the event loop?
// Tasks using the underlying OS are reflected in our pendingOSTasks array
const cluster = require('cluster')
const crypto = require("crypto")

// one thread per worker instance
process.env.UV_THREADPOOL_SIZE = 1

// node cluster has a cluster manager
// the cluster manager is responsible for monitoring the health of the node instances, creating and destroying them
// when the node application with cluster is started, it is the cluster manager that starts first
// the cluster manager then takes responsibility for starting the worker instances.
// worker instances are responsible for processing the incoming requests.
// To crate the worker instances, the 'cluster' manager requires the cluster module from the node std library.
// Cluster module has a function called 'fork'
// Whenever 'fork' function is called, something interesting happens.
// Whenever the 'fork' function is called, node goes back to the index.js file, and it executes it a second time.
// But it executes the second time in a slightly different mode. This second time a worker instance is started.
// Literally means, the node application executes the index.js file multiple times.

// BENCHMARKS REPORT
// every machine has an upper limit (depending on the machine) on how many requests can be handled.
// When the number of worker instances exceeds this upper limit,
// then the node cluster will hinder the overall performance of the application irrespective of the number of worker instances.
// In other words, even though there are multiple worker instances running,
// at some point there is going to be a negative impact on the performance of the machine.
// Clustering is great but don't think that we can have 100 worker instances and have awesome performance    !

// In general, the number of worker instances (children) in the cluster should be matched with the number of physical cores or logical cores in the machine.
// Logical cores --> Based on the number of threads each core has. So, it is number of threads per core * number of cores.
// It is always better to match the number of worker instances to the number of physical cores in the machine.


// whenever the code is running on a manager the isMaster flag will be set to true.
// based on this flag, we will have to handle slightly differently to handle the worker instances.
if (cluster.isMaster) {
    // handler responsible for the cluster manager
    // fork function cause the index.js file to be executed again
    // when the fork function is called only once, there will be only one worker instance
    cluster.fork() // one worker instance is created here

    cluster.fork() // one worker instance is created here
    // cluster.fork() // one worker instance is created here
    // cluster.fork() // one worker instance is created here
} else {
    // handler responsible for the worker instances
    // this is the child node process that will act like servers

    const express = require('express')
    const app = express()

    function doHash(callback) {
        crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
            callback()
        });
    }

    app.get('/', (req, res) => {
        // just doing more work by calling hash again and again
        doHash(() => doHash(() => doHash(() => {
            res.send('Hello there! After pbkdf2 hash computation.')
        })))
    })

    app.get('/fast', (req, res) => {
        res.send('This was fast!')
    })

    app.listen(3000)
}


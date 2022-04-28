// crazy node behaviour
// Great interview question: What order the console logs might appear?

// process.env.UV_THREADPOOL_SIZE = 5;


const https = require('https')
const crypto = require("crypto")
const fs = require('fs')

const start = Date.now()

function doRequest() {
    https.request('https://www.google.com/', res => {
        res.on('data', () => {
        })
        res.on('end', () => {
            console.log('HTTP:',Date.now() - start)
        })
    }).end()
}

function doHash() {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        console.log('Hash:', Date.now() - start);
    });
}

doRequest()

fs.readFile('multitask.js', 'utf8', () => {
    console.log('FS:', Date.now() - start)
})

// commenting these 4 calls to the hash function will drastically reduce the time taken for reading a file from the local machine
doHash()
doHash()
doHash()
doHash()


// ANSWER

// all fs module functions and the crypto module makes use of the thread pool
// HTTPS module does not use the thread pool and makes use of the OS to make it work

// PROCESS OF READING FILE --> (process-file-read.png)
// When a readFile function is called, node does not read the file directly.
// At first, node fetches some statistics of the file, like how large the file is.
// This is a trip to HDD and  back to the program with the file information.
// Now, node knew how large the file is, and it is now ready to read the file.
// Node then goes to the HDD, gets the file contents and gets back to our application.
// And eventually calls our callback function where our console log function is executed.
// We had two pauses here
// in the first pause we were reading on the statistics of the file from the HDD,
// in the second big pause were we went to the HDD to actually read the contents

// By default, libuv has 4 threads in the thread pool
// When this file is executed, the file read operation is offloaded to one thread (thread 1).
// There are 4 calls to the hash function, out of which 3 are offloaded to the remaining 3 threads (threads 2, 3, 4).
// The 3 threads are now working on computing the hash and the one thread is working on reading the file (thread 1).
// During the first pause of file read (getting statistics phase),
// the thread handling the file reading operations becomes free as it has to wait.
// As this thread is waiting, the last hash call is executed in this thread.
// Thread 1, now temporarily forgets the file read operation and works on calculating the hash.
// In the meantime, lets say thread 2 completes the hash function and has no more tasks to execute.
// Now, thread 2 takes the file read task which was discontinued by thread 1 during the first pause.
// File statistics are returned to thread 2 and this thread starts reading on the file contents by making HDD call.
// This is the second pause and there are no other tasks to do. So thread 2 simply waits for the HDD call to return.

// setting the thread pool size to 5 will make file read faster
// making only 3 hash calls will also make file read faster
// This is because, there is one thread that is 100% responsible for the file read operation.

// Try setting the thread pool size to 1, 2, 3 to see interesting results.
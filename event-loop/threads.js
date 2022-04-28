// Multithreading or Hyper threading in Node

// refer thread-pool.png

// this line sets the thread pool size of libuv module to 2
// try commenting or uncommenting this line to see interesting results
// first, execute the entire file by commenting out this line
// default size fo the libuv thread pool is 4
// thread pool size can be set to any number, see interesting results when setting it to 5 for this example file.
// process.env.UV_THREADPOOL_SIZE = 2;

const crypto = require('crypto');

const start = Date.now();

// call 1
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('1:', Date.now() - start);
});

// call 2
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('2:', Date.now() - start);
});

// the above two calls to pbkdf2 functions are called almost at the same time
// one call to the pbkdf2 function takes approximately 0.5 seconds (500 milliseconds) to complete
// if node is single threaded, then each of the calls to pbkdf2 functions should be executed in a sequential order
// thereby the total time taken for both the calls should be around 1 second (1000 milliseconds)
// in reality, both the calls to pbkdf2 function executed in parallel, therefore node is not single threaded

// the node function pbkdf2 just validates the inputs and redirects the call to the actual hashing function pbkdf2 which is available in the C++ module of nodejs
// the C++ module is called Libuv
// it has its own thread pool. This thread pool has a series of 4 (default) threads that are used for computationally intensive tasks such as the pbkdf2 function.

// call 3
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('3:', Date.now() - start);
});

// call 4
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('4:', Date.now() - start);
});

// as the Libuv thread pool has 4 threads, all the above 4 calls to the pbkdf2 function are called in parallel

// call 5
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('5:', Date.now() - start);
});

// the first 4 calls to the pbkdf2 function each got offloaded to each of the threads in the libuv's thread pool
// the thread schedule of the OS assigns the threads to the cores of the processor.
// the 5th call to the pbkdf2 function got offloaded to one of the thread in the thread pool completes its execution


//Discussions

// Can we use the thread pool for our own JS functions or just the node functions like pbkdf2?
// Yes, we can use the thread pool for our own JS functions

// What functions in the node std library actually make use of the thread pool?
// All 'fs' module functions, some crypto functions

// How does the thread pool stuff actually fit into the event loop?
// In event-loop.js file, we have pendingOperations which refers to the long-running functions like accessing the fs module functions.
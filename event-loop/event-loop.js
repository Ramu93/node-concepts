// Node event loop is single threaded
// However, some functions that are included in the standard library of node that we run, runs outside the event loop and are not single threaded.
// simply declaring that nodejs is single threaded is not absolutely true

// refer event-loop.png

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

function shouldContinue() {
//    check one: Any pending setTimeout, setInterval, setImmediate
//    check two: Any pending OS tasks (like server listening to port)
//    check three: Any pending long-running or computational operations (like fs access, crypto) --> carried out in threads
    return pendingTimers.length || pendingOSTasks.length || pendingOperations.length
}

// refer threads.js as an example for pendingOperations
// refer async.js as an example for pendingOSTasks - here, it is network communication

// entire while loop body executes in one 'tick'
// one execution of the event loop is one 'tick'
while (shouldContinue()) {
//    1) Node looks at the pending timers. Checks if any callbacks of the timer functions are ready to be called. Only for setTimeout and setInterval

//    2) Node checks for pendingOSTasks and pending operations and calls relevant callback functions
//    Here is where 99% of our application code is executed

//    3) Node pauses execution and continues when
//        - a new pendingOSTask is done
//        - a new pendingOperation is done
//        - a new timer is about to complete

//    4) Look at any pending timers and call setImmediate

//    5) Handle any 'close' events
}

// exit back to terminal

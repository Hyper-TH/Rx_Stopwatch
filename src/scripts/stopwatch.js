document.addEventListener('DOMContentLoaded', () => {
    // Import functions and operators from the CDN
    const { fromEvent, interval, takeUntil, 
            switchMapTo, scan, startWith, 
            mapTo, merge, map } = rxjs;

    // Get button elements
    const startButton = document.querySelector('#start');
    const stopButton = document.querySelector('#stop');
    const resetButton = document.querySelector('#reset');

    // Get time elements
    const minutes = document.querySelector('#minutes');
    const seconds = document.querySelector('#seconds');
    const milliseconds = document.querySelector('#milliseconds');

    // Create observables (Observables.fromEvent(DOM, event);)
    // start stream (pass in the element, then listen to clicks, $ for conventional naming)
    const start$ = fromEvent(startButton, 'click');
    const stop$ = fromEvent(stopButton, 'click');
    const reset$ = fromEvent(resetButton, 'click');

    // interval observer that emits sequential numbers for every 10 milliseconds
    const interval$ = interval(10);

    // Merge stop and reset observables into a single observable
    // interval now stops when stop or reset streams are activated (completed)
    const stopOrReset$ = merge(
        stop$,
        reset$
    )

    // Create pauseible interval observable
    // takeUntil(observable) used to complete the observable 
    // when the merged observable emits a value
    const pausible$ = interval$.pipe(takeUntil(stopOrReset$));  // pausible$ changes interval$ when stopOrReset$ activates

    const init = 0;                 // Set inital time to 0
    const inc = acc => acc + 1;     // Function returns +1 to current time
    const reset = acc => init;      // Function returns reset to init time

    // Merge two observables, one that increments and one that resets
    // mapTo() emits given constant value on the output Observable
    // everytime the source Observable emits a value
    const incOrReset$ = merge(
        pausible$. pipe(mapTo(inc)),        // stop || reset
        reset$.pipe(mapTo(reset))           // reset
    )

    // Utility function for time
    const toTime = (time) => ({
        milliseconds: Math.floor(time % 100),
        seconds: Math.floor((time/100) % 60),
        minutes: Math.floor(time / 6000)
    });

    // Render format time outputs
    const pad = (number) => number <= 0 ? ('0' + number) : number.toString();

    const render = (time) => {
        minutes.innerHTML = pad(time.minutes);
        seconds.innerHTML = pad(time.seconds);
        milliseconds.innerHTML = pad(time.milliseconds);
    }

    // An event on one stream, it can switch to another
    app$ = start$                                   // Main observable
        .pipe(
            switchMapTo(incOrReset$),               // Switch to incOrReset observable 
            startWith(init),                        // Start with init time
            scan((acc, currFunc) => currFunc(acc)), // Keeps track of current value
                                                    // scan() takes acc and manipulate acc/keeps track of it
            map(toTime)
        ) 
        .subscribe(val => render(val));             // subscribe to update the UI

});


// range(1, 200)
//   .pipe(
//     filter((x) => x % 2 === 1),
//     map((x) => x + x)
//   )
//   .subscribe((x) => console.log(x));

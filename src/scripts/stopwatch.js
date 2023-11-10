// interval observer
// click streams from 3 buttons

document.addEventListener('DOMContentLoaded', () => {
    const { fromEvent, interval, takeUntil, 
            switchMapTo, scan, startWith, 
            mapTo, merge, map } = rxjs;

    const startButton = document.querySelector('#start');
    const stopButton = document.querySelector('#stop');
    const resetButton = document.querySelector('#reset');

    const minutes = document.querySelector('#minutes');
    const seconds = document.querySelector('#seconds');
    const milliseconds = document.querySelector('#milliseconds');

    // start stream (pass in the element, then listen to clicks, $ for conventional naming)
    const start$ = fromEvent(startButton, 'click');
    const stop$ = fromEvent(stopButton, 'click');
    const reset$ = fromEvent(resetButton, 'click');

    // interval observer
    const interval$ = interval(10);

    const stopOrReset$ = merge(
        stop$,
        reset$
    )

    const pausible$ = interval$.pipe(takeUntil(stopOrReset$));

    const init = 0;
    const inc = acc => acc + 1;
    const reset = acc => init;

    const incOrReset$ = merge(
        pausible$. pipe(mapTo(inc)),
        reset$.pipe(mapTo(reset))
    )

    const toTime = (time) => ({
        milliseconds: Math.floor(time % 100),
        seconds: Math.floor((time/100) % 60),
        minutes: Math.floor(time / 6000)
    });

    const pad = (number) => number <= 0 ? ('0' + number) : number.toString();

    const render = (time) => {
        minutes.innerHTML = pad(time.minutes);
        seconds.innerHTML = pad(time.seconds);
        milliseconds.innerHTML = pad(time.milliseconds);
    }

    // An event on one stream, it can switch to another
    // scan takes accumulator and keeps track of it
    app$ = start$
        .pipe(
            switchMapTo(incOrReset$), 
            startWith(init), 
            scan((acc, currFunc) => currFunc(acc)),
            map(toTime)
        )
        .subscribe(val => render(val));

});


// range(1, 200)
//   .pipe(
//     filter((x) => x % 2 === 1),
//     map((x) => x + x)
//   )
//   .subscribe((x) => console.log(x));

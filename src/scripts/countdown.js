document.addEventListener('DOMContentLoaded', () => {
    const { fromEvent, interval, takeUntil,
            switchMapTo, scan, startWith,
            mapTo, merge, map} = rxjs;

    const startButton = document.querySelector('#start_c');
    const stopButton = document.querySelector('#stop_C');
    const render = document.querySelector('#timer');

    // Get the inputs 
    const inputHours = document.querySelector('#hour_start');
    const inputMin = document.querySelector('#minute_start');
    const inputSec = document.querySelector('#second_start');

    const start$ = fromEvent(startButton, 'click');
    const stop$ = fromEvent(stopButton, 'click');

    const getInitialTime = () => {
        const hours = parseInt(inputHours.value) || 0;
        const minutes = parseInt(inputMin.value) || 0;
        const seconds = parseInt(inputSec.value) || 0;
        return (hours * 3600) + (minutes * 60) + seconds;
    };

    // Main observer
    const countDown$ = start$.pipe(
        switchMapTo(() => interval(1000)),          // Emits values every second using the interval
        takeUntil(stop$),                           // Stops countdown when the stop stream is activated
        startWith(getInitialTime()),                // Start with initial time
        scan((acc) => acc - 1),                     // Decrements the current value
        mapTo((count) => count >= 0 ? count : 0)    // Ternary operator to ensure count value does not go below zero
    );

    // Subscribe to countDown stream
    countDown$.subscribe((count) => {
        const hours = Math.floor(count / 3600);
        const minutes = Math.floor((count % 3600) / 60);
        const seconds = count % 60;

        render.textContent = `Time remaining: ${hours}h : ${minutes}, : ${seconds}s`;

        if (count === 0) {
            render.textContent = 'Countdown Finished';
        }
    })
});

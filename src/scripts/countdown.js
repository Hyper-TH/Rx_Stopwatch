document.addEventListener('DOMContentLoaded', () => {
    const { fromEvent, interval, takeUntil,
            switchMapTo, scan, startWith,
            mapTo, merge, map} = rxjs;

    const startButton = document.querySelector('#start_c');
    const stopButton = document.querySelector('#stop_C');

    // Get the inputs 
    const inputHours = document.querySelector('#hour_start');
    const inputMin = document.querySelector('#minute_start');
    const inputSec = document.querySelector('#second_start');

    const start$ = fromEvent(startButton, 'click');
    const stop$ = fromEvent(stopButton, 'click');

});
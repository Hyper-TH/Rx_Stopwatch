import * as Rx from 'rxjs'; 

// internal observer
// click streams from 3 buttons

const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const resetButton = document.querySelector('#reset');

// start stream
const start$ = Rx.Observable.fromEvent(startButton, 'click');
const stop$ = Rx.Observable.fromEvent(stopButton, 'click');
const reset$ = Rx.Observable.fromEvent(resetButton, 'click');
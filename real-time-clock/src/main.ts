import {
  BehaviorSubject,
  Subject,
  debounceTime,
  fromEvent,
  map,
  scan,
  startWith,
  switchMap,
  takeUntil,
  tap,
  timer,
  timestamp,
} from "rxjs";

const span = document.getElementById("clock") as HTMLSpanElement;

timer(0, 1000)
  .pipe(
    timestamp(),
    map((value) => new Date(value.timestamp).toTimeString())
  )
  .subscribe((value) => {
    span.innerText = value;
  });

const timerEl = document.getElementById("timer") as HTMLSpanElement;
const timerInitValueMS = 3600000;

timer(0, 1000)
  .pipe(
    // tap((value) => console.log("value", value)),
    map((value) => timerInitValueMS - value * 1000),
    map((value) => new Date(value).toISOString().substr(11, 8))
  )
  .subscribe((value) => {
    timerEl.innerText = value;
  });

const stopwatch = document.getElementById("stopwatch") as HTMLSpanElement;
const stopwatchButton = document.getElementById("stopwatchBtn") as HTMLButtonElement;
const stopwatchBtnStop = document.getElementById("stopwatchBtnStop") as HTMLButtonElement;
const stopwatchBtnReset = document.getElementById("stopwatchBtnReset") as HTMLButtonElement;

const stopwatchStop$ = new Subject();
const stopwatchStart$ = new Subject();

let lastValue$ = new BehaviorSubject(0);

stopwatchStart$
  .pipe(
    switchMap(() =>
      timer(0, 1000).pipe(
        scan((acc) => acc + 1, lastValue$.getValue()),
        tap((value) => lastValue$.next(value)),
        map((value) => new Date(value * 1000).toISOString().substr(11, 8)),
        takeUntil(stopwatchStop$)
      )
    )
  )
  .subscribe((value) => {
    stopwatch.innerText = value;
  });

fromEvent(stopwatchButton, "click").subscribe(() => {
  stopwatchStart$.next(null);
});

fromEvent(stopwatchBtnStop, "click").subscribe(() => {
  stopwatchStop$.next(null);
});

fromEvent(stopwatchBtnReset, "click")
  .pipe(
    tap(() => {
      stopwatchStop$.next(null);
    })
  )
  .subscribe(() => {
    lastValue$.next(0);
    stopwatch.innerText = "00:00:00";
  });

import { Subject, catchError, exhaustMap, fromEvent, interval, takeUntil } from "rxjs";
import { ajax } from "rxjs/ajax";

const button = document.getElementById("button") as HTMLButtonElement;

// Create new Subjects
const startButtonClick$ = new Subject();
const stopButtonClick$ = new Subject();

const interval$ = interval(5000);

const request$ = ajax("https://restcountries.com/v3.1/name/poland");

startButtonClick$.subscribe(() => {
  interval$
    .pipe(
      exhaustMap(() => request$),
      takeUntil(stopButtonClick$)
    )
    .subscribe({
      next: (value) => {
        console.log("res", value.response);
      },
      error: (err) => [console.log("err", err)],
    });
});

// turn on and off interval
fromEvent(button, "click").subscribe(() => {
  if (button.innerText === "stop") {
    stopButtonClick$.next(null);
    button.innerText = "start";
  } else {
    button.innerText = "stop";
    startButtonClick$.next(null);
  }
});

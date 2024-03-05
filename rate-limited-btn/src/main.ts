import { fromEvent, scan, throttleTime } from "rxjs";

const button = document.getElementById("rate-limited-btn") as HTMLButtonElement;

fromEvent(button, "click")
  .pipe(
    throttleTime(3000),
    scan((count) => count + 1, 0)
  )
  .subscribe((count) => {
    console.log("Clicked!", count);
  });

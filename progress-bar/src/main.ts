import { scan, takeWhile, finalize, timer } from "rxjs";

const progressBar = document.getElementById("file") as HTMLProgressElement;

timer(500, 1000)
  .pipe(
    scan((count) => count + Math.floor(Math.random() * 40) + 1, 0),
    takeWhile((count) => count < 100),
    finalize(() => (progressBar.value = 100))
  )
  .subscribe((value) => {
    console.log("value", value);
    progressBar.value = value;
  });

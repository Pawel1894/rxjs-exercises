import { catchError, debounceTime, distinctUntilChanged, fromEvent, map, of, switchMap } from "rxjs";
import { ajax } from "rxjs/ajax";

const searchBox = document.getElementById("search-box") as HTMLInputElement;

fromEvent(searchBox, "input")
  .pipe(
    debounceTime(500),
    map((e: Event) => (e.target as HTMLInputElement).value),
    distinctUntilChanged(),
    switchMap((value) =>
      ajax.getJSON(`https://restcountries.com/v3.1/name/${value}`).pipe(
        catchError((error) => {
          console.log("Error:", error);
          return of([]); // Return an empty array on error
        })
      )
    )
  )
  .subscribe({
    next: (response) => console.log("Success:", response),
    error: (error) => console.log("Error:", error),
  });

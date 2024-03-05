import { fromEvent, merge, of } from "rxjs";
import { concatMap, delay, filter, map, startWith } from "rxjs/operators";

let counter = 0;

function mockApiRequest() {
  const items = Array.from({ length: 20 }, () => `Item ${++counter}`);
  return of(items).pipe(delay(500));
}

const list = document.getElementById("list") as HTMLDivElement;

merge(
  fromEvent(list, "scroll").pipe(filter(() => list.scrollTop + list.clientHeight >= list.scrollHeight)),
  of(null)
)
  .pipe(
    concatMap(() => mockApiRequest()),
    map((items) => {
      return items.map((item) => {
        const div = document.createElement("div");
        div.innerText = item;
        return div;
      });
    })
  )
  .subscribe((val) => {
    list.append(...val);
  });

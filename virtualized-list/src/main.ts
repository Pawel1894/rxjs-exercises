import { fromEvent, merge, of } from "rxjs";
import { map, filter, distinctUntilChanged, debounceTime, switchMap } from "rxjs/operators";

const listContainer = document.getElementById("list") as HTMLDivElement;
const itemHeight = 45; // Height of each item in pixels
const bufferSize = 10; // Number of items to keep above and below the visible area
let items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`); // Mock data

const topPlaceholder = document.createElement("div");
const bottomPlaceholder = document.createElement("div");
listContainer.appendChild(topPlaceholder);
listContainer.appendChild(bottomPlaceholder);

function loadItems(start: number, end: number) {
  return items.slice(start, end).map((item, index) => ({ id: start + index, text: item }));
}

merge(fromEvent(listContainer, "scroll"), of(null))
  .pipe(
    debounceTime(100),
    map(() => Math.floor(listContainer.scrollTop / itemHeight)),
    filter((startIndex) => startIndex >= 0),
    switchMap((startIndex) => {
      const visibleItemsCount = Math.ceil(listContainer.clientHeight / itemHeight);

      const startIndexBuffered = Math.max(startIndex - bufferSize, 0);
      const endIndexBuffered = Math.min(startIndex + visibleItemsCount + bufferSize, items.length);

      return of({
        startIndex: startIndexBuffered,
        endIndex: endIndexBuffered,
        items: loadItems(startIndexBuffered, endIndexBuffered),
      });
    }),
    distinctUntilChanged((a, b) => a.startIndex === b.startIndex && a.endIndex === b.endIndex)
  )
  .subscribe(({ startIndex, endIndex, items: newItems }) => {
    // Remove all existing items
    while (listContainer.firstChild) {
      listContainer.firstChild.remove();
    }

    // Adjust padding
    topPlaceholder.style.paddingTop = `${startIndex * itemHeight}px`;
    bottomPlaceholder.style.paddingBottom = `${(items.length - endIndex) * itemHeight}px`;

    // Add new items
    listContainer.appendChild(topPlaceholder);
    newItems.forEach(({ text }) => {
      const item = document.createElement("span");
      item.classList.add("item");
      item.textContent = text;
      listContainer.appendChild(item);
    });
    listContainer.appendChild(bottomPlaceholder);
  });

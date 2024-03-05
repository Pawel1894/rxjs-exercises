import { fromEvent, merge, of } from "rxjs";
import { map, filter, distinctUntilChanged, concatMap } from "rxjs/operators";

const listContainer = document.getElementById("list") as HTMLDivElement;
const itemHeight = 45; // Height of each item in pixels
const bufferSize = 6; // Number of items to keep above and below the visible area
let items = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`); // Mock data

const topPlaceholder = document.createElement("div");
const bottomPlaceholder = document.createElement("div");
listContainer.appendChild(topPlaceholder);
listContainer.appendChild(bottomPlaceholder);

function loadItems(start: number, end: number) {
  return items.slice(start, end).map((item, index) => ({ id: start + index, text: item }));
}

merge(fromEvent(listContainer, "scroll"), of(null))
  .pipe(
    map(() => Math.floor(listContainer.scrollTop / itemHeight)),
    distinctUntilChanged(),
    filter((startIndex) => startIndex >= 0),
    concatMap((startIndex) => {
      const visibleItemsCount = Math.ceil(listContainer.clientHeight / itemHeight);
      const endIndex = startIndex + visibleItemsCount + bufferSize;
      return of({ startIndex, endIndex, items: loadItems(startIndex, endIndex) });
    })
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

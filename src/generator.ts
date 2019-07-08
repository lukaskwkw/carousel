import { coverI, Book } from "./model";
import { ListItem } from "./components/carousel";

export interface SearchResponse {
  start: number;
  numFound: number;
  docs: Partial<Book>[];
}

const createSearchUrl = (query: string) =>
  `http://openlibrary.org/search.json?q=${query}`;

enum ImageSize {
  SMALL = "S",
  MEDIUM = "M",
  LARGE = "L"
}

interface CrreateImageUrl {
  (id: coverI, size: ImageSize): string;
}

const createImageUrl: CrreateImageUrl = (id: coverI, size: ImageSize) =>
  `https://covers.openlibrary.org/b/id/${id}-${size}.jpg`;

// interface CacheItem extends Partial<Book> {
//   delayedImage: Promise<any>;
// }

const preloadImage = (url: string) => {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.src = url;
  });
};

export async function* getContent(url: string) {
  let nextUrl = "";
  let cache: ListItem[] = [];
  let page = 0;
  let currentIndex = 0;

  let offsetTimes = 0;
  const offsetItems = 8;
  // const amountToDisplay = offsetItems * 2;
  let docsInBatch: Partial<Book>[] = [];

  while (true) {
    nextUrl = nextUrl || url;

    if (
      docsInBatch.length === 0 ||
      currentIndex >= docsInBatch.length - offsetItems
    ) {
      const searchUrl = createSearchUrl(nextUrl);
      const response: SearchResponse = await fetch(searchUrl).then(response =>
        response.json()
      );

      console.info({
        start: response.start,
        amount: response.numFound,
        batchLength: response.docs.length
      });

      docsInBatch = response.docs;

      //only books with cover image
      docsInBatch = docsInBatch
        .filter(book => book.cover_i)
        .map(({ title, author_name, cover_i, language }) => ({
          title,
          author_name,
          cover_i,
          language
        }));

      console.info({ afterFilter: docsInBatch.length });

      if (docsInBatch.length === 0) {
        return;
      }

      nextUrl = `${url}&page=${page++}`;
    }

    const offset = Math.floor(currentIndex + 1 / offsetItems);
    offsetTimes = offset > offsetTimes ? offset : offsetTimes;

    const sliceStart = offsetTimes > 0 ? offsetTimes : 0;

    console.info({ sliceStart, offsetTimes });

    // if (offset > offsetTimes) {
    for (let i = sliceStart; i < sliceStart + 15; i++) {
      // for (let i = sliceStart; i < sliceStart + offsetItems; i++) {
      const src = createImageUrl(docsInBatch[i].cover_i, ImageSize.LARGE);
      const delayedImage = preloadImage(src);
      cache.push({ ...docsInBatch[i], delayedImage });
    }
    // }

    console.info({ cache });

    currentIndex = yield cache.slice(sliceStart, sliceStart + offsetItems);
  }
}

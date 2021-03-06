import { coverI, Book } from "../model";
import { ListItem } from "../components/carousel";

export interface SearchResponse {
  start: number;
  numFound: number;
  docs: Partial<Book>[];
}

export const createSearchUrl = (query: string) =>
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

//TO-DO maybe clean cache after some MB?
const ImageCache: Set<any> = new Set();

const preloadImage = (url: string) => {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.src = url;
    ImageCache.add(img);
  });
};

const createDelayedImage = (url: coverI, size: ImageSize) => {
  const src = createImageUrl(url, size);
  return preloadImage(src);
};

export async function* getContent(url: string) {
  let nextUrl = "";
  let cache: ListItem[] = [];
  let delayedImageCache: Promise<any>[] = [];
  let page = 1;
  let currentIndex = 0;
  let lastPage = false;

  const offsetItems = 6;
  let docsInBatch: Partial<Book>[] = [];

  while (true) {
    if (
      !lastPage &&
      (docsInBatch.length === 0 ||
        currentIndex >= docsInBatch.length - offsetItems)
    ) {
      nextUrl = nextUrl || url;

      const response: SearchResponse = await fetch(nextUrl)
        .then(response => response.json())
        .catch(error => error);

      lastPage = response.numFound - response.start < 100;

      //only books with cover image
      const docs = response.docs
        .filter(({ cover_i }) => cover_i && cover_i > 0)
        .map(
          ({
            last_modified_i,
            title,
            author_name,
            cover_i,
            language
          }: ListItem) => ({
            last_modified_i,
            title,
            author_name,
            cover_i,
            language
          })
        );

      docsInBatch = [...docsInBatch, ...docs];

      if (docsInBatch.length === 0) {
        return;
      }

      nextUrl = `${url}&page=${++page}`;
    }

    const promisesSum = currentIndex + offsetItems * 2;
    const promisesEnd =
      promisesSum >= docsInBatch.length ? docsInBatch.length : promisesSum;

    for (let i = delayedImageCache.length; i < promisesEnd; i++) {
      const delayedImage = createDelayedImage(
        docsInBatch[i].cover_i,
        ImageSize.LARGE
      );
      delayedImageCache.push(delayedImage);
    }

    const sum = currentIndex + offsetItems;
    const end = sum >= docsInBatch.length ? docsInBatch.length : sum;

    for (let i = cache.length; i < end; i++) {
      cache.push({
        ...docsInBatch[i],
        index: i,
        delayedImage: delayedImageCache[i]
      });
    }

    const ratio = Math.floor(currentIndex / offsetItems);
    let sliceStart = 0;
    if (ratio > 0) {
      sliceStart = currentIndex - offsetItems;
    }

    currentIndex = yield cache.slice(sliceStart, end);
  }
}

// import fetchMock from "fetch-mock";
const fetchMock = require("fetch-mock");
import { expect } from "chai";

import { getContent } from "../generator";
import response from "./response_page1";
import response_page2 from "./response_page2";
import { Book } from "../../model";
import { ListItem } from "../../components/carousel";

//Image mock
global["Image"] = function() {
  this.onload = function() {};

  return {
    onload: this.onload,
    set src(value) {
      setTimeout(this.onload, 20 + Math.random() * 100);
    }
  };
};

const initialUrl = "http://__fakeurl__/search.json?q=test";

fetchMock.get(initialUrl, response);
fetchMock.get(`${initialUrl}&page=2`, response_page2);

let content: AsyncIterableIterator<ListItem[]>;

const mapBook = ({
  index,
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
});

const getSliceOfBooks = (start: number, end: number, docs: Partial<Book>[]) =>
  docs.slice(start, end).map(mapBook);

const docsWithCoverImagePage1 = response.docs.filter(book => book.cover_i);
const docsWithCoverImagePage2 = response_page2.docs.filter(
  book => book.cover_i
);

const batchLength = 6;

describe("Testing generator basics", () => {
  beforeEach(() => {
    content = getContent(initialUrl);
  });

  it(`For the first iteration should return ${batchLength} items`, async () => {
    const batch: ListItem[] = (await content.next(0)).value;
    const batchMapped = batch.map(mapBook);
    const expectedSliced = getSliceOfBooks(
      0,
      batchLength,
      docsWithCoverImagePage1
    );
    expect(batchMapped).to.deep.equal(expectedSliced);
  });

  it(`For the first ${batchLength} iteration should return items from 0 to max doubled batchLength`, async () => {
    for (let i = 0; i < batchLength; i++) {
      const batch: ListItem[] = (await content.next(i)).value;
      const batchMapped = batch.map(mapBook);
      const expectedSliced = getSliceOfBooks(
        0,
        batchLength + i,
        docsWithCoverImagePage1
      );
      expect(batchMapped).to.deep.equal(expectedSliced);
    }
  });

  it(`After first ${batchLength} iteration should return correspondly sliced (currI-batchLength, currI+batchLength)`, async () => {
    for (let i = 0; i < batchLength; i++) {
      await content.next(i);
    }

    for (let i = batchLength; i < batchLength * 2; i++) {
      const batch: ListItem[] = (await content.next(i)).value;
      const batchMapped = batch.map(mapBook);

      const expectedSliced = getSliceOfBooks(
        i - batchLength,
        i + batchLength,
        docsWithCoverImagePage1
      );
      expect(batchMapped).to.deep.equal(expectedSliced);
    }
  });
});

describe("Testing generator with multiple documents", () => {
  beforeEach(() => {
    content = getContent(initialUrl);
  });

  it(`${batchLength} items before end of first page should get the next and return
    corresponded last items from first page and first from second`, async () => {
    const justBeforeEnd = docsWithCoverImagePage1.length - batchLength;
    for (let i = 0; i < justBeforeEnd; i++) {
      await content.next(i);
    }

    const mergedDocs = [...docsWithCoverImagePage1, ...docsWithCoverImagePage2];

    const additionalItems = 7;

    for (let i = justBeforeEnd; i < justBeforeEnd + additionalItems; i++) {
      const batch: ListItem[] = (await content.next(i)).value;
      const batchMapped = batch.map(mapBook);

      const books = getSliceOfBooks(
        i - batchLength,
        i + batchLength,
        mergedDocs
      );

      expect(batchMapped).to.deep.equal(books);
    }
  });

  it(`${batchLength} items before total end (last page) should return  ${batchLength}
    items on the left + last items on right`, async () => {
    const mergedDocs = [...docsWithCoverImagePage1, ...docsWithCoverImagePage2];

    const justBeforeEnd = mergedDocs.length - batchLength - 1;
    for (let i = 0; i < justBeforeEnd; i++) {
      await content.next(i);
    }

    const itemsAfterEnd = 5;

    for (let i = justBeforeEnd; i < mergedDocs.length + itemsAfterEnd; i++) {
      const batch: ListItem[] = (await content.next(i)).value;
      const batchMapped = batch.map(mapBook);
      const lastBooks = getSliceOfBooks(
        i - batchLength,
        i + batchLength,
        mergedDocs
      );

      expect(batchMapped).to.deep.equal(lastBooks);
    }
  });
});

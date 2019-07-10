//jscmd === 'details'

export type coverI = number | string;
type bibkeys = string;

// const imageUrl = "https://covers.openlibrary.org/b/id/8314541-M.jpg";
// const searchLink = "http://openlibrary.org/search.json?q=the+lord+of+the+rings";

// interface getDetailsUrl {
//   (id: bibkeys): string;
// }

// interface fetchBookDetails {
//   (url: string): Book;
// }

interface FetchBooks {
  (query: string): Book[];
}

// interface fetchBooksDetails {
//   (url: string): Book
// }

export interface Book {
  title: string;
  author_name: string[];
  cover_i: coverI;
  language?: string[];
  last_modified_i?: number;
  // publisher?: string[];
}

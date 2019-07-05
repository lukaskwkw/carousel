//jscmd === 'details'

type bibkeys = string;
type coverI = string;

enum ImageSize {
  SMALL = "S",
  MEDIUM = "M",
  LARGE = "L"
}

interface GetImageUrl {
  (id: coverI, size: ImageSize): string;
}

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

interface Book {
  title: string;
  author_name: string;

  // ID - in json is a number
  cover_i: coverI;
  // info_url: string;
  // thumbnail_url: string;
  // description: string;

  language?: string[];
  publisher?: string[];
}

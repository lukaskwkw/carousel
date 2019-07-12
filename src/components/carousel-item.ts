import { Book, coverI } from "../model";

const templateTodoItem = document.createElement("template");

templateTodoItem.innerHTML = /* template */ `
    <li class="item">
        <label></label>
        <img />
    </li>
`;

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

export default class CarouselItem extends HTMLElement {
  _selected: boolean;
  _index: number;
  _book: Book;
  title: string;
  src: string;
  $item: HTMLElement;
  $title: HTMLElement;
  $img: HTMLElement;

  constructor() {
    super();
  }

  connectedCallback() {
    this.appendChild(templateTodoItem.content.cloneNode(true));
    this.$item = this.querySelector(".item");
    this.$title = this.querySelector("label");
    this.$img = this.querySelector("img");

    this.addEventListener("click", e => {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent("onCoverSelect", { detail: this.index })
      );
    });

    this._render();
  }

  static get observedAttributes() {
    return ["book"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }

  set index(value) {
    this._index = value;
  }

  get index() {
    return this._index;
  }

  set book(bookString: string) {
    const book: Book = JSON.parse(bookString);
    if (book.title) {
      this.title = book.title;
    }
    if (book.cover_i) {
      this.src = createImageUrl(book.cover_i, ImageSize.LARGE);
    }
    this._book = book;
  }

  set selected(value) {
    this._selected = Boolean(value);
  }

  get selected() {
    return this.hasAttribute("selected");
  }

  _render() {
    // this.$title.textContent = this.title;

    if (this.src) {
      this.$img.setAttribute("src", this.src);
    }

    if (this._selected) {
      this.classList.add("selected");
    } else {
      this.classList.remove("selected");
    }
  }
}

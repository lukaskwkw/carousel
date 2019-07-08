import { css } from "../utils/helpers";
import { Book, coverI } from "../model";

const templateTodoItem = document.createElement("template");

const style = css`
  :host {
    position: absolute;
    display: block;
    transition: all ease-in-out 1s;
    cursor: pointer;
    width: var(--carousel-size);
    height: var(--carousel-size);
    transform-origin: 50% 50% var(--cricle-radius);
    /* padding: 0 60px; */
    /* top: 0;
    left: 0; */
  }

  li.item {
    top: 0px;
    font-size: 24px;
    transition: all ease-in-out 0.5s;
    display: block;
    position: absolute;
    background: white;
    width: inherit;
    height: inherit;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  li.item.selected {
    /* background: #f6f6f6; */
  }

  li.item:not(.selected):hover {
    top: -10px;
    background: #f6f6f6;
  }

  li.item label {
    white-space: pre;
    word-break: break-word;
    padding: 15px 5px 15px 15px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
  }
`;

templateTodoItem.innerHTML = /* template */ `
    <style>
      ${style}
    </style>
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
  _root: ShadowRoot;
  _index: number;
  _book: Book;
  title: string;
  src: string;
  $item: HTMLElement;
  $title: HTMLElement;
  $img: HTMLElement;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this._root.appendChild(templateTodoItem.content.cloneNode(true));
    this.$item = this._root.querySelector(".item");
    this.$title = this._root.querySelector("label");
    this.$img = this._root.querySelector("img");

    this.$item.addEventListener("click", e => {
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

  get index() {
    return this._index;
  }

  set selected(value) {
    this._selected = Boolean(value);
  }

  get selected() {
    return this.hasAttribute("selected");
  }

  _render() {
    if (!this.$item) return;

    this.$title.textContent = this.title;

    if (this.src) {
      this.$img.setAttribute("src", this.src);
    }

    if (this._selected) {
      this.$item.classList.add("selected");
    } else {
      this.$item.classList.remove("selected");
    }
  }
}

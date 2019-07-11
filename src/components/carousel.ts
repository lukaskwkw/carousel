import CarouselItem from "./carousel-item";
import * as _throttle from "lodash/throttle";
import { css } from "../utils/helpers";
import { animateItem } from "../animation";
import { Book } from "../model";
import { getContent, createSearchUrl } from "../generator/generator";

const scaleRatio = 0.05;
const templateTodo = document.createElement("template");
const throttleClickTime = 500;

const style = css`
  h1 {
    font-size: var(--header-size, 96px);
    font-weight: 100;
    text-align: center;
    color: rgba(175, 47, 47, 0.15);
  }

  section {
    margin: 30px 0 40px 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .title {
    font-size: 24px;
  }

  .carousel {
    display: flex;
    perspective: var(--perspective-distance);
  }

  .carousel button {
    z-index: 100;
  }

  .carousel-container {
    margin-top: 32px;
    position: relative;
    padding: 0;
    transform-style: preserve-3d;
    padding: 0 var(--buttons-padding);
    transition: all ease-in-out 1s;

    width: var(--carousel-size);
    height: var(--carousel-size);
    transform-origin: 50% 50% var(--cricle-radius);
  }
`;

templateTodo.innerHTML = /* template */ `
    <style>
      ${style}
    </style>
    <h1>Carousel of Books</h1>
    <section>
        <carousel-searchbox></carousel-searchbox>
        <p class="title"></p>
        <div class="carousel">
          <button id="left"><<</button>
          <ul class="carousel-container"></ul>
          <button id="right">>></button>
        </div>
    </section>
`;

export interface ListItem extends Partial<Book> {
  selected?: boolean;
  transform?: string;
  delayedImage?: Promise<any>;
  index: number;
}

export default class MyTodo extends HTMLElement {
  _root: ShadowRoot;
  _list: ListItem[] = [];
  _bufferedList: ListItem[] = [];
  _content: AsyncIterableIterator<any>;
  $input;
  $carouselContainer: HTMLElement;
  $bookTitle: HTMLElement;
  selectedIndex: number;
  itemOffset: number = 6;
  theta: number;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
    this._list = [
      { index: 0, selected: false, title: "Pomarancze" },
      { index: 1, selected: false },
      { index: 2, selected: false },
      { index: 3, selected: false },
      { index: 4, selected: false },
      { index: 5, selected: false }
    ];
    this.selectedIndex = 0;
    this._list[this.selectedIndex]["selected"] = true;

    this.toggleItem = this.toggleItem.bind(this);
    this.onCoverSelect = this.onCoverSelect.bind(this);
    this.search = this.search.bind(this);
    this.theta = (2 * Math.PI) / 82;
  }

  connectedCallback() {
    this._root.appendChild(templateTodo.content.cloneNode(true));
    this.$input = this._root.querySelector("carousel-searchbox");
    this.$carouselContainer = this._root.querySelector(".carousel-container");
    const buttonLeft = this._root.querySelector("#left");
    const buttonRight = this._root.querySelector("#right");
    this.$bookTitle = this._root.querySelector(".title");

    buttonLeft.addEventListener(
      "click",
      _throttle(async () => {
        if (this.selectedIndex > 0) {
          this.selectedIndex--;
          this.toggleItem(this.selectedIndex);
          if (this._content) {
            this._list = (await this._content.next(this.selectedIndex)).value;
          }
          this._render();
        }
      }, throttleClickTime)
    );

    buttonRight.addEventListener(
      "click",
      _throttle(async () => {
        this.selectedIndex++;
        this.toggleItem(this.selectedIndex);
        if (this._content) {
          this._list = (await this._content.next(this.selectedIndex)).value;
        }
        this._render();
      }, throttleClickTime)
    );

    this.$input.addEventListener("onSubmit", this.search);
    this._render();
  }

  async search(event: CustomEvent) {
    const searchUrl = createSearchUrl(event.detail);
    this._content = getContent(searchUrl);

    this._list = (await this._content.next()).value;

    if (this._list && this._list.length > 0) {
      this.selectedIndex = 0;
      const renderAccumulated = _throttle(() => this._render(), 250);

      for (let i = 0; i < this._list.length; i++) {
        await this._list[i].delayedImage;

        renderAccumulated();
      }
    }
  }

  toggleItem(itemIndex: number) {
    const prevIndex = this.selectedIndex;
    const prevItem = this._list[prevIndex];

    this._list[prevIndex] = { ...prevItem, selected: false };

    const newSelectedIndex = itemIndex;

    const item = this._list[newSelectedIndex];
    this._list[newSelectedIndex] = { ...item, selected: true };

    this.selectedIndex = newSelectedIndex;
  }

  async onCoverSelect(event: CustomEvent) {
    this.toggleItem(event.detail);
    if (this._content) {
      this._list = (await this._content.next(this.selectedIndex)).value;
    }
    this._render();
  }

  disconnectedCallback() {}

  _render() {
    if (!this.$carouselContainer) return;
    this.$carouselContainer.innerHTML = "";
    let { _list, selectedIndex } = this;
    const { length } = _list;

    this.$carouselContainer.style["transform"] = `rotateY(${selectedIndex *
      -this.theta}rad)`;

    this.$bookTitle.textContent = `${
      _list.find(item => item.index === selectedIndex).title
    } index: ${selectedIndex}`;

    _list.forEach(item => {
      const { index } = item;
      let $item = document.createElement("carousel-item") as CarouselItem;
      $item.setAttribute("book", JSON.stringify(item));

      animateItem(
        index,
        selectedIndex,
        length,
        item,
        $item,
        scaleRatio,
        this.theta
      );

      $item.selected = item.selected;
      $item.index = index;
      $item.addEventListener("onCoverSelect", this.onCoverSelect);
      this.$carouselContainer.appendChild($item);
    });
  }
}

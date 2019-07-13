import CarouselItem from "./carousel-item";
import * as _throttle from "lodash/throttle";
import { css, delay } from "../utils/helpers";
import { animateItem } from "../animation";
import { Book } from "../model";
import { getContent, createSearchUrl } from "../generator/generator";

const scaleRatio = 0.05;
const templateTodo = document.createElement("template");
const minimalSwipeTime = 500;

const style = css`
  h1 {
    font-size: var(--header-size, 96px);
    font-weight: 100;
    text-align: center;
    color: rgba(175, 47, 47, 0.15);
  }

  @keyframes slideUpDown {
    0% {
      top: 0px;
    }
    50% {
      top: -50px;
    }
    100% {
      top: 0px;
    }
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
    width: 100%;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 0;
  }

  .carousel {
    display: flex;
    perspective: var(--perspective-distance);
    align-items: center;
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

    width: var(--carousel-width);
    height: var(--carousel-height);
    transform-origin: 50% 50% var(--circle-radius);

    /* firefox fix for parent is blocking child elements */
    pointer-events: none;
  }

  .carousel-container > carousel-item {
    position: absolute;
    top: 0px;
    pointer-events: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    transition: all ease-in-out 1s;
    cursor: pointer;
    width: var(--carousel-width);
    height: var(--carousel-height);

    transform-origin: 50% 50% var(--circle-radius);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
  }

  li.item {
    font-size: 24px;
    transition: all ease-in-out 0.5s;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }

  li.item.selected {
    /* background: #f6f6f6; */
  }

  carousel-item:not(.selected):hover {
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
    display: none;
  }

  li.item img {
    max-width: var(--carousel-width);
    max-height: var(--carousel-height);
  }

  .control {
    height: 32px;
  }
`;

templateTodo.innerHTML = /* template */ `
    <style>
      ${style}
    </style>
    <div>
      <h1>Carousel of Books</h1>
      <section>
          <carousel-searchbox></carousel-searchbox>
          <p class="title"></p>
          <div class="carousel">
            <button class="control" id="left"><<</button>
            <ul class="carousel-container"></ul>
            <button class="control" id="right">>></button>
          </div>
      </section>
    </div>
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
  throttledRender: Function;
  carouselRun: boolean = false;
  carouselPromise: Promise<any>;

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
    this.throttledRender = _throttle(() => this._render(), 250);
    this.throttledRender = this.throttledRender.bind(this);
    this.startCarousel = this.startCarousel.bind(this);
    this.stopCarousel = this.stopCarousel.bind(this);
    this.swipeLeft = this.swipeLeft.bind(this);
    this.swipeRight = this.swipeRight.bind(this);
  }

  connectedCallback() {
    this._root.appendChild(templateTodo.content.cloneNode(true));
    this.$input = this._root.querySelector("carousel-searchbox");
    this.$carouselContainer = this._root.querySelector(".carousel-container");
    const buttonLeft = this._root.querySelector("#left");
    const buttonRight = this._root.querySelector("#right");
    this.$bookTitle = this._root.querySelector(".title");

    buttonLeft.addEventListener("click", this.swipeLeft());
    buttonRight.addEventListener("click", this.swipeRight());

    this.$input.addEventListener("onSubmit", this.search);
    this._render();
  }

  swipeLeft(time: number = minimalSwipeTime) {
    return _throttle(() => {
      if (this.selectedIndex > 0) {
        this.stopCarousel();
        this.toggleItem(this.selectedIndex - 1);
      }
    }, time);
  }

  swipeRight(time: number = minimalSwipeTime) {
    return _throttle(() => {
      if (!this._list) {
        return;
      }

      const item = this._list.find(
        item => item.index === this.selectedIndex + 1
      );
      if (item) {
        this.toggleItem(this.selectedIndex + 1);
        this.startCarousel();
      }
    }, time);
  }

  startCarousel() {
    if (this.carouselPromise) {
      return;
    }

    this.carouselPromise = (async () => {
      const swipe = this.swipeRight();
      this.carouselRun = true;

      while (this.carouselRun) {
        await delay(2000);
        if (this.carouselRun) {
          swipe();
        }
      }
    })();
  }

  async stopCarousel() {
    this.carouselRun = false;
    if (this.carouselPromise) {
      await this.carouselPromise;
      this.carouselPromise = null;
    }
  }

  async search(event: CustomEvent) {
    this._list = [];
    const searchUrl = createSearchUrl(event.detail);
    this._content = getContent(searchUrl);

    const llistWithDelayedImages = (await this._content.next()).value;

    if (llistWithDelayedImages && llistWithDelayedImages.length > 0) {
      this.selectedIndex = 0;

      llistWithDelayedImages.forEach(item => {
        item.delayedImage.then(() => {
          this._list.push(item);
          this.throttledRender();
        });
      });

      await this.stopCarousel();
      await delay(2000);
      this.startCarousel();
    }
  }

  toggleItem(newSelectedIndex: number) {
    const prevIndex = this.selectedIndex;
    this.selectedIndex = newSelectedIndex;

    if (this._content && newSelectedIndex !== prevIndex) {
      this._content.next(newSelectedIndex).then(iterator => {
        this._list = iterator.value;

        this._list = this._list.map(item => {
          if (item.index === prevIndex) {
            return { ...item, selected: false };
          }
          if (item.index === newSelectedIndex) {
            return { ...item, selected: true };
          }
          return item;
        });

        //changed from throttledRender for animation improvement
        this._render();
      });
      this._render();
    }
  }

  onCoverSelect(event: CustomEvent) {
    this.stopCarousel();
    this.toggleItem(event.detail);
  }

  disconnectedCallback() {}

  _render() {
    if (!this.$carouselContainer) return;
    this.$carouselContainer.innerHTML = "";
    let { _list, selectedIndex } = this;
    const { length } = _list;

    this.$carouselContainer.style["transform"] = `rotateY(${selectedIndex *
      -this.theta}rad)`;

    const item = _list.find(item => item.index === selectedIndex);

    if (item) {
      this.$bookTitle.textContent = item.title;
    }

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

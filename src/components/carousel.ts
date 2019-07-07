import CarouselItem from "./carousel-item";
import breakpoints from "../breakpoints";
import * as _throttle from "lodash/throttle";
import { css } from "../utils/helpers";
import { animateItem } from "../animation";

const scaleRatio = 0.05;
const templateTodo = document.createElement("template");
const throttleClickTime = 1000;

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
    padding: 0 300px;
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
        <div class="carousel">
          <button id="left"><<</button>
          <ul class="carousel-container"></ul>
          <button id="right">>></button>
        </div>
    </section>
`;

export default class MyTodo extends HTMLElement {
  _root: ShadowRoot;
  _list: any[];
  $input;
  $carouselContainer: HTMLElement;
  selectedIndex: number;
  itemOffset: number;
  itemSize: number;
  theta: number;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
    this._list = [
      { text: "1", selected: false, url: "http://placekitten.com/200/300" },
      { text: "2", selected: false, url: "http://placekitten.com/200/300" },
      { text: "3", selected: false, url: "http://placekitten.com/200/300" },
      { text: "4", selected: false, url: "http://placekitten.com/200/300" },
      { text: "5", selected: false, url: "http://placekitten.com/200/300" },
      { text: "6", selected: false, url: "http://placekitten.com/200/300" }
    ];
    this.selectedIndex = 2;
    this._list[this.selectedIndex]["selected"] = true;

    this.toggleItem = this.toggleItem.bind(this);
    this.onCoverSelect = this.onCoverSelect.bind(this);
    this.checkBreakpoints = this.checkBreakpoints.bind(this);
    this.onResize = this.onResize.bind(this);
    this.theta = (2 * Math.PI) / 82;
    // const apothem = 300 / (2 * Math.tan(Math.PI / this._list.length));
    // console.info({ apothem });
  }

  checkBreakpoints() {
    const windowWidth = document.body.clientWidth;
    if (windowWidth < breakpoints.small) {
      this.itemOffset = 25;
      this.itemSize = 200;
      return;
    }
    if (windowWidth < breakpoints.medium) {
      this.itemOffset = 50;
      this.itemSize = 300;
      return;
    }
    this.itemOffset = 100;
    this.itemSize = 400;
  }

  onResize() {
    _throttle(() => {
      this.checkBreakpoints();
      this._render();
    }, 1500);
  }

  connectedCallback() {
    this._root.appendChild(templateTodo.content.cloneNode(true));
    this.$input = this._root.querySelector("carousel-searchbox");
    this.$carouselContainer = this._root.querySelector(".carousel-container");
    const buttonLeft = this._root.querySelector("#left");
    const buttonRight = this._root.querySelector("#right");
    buttonLeft.addEventListener(
      "click",
      _throttle(() => {
        if (this.selectedIndex > 0) {
          this.toggleItem(--this.selectedIndex);
          this._render();
        }
      }, throttleClickTime)
    );
    buttonRight.addEventListener(
      "click",
      _throttle(() => {
        if (this.selectedIndex < this._list.length - 1) {
          this.toggleItem(++this.selectedIndex);
          this._render();
        }
      }, throttleClickTime)
    );

    this.$input.addEventListener("onSubmit", this.addItem.bind(this));
    this.checkBreakpoints();
    // window.addEventListener("resize", this.onResize);

    this._render();
  }

  addItem(event) {
    this._list.push({ text: event.detail, selected: false });
    this._render();
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

  onCoverSelect(event: CustomEvent) {
    this.toggleItem(event.detail);
    this._render();
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.onResize);
  }

  _render() {
    if (!this.$carouselContainer) return;
    this.$carouselContainer.innerHTML = "";
    const { length } = this._list;
    // const theta = (2 * Math.PI) / length;

    this.$carouselContainer.style["transform"] = `rotateY(${this.selectedIndex *
      -this.theta}rad)`;
    this._list.forEach((item, index) => {
      let $item = document.createElement("carousel-item") as CarouselItem;
      $item.setAttribute("text", item.text);

      animateItem(
        index,
        this.selectedIndex,
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

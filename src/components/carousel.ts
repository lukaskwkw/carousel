import CarouselItem from "./carousel-item";
import breakpoints from "../breakpoints";
import * as _throttle from "lodash/throttle";

const scaleRatio = 0.05;
const templateTodo = document.createElement("template");

const style = `
  h1 {
    font-size: 96px;
    font-weight: 100;
    text-align: center;
    color: rgba(175, 47, 47, 0.15);
  }
  
  @media screen and (max-width: ${breakpoints.medium}px) {
    h1 {
      font-size: 64px;
    }
  }

  @media screen and (max-width: ${breakpoints.small}px) {
    h1 {
      font-size: 32px;
    }
  }

  section {
    margin: 30px 0 40px 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #list-container {
    margin-top: 32px;
    position: relative;
    padding: 0;
  }
`;

templateTodo.innerHTML = /* template */ `
    <style>
      ${style}
    </style>
    <h1>Carousel of Books</h1>
    <section>
        <todo-input></todo-input>
        <ul id="list-container"></ul>
    </section>
`;

export default class MyTodo extends HTMLElement {
  _root;
  _list: any[];
  $input;
  $listContainer: HTMLElement;
  selectedIndex: number;
  itemOffset: number;
  itemSize: number;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
    this._list = [
      { text: "my initial todo", selected: false },
      { text: "Learn about Web Components", selected: false },
      { text: "Learn about Web Components", selected: true },
      { text: "Learn about Web Components", selected: false },
      { text: "Learn about Web Components", selected: false }
    ];
    this.selectedIndex = 2;
    this.toggleItem = this.toggleItem.bind(this);
    this.onCoverSelect = this.onCoverSelect.bind(this);
    this.checkBreakpoints = this.checkBreakpoints.bind(this);
    this.onResize = this.onResize.bind(this);
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
    this.$input = this._root.querySelector("todo-input");
    this.$listContainer = this._root.querySelector("#list-container");
    this.$input.addEventListener("onSubmit", this.addItem.bind(this));
    this.checkBreakpoints();
    window.addEventListener("resize", this.onResize);

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
    if (!this.$listContainer) return;
    this.$listContainer.innerHTML = "";
    const { length } = this._list;

    this._list.forEach((item, index) => {
      let $item = document.createElement("todo-item") as CarouselItem;
      $item.setAttribute("text", item.text);
      $item.setAttribute("width", `${this.itemSize}px`);
      $item.setAttribute("height", `${this.itemSize}px`);

      //TODO: Clean-up render
      let forScale = 0;
      let zIndex = 0;
      if (index <= this.selectedIndex) {
        zIndex = this._list.length - (this.selectedIndex - index);
        forScale = index;
      } else {
        zIndex = this._list.length - index;

        forScale = this.selectedIndex - (index - this.selectedIndex);
      }

      $item.style["z-index"] = zIndex;
      const scale = 1 - (this.selectedIndex - forScale) * scaleRatio;

      if (item.scale) {
        $item.style["transform"] = `scale(${item.scale})`;
      } else {
        $item.style["transform"] = `scale(0.5)`;
      }

      setTimeout(() => {
        const opacityDowngrade = scale * 0.9;
        const timeyDowngrade = 1000 * scale * 0.5;
        $item.style["transform"] = `scale(${scale})`;
        $item.style["opacity"] = `${opacityDowngrade}`;
        $item.style["transition"] = `all ease-in-out ${timeyDowngrade}ms`;
        item.scale = scale;
      }, 100);

      this.$listContainer.style["width"] = `${(length - 1) * this.itemOffset +
        this.itemSize}px`;

      $item.style["left"] = `${index * this.itemOffset}px`;
      $item.selected = item.selected;
      $item.index = index;
      $item.addEventListener("onCoverSelect", this.onCoverSelect);
      this.$listContainer.appendChild($item);
    });
  }
}

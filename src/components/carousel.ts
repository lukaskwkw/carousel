import CarouselItem from "./carousel-item";
import { css } from "../utils/helpers";

const scaleRatio = 0.05;
const templateTodo = document.createElement("template");

const style = css`
  h1 {
    font-size: 100px;
    font-weight: 100;
    text-align: center;
    color: rgba(175, 47, 47, 0.15);
  }

  section {
    background: #fff;
    margin: 30px 0 40px 0;
    position: relative;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
  }

  #list-container {
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid #e6e6e6;
    display: flex;
    height: 200px;
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
  $listContainer;
  selectedIndex: number;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
    // initial state
    this._list = [
      { text: "my initial todo", selected: false },
      { text: "Learn about Web Components", selected: true }
    ];
    this.selectedIndex = 1;
    this.toggleItem = this.toggleItem.bind(this);
    this.onCoverSelect = this.onCoverSelect.bind(this);
  }

  connectedCallback() {
    this._root.appendChild(templateTodo.content.cloneNode(true));
    this.$input = this._root.querySelector("todo-input");
    this.$listContainer = this._root.querySelector("#list-container");
    this.$input.addEventListener("onSubmit", this.addItem.bind(this));
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

  disconnectedCallback() {}

  _render() {
    if (!this.$listContainer) return;
    // empty the list
    this.$listContainer.innerHTML = "";
    this._list.forEach((item, index) => {
      let $item = document.createElement("todo-item") as CarouselItem;
      $item.setAttribute("text", item.text);

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
      let scale = 1 - (this.selectedIndex - forScale) * scaleRatio;

      if (item.scale) {
        $item.style["transform"] = `scale(${item.scale})`;
      }

      item.scale = scale;
      setTimeout(() => {
        $item.style["transform"] = `scale(${scale})`;
        $item.style["transition"] = `all ease-in-out ${1000 * scale * 0.5}ms`;
      });

      // setTimeout(() => {
      //   $item.style["transform"] = `scale(${scale}) translate(-200px,0px)`;
      // }, 2000);

      $item.style["left"] = `${index * 100}px`;
      $item.selected = item.selected;
      $item.index = index;
      $item.addEventListener("onCoverSelect", this.onCoverSelect);
      this.$listContainer.appendChild($item);
    });
  }
}

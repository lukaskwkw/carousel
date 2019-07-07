import { css } from "../utils/helpers";

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
    background: #f6f6f6;
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
    </li>
`;

export default class CarouselItem extends HTMLElement {
  _selected: boolean;
  _root: ShadowRoot;
  _index: any;
  text: string;
  $item: any;
  $text: any;
  $checkbox: any;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
    this._selected = this.selected;
    this._index = this.index;
    this.text = "";
  }

  connectedCallback() {
    this._root.appendChild(templateTodoItem.content.cloneNode(true));
    this.$item = this._root.querySelector(".item");
    this.$text = this._root.querySelector("label");

    this.$item.addEventListener("click", e => {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent("onCoverSelect", { detail: this.index })
      );
    });

    this._render();
  }

  static get observedAttributes() {
    return ["text"];
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

  set selected(value) {
    this._selected = Boolean(value);
  }

  get selected() {
    return this.hasAttribute("selected");
  }

  _render() {
    if (!this.$item) return;
    this.$text.textContent = this.text;
    if (this._selected) {
      this.$item.classList.add("selected");
    } else {
      this.$item.classList.remove("selected");
    }
  }
}

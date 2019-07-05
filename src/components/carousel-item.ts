import { css } from "../utils/helpers";

const templateTodoItem = document.createElement("template");

const style = css`
  :host {
    position: absolute;
    display: block;
    transition: all ease-in-out 1s;
    /* width: 100px; */
    height: 200px;
  }

  li.item {
    /* border: 1px solid #e6e6e6; */
    font-size: 24px;
    display: block;
    position: absolute;
    background: green;
    width: 200px;
    height: 200px;

    overflow: hidden;
  }

  li.item input {
    text-align: center;
    width: 40px;
    /* auto, since non-WebKit browsers doesn't support input styling */
    height: auto;
    position: absolute;
    top: 9px;
    bottom: 0;
    margin: auto 0;
    border: none;
    /* Mobile Safari */
    -webkit-appearance: none;
    appearance: none;
  }

  li.item input:after {
    content: url('data:image/svg+xml;utf8,<svg%20xmlns%3D"http%3A//www.w3.org/2000/svg"%20width%3D"40"%20height%3D"40"%20viewBox%3D"-10%20-18%20100%20135"><circle%20cx%3D"50"%20cy%3D"50"%20r%3D"50"%20fill%3D"none"%20stroke%3D"%23ededed"%20stroke-width%3D"3"/></svg>');
  }

  li.item input:checked:after {
    content: url('data:image/svg+xml;utf8,<svg%20xmlns%3D"http%3A//www.w3.org/2000/svg"%20width%3D"40"%20height%3D"40"%20viewBox%3D"-10%20-18%20100%20135"><circle%20cx%3D"50"%20cy%3D"50"%20r%3D"50"%20fill%3D"none"%20stroke%3D"%23bddad5"%20stroke-width%3D"3"/><path%20fill%3D"%235dc2af"%20d%3D"M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z"/></svg>');
  }

  li.item label {
    white-space: pre;
    word-break: break-word;
    padding: 15px 60px 15px 15px;
    margin-left: 45px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
  }

  li.item.selected {
    background: red;
  }

  li.item button,
  li.item input[type="checkbox"] {
    outline: none;
  }

  li.item button {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    font-size: 100%;
    vertical-align: baseline;
    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    -webkit-appearance: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    -moz-font-smoothing: antialiased;
    font-smoothing: antialiased;
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
  _text: string;
  $item: any;
  $removeButton: any;
  $text: any;
  $checkbox: any;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
    this._selected = this.selected;
    this._index = this.index;
    this._text = "";
  }

  connectedCallback() {
    this._root.appendChild(templateTodoItem.content.cloneNode(true));
    this.$item = this._root.querySelector(".item");
    this.$removeButton = this._root.querySelector(".destroy");
    this.$text = this._root.querySelector("label");

    this.$item.addEventListener("click", e => {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent("onCoverSelect", { detail: this.index })
      );
    });

    this._render();
  }

  disconnectedCallback() {}
  static get observedAttributes() {
    return ["text"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._text = newValue;
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
    this.$text.textContent = this._text;
    if (this._selected) {
      this.style["transform"] = "scale(1)";
      // this.style["transition"] = "all ease-in-out 1s";
      this.$item.classList.add("selected");
    } else {
      this.$item.classList.remove("selected");
    }
  }
}

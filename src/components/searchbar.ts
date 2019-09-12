const templateTodoInput = document.createElement("template");
templateTodoInput.innerHTML = /* template */ `
    <style>
        .searchbox {
            padding: 16px 16px 16px 60px;
            border: none;
            background: white;
            position: relative;
            margin: 0 auto;
            width: 100%;
            font-size: 24px;
            font-family: inherit;
            font-weight: inherit;
            line-height: 1.4em;
            border: 0;
            outline: none;
            color: inherit;
            padding: 6px;
            border: 1px solid #CCC;
            box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
            box-sizing: border-box;
        }
    </style>
    <form>
        <input class="searchbox" type="text" placeholder="Search for..." />
    </form>
`;

export default class TodoInput extends HTMLElement {
  _root: ShadowRoot;
  $form: any;
  $input: any;
  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this._root.appendChild(templateTodoInput.content.cloneNode(true));
    this.$form = this._root.querySelector("form");
    this.$input = this._root.querySelector("input");
    this.$form.addEventListener("submit", e => {
      e.preventDefault();
      if (!this.$input.value) return;
      this.dispatchEvent(
        new CustomEvent("onSubmit", { detail: this.$input.value })
      );
      this.$input.value = "";
    });
  }

  disconnectedCallback() {}
}

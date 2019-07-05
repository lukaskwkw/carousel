import "./index.scss";
import MyTodo from "./components/my-todo";
import TodoInput from "./components/todo-input";
import TodoItem from "./components/todo-item";

window.customElements.define("my-todo", MyTodo);
window.customElements.define("todo-input", TodoInput);
window.customElements.define("todo-item", TodoItem);

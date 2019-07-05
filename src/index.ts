import "./index.scss";
import Carousel from "./components/carousel";
import Searchbar from "./components/searchbar";
import CarouselItem from "./components/carousel-item";

window.customElements.define("my-todo", Carousel);
window.customElements.define("todo-input", Searchbar);
window.customElements.define("todo-item", CarouselItem);

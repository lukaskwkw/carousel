import "./index.scss";
import Carousel from "./components/carousel";
import Searchbar from "./components/searchbar";
import CarouselItem from "./components/carousel-item";

window.customElements.define("my-carousel", Carousel);
window.customElements.define("carousel-searchbox", Searchbar);
window.customElements.define("carousel-item", CarouselItem);

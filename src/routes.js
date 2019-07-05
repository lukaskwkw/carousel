import Home from "./pages/Home";
import FourOhFour from "./pages/FourOhFour";
import Portfolio from "./pages/Portfolio";

const PAGES = {
  "/": Home,
  "/404": FourOhFour,
  "/portfolio": Portfolio
};

export const Routes = Object.keys(PAGES);

export default PAGES;

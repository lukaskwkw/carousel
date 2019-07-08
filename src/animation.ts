export const animateItem = (
  index: number,
  selectedIndex: number,
  lenghtOfItems: number,
  item: { transform?: string },
  $item: HTMLElement,
  downgradeRatio: number,
  theta: number
) => {
  let forScale = 0;
  let zIndex = 0;
  if (index <= selectedIndex) {
    zIndex = lenghtOfItems - (selectedIndex - index);
    forScale = index;
  } else {
    zIndex = lenghtOfItems - index;

    forScale = selectedIndex - (index - selectedIndex);
  }

  $item.style["z-index"] = zIndex;

  const scale = 1 - (selectedIndex - forScale) * downgradeRatio;

  const newTransform = `rotateY(${index * theta}rad) translateZ(${(1 - scale) *
    -500}px)`;

  if (item.transform) {
    $item.style["transform"] = item.transform;
  } else {
    $item.style["transform"] = `rotateY(${2}rad) translateZ(${(1 - scale) *
      -500}px)`;
  }

  setTimeout(() => {
    const opacityDowngrade = scale * 0.99;
    const timeDowngrade = 1000 * scale * 0.5;

    $item.style["transform"] = newTransform;

    $item.style["opacity"] = `${opacityDowngrade}`;
    $item.style["transition"] = `all ease-in-out ${timeDowngrade}ms`;
    item.transform = newTransform;
  }, 100);
};

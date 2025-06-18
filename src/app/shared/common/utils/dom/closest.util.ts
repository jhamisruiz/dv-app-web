export const Closest = (elm: any, selector: string): HTMLElement | null => {
  for (; elm && elm !== document; elm = elm.parentNode) {
    if (elm.matches(selector)) {
      return elm;
    }
  }
  return null;
};

// eslint-disable-next-line no-extra-boolean-cast
export const GetElements = (target: HTMLElement, selector: string): HTMLElement[] => !!target ? [].slice.call(target.querySelectorAll(selector)) : [];

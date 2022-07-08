// линтер ругается на циклический импорт, поэтому пришлось
// описать интерфейс (а по сути повторить объявление типа),
// вместо того, чтобы импортировать
interface BlockType {
  dispatchComponentDidMount(): void,
}

export const elementsPlacer = (rootElem: HTMLElement, elems: Record<string, BlockType>): void => {
  for (const el of Object.keys(elems)) {
    const htmlElement = rootElem.getElementsByClassName(el)[0];
    if (htmlElement !== null) {
      // @ts-ignore
      htmlElement.replaceWith(elems[el].getContent());
      elems[el].dispatchComponentDidMount();
    }
  }
};

import {IEvents} from "../base/events";

/**
 * Базовый компонент
 */
export abstract class Component<T> {

  protected constructor(protected container: HTMLElement, protected events?: IEvents) {
  }

// Установить текстовое содержимое
  protected setText(element: HTMLElement, value: unknown) {
    if (element) {
        element.textContent = String(value);
    }
  }

// Установить изображение с алтернативным текстом
  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
    if (element) {
        element.src = src;
        if (alt) {
            element.alt = alt;
        }
    }
  }

// Вернуть корневой DOM-элемент
  render(data?: Partial<T>): HTMLElement {
      Object.assign(this as object, data ?? {});
      return this.container;
  }
}
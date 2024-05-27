import { TForm } from './../../types/index';
import { IEvents } from './../base/events';
import { Component } from "./View";
import { ensureAllElements, ensureElement } from "../../utils/utils"

interface IForm{
  valid: boolean;
  errorMessage: string;
  clear(): void;
}

export class Form<T> extends Component<TForm> implements IForm {
  protected inputsList: HTMLInputElement[];
  protected submitButton: HTMLButtonElement;
  protected _errorMessage: HTMLSpanElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container, events);

    this.inputsList = ensureAllElements<HTMLInputElement>('.form__input', container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
    this._errorMessage = ensureElement<HTMLSpanElement>('.form__errors' , container);

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });

    this.inputsList.forEach(input => {
      input.addEventListener('input', () =>
        this.events.emit(`${this.container.name}:valid`));
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errorMessage(value: string) {
    this.setText(this._errorMessage, value);
  }

  render(data: Partial<T> & TForm): HTMLElement {
    const {valid, ...other} = data;
    this.valid = valid;
    return super.render(other);
  }

  clear() {
    this.container.reset()
  }

}
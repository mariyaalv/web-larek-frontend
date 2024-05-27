import { IEvents } from './../base/events';
import { Component } from "./View";
import { cloneTemplate, ensureElement } from "../../utils/utils";


interface ISuccessView {
  total: string;
}

export class Success extends Component<ISuccessView> {
  protected _total: HTMLParagraphElement;
  protected buttonOrderSuccess: HTMLButtonElement;

  constructor(protected template: HTMLTemplateElement, protected events: IEvents) {
    super(cloneTemplate(template), events);

    this._total = ensureElement<HTMLParagraphElement>('.order-success__description', this.container);
    this.buttonOrderSuccess = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.buttonOrderSuccess.addEventListener('click', () => this.events.emit('success:submit'))
  }

  set total(value: string) {
    this.setText(this._total, `Списано ${value || '0'} синапсов`);
  }
}
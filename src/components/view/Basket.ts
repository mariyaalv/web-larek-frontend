import { IEvents } from './../base/events';
import { Component } from './View';
import { cloneTemplate, ensureElement } from '../../utils/utils';

interface IBasketView {
	list: HTMLElement[] | null;
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLUListElement | null;
	protected _total: HTMLSpanElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected template: HTMLTemplateElement,
		protected events: IEvents
	) {
		super(cloneTemplate(template), events);

		this._list = ensureElement<HTMLUListElement>(
			'.basket__list',
			this.container
		);
		this._total = ensureElement<HTMLSpanElement>(
			'.basket__price',
			this.container
		);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this._button.addEventListener('click', () =>
			this.events.emit('basket:submit')
		);
	}

	set total(total: number) {
		this.setText(this._total, String(total) + ' синапсов');
		this._button.disabled = total <= 0;
	}

	set list(cards: HTMLElement[]) {
		this._list.replaceChildren(...cards);
	}
}

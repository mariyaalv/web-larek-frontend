import { IEvents } from './../base/events';
import { Component } from './View';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<HTMLElement> {
	closeButton: HTMLButtonElement;
	content: HTMLDivElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container, events);

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.content = ensureElement<HTMLDivElement>('.modal__content', container);

		this.closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this.content.addEventListener('mousedown', (event) =>
			event.stopPropagation()
		);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.events.emit('modal:close');
	}

	render(obj: HTMLElement): HTMLElement {
		this.content.replaceChildren(obj);

		return this.container;
	}
}

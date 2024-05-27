import { TFormOfPayment, TPayment } from './../../types/index';
import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from './../base/events';

export interface IFormOfPayment {
	payment: TPayment | null;
	address: string;
	clear(): void;
	getButtonActive(): HTMLButtonElement | null;
}

export class FormPayment
	extends Form<TFormOfPayment>
	implements IFormOfPayment
{
	protected containerButtons: HTMLDivElement;
	protected buttonCard: HTMLButtonElement;
	protected buttonCash: HTMLButtonElement;
	protected inputAddress: HTMLInputElement;
	protected orderButtonElement: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.containerButtons = ensureElement<HTMLDivElement>(
			'.order__buttons',
			container
		);
		this.inputAddress = this.container.elements.namedItem(
			'adress'
		) as HTMLInputElement;
		this.buttonCard = this.container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this.buttonCash = this.container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;
		this.orderButtonElement = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.container
		);

		this.orderButtonElement.addEventListener('click', (evt) => {
			evt.preventDefault();
			events.emit('order:submit', {
				address: this.inputAddress.value,
				payment: this.payment,
			});
		});

		this.containerButtons.addEventListener('click', (event) => {
			if (event.target === this.buttonCard || this.buttonCash) {
				const buttonActive = event.target as HTMLButtonElement;
				this.deleteActiveButtons();
				buttonActive.classList.add('button_alt-active');
				this.events.emit('order:valid');
			}
		});
	}

	getButtonActive(): HTMLButtonElement | null {
		if (this.buttonCard.classList.contains('button_alt-active')) {
			return this.buttonCard;
		} else if (this.buttonCash.classList.contains('button_alt-active')) {
			return this.buttonCash;
		}
		return null;
	}

	protected deleteActiveButtons(): void {
		this.buttonCard.classList.remove('button_alt-active');
		this.buttonCash.classList.remove('button_alt-active');
	}

	clear() {
		super.clear();
		this.deleteActiveButtons();
	}

	set address(value: string) {
		this.setText(this.inputAddress, value);
	}

	get address() {
		return this.inputAddress.value;
	}

	get payment() {
		const buttonActive = this.getButtonActive();
		return buttonActive ? (buttonActive.name as TPayment) : null;
	}
}

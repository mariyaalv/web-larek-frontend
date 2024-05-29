import { TFormOfContact } from './../../types/index';
import { Form } from './Form';
import { IEvents } from './../base/events';

interface IFormOfContact {
	email: string;
	phone: string;
}

export class FormContacts
	extends Form<TFormOfContact>
	implements IFormOfContact
{
	protected inputEmail: HTMLInputElement;
	protected inputPhone: HTMLInputElement;

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.inputEmail = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
		this.inputPhone = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
	}

	set phone(value: string) {
		this.setText(this.inputPhone, value);
	}

	get phone() {
		return this.inputPhone.value;
	}

	set email(value: string) {
		this.setText(this.inputEmail, value);
	}

	get email() {
		return this.inputEmail.value;
	}
}

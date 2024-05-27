import { IEvents } from '../base/events';

import {
	IOrderData,
	TFormOfPayment,
	TFormOfContact,
	FormErrors,
	ErrorStatus,
} from '../../types/index';

export class OrderData implements IOrderData {
	protected _paymentInfo: TFormOfPayment;
	protected _contactInfo: TFormOfContact;
	formErrors: FormErrors = {};

	constructor(protected events: IEvents) {
		this.clearOrder();
		this.clearUserContacts();
	}

	clearOrder() {
		this._paymentInfo = {
			address: '',
			payment: undefined,
		};
	}

	clearUserContacts() {
		this._contactInfo = {
			email: '',
			phone: '',
		};
	}

	set paymentInfo(info: TFormOfPayment) {
		this._paymentInfo.payment = info.payment;
		this._paymentInfo.address = info.address;
	}

	set contactInfo(info: TFormOfContact) {
		this._contactInfo.email = info.email;
		this._contactInfo.phone = info.phone;
	}

	checkValidation() {
		const errors: typeof this.formErrors = {};
		if (!this._paymentInfo.payment) {
			errors.payment = ErrorStatus.EmptyPayment;
		}
		if (!this._paymentInfo.address) {
			errors.address = ErrorStatus.EmptyAdress;
		}
		if (!this._contactInfo.email) {
			errors.email = ErrorStatus.EmptyEmail;
		}
		if (!this._contactInfo.phone) {
			errors.phone = ErrorStatus.EmptyPnone;
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}

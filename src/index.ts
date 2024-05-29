import { Card } from './components/view/Card';
import { IProduct, IOrder } from './types/index';
import { Success } from './components/view/Success';
import { FormContacts } from './components/view/FormOfContact';
import { FormPayment } from './components/view/FormOfPayment';
import { Basket } from './components/view/Basket';
import { Modal } from './components/view/Modal';
import { BasketData } from './components/model/BasketData';
import { OrderData } from './components/model/OrderData';
import { Page } from './components/view/Page';
import './scss/styles.scss';
import { ActionAPI } from './components/ActionApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardData } from './components/model/CardData';

//шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const templateCardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const templateCardBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const templateBasket = ensureElement<HTMLTemplateElement>('#basket');
const templatePayment = ensureElement<HTMLTemplateElement>('#order');
const templateContacts = ensureElement<HTMLTemplateElement>('#contacts');
const templateSuccess = ensureElement<HTMLTemplateElement>('#success');

const containerPage = ensureElement<HTMLElement>('.page');
const containerModal = ensureElement<HTMLDivElement>('#modal-container');

//экземпляр класса EventEmitter
const events = new EventEmitter();
// Модель данных приложения
const api = new ActionAPI(CDN_URL, API_URL);

//экземпляры классов слоя модели
const cardsData = new CardData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

//экземпляры классов слоя представления
const page = new Page(containerPage, events);
const modal = new Modal(containerModal, events);
const basket = new Basket(templateBasket, events);
const success = new Success(templateSuccess, events);
const formOrder = new FormPayment(cloneTemplate(templatePayment), events);
const formContacts = new FormContacts(cloneTemplate(templateContacts), events);

//Обработка событий изменения данных

//получаем данные о товарах с сервера
api
	.getProducts()
	.then((cards) => {
		cardsData.cards = cards;
	})
	.catch(console.error);

function renderCards(products: IProduct[]) {
	page.catalog = products.map((product) =>
		new Card(cardCatalogTemplate, events, {
			onClick: () => events.emit('preview:selected', product),
		}).render({
			...product,
		})
	);
}

function renderPreview(product: IProduct) {
	modal.render(
		new Card(templateCardPreview, events, {
			onClick: () => events.emit('preview:submit', product),
		}).render({
			...product,
			isInBasket: basketData.isInBasket(product.id),
		})
	);
}

function renderBasket() {
	modal.render(
		basket.render({
			total: basketData.getTotal(),
			list: basketData.cardsInBasket.map((product: IProduct, index: number) => {
				const card = new Card(templateCardBasket, events, {
					onClick: () => events.emit('basket:delete', product),
				});
				return card.render({
					title: product.title,
          id: product.id,
          price: product.price,
					index: ++index,
				});
			}),
		})
	);
}

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Изменились элементы каталога => отреагировали
events.on('cards:changed', (cards: IProduct[]) => {
	renderCards(cards);
});

// Отображение карточки
events.on('preview:selected', (product: IProduct) => {
	renderPreview(product);
	modal.open();
});

//
events.on('preview:submit', (product: IProduct) => {
	if (basketData.isInBasket(product.id)) {
		basketData.deleteProductFromBasket(product.id);
		renderPreview(product);
	} else {
		basketData.addProductInBasket(product);
		renderPreview(product);
	}
});

events.on('basket:changed', () => {
	page.counter = basketData.cardsInBasket.length;
});

//обработаем событие удаления товара из корзины
events.on('basket:delete', (data: IProduct) => {
	basketData.deleteProductFromBasket(data.id);
	renderBasket();
});

//обработаем событие открытия корзины
events.on('basket:open', () => {
	renderBasket();
	modal.open();
});

events.on('basket:submit', () => {
	orderData.clearOrder();
  modal.render(formOrder.render({valid: false, ...orderData.paymentInfo}));
});

//взаимодействие пользователя с полями формы доставки
events.on('order:valid', () => {
  orderData.paymentInfo = {payment: formOrder.payment, address: formOrder.address};
});

events.on('contacts:valid', () => {
  orderData.contactInfo = {email: formContacts.email, phone: formContacts.phone};
 });

 events.on('order:submit', () => {
  orderData.clearUserContacts();
  modal.render(formContacts.render({valid: false, ...orderData.contactInfo}));
 });
 
// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
  const { payment, address, email, phone } = errors;
  formOrder.valid = !payment && !address;
  formContacts.valid = !email && !phone;
  formOrder.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
  formContacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on('contacts:submit', () => {
  api.postOrder({
   ...orderData.contactInfo,
   ...orderData.paymentInfo,
   items: basketData.getProductIdsInBasket(),
   total: basketData.getTotal()
  }).then(result => {
   orderData.clearOrder();
   orderData.clearUserContacts();
   basketData.clearBasket();
   modal.render(success.render(result));
  })
   .catch(e => console.error(e));
 });

 events.on('success:submit', () => {
  modal.close();
 })
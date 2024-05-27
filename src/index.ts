import { Card } from './components/view/Card';
import { IProduct } from './types/index';
import { Success } from './components/view/Success';
import { FormContacts } from './components/view/FormOfContact';
import { FormPayment } from './components/view/FormOfPayment';
import { Basket } from './components/view/Basket';
import { Modal } from './components/view/Modal';
import { SuccessData } from './components/model/SuccessData';
import { BasketData } from './components/model/BasketData';
import { OrderData } from './components/model/OrderData';
import { Page } from './components/view/Page';
import './scss/styles.scss';
import { ActionAPI } from './components/ActionApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
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
const successData = new SuccessData(events);

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
					...product,
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


// // Открыть форму заказа
// events.on('order:open', () => {
//   modal.render({
//       content: order.render({
//           phone: '',
//           email: '',
//           valid: false,
//           errors: []
//       })
//   });
// });

// // Отправлена форма заказа
// events.on('order:submit', () => {
//   api.orderLots(appData.order)
//       .then((result) => {
//           const success = new Success(cloneTemplate(successTemplate), {
//               onClick: () => {
//                   modal.close();
//                   appData.clearBasket();
//                   events.emit('auction:changed');
//               }
//           });

//           modal.render({
//               content: success.render({})
//           });
//       })
//       .catch(err => {
//           console.error(err);
//       });
// });

// success:changed
// basket:open
// card-preview:open
// purchases:delete
// purchases:add + delete
// ${this.container.name}:submit
// `${this.container.name}:valid`)
// open:basket

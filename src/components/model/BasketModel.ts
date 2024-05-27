import { Model } from './Model';
import { IEvents } from '../base/events';
import { IBasketData, IProduct } from '../../types/index';

export class BasketData extends Model implements IBasketData {
  protected _cardsInBasket: IProduct[];
  protected _total: number;

  constructor(protected events: IEvents) {
    super(events);
    this.clearBasket();
  }

	isInBasket(productId: string) {
    const cardId = this._cardsInBasket.find(product => {product.id === productId});
    if (!cardId) {
      return false;
    } else {
      return true;
    }
	}

  getProductsInBasket(): IProduct[] {
		return this._cardsInBasket.filter((item) => this.isInBasket(item.id));
	}

  addProductInBasket(product: IProduct) {
    if(!this._cardsInBasket.find(order => {order.id === product.id})) {
      this._cardsInBasket.push(product);
    }
  }

  deleteProductFromBasket(id: string) {
    this._cardsInBasket = this._cardsInBasket.filter(cards => cards.id !== id);
  }

  clearBasket() {
    this._cardsInBasket = [];
    this._total = 0;
  }

  get cardsInBasket() {
    return this._cardsInBasket;
  }

  get total() {
    return this._total;
  }

	protected set cardsInBasket(cardsInBasket: IProduct[]) {
		this._cardsInBasket = cardsInBasket;
		this.events.emit('basket:changed', this.cardsInBasket);
	}

  getTotal() {
    return this._cardsInBasket.reduce((res, current) => {
      return res + current.price
    }, 0)
  }
}
import { Model } from './Model';
import { IEvents } from '../base/events';
import { IBasketData, IProduct } from '../../types';

export class BasketData extends Model implements IBasketData {
  protected _cardsInBasket: IProduct[];
  protected _total: number;

  constructor(protected events: IEvents) {
    super(events);
    this.clearBasket();
  }

  isInBasket(productId: string) {
    const cardId = this.cardsInBasket.find(
      (product) => product.id === productId
    );
    return cardId !== undefined;
  }

  getProductsInBasket(): IProduct[] {
    return this.cardsInBasket.filter((item) => this.isInBasket(item.id));
  }

  addProductInBasket(product: IProduct) {
    if (!this.isInBasket(product.id)) {
      this.cardsInBasket = [...this.cardsInBasket, product];
    }
  }

  deleteProductFromBasket(id: string) {
    this.cardsInBasket = this.cardsInBasket.filter(
      (cards) => cards.id !== id
    );
  }

  clearBasket() {
    this.cardsInBasket = [];
    this._total = 0;
  }
  
  get total() {
    return this._total;
  }
  
  get cardsInBasket() {
    return this._cardsInBasket;
  }
  
  protected set cardsInBasket(cardsInBasket: IProduct[]) {
    this._cardsInBasket = cardsInBasket;
    this.events.emit('basket:changed', this.cardsInBasket);
  }

  getTotal() {
    return this.cardsInBasket.reduce((res, current) => {
      return res + current.price;
    }, 0);
  }
}

import { IProduct } from './../../types/index';
import { IEvents } from './../base/events';
import { Model } from './Model';
import { ICardsData } from '../../types/index';

export class CardData extends Model implements ICardsData {
  protected _cards: IProduct[];

  constructor(protected events: IEvents) {
    super(events);
    this._cards = [];
  }

  getCard(cardId: string): IProduct | undefined {
    const product = this._cards.find(card => card.id === cardId);
    if (!product)
			throw Error(`Product with id ${cardId} not found`);

		return product;
  }

  set cards(value: IProduct[]) {
    this._cards = value;
    this.emitChanges('cards:changed', this._cards);
  }

  get cards() {
    return this._cards;
  }
}
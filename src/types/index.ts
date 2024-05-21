export interface ICard {
  _id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface IOrder {
  payment: string;
  email: string;
  phone: number;
  address: string;
  total: number;
  purchases: string[];
}

export interface ICardsData {
  cards: ICard[];
  getCard(cardId: string): ICard;
  addCard(card: ICard): void;
}

export interface IUserData {
  getUserInfo(): TUserData;
  setUserInfo(userData: IOrder): void;
  clearUserInfo(): void;
  checkValidation(data: Record<keyof TUserData, string>): boolean;
}

export interface IBasketData {
  cardsInBasket: ICard[];
  total: number;
	addCardInBasket(card: ICard): void;
	deleteCardFromBasket(id: string, payload: Function | null): void;
	clearBasket(): void;
	getCardsInBasket(): ICard[];
}

export type TCardPublicInfo = Pick<ICard, 'category' | 'image' | 'price' | 'title'>;

export type TCardInBasket = Pick<ICard, 'title' | 'price'>;

export type TFormOfPayment = Pick<IOrder, 'payment' | 'address'>;

export type TFormOfContact = Pick<IOrder, 'email' | 'phone'>;

export type TUserData = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;



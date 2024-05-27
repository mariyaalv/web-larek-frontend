import { Model } from './Model';
import { IEvents } from '../base/events';
import { ISuccessData, TSuccessData } from './../../types/index';

export class SuccessData extends Model implements ISuccessData {
  protected _orderSuccess: TSuccessData;

  constructor(protected events: IEvents) {
    super(events);
  }

  set orderSuccess(value: TSuccessData) {
    this._orderSuccess = value;
    this.events.emit('success:changed', this._orderSuccess)
  }

  get orderSuccess() {
    return this._orderSuccess;
  }
}
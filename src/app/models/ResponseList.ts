import { ResponseBase } from './ResponseBase';

export interface ResponseList<T> extends ResponseBase {
  data: T[];
}

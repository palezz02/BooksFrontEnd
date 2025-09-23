import { ResponseBase } from './ResponseBase';

export interface ResponseObject<T> extends ResponseBase {
  data: T;
}

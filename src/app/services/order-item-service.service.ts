import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseList } from '../models/ResponseList';
import { Observable } from 'rxjs';
import { ResponseObject } from '../models/ResponseObject';
import { ResponseBase } from '../models/ResponseBase';

@Injectable({
  providedIn: 'root',
})
export class OrderItemServiceService {
  url = 'http://localhost:8080/rest/orderitem/';
  constructor(private http: HttpClient) {}

  listOrderItems(): Observable<ResponseList<any>> {
    return this.http.get<ResponseList<any>>(this.url + 'getAll');
  }

  getOrderItem(id: number): Observable<ResponseObject<any>> {
    let params = new HttpParams().set('id', id);
    return this.http.get<ResponseObject<any>>(this.url + 'getById', { params });
  }

  insertOrderItem(body: {}): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(this.url + 'create', { body });
  }
  removeOrderItem(body: {}): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(this.url + 'delete', { body });
  }

  updateOrderItem(body: {}): Observable<ResponseBase> {
    console.log(body);
    return this.http.put<ResponseBase>(this.url + 'update', { body });
  }
}

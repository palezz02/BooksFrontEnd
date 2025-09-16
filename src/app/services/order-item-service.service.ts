import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderItemServiceService {
  url = 'http://localhost:8080/rest/orderitem/';
  constructor(private http: HttpClient) {}

  listOrderItems() {
    return this.http.get(this.url + 'getAll');
  }

  getOrderItem(id: number) {
    let params = new HttpParams().set('id', id);
    return this.http.get(this.url + 'getById', { params });
  }

  insertOrderItem(body: {}) {
    return this.http.post(this.url + 'create', body);
  }
  removeOrderItem(body: {}) {
    return this.http.post(this.url + 'delete', body);
  }

  updateOrderItem(body: {}) {
    console.log(body);
    return this.http.put(this.url + 'update', body);
  }
}

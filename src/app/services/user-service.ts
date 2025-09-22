import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBase } from '../models/ResponseBase';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = 'http://localhost:8080/rest/user/';
  constructor(private http: HttpClient) {}

  create(body: {}): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(this.url + 'create', body);
  }

  update(body: {}) {
    return this.http.put(this.url + 'update', body);
  }

  delete(body: {}) {
    return this.http.delete(this.url + 'delete', body);
  }

  getById(id: number) {
    let params = new HttpParams().set('id', id);
    return this.http.get(this.url + 'getById', { params });
  }

  getAll() {
    return this.http.get(this.url + 'getAll');
  }

  signin(body: {}) {
    return this.http.post(this.url + 'signin', body);
  }
}

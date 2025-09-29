import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBase } from '../models/ResponseBase';
import { ResponseList } from '../models/ResponseList';
import { ResponseObject } from '../models/ResponseObject';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = 'http://localhost:8080/rest/user/';
  constructor(private http: HttpClient) {}

  create(body: {}): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(this.url + 'create', body);
  }

  update(body: {}): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(this.url + 'update', body);
  }

  delete(body: {}): Observable<ResponseBase> {
    return this.http.delete<ResponseBase>(this.url + 'delete', { body });
  }

  getById(id: number): Observable<ResponseObject<any>> {
    let params = new HttpParams().set('id', id);
    return this.http.get<ResponseObject<any>>(this.url + 'getById', { params });
  }

  getAll(): Observable<ResponseList<any>> {
    return this.http.get<ResponseList<any>>(this.url + 'getAll');
  }

  getBestByReviews(): Observable<ResponseList<any>> {
    return this.http.get<ResponseList<any>>(this.url + 'getBestByReviews');
  }

  getBestByCategory(): Observable<ResponseList<any>> {
    return this.http.get<ResponseList<any>>(this.url + 'getBestByCategory');
  }


  getCartBooks(userId: number): Observable<ResponseList<any>> {
    let params = new HttpParams().set('id', userId);
    return this.http.get<ResponseList<any>>(this.url + 'getCartBooks', { params });
  }

  signin(body: {}): Observable<any> {
    return this.http.post<any>(this.url + 'signin', body);
  }
}
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseBase } from '../models/ResponseBase';
import { Observable } from 'rxjs';
import { ResponseObject } from '../models/ResponseObject';
import { ResponseList } from '../models/ResponseList';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  url = 'http://localhost:8080/rest/book/';
  constructor(private http: HttpClient) {}

  create(body: {}): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(this.url + 'create', { body });
  }

  update(body: {}): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(this.url + 'update',  body );
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

  getBestByReviews(limit: number, offset: number): Observable<ResponseList<any>> {
    let params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http.get<ResponseList<any>>(this.url + 'getBestByReviews', { params });
  }

  getBestByCategory(limit: number, offset: number): Observable<ResponseList<any>> {
    let params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset);

    return this.http.get<ResponseList<any>>(this.url + 'getBestByCategory', { params });
  }

}

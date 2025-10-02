import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseBase } from '../models/ResponseBase';
import { Observable } from 'rxjs';
import { ResponseList } from '../models/ResponseList';
import { ResponseObject } from '../models/ResponseObject';
@Injectable({
  providedIn: 'root',
})
export class PublisherService {
  url = 'http://localhost:8080/rest/publisher/';
  constructor(private http: HttpClient) {}

  listPublishers(): Observable<ResponseList<any>> {
    return this.http.get<ResponseList<any>>(this.url + 'getAll');
  }

  getPublisher(id: number): Observable<ResponseObject<any>> {
    let params = new HttpParams().set('id', id);
    return this.http.get<ResponseObject<any>>(this.url + 'getById', { params });
  }

  insertPublisher(body: {}): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(this.url + 'create', body);
  }
  removePublisher(body: {}): Observable<ResponseBase> {
    return this.http.delete<ResponseBase>(this.url + 'delete', { body });
  }

  updatePublisher(body: {}): Observable<ResponseBase> {
    console.log(body);
    return this.http.put<ResponseBase>(this.url + 'update', body);
  }

   getById(id: number): Observable<ResponseObject<any>> {
    let params = new HttpParams().set('id', id);
    return this.http.get<ResponseObject<any>>(this.url + 'getById', { params });
  }
}

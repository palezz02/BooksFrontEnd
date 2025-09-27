import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseList } from '../models/ResponseList';
import { ResponseBase } from '../models/ResponseBase';
import { ResponseObject } from '../models/ResponseObject';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorServiceService {
  url = 'http://localhost:8080/rest/author/';
  constructor(private http: HttpClient) {}

  listAuthor(): Observable<ResponseList<any>> {
    return this.http.get<ResponseList<any>>(this.url + 'listAll');
  }

  insertAuthor(body: {}): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(this.url + 'create', body);
  }
  removeAuthor(body: {}): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(this.url + 'delete', { body });
  }

  updateAuthor(body: {}): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(this.url + 'update', body);
  }

  getById(id: number): Observable<ResponseObject<any>> {
  const params = new HttpParams().set('id', id);
  return this.http.get<ResponseObject<any>>(this.url + 'getById', { params });
}

}

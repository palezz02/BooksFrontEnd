import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseList } from '../models/ResponseList';
import { ResponseBase } from '../models/ResponseBase';

@Injectable({
  providedIn: 'root',
})
export class AddressServiceService {
  url = 'http://localhost:8080/rest/address/';
  constructor(private http: HttpClient) {}

  listAddress(): Observable<ResponseList<any>> {
    return this.http.get<ResponseList<any>>(this.url + 'listAll');
  }

  insertAddress(body: {}): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(this.url + 'create', { body });
  }
  removeAddress(body: {}): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(this.url + 'delete', { body });
  }

  updateAddress(body: {}): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(this.url + 'update', { body });
  }
}

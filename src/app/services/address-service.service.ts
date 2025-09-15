import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressServiceService {

  url = 'http://localhost:8080/rest/address/';
  constructor(private http : HttpClient) { }

  listAddress(){
    return this.http.get(this.url + 'listAll');
  }

  insertAddress(body:{}){
    return this.http.post(this.url + 'create', body);
  }
  removeAddress(body:{}){
    return this.http.post(this.url + 'delete', body);
  }

  updateAddress(body:{}){
    console.log(body);
    return this.http.put(this.url + 'update', body);
  }

}

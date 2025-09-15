import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthorServiceService {

  url = 'http://localhost:8080/rest/author/';
  constructor(private http : HttpClient) { }

  listAuthor(){
    return this.http.get(this.url + 'listAll');
  }

  insertAuthor(body:{}){
    return this.http.post(this.url + 'create', body);
  }
  removeAuthor(body:{}){
    return this.http.post(this.url + 'delete', body);
  }

  updateAuthor(body:{}){
    console.log(body);
    return this.http.put(this.url + 'update', body);
  }

}

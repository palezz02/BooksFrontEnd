import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://localhost:8080/rest/user/';
  constructor(private http: HttpClient) { }
  
  create(body: {}) {
    return this.http.post(this.url + 'create', body);
  }

  update(body:{}) { 
    return this.http.put(this.url + 'update', body)
  }
  
  delete(body:{}) {
    return this.http.delete(this.url + 'delete', body);
  }
  
  getById(id: number) { 
    let params = new HttpParams().set('id', id);
    return this.http.get(this.url + 'getById', {params});
  }
  
  getAll() {
    return this.http.get(this.url + 'getAll');
  }
}

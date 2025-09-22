import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class PublisherService {
  url = 'http://localhost:8080/rest/publisher/';
  constructor(private http: HttpClient) {}

  listPublishers() {
    return this.http.get(this.url + 'getAll');
  }

  getPublisher(id: number) {
    let params = new HttpParams().set('id', id);
    return this.http.get(this.url + 'getById', { params });
  }

  insertPublisher(body: {}) {
    return this.http.post(this.url + 'create', body);
  }
  removePublisher(body: {}) {
    return this.http.post(this.url + 'delete', body);
  }

  updatePublisher(body: {}) {
    console.log(body);
    return this.http.put(this.url + 'update', body);
  }
}

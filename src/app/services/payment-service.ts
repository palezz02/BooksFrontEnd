import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseObject } from '../models/ResponseObject';

export interface CreatePaymentIntentReq {
  amount: number;
  currency: string;
  customerEmail: string;
  description: string;
  orderId?: number;
}

export interface PaymentDTO {
  id: string;
  orderId?: number;
  amount: number;
  currency: string;
  status: string;
  paymentIntentId: string;
  clientSecret: string;
  createdAt: string;
  errorMessage?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private url = 'http://localhost:8080/rest/payment/';

  constructor(private http: HttpClient) {}

  createPaymentIntent(req: CreatePaymentIntentReq): Observable<ResponseObject<PaymentDTO>> {
    return this.http.post<ResponseObject<PaymentDTO>>(this.url + 'create-intent', req);
  }

  confirmPayment(paymentIntentId: string, orderId?: number): Observable<ResponseObject<PaymentDTO>> {
    return this.http.post<ResponseObject<PaymentDTO>>(this.url + 'confirm', {
      paymentIntentId,
      orderId
    });
  }

//   getPaymentByOrder(orderId: number): Observable<ResponseObject<PaymentDTO>> {
//     return this.http.get<ResponseObject<PaymentDTO>>(this.url + by-order?orderId=${orderId});
//   }
}
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private baseUrl = 'https://671d383409103098807c943e.mockapi.io/api/products/';
  private http = inject(HttpClient)

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + id)
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product)
  }

  loadProducts(): Observable<Product[]> {
    return this
            .http
            .get<Product[]>(this.baseUrl)
            .pipe(
              delay(1500) // For the demo...
            )
  }

}

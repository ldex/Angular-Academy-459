import { inject, Injectable, Signal, signal } from '@angular/core';
import { Product } from '../models/product';
import { ApiService } from '../api/api-service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiService = inject(ApiService)

  private productsCache = signal<Product[]>([])
  private loading = signal(false)
  isLoading = this.loading.asReadonly()

  error = signal<string>(undefined)

  getProducts(): Signal<Product[]> {
    this.loading.set(true)
    this.apiService.loadProducts().subscribe(
      {
        next: products => {
          this.loading.set(false)
          console.table(products)
          this.productsCache.set(products)
        },
        error: err => this.handleError(err, "Failed to load products.")
      }
    )
    return this.productsCache
  }

  private handleError(httpError: HttpErrorResponse, userMessage: string) {
    this.loading.set(false)
    let logMessage: string;
    if (httpError.error instanceof ErrorEvent) {
      logMessage = 'An error occurred:' + httpError.error.message;
    } else {
      logMessage = `Backend returned code ${httpError.status}, body was: ${httpError.error}`;
    }
    console.error(logMessage);
    this.error.set(userMessage);
  }

}

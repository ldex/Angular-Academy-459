import { inject, Injectable, Signal, signal } from '@angular/core';
import { Product } from '../models/product';
import { ApiService } from '../api/api-service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiService = inject(ApiService)
  private router = inject(Router)

  private productsCache = signal<Product[]>([])
  private loading = signal(false)
  isLoading = this.loading.asReadonly()

  error = signal<string>(undefined)

  deleteProduct(id: number) {
    this.apiService.deleteProduct(id).subscribe({
      next: () => {
        this.productsCache.update(products => products.filter(p => p.id !== id));
        console.log('Product deleted');
        this.router.navigateByUrl('/products');
      },
      error: (error) => this.handleError(error, 'Failed to delete product.')
    });
  }

  createProduct(newProduct: Omit<Product, 'id'>): Promise<void> {
    this.apiService.createProduct(newProduct).subscribe({
      next: (product) => {
        this.productsCache.update((products) => [...products, product]);
        console.log('Product saved on the server with id: ' + product.id);
      },
      error: (error) => {
        this.handleError(error, 'Failed to save product.');
        return Promise.reject();
      },
    });
    return Promise.resolve();
  }

  getProductById(id: number): Product | undefined {
    return this.productsCache().find(product => product.id === id)
  }

  getProducts(): Signal<Product[]> {
    if(this.productsCache().length > 0)
        return this.productsCache

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

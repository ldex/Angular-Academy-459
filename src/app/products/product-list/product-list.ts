import { Component, inject, Signal, signal } from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ProductDetails } from "../product-details/product-details";
import { ProductService } from '../product-service';
import { OrderByPipe } from '../orderBy.pipe';

@Component({
  selector: 'app-product-list',
  imports: [UpperCasePipe, CurrencyPipe, OrderByPipe, ProductDetails],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private productService = inject(ProductService)

  title = signal('Products')
  isLoading = this.productService.isLoading
  error = this.productService.error
  selectedProduct = signal<Product>(undefined)

  select(product: Product) {
    this.selectedProduct.set(product)
  }

  products: Signal<Product[]> = this.productService.getProducts()

}

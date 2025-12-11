import { Component, inject, Signal, signal } from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { ProductService } from '../product-service';
import { OrderByPipe } from '../orderBy.pipe';
import { Router, RouterLink } from '@angular/router';
import { ProductForm } from '../product-form/product-form';

@Component({
  selector: 'app-product-list',
  imports: [UpperCasePipe, CurrencyPipe, OrderByPipe, SlicePipe, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export default class ProductList {
  private productService = inject(ProductService)
  private router = inject(Router)

  title = signal('Products')
  isLoading = this.productService.isLoading
  error = this.productService.error
  selectedProduct = signal<Product>(undefined)
  products: Signal<Product[]> = this.productService.getProducts()

  select(product: Product) {
    this.selectedProduct.set(product)
    this.router.navigateByUrl('/products/' + product.id)
  }

  // Pagination
  pageSize = signal(5)
  start = signal(0)
  end = signal(this.pageSize())
  pageNumber = signal(1)

  changePage(increment: number) {
    this.pageNumber.update(pn => pn + increment)
    this.start.update(n => n + increment * this.pageSize())
    this.end.set(this.start() + this.pageSize())
    this.selectedProduct.set(null)
  }

}

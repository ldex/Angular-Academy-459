import { Component, computed, inject, input } from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ProductService } from '../product-service';
import { compatForm } from '@angular/forms/signals/compat';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, DatePipe, UpperCasePipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private productService = inject(ProductService)

  id = input.required<number>()

  product = computed(
    () => this.productService.getProductById(this.id())
  )

  deleteProduct() {
    this.productService.deleteProduct(this.id())
  }
}

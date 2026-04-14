import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ProductService } from '../../../core/services/product.service';
import { Category } from '../../../core/models/category.model';
import { Observable } from 'rxjs';

import { ProductCardComponent } from '../../../shared/components/product-card/product-card';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  selectedCategory: Category | undefined;
  categories$: Observable<Category[]>;
  products$: Observable<any[]>;
  searchTerm = '';
  minPrice = 0;
  maxPrice = 5000000;
  selectedBrand = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    this.categories$ = this.categoryService.getCategories();
    this.products$ = this.productService.getProducts();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      const catSlug = params['category'];
      this.selectedBrand = params['brand'] || '';
      
      const apiParams: any = {};
      if (this.searchTerm) apiParams.search = this.searchTerm;
      if (catSlug) apiParams.category = catSlug;
      if (this.selectedBrand) apiParams.brand = this.selectedBrand;

      if (catSlug) {
        this.categoryService.getCategoryBySlug(catSlug).subscribe({
          next: (cat) => {
            this.selectedCategory = cat;
            this.products$ = this.productService.getProducts(apiParams);
          },
          error: () => {
            this.selectedCategory = undefined;
            this.products$ = this.productService.getProducts(apiParams);
          }
        });
      } else {
        this.selectedCategory = undefined;
        this.products$ = this.productService.getProducts(apiParams);
      }
    });
  }

  applyFilters() {
    const queryParams: any = {};
    if (this.searchTerm) queryParams.search = this.searchTerm;
    if (this.selectedCategory) queryParams.category = this.selectedCategory.slug;
    if (this.selectedBrand) queryParams.brand = this.selectedBrand;
    
    this.router.navigate(['/products'], { queryParams });
  }
}

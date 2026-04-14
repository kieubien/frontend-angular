import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ProductService } from '../../../core/services/product.service';
import { Category } from '../../../core/models/category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  selectedCategory: Category | undefined;
  categories$: Observable<Category[]>;
  products$: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    this.categories$ = this.categoryService.getCategories();
    this.products$ = this.productService.getProducts();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const slug = params['category'];
      if (slug) {
        this.categoryService.getCategoryBySlug(slug).subscribe({
          next: (cat) => {
            this.selectedCategory = cat;
            this.products$ = this.productService.getProducts({ category: slug });
          },
          error: () => this.selectedCategory = undefined
        });
      } else {
        this.selectedCategory = undefined;
        this.products$ = this.productService.getProducts();
      }
    });
  }
}

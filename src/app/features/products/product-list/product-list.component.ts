import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, NavbarComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  selectedCategory: Category | undefined;
  categories$: Observable<Category[]>;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const slug = params['category'];
      if (slug) {
        this.selectedCategory = this.categoryService.getCategoryBySlug(slug);
      } else {
        this.selectedCategory = undefined;
      }
    });
  }
}

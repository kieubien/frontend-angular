import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  categories: Category[] = [];

  footerLinks = [
    {
      title: 'Hỗ trợ',
      links: [
        { label:'Hướng dẫn mua hàng', path:'/' },
        { label:'Chính sách đổi trả', path:'/' },
        { label:'Vận chuyển',         path:'/' },
        { label:'Tích điểm',          path:'/' },
        { label:'Liên hệ',            path:'/' },
      ]
    },
    {
      title: 'Công ty',
      links: [
        { label:'Về chúng tôi', path:'/' },
        { label:'Blog làm đẹp', path:'/' },
        { label:'Thương hiệu',  path:'/' },
        { label:'Tuyển dụng',   path:'/' },
      ]
    },
  ];

  paymentMethods = ['VISA','MasterCard','MoMo','ZaloPay','COD'];

  constructor(private categoryService: CategoryService) {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats.filter(c => !(c.parent_id || c.parentId)).slice(0, 5);
    });
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  footerLinks = [
    {
      title: 'Sản phẩm',
      links: [
        { label:'Son môi',  path:'/products' },
        { label:'Phấn má',  path:'/products' },
        { label:'Mắt',      path:'/products' },
        { label:'Dưỡng da', path:'/products' },
        { label:'Gift Set', path:'/products' },
      ]
    },
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
}
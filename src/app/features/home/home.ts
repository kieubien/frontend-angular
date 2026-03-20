import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { FooterComponent } from '../../shared/components/footer/footer';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,NavbarComponent, FooterComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  featuredProducts: any[] = [];
  products: any[] = [];
  isLoading = true;
  activeTab = 'featured';
  email = '';

  stats = [
    { num: '500+', label: 'Sản phẩm' },
    { num: '50+',  label: 'Thương hiệu' },
    { num: '20K+', label: 'Khách hàng' },
  ];

  marqueeItems = [
    'Miễn phí ship đơn từ 299K','MAC Cosmetics','Charlotte Tilbury',
    'NARS','Dior Beauty','YSL Beauty','Đổi trả 30 ngày','100% Chính hãng',
    'Miễn phí ship đơn từ 299K','MAC Cosmetics','Charlotte Tilbury',
    'NARS','Dior Beauty','YSL Beauty','Đổi trả 30 ngày','100% Chính hãng',
  ];

  categories = [
    { name:'Son môi',       count:128, icon:'💄', cls:'cat--pink',   cat:'son-moi' },
    { name:'Má hồng',       count:64,  icon:'✨', cls:'cat--gold',   cat:'ma-hong' },
    { name:'Mắt & Kẻ mắt',  count:96,  icon:'👁️', cls:'cat--blue',  cat:'mat' },
    { name:'Dưỡng da',      count:85,  icon:'🌿', cls:'cat--green',  cat:'duong-da' },
    { name:'Gift Set',      count:32,  icon:'🎁', cls:'cat--purple', cat:'gift-set' },
  ];

  tabs = [
    { key:'featured', label:'Bán chạy' },
    { key:'newest',   label:'Mới nhất' },
    { key:'sale',     label:'Khuyến mãi' },
  ];

  discounts = [
    { value:'30%', label:'Son môi' },
    { value:'50%', label:'Mắt' },
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/products').subscribe({
      next: (data) => {
        this.products = data;
        this.featuredProducts = data.filter(p => p.isFeatured).slice(0, 4);
        this.isLoading = false;
      },
      error: () => {
        this.products = this.mockData();
        this.featuredProducts = this.mockData();
        this.isLoading = false;
      }
    });
  }

  setTab(key: string): void {
    this.activeTab = key;
    if (key === 'newest')    this.featuredProducts = [...this.products].reverse().slice(0, 4);
    else if (key === 'sale') this.featuredProducts = this.products.filter(p => p.badge === 'sale').slice(0, 4);
    else                     this.featuredProducts = this.products.filter(p => p.isFeatured).slice(0, 4);
  }

  getDiscount(p: any): number {
    if (!p.originalPrice) return 0;
    return Math.round((1 - p.price / p.originalPrice) * 100);
  }

  addToCart(p: any, e: Event): void {
    e.stopPropagation();
    alert('Đã thêm "' + p.name + '" vào giỏ hàng!');
  }

  goToProducts(cat?: string): void {
    this.router.navigate(['/products'], cat ? { queryParams: { category: cat } } : {});
  }

  subscribe(): void {
    if (!this.email) return;
    alert('Đăng ký thành công! 🎉');
    this.email = '';
  }

  mockData(): any[] {
    return [
      { id:1, name:'Lipstick Matte Ruby Woo', brand:'MAC Cosmetics', price:480000, originalPrice:600000, badge:'sale', reviewCount:342, isFeatured:true, emoji:'💄', colors:[{hex:'#C95E85'},{hex:'#E24B4A'},{hex:'#9B3060'}] },
      { id:2, name:'Rouge Dior Satin 999',    brand:'Dior Beauty',   price:1250000, originalPrice:null,  badge:'new',  reviewCount:218, isFeatured:true, emoji:'🌹', colors:[{hex:'#C8963E'},{hex:'#C95E85'}] },
      { id:3, name:'Velvet Matte Lip Pencil', brand:'NARS Cosmetics', price:720000, originalPrice:850000, badge:null,  reviewCount:189, isFeatured:true, emoji:'✨', colors:[{hex:'#DEB8F0'},{hex:'#D4537E'}] },
      { id:4, name:'Rouge Pur Couture Sheer', brand:'YSL Beauty',    price:980000,  originalPrice:null,  badge:'hot',  reviewCount:401, isFeatured:true, emoji:'💋', colors:[{hex:'#E88DAE'},{hex:'#E24B4A'}] },
    ];
  }
}
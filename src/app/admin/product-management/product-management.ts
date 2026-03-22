import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './product-management.html',
  styleUrls: ['./product-management.scss']
})
export class ProductManagement {

  searchText = '';
  filterCategory = '';
  filterStatus = '';

  showModal = false;
  editing = false;

  form: any = {};

  products = [
    { name: 'MAC Ruby Woo', category: 'Son môi', price: '500k', stock: 10, status: 'active' },
    { name: 'Dior 999', category: 'Son môi', price: '900k', stock: 5, status: 'active' }
  ];

  filteredProducts() {
    return this.products.filter(p =>
      (!this.filterCategory || p.category === this.filterCategory) &&
      (!this.filterStatus || p.status === this.filterStatus) &&
      (!this.searchText || p.name.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }

  getActiveCount() {
    return this.products.filter(p => p.status === 'active').length;
  }

  getLowStock() {
    return this.products.filter(p => p.stock < 10).length;
  }

  resetFilters() {
    this.filterCategory = '';
    this.filterStatus = '';
    this.searchText = '';
  }

  openModal() {
    this.form = {};
    this.editing = false;
    this.showModal = true;
  }

  editProduct(p: any) {
    this.form = { ...p };
    this.editing = true;
    this.showModal = true;
  }

  saveProduct() {
    if (this.editing) {
      const index = this.products.findIndex(x => x.name === this.form.name);
      this.products[index] = this.form;
    } else {
      this.products.push({ ...this.form, status: 'active' });
    }

    this.closeModal();
  }

  deleteProduct(p: any) {
    this.products = this.products.filter(x => x !== p);
  }

  closeModal() {
    this.showModal = false;
  }
}
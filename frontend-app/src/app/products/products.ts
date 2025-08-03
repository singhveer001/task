import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Product {
  product_id: number;
  product_name: string;
  category_id: number;
  category_name: string;
}

interface Category {
  category_id: number;
  category_name: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  standalone: true,       
  imports: [FormsModule, HttpClientModule, CommonModule],
})

export class Products implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  page = 1;
  pageSize = 10;

  newProductName = '';
  newCategoryId: number | null = null;

  editingId: number | null = null;
  editingName = '';
  editingCategoryId: number | null = null;

  baseUrl = 'http://localhost:3000/api'; 
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.http.get< {categories : Category[]}>(`${this.baseUrl}/categories`).subscribe(
      (data) => {
        this.categories = data.categories;
        if (!this.newCategoryId && this.categories.length > 0) {
          this.newCategoryId = this.categories[0].category_id;
        }
      },
      (error) => {
        console.error('Error loading categories', error);
      }
    );
  }

  loadProducts() {
    this.http.get<{ products: Product[], page: number, pageSize: number  }>(
      `${this.baseUrl}/products?page=${this.page}&pageSize=${this.pageSize}`
    ).subscribe(
      (data) => {
        this.products = data.products;
      },
      (error) => {
        console.error('Error loading products', error);
      }
    );
  }

  addProduct() {
    if (!this.newProductName.trim() || !this.newCategoryId) {
      alert('Please enter product name and select category.');
      return;
    }
    const body = {
      name: this.newProductName,
      categoryId: this.newCategoryId,
    };
    this.http.post(`${this.baseUrl}/products`, body).subscribe(() => {
      this.newProductName = '';
      this.loadProducts();
    }, (error) => {
      console.error('Error adding product', error);
    });
  }

  editProduct(product: Product) {
    this.editingId = product.product_id;
    this.editingName = product.product_name;
    this.editingCategoryId = product.category_id;
  }

  updateProduct() {
    if (!this.editingName.trim() || this.editingId === null || !this.editingCategoryId) {
      alert('Please enter product name and select category.');
      return;
    }
    const body = {
      name: this.editingName,
      categoryId: this.editingCategoryId,
    };
    this.http.put(`${this.baseUrl}/products/${this.editingId}`, body).subscribe(() => {
      this.editingId = null;
      this.loadProducts();
    }, (error) => {
      console.error('Error updating product', error);
    });
  }

  cancelEdit() {
    this.editingId = null;
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`${this.baseUrl}/products/${id}`).subscribe(() => {
        this.loadProducts();
      }, (error) => {
        console.error('Error deleting product', error);
      });
    }
  }

  nextPage() {
      this.page++;
      this.loadProducts();
  }

  prevPage() {
    if (this.page > 1) {
      this.page -= 1;
      this.loadProducts();
    }
  }
}

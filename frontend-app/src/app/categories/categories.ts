import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.html',
  standalone: true,
  imports: [FormsModule,HttpClientModule,CommonModule],
  styleUrl : './categories.css'
})
export class Categories implements OnInit {
  categories: { category_id: number; category_name: string }[] = [];
  newCategoryName = '';
  editingId: number | null = null;
  editingName = '';

  baseUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<{ categories: { category_id: number; category_name: string }[] }>(`${this.baseUrl}/categories`)
      .subscribe(
        (res) => {
          this.categories = res.categories;
        },
        (error) => {
          console.error('Error loading categories:', error);
        }
      );
  }

  addCategory() {
    if (!this.newCategoryName.trim()) {
      alert('Enter a category name');
      return;
    }
    this.http.post(`${this.baseUrl}/categories`, { name: this.newCategoryName })
      .subscribe(() => {
        this.newCategoryName = '';
        this.loadCategories();
      }, error => {
        console.error('Error adding category:', error);
      });
  }

  editCategory(category: { category_id: number; category_name: string }) {
    this.editingId = category.category_id;
    this.editingName = category.category_name;
  }

  updateCategory() {
    if (!this.editingName.trim() || this.editingId === null) {
      alert('Enter category name');
      return;
    }
    this.http.put(`${this.baseUrl}/categories/${this.editingId}`, { name: this.editingName })
      .subscribe(() => {
        this.editingId = null;
        this.editingName = '';
        this.loadCategories();
      }, error => {
        console.error('Error updating category:', error);
      });
  }

  cancelEdit() {
    this.editingId = null;
    this.editingName = '';
  }

  deleteCategory(id: number) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    this.http.delete(`${this.baseUrl}/categories/${id}`)
      .subscribe(() => {
        this.loadCategories();
      }, error => {
        console.error('Error deleting category:', error);
      });
  }
}

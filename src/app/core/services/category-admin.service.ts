// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ICategory, ICategoryResponse } from '../interfaces/ICatadmin';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  constructor(private http: HttpClient) {}

  // Get all categories
  getAllCategories(): Observable<ICategoryResponse> {
    return this.http.post<ICategoryResponse>(
      `${environment.BaseURL}/api/category/GetAllCategories`,
      {}
    );
  }

  // Add a new category
  addCategory(category: ICategory): Observable<ICategoryResponse> {
    return this.http.post<ICategoryResponse>(
      `${environment.BaseURL}/api/category/AddCategory`,
      category
    );
  }

  // Update an existing category
  updateCategory(
    id: number,
    category: ICategory
  ): Observable<ICategoryResponse> {
    return this.http.post<ICategoryResponse>(
      `${environment.BaseURL}/api/category/UpdateCategory?id=${id}`,
      category
    );
  }

  // Delete a category
  deleteCategory(id: number): Observable<ICategoryResponse> {
    return this.http.post<ICategoryResponse>(
      `${environment.BaseURL}/api/category/DeleteCategory/${id}`,
    id);
  }

  // Get sub-categories for a category
  getSubCategories(id: number): Observable<ICategoryResponse> {
    return this.http.post<ICategoryResponse>(
      `${environment.BaseURL}/api/category/GetSubCategories`,
      id
    );
  }

  // Get category details by ID
  getCategoryDetails(id: number): Observable<ICategoryResponse> {
    return this.http.post<ICategoryResponse>(
      `${environment.BaseURL}/api/category/GetCategoryName`,
      id
    );
  }
}

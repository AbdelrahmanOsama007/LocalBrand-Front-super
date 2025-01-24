import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { IOperationResult } from '../interfaces/IOperationResult';
import { ProductInfo } from '../models/productinfo';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IColor, IProductadmin, ISize } from '../interfaces/IProductadmin';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _HttpClient: HttpClient) {}

  //public imageUpload = new Subject<string>();
  public imageUpload = new Subject<{ imagePreviews: any[]; index: number }>();

  public imageUpload$ = this.imageUpload.asObservable();
  GetBestSellers(): Observable<IOperationResult> {
    return this._HttpClient.post<IOperationResult>(
      `${environment.BaseURL}/api/Product/GetBestSeller`,
      ''
    );
  }

  GetSaleProducts(): Observable<IOperationResult> {
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/Product/GetSaleProducts`,'');
  }

  GetProductById(id:number | undefined):Observable<IOperationResult>{
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/Product/GetProductById`,id);
  }

  GetProductBySubCatId(id: number): Observable<IOperationResult> {
    return this._HttpClient.post<IOperationResult>(
      `${environment.BaseURL}/api/Product/GetProductBySubCategory`,
      id
    );
  }

  CheckCurrentQuantity(productinfo:ProductInfo):Observable<IOperationResult>{
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/Cart/CheckCurrentStockQuantity`,productinfo);
  }

  GetProductsByCatId(id:number):Observable<IOperationResult>{
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/Product/GetProductsByCatId`,id)
  }
  
  createProduct(product: IProductadmin): Observable<IOperationResult> {
    return this._HttpClient.post<IOperationResult>(
      `${environment.BaseURL}/api/Product/AddProduct`,
      product
    );
  }

  // Update an existing product
  updateProduct(
    product: IProductadmin,
    id: number
  ): Observable<IOperationResult> {
    return this._HttpClient.post<IOperationResult>(
      `${environment.BaseURL}/api/product/UpdateProduct?id=${id}`,
      product
    );
  }

  // Delete a product by id
  DeleteProduct(productId: number): Observable<IOperationResult> {
    console.log(productId);
    return this._HttpClient.post<IOperationResult>(
      `${environment.BaseURL}/api/product/DeleteProduct`,
      productId
    );
  }
  GetAllColors(): Observable<{ success: boolean; data: IColor[] }> {
    return this._HttpClient.post<{ success: boolean; data: IColor[] }>(
      `${environment.BaseURL}/api/Color/GetAllColors`,
      ' '
    );
  }

  GetAllSizes(): Observable<{ success: boolean; data: ISize[] }> {
    return this._HttpClient.post<{ success: boolean; data: ISize[] }>(
      `${environment.BaseURL}/api/Size/GetAllSizes`,
      ' '
    );
  }
  uploadImage(image: string[]): Observable<string> {
    return this._HttpClient.post<string>(
      `${environment.BaseURL}/api/Product/uploadImage`,
      JSON.stringify(image),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  GetAllProducts(query: string = ''): Observable<IOperationResult> {
    const headers = { 'Content-Type': 'application/json' };
    return this._HttpClient.post<IOperationResult>(`${environment.BaseURL}/api/Product/GetAllProducts`, JSON.stringify(query), { headers });
  }
  

  private productDetailsSource = new BehaviorSubject<{ productId: number, subCategoryId: number }>({ productId: 0, subCategoryId: 0 });
  currentProductDetails = this.productDetailsSource.asObservable();

  setProductDetails(productId: number, subCategoryId: number) {
    this.productDetailsSource.next({ productId, subCategoryId });
    localStorage.setItem('productDetails', JSON.stringify({ productId, subCategoryId }));
  }

  getProductDetailsFromLocalStorage(): { productId: number, subCategoryId: number } | null {
    const productDetails = localStorage.getItem('productDetails');
    return productDetails ? JSON.parse(productDetails) : null;
  }
}

import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ColorSketchModule } from 'ngx-color/sketch';
import { IColorPagination } from '../../../interfaces/IColorPagination';
import { Router } from '@angular/router';
import { ColorService } from '../../../services/color.service';
import { IGridOperationResult } from '../../../interfaces/IGridOperationResult';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IOperationResult } from '../../../interfaces/IOperationResult';
import { HttpErrorResponse } from '@angular/common/http';
import { IColor } from '../../../interfaces/IProductadmin';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import Swal from 'sweetalert2';
import { error } from 'console';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-colors',
  standalone: true,
  imports: [ColorSketchModule,CommonModule,MatFormFieldModule,MatInputModule,MatTableModule,MatPaginatorModule,MatSortModule,MatSelectModule,MatTooltipModule,FormsModule,NgxSkeletonLoaderModule],
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.css'
})
export class ColorsComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private _colorservice: ColorService){}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['name', 'code', 'actions'];
  dataSource!: MatTableDataSource<IColorPagination>;
  subscription : Subscription[] = [];
  CurrentColor: IColor = {id: 0,colorName: '#000000', colorCode: ''};
  isModalOpen: boolean = false;

  ngOnInit(): void {
    const colors: IColorPagination[] = [];
    this.dataSource = new MatTableDataSource(colors);
    const paginationObject: IColorPagination = {
      searchParam: '',
      pageNumber: 1,
      pageSize: 5
    };
    this.FetchColors(paginationObject);
  }

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  
      this.paginator.page.subscribe(() => {
        const paginationObject: IColorPagination = {
          searchParam: '',
          pageNumber: this.paginator.pageIndex + 1,
          pageSize: this.paginator.pageSize
        };
    
        this.FetchColors(paginationObject);
      });
    }
    @ViewChild('addmodal') myDiv!: ElementRef;
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      if (this.myDiv && !this.myDiv.nativeElement.contains(event.target)) {
        this.isModalOpen = false;
      }
    }
    onDivClick(event: MouseEvent) {
      event.stopPropagation();
    }

  onColorChange(event: any): void {
    this.CurrentColor.colorCode = event.color.hex;
  }
    applyFilter(filterValue: Event) {
      const actualvalue = (filterValue.target as HTMLInputElement).value.trim().toLowerCase();
      const paginationObject: IColorPagination = {
        searchParam: actualvalue,
        pageNumber: this.paginator.pageIndex + 1,
        pageSize: this.paginator.pageSize
      };
      this.FetchColors(paginationObject);
    }
    FetchColors(paginationObject: IColorPagination) {
      this._colorservice.GetColorGrid(paginationObject).subscribe({
        next: (result: IGridOperationResult) => {
          if (result.success) {
            this.dataSource = new MatTableDataSource(result.data.gridList as IColorPagination[]);
            this.paginator.length = result.data.totalRecords;
            this.paginator.pageSize = result.data.pageSize;
            this.paginator.pageIndex = result.data.pageNumber - 1;
            this.dataSource.sort = this.sort;
          }
        },
        error: (error) => {
          if(error instanceof HttpErrorResponse && error.status === 401){
            this.router.navigate(['/admin-login/ahmedeltalkhawy/550e8400-e29b-41d4-a716-446655440000']);
          }
          else{
            this.GoToError();
          }
        }
      });
    }
    GetColorById(id:number){
      this._colorservice.GetColorById(id).subscribe({
        next: (result:IOperationResult) => {
          if(result.success){
            this.isModalOpen = true;
            this.CurrentColor = result.data as IColor;
          }
        },
        error: (error) => {
          if(error instanceof HttpErrorResponse && error.status === 401){
            this.router.navigate(['/admin-login/ahmedeltalkhawy/550e8400-e29b-41d4-a716-446655440000']);
          }
          else{
            this.GoToError();
          }
        }
      })
    }
    AddColor(){
      this.CurrentColor.colorName = '';
      this.CurrentColor.colorCode = '';
      this.isModalOpen = true;
    }
    DeleteColor(id:number){
      this.subscription.push(
        this._colorservice.DeleteColor(id).subscribe({
          next: (result:IOperationResult) => {
            if(result.success){
              Swal.fire({
                title: "Success",
                text: "Color deleted successfully",
                icon: "success"
              });
              const paginationObject: IColorPagination = {
                searchParam: '',
                pageNumber: 1,
                pageSize: 5
              };
              this.FetchColors(paginationObject);
            }
            else{
              Swal.fire({
                title: "Failed",
                text: "Something went wrong. Color not deleted",
                icon: "error"
              });
            }
          },
          error: (error) => {
            if(error instanceof HttpErrorResponse && error.status === 401){
              this.router.navigate(['/admin-login/ahmedeltalkhawy/550e8400-e29b-41d4-a716-446655440000']);
            }
            else{
              this.GoToError();
            }
          }
        })
      )
    }
    closeMessageModal(): void {
      this.isModalOpen = false;
    }
      onSubmit(event : any , Colorform:NgForm){
        if(Colorform.invalid){
          event.stopPropagation();
          Colorform.control.markAllAsTouched();
        }
        else{
          if(this.CurrentColor.id == 0){
            this.subscription.push(
              this._colorservice.AddColor(this.CurrentColor).subscribe({
                next: (result:IOperationResult) =>{
                  if(result.success){
                    Swal.fire({
                      title: "Success",
                      text: "Color added successfully",
                      icon: "success"
                    });
                    Colorform.resetForm();
                    const paginationObject: IColorPagination = {
                      searchParam: '',
                      pageNumber: 1,
                      pageSize: 5
                    };
                    this.FetchColors(paginationObject);
                  }
                  else{
                    Swal.fire({
                      title: "Failed",
                      text: "Something went wrong. Color not added",
                      icon: "error"
                    });
                  }
                },
                error: (error) => {
                  if(error instanceof HttpErrorResponse && error.status === 401){
                    this.router.navigate(['/admin-login/ahmedeltalkhawy/550e8400-e29b-41d4-a716-446655440000']);
                  }
                  else{
                    this.GoToError();
                  }
                }
              })
            )
          }
          else if(this.CurrentColor.id > 0){
            this.subscription.push(
              this._colorservice.UpdateColor(this.CurrentColor).subscribe({
                next: (result:IOperationResult) => {
                  if(result.success){
                    this.isModalOpen = false;
                    Swal.fire({
                      title: "Success",
                      text: "Color updated successfully",
                      icon: "success"
                    });
                    Colorform.resetForm();
                    const paginationObject: IColorPagination = {
                      searchParam: '',
                      pageNumber: 1,
                      pageSize: 5
                    };
                    this.FetchColors(paginationObject);
                  }
                  else {
                    Swal.fire({
                      title: "Failed",
                      text: "Something went wrong. Color not updated",
                      icon: "error"
                    });
                  }
                },
                error: (error) => {
                  if(error instanceof HttpErrorResponse && error.status === 401){
                    this.router.navigate(['/admin-login/ahmedeltalkhawy/550e8400-e29b-41d4-a716-446655440000']);
                  }
                  else{
                    this.GoToError();
                  }
                }
              })
            )
          }
        }
       }
    GoToError(){
      this.router.navigate(['/error'], { queryParams: { retryUrl: '/colorcrud' } });
    }
    ngOnDestroy(): void {
      if(this.subscription){
        this.subscription.forEach((s) => s.unsubscribe());
      }
    }
}

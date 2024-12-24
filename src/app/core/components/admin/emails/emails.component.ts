import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EmailsService } from '../../../services/emails.service';
import { IEmailPagination } from '../../../interfaces/IEmailPagination';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { IEditEmailStatus } from '../../../interfaces/IEditEmailStatus';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-emails',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatInputModule,MatTableModule,MatPaginatorModule,MatSortModule,MatSelectModule],
  templateUrl: './emails.component.html',
  styleUrl: './emails.component.css'
})
export class EmailsComponent implements OnInit {
  displayedColumns = ['name', 'email', 'emailDate', 'message', 'emailstatus'];
  dataSource!: MatTableDataSource<IEmailPagination>;
  selectedStatus: number = 0;
  selectedSortStatus: string = '0';
  isModalOpen: boolean = false;
  selectedMessage: string = '';
  statusOptions = [
    { value: 1, viewValue: 'Unread', color: 'blue' },
    { value: 2, viewValue: 'Solved', color: 'green' },
    { value: 4, viewValue: 'Processing', color: 'orange' },
    { value: 3, viewValue: 'Unsolved', color: 'red' }
  ];

  statusSortOptions = [
    { value: "0", viewValue: 'All Emails', color: 'gray'},
    { value: "1", viewValue: 'Unread', color: 'blue' },
    { value: "2", viewValue: 'Solved', color: 'green' },
    { value: "3", viewValue: 'Processing', color: 'orange' },
    { value: "4", viewValue: 'Unsolved', color: 'red' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _emailsservice: EmailsService, private router: Router) {}
  ngOnInit(): void {
    const emails: IEmailPagination[] = [];
    this.dataSource = new MatTableDataSource(emails);
    const paginationObject: IEmailPagination = {
      searchParam: '',
      emailStatus: this.selectedStatus,
      pageNumber: 1,
      pageSize: 5
    };
    this.fetchEmails(paginationObject);
  }

  fetchEmails(paginationObject: IEmailPagination) {
    this._emailsservice.GetAllEmails(paginationObject).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.dataSource = new MatTableDataSource(result.data.emails as IEmailPagination[]);
          this.paginator.length = result.data.totalRecords;
          this.paginator.pageSize = result.data.pageSize;
          this.paginator.pageIndex = result.data.pageNumber - 1;
          this.dataSource.sort = this.sort;
        }
      },
      error: () => {
        this.GoToError();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.paginator.page.subscribe(() => {
      const paginationObject: IEmailPagination = {
        searchParam: '',
        emailStatus: 0,
        pageNumber: this.paginator.pageIndex + 1,
        pageSize: this.paginator.pageSize
      };
  
      this.fetchEmails(paginationObject);
    });
  }

  applyFilter(filterValue: Event) {
    const actualvalue = (filterValue.target as HTMLInputElement).value.trim().toLowerCase();
    const paginationObject: IEmailPagination = {
      searchParam: actualvalue,
      emailStatus: 0,
      pageNumber: this.paginator.pageIndex + 1,
      pageSize: this.paginator.pageSize
    };
    this.fetchEmails(paginationObject);
  }

  onStatusChange(row: any) {
    const editStatusObject: IEditEmailStatus = {
      id: row.id,
      emailStatus: row.emailStatus
    };
    this._emailsservice.EditEmailStatus(editStatusObject).subscribe({
      next: (result) => {
        if (result.success) {
          Swal.fire({
            title: "Success",
            text: "Email status updated successfully",
            icon: "success"
          });
        } else{
          Swal.fire({
            title: "Error",
            text: "Failed to update email status",
            icon: "error"
          });
        }
      },
      error: () => {
        this.GoToError();
      }
    });
  }

  sortByStatus(status:number){
    this.selectedSortStatus = status.toString();
    const actualvalue = (document.getElementById('searchparam') as HTMLInputElement).value.trim().toLowerCase();
    const paginationObject: IEmailPagination = {
      searchParam: actualvalue,
      emailStatus: status,
      pageNumber: this.paginator.pageIndex + 1,
      pageSize: this.paginator.pageSize
    };
    this.fetchEmails(paginationObject);
  }
  
  getStatusColor(statusValue: number): string {
    const status = this.statusOptions.find(option => option.value === statusValue);
    return status ? status.color : 'transparent';
  }
  
  getStatusLabel(statusValue: number): string {
    const status = this.statusOptions.find(option => option.value === statusValue);
    return status ? status.viewValue : '';
  }
  
getSortStatusColor(status: string): string {
  switch (status) {
    case '0': return 'gray';
    case '1': return 'blue';
    case '2': return 'green';
    case '3': return 'red';
    case '4': return 'orange';
    default: return 'gray';
  }
}

getStatusText(status: string): string {
  switch (status) {
    case '0': return 'All Emails';
    case '1': return 'Unread';
    case '2': return 'Solved';
    case '3': return 'Unsolved';
    case '4': return 'Processing';
    default: return 'All Emails';
  }
}

openMessageModal(message: string): void {
  this.selectedMessage = message;
  this.isModalOpen = true;
}

closeMessageModal(): void {
  this.isModalOpen = false;
  this.selectedMessage = '';
}

  GoToError(){
    this.router.navigate(['/error'], { queryParams: { retryUrl: '/emailcrud' } });
  }
}
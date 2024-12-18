import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [NgIf],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}
  retryUrl: string = '/';
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.retryUrl = params['retryUrl'] || '/';
    });
    // this.retry()
  }
  isError = false;
  httpErrorMessage = '';
  errorMessage = "GGGGG"


  fetchData(): void {
    this.isError = false; // Reset error state
    // Simulating an HTTP request
    fakeHttpRequest()
      .then(response => {
        console.log(response); // Handle success
      })
      .catch(error => {
        this.isError = true;
        this.httpErrorMessage = error.message;
      });
  }

  handleRetry(): void {
    this.fetchData();
  }
  retry(): void {
    this.router.navigateByUrl(this.retryUrl);
  }
}

// Mock function to simulate HTTP request
function fakeHttpRequest(): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Failed to load data. Please try again.'));
    }, 2000);
  });
}

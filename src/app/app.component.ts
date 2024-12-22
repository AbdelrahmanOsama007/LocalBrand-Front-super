import { AfterContentInit, AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/general/header/header.component';
import { FooterComponent } from './core/components/general/footer/footer.component';
import { filter } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AdminHeaderComponent } from './core/components/admin/admin-header/admin-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AdminHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterContentInit , OnInit{
  title = 'LocalBrand';
  isErrorRoute = false;
  isLoading = true;
  constructor(private router: Router,@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {    
      this.isErrorRoute = this.router.url.includes('/error');
    });


  }

  ngAfterContentInit() {
   
      setTimeout(() => {
        this.isLoading = false;
      }, 1500); // Delay for fade out
    
  }
}


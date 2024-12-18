import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { httpLoadingInterceptor } from './core/interceptors/http-loading.interceptor';
import { provideToastr } from 'ngx-toastr';
import { tokenInterceptor } from './core/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), provideHttpClient(withFetch()), 
    provideClientHydration() ,provideAnimations(), provideToastr({timeOut: 2000,
      positionClass: 'toast-top-center',
      preventDuplicates: true}),
    BrowserAnimationsModule,
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor,httpLoadingInterceptor,tokenInterceptor])),]
};
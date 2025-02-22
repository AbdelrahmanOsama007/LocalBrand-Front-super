import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
// import 'whatwg-fetch';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

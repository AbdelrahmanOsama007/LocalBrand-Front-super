import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import 'zone.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

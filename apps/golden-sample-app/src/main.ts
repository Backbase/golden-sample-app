import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode, isDevMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import { appConfig } from './app/app.config';
// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

// Use NgModules approach for now
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

// In the future, you can switch to standalone bootstrapping:
// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error('Error bootstrapping app:', err));

if (!isDevMode()) {
  console.log('Production mode enabled');
}

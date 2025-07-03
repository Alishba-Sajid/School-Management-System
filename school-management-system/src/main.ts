import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr'; // ✅ Add this

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    provideAnimations(), // Required for toast animations
    provideToastr()       // ✅ THIS enables ngx-toastr globally
  ]
});

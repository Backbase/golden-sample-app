import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  standalone: false,
})
export class ErrorPageComponent {
  private readonly router: Router = inject(Router);
  public error =
    this.router.getCurrentNavigation()?.extras.state?.['error'] ??
    new HttpErrorResponse({ status: 404 });
}

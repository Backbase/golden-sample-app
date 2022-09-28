import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
})
export class ErrorPageComponent {
  public error =
    this.router.getCurrentNavigation()?.extras.state?.['error'] ??
    new HttpErrorResponse({ status: 404 });

  constructor(private readonly router: Router) {}
}

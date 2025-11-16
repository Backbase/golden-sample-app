import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ErrorCommonStateModule } from '@backbase/ui-ang/common-error-state';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  imports: [CommonModule, ErrorCommonStateModule],
})
export class ErrorPageComponent {
  private readonly router: Router = inject(Router);
  public error =
    this.router.getCurrentNavigation()?.extras.state?.['error'] ??
    new HttpErrorResponse({ status: 404 });
}

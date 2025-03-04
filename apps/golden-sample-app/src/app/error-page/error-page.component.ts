import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorCommonStateModule } from '@backbase/ui-ang/common-error-state';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  standalone: true,
  imports: [ErrorCommonStateModule],
})
export class ErrorPageComponent {
  public error =
    this.router.getCurrentNavigation()?.extras.state?.['error'] ??
    new HttpErrorResponse({ status: 404 });

  constructor(private readonly router: Router) {}
}

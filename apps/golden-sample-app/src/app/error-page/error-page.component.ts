import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
})
export class ErrorPageComponent {
  public message =
    this.router.getCurrentNavigation()?.extras.state?.['message'] ??
    $localize`:Error page message@@error-page.message:Try to reload the page or contact the system administrator.`;

  constructor(private readonly router: Router) {}
}

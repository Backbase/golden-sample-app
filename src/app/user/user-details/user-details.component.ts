import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: [ './user-details.component.sass' ]
})
export class UserDetailsComponent implements OnInit {

  constructor(public oAuthService: OAuthService, public router: Router) {
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.oAuthService.revokeTokenAndLogout().then(() => this.router.navigate(['/']));
  }
}

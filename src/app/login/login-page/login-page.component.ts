import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppAuthService } from '../../services/app-auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private authService: AppAuthService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { login }: { login: string } = this.loginForm.value;
      this.authService.login({
        redirectUri: 'transactions',
        login: login.trim().toLowerCase(),
      });
    }
  }
}

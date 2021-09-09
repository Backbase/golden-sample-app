import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginRoutingModule } from './login-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonModule,
  HeaderModule,
  InputPasswordModule,
  InputTextModule,
  InputValidationMessageModule,
} from '@backbase/ui-ang';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    InputValidationMessageModule,
    ButtonModule,
    InputTextModule,
    InputPasswordModule,
    HeaderModule,
  ],
})
export class LoginModule {}

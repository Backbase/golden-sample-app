import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginRoutingModule } from './login-routing.module';
import { ButtonModule } from '@backbase/ui-ang/button';
import { HeaderModule } from '@backbase/ui-ang/header';
@NgModule({
  declarations: [LoginPageComponent],
  imports: [CommonModule, LoginRoutingModule, ButtonModule, HeaderModule],
})
export class LoginModule {}

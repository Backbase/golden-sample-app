import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserDetailsComponent } from './user-details/user-details.component';

@NgModule({
  declarations: [UserDetailsComponent],
  imports: [CommonModule, UserRoutingModule],
})
export class UserModule {}

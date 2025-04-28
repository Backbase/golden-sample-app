import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedUserContextService } from './shared-user-context.service';
import { SharedUserContextGuard } from './shared-user-context.guard';

@NgModule({
  imports: [CommonModule],
  providers: [SharedUserContextService, SharedUserContextGuard],
})
export class SharedUserContextModule {}

import { DropdownMenuModule } from '@backbase/ui-ang/dropdown-menu';
import { ThemeSwitcherComponent } from './theme-switcher.component';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [DropdownMenuModule, ThemeSwitcherComponent],
  exports: [ThemeSwitcherComponent],
})
export class ThemeSwitcherModule {}

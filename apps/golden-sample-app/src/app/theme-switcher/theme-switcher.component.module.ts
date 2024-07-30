import { DropdownMenuModule } from "@backbase/ui-ang/dropdown-menu";
import { ThemeSwitcherComponent } from "./theme-switcher.component";
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [ ThemeSwitcherComponent ],
  imports: [ DropdownMenuModule ],
  exports: [ ThemeSwitcherComponent ],
})
export class ThemeSwitcherModule {
}

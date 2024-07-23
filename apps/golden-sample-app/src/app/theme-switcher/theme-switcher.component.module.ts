import { DropdownMenuModule } from "@backbase/ui-ang/dropdown-menu";
import { ThemeExporterComponent } from "./theme-switcher.component";
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [ ThemeExporterComponent ],
  imports: [ DropdownMenuModule ],
  exports: [ ThemeExporterComponent ],
})
export class ThemeExporterModule {
}

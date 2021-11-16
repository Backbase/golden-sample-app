import { ModuleWithProviders, NgModule } from '@angular/core';
import { LocalesService, LOCALES_LIST } from './locales.service';
import { LocaleSelectorComponent } from './locale-selector.component';
import { DropdownSingleSelectModule } from '@backbase/ui-ang/dropdown-single-select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LocaleSelectorComponent],
  imports: [DropdownSingleSelectModule, FormsModule, CommonModule],
  exports: [LocaleSelectorComponent],
  providers: [ LocalesService ],
})
export class LocaleSelectorModule {
  static forRoot(config: { locales: Array<string> } ): ModuleWithProviders<LocaleSelectorModule> {
    return {
      ngModule: LocaleSelectorModule,
      providers: [{
        provide: LOCALES_LIST,
        useValue: config.locales,
      }],
    };
  }
}
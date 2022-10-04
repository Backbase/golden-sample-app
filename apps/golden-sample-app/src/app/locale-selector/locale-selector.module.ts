import { ModuleWithProviders, NgModule } from '@angular/core';
import { LOCALES_LIST, LocalesService } from './locales.service';
import { LocaleSelectorComponent } from './locale-selector.component';
import { DropdownMenuModule } from '@backbase/ui-ang/dropdown-menu';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LocaleSelectorComponent],
  imports: [DropdownMenuModule, CommonModule],
  exports: [LocaleSelectorComponent],
  providers: [LocalesService],
})
export class LocaleSelectorModule {
  static forRoot(config: {
    locales: Array<string>;
  }): ModuleWithProviders<LocaleSelectorModule> {
    return {
      ngModule: LocaleSelectorModule,
      providers: [
        {
          provide: LOCALES_LIST,
          useValue: config.locales,
        },
      ],
    };
  }
}

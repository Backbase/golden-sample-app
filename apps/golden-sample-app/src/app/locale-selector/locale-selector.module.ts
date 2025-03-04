import { LOCALES_LIST, LocalesService } from './locales.service';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DropdownMenuModule } from '@backbase/ui-ang/dropdown-menu';
import { LocaleSelectorComponent } from './locale-selector.component';

@NgModule({
  imports: [DropdownMenuModule, CommonModule, LocaleSelectorComponent],
  exports: [LocaleSelectorComponent],
  providers: [LocalesService],
})
export class LocaleSelectorModule {
  static forRoot(config: {
    // eslint-disable-next-line @typescript-eslint/array-type
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

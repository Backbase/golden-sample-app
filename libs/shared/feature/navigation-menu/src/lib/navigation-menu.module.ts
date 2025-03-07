import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { IconModule } from '@backbase/ui-ang/icon';
import { ButtonModule } from '@backbase/ui-ang/button';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { LayoutModule } from '@backbase/ui-ang/layout';

import { DynamicNavigationMenuComponent } from './navigation-menu.component';
import { MenuItemIdPipe } from './menu-item-id.pipe';

@NgModule({
  declarations: [DynamicNavigationMenuComponent, MenuItemIdPipe],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    EntitlementsModule,
    IconModule,
    ButtonModule,
    LayoutModule,
  ],
  exports: [DynamicNavigationMenuComponent],
})
export class DynamicNavigationMenuModule {}

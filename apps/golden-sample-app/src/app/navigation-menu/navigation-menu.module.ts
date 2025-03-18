import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { IconModule } from '@backbase/ui-ang/icon';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicNavigationMenuModule } from '@backbase-gsa/shared/feature/navigation-menu';
import {
  NAVIGATION_MENU_CONFIG,
  NavigationMenuItem,
  composeNavigationTree,
} from '@backbase-gsa/shared/util/app-core';

import { NAVIGATION_GROUPS, NAVIGATION_BUNDLE } from './navigation-menu.config';
import { NavigationMenuComponent } from './navigation-menu.component';

function navigationTreeConfig(): NavigationMenuItem[] {
  return composeNavigationTree(NAVIGATION_BUNDLE, NAVIGATION_GROUPS);
}

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    NgbDropdownModule,
    EntitlementsModule,
    DynamicNavigationMenuModule,
  ],
  exports: [NavigationMenuComponent],
  providers: [
    {
      provide: NAVIGATION_MENU_CONFIG,
      useFactory: navigationTreeConfig,
    },
  ],
  declarations: [NavigationMenuComponent],
})
export class NavigationMenuModule {}

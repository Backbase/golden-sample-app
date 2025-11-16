import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { IconModule } from '@backbase/ui-ang/icon';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicNavigationMenuComponent } from '@backbase/shared/feature/navigation-menu';
import {
  NAVIGATION_MENU_CONFIG,
  NavigationMenuItem,
  composeNavigationTree,
} from '@backbase/shared/util/app-core';

import { NAVIGATION_GROUPS, NAVIGATION_BUNDLE } from './navigation-menu.config';

function navigationTreeConfig(): NavigationMenuItem[] {
  return composeNavigationTree(NAVIGATION_BUNDLE, NAVIGATION_GROUPS);
}

@Component({
  selector: 'app-navigation-menu',
  template: `<bb-dynamic-navigation-menu />`,
  imports: [
    CommonModule,
    IconModule,
    NgbDropdownModule,
    EntitlementsModule,
    DynamicNavigationMenuComponent,
  ],
  providers: [
    {
      provide: NAVIGATION_MENU_CONFIG,
      useFactory: navigationTreeConfig,
    },
  ],
})
export class NavigationMenuComponent {}

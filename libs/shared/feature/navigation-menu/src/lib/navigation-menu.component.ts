import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ConditionsService } from '@backbase/foundation-ang/entitlements';
import { IconModule } from '@backbase/ui-ang/icon';
import { ButtonModule } from '@backbase/ui-ang/button';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { LayoutModule } from '@backbase/ui-ang/layout';
import {
  NAVIGATION_MENU_CONFIG,
  NavigationDynamicComponent,
  NavigationItemIconPosition,
  NavigationMenuGroup,
  NavigationMenuItem,
} from '@backbase/shared/util/app-core';
import { Observable, of } from 'rxjs';
import { MenuItemIdPipe } from './menu-item-id.pipe';

@Component({
  selector: 'bb-dynamic-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    EntitlementsModule,
    IconModule,
    ButtonModule,
    LayoutModule,
    MenuItemIdPipe,
  ],
})
export class DynamicNavigationMenuComponent {
  readonly navigationMenu: NavigationMenuItem[] = inject(
    NAVIGATION_MENU_CONFIG
  );

  private readonly conditionsService = inject(ConditionsService);
  protected readonly NavigationItemIconPosition = NavigationItemIconPosition;

  isNavigationGroup(item: NavigationMenuItem): item is NavigationMenuGroup {
    return 'children' in item;
  }

  isNavigationDynamicComponent(
    item: NavigationMenuItem
  ): item is NavigationDynamicComponent {
    return 'component' in item;
  }

  resolveEntitlements(permissions?: string): Observable<boolean> {
    if (!permissions) {
      return of(true);
    }

    return this.conditionsService.resolveEntitlementsByIdentifier(permissions);
  }
}

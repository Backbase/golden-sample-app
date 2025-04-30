import { Component, inject } from '@angular/core';
import { ConditionsService } from '@backbase/foundation-ang/entitlements';
import {
  NAVIGATION_MENU_CONFIG,
  NavigationDynamicComponent,
  NavigationItemIconPosition,
  NavigationMenuGroup,
  NavigationMenuItem,
} from '@backbase-gsa/shared/util/app-core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'bb-dynamic-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  standalone: false,
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

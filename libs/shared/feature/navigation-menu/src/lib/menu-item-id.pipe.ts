import { Pipe, PipeTransform } from '@angular/core';
import { NavigationMenuItem } from '@backbase/shared/util/app-core';

@Pipe({
  name: 'menuItemId',
  standalone: true,
})
export class MenuItemIdPipe implements PipeTransform {
  transform(menuItem: NavigationMenuItem) {
    return menuItem?.elementId ?? `bb-menu-header-${menuItem.id}`;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { NavigationMenuItem } from '@backbase-gsa/shared/util/app-core';

@Pipe({
  name: 'menuItemId',
  standalone: false,
})
export class MenuItemIdPipe implements PipeTransform {
  transform(menuItem: NavigationMenuItem) {
    return menuItem?.elementId ?? `bb-menu-header-${menuItem.id}`;
  }
}

import { NavigationMenuItem } from '@backbase/shared/util/app-core';
import { MenuItemIdPipe } from './menu-item-id.pipe';

describe(MenuItemIdPipe.name, () => {
  let pipe: MenuItemIdPipe;

  beforeEach(() => {
    pipe = new MenuItemIdPipe();
  });

  it('transforms ', () => {
    const menuItem: Partial<NavigationMenuItem> = {
      id: 'element-id',
    };

    expect(pipe.transform(menuItem as NavigationMenuItem)).toBe(
      `bb-menu-header-${menuItem.id}`
    );
  });

  it('transforms ', () => {
    const menuItem: Partial<NavigationMenuItem> = {
      id: 'id',
      elementId: 'element-id',
    };

    expect(pipe.transform(menuItem as NavigationMenuItem)).toBe(
      menuItem.elementId
    );
  });
});

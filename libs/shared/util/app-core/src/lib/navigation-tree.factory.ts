import { inject } from '@angular/core';
import {
  NavigationDynamicComponent,
  NavigationItem,
  NavigationLink,
  NAVIGATION_MENU_FILTER_FN,
  NavigationMenuFilterFn,
  NavigationMenuItem,
} from './journey-bundle-configuration.model';

export function composeNavigationTree(
  navigationList: Array<NavigationLink | NavigationDynamicComponent>,
  groups: NavigationItem[]
): NavigationMenuItem[] {
  const filterFunction:
    | NavigationMenuFilterFn
    | NavigationMenuFilterFn[]
    | null = inject(NAVIGATION_MENU_FILTER_FN, {
    optional: true,
  });

  const filters = getNormalizedFilters(filterFunction);

  const navTree: Array<NavigationMenuItem> = [];
  const ignoredGroups: Set<string> = new Set();

  for (const menu of navigationList) {
    if (!showMenuItem(menu, filters)) {
      continue;
    }

    if (!menu.group) {
      navTree.push(menu);
      continue;
    }

    if (ignoredGroups.has(menu.group)) {
      continue;
    }

    const group = groups.find((g) => g.id === menu.group);
    if (!group) {
      console.error(`Invalid navigation group: ${menu.group}`);
      continue;
    }

    const groupItem = getGroupItem(navigationList, group, filters);
    if (groupItem) {
      navTree.push(groupItem);
    }

    ignoredGroups.add(menu.group);
  }

  return navTree;
}

function getNormalizedFilters(
  filterFunction: NavigationMenuFilterFn | NavigationMenuFilterFn[] | null
): NavigationMenuFilterFn[] {
  if (!filterFunction) {
    return [];
  } else if (Array.isArray(filterFunction)) {
    return filterFunction;
  }
  return [filterFunction];
}

function showMenuItem(
  menu: NavigationLink | NavigationDynamicComponent,
  filters: NavigationMenuFilterFn[]
): boolean {
  return filters.every((f) => f(menu));
}

function getGroupItem(
  navigationList: Array<NavigationLink | NavigationDynamicComponent>,
  group: NavigationItem,
  filters: NavigationMenuFilterFn[]
): NavigationMenuItem | null {
  const children = navigationList
    .filter((n) => n.group === group.id)
    .filter((n) => showMenuItem(n, filters));

  if (children.length > 0) {
    let permissions: string | null = null;

    if (!hasChildWithoutPermissions(children)) {
      permissions = combineChildrenPermissions(children);
    }

    const groupItem: NavigationMenuItem = {
      ...group,
      children,
    };

    if (permissions) {
      groupItem.permissions = permissions;
    }

    return groupItem;
  }

  return null;
}

function combineChildrenPermissions(
  items: Array<NavigationLink | NavigationDynamicComponent>
): string {
  return items
    .map((i) => i.permissions)
    .filter((i) => i)
    .sort(
      (a, b) =>
        String(b).split(' AND ').length - String(a).split(' AND ').length
    )
    .join(' OR ');
}

function hasChildWithoutPermissions(
  items: Array<NavigationLink | NavigationDynamicComponent>
): boolean {
  return items.some((i) => i.permissions == null);
}

/**
 * Introduced for the 2024.10 BC release
 */
import { InjectionToken } from '@angular/core';

export enum NavigationItemIconPosition {
  START,
  END,
}

export interface NavigationItemIcon {
  name: string;
  position: NavigationItemIconPosition;
}

export interface NavigationItem {
  /**
   * Used by the TVP configuration to reference the navigation item,
   * it maps to the keys stored in remote config
   */
  id: string;
  /**
   * The displayed name of the navigation item
   */
  name: string;
  /**
   * If the navigation item is the children of a group, the id of the group should
   * be indicated here otherwise null if it is displayed as a root item
   */
  group: string | null;
  /**
   *
   */
  icon?: NavigationItemIcon;
  /**
   * Used for a group that shows the icon in large screens and the name in small screens
   */
  minifiable?: boolean;
  /**
   * HTMLElement id, used to identify the element for e2e tests, a11y...
   */
  elementId?: string;
}

export interface NavigationLink extends NavigationItem {
  /**
   * The route path that it should be navigated to once clicked
   */
  route: string;
  /**
   * Entitlements permissions definition
   */
  permissions?: string;
}

export interface NavigationDynamicComponent extends NavigationItem {
  /**
   * Component with dynamic import to be rendered:
   * import('@someLibrary/someComponent').then((c) => c.SomeComponent)
   */
  component: Promise<unknown> | undefined;
  /**
   * Entitlements permissions definition
   */
  permissions?: string;
}

export interface NavigationMenuGroup extends NavigationItem {
  children: Array<NavigationLink | NavigationDynamicComponent>;
  permissions?: string;
}

export type NavigationMenuItem = NavigationMenuGroup | NavigationLink | NavigationDynamicComponent;

export const NAVIGATION_MENU_CONFIG = new InjectionToken<NavigationMenuItem[]>('NavigationMenu::NavigationMenuConfig');

/**
 * Function to control items visibility on a navigation tree
 */
export type NavigationMenuFilterFn = (menu: NavigationLink | NavigationDynamicComponent) => boolean;

export const NAVIGATION_MENU_FILTER_FN = new InjectionToken<NavigationMenuFilterFn[]>(
  'NavigationMenu::NavigationMenuFilterFn',
);

export interface NavigationPlanMapper {
  [bundle: string]: Array<NavigationLink | NavigationDynamicComponent>;
  default: Array<NavigationLink | NavigationDynamicComponent>;
}

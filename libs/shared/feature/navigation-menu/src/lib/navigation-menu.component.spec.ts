import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { faker } from '@faker-js/faker';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { ConditionsService } from '@backbase/foundation-ang/entitlements';

import {
  NAVIGATION_MENU_CONFIG,
  NavigationMenuItem,
} from '@backbase/shared/util/app-core';

import { MenuItemIdPipe } from './menu-item-id.pipe';
import { DynamicNavigationMenuComponent } from './navigation-menu.component';

@Component({ selector: 'bb-dynamic' })
class StubDynamicComponent {}

describe('DynamicNavigationMenuComponent', () => {
  let componentFixture: ComponentFixture<DynamicNavigationMenuComponent>;
  let component: DynamicNavigationMenuComponent;
  let dropdownItemId: string;
  let navigationMenu: NavigationMenuItem[];

  beforeEach(() => {
    dropdownItemId = faker.string.alpha();

    navigationMenu = [
      {
        permissions: faker.string.alpha(),
        name: faker.string.alpha(),
        id: faker.string.uuid(),
        group: null,
        route: faker.system.directoryPath(),
      },
      {
        name: faker.string.alpha(),
        id: dropdownItemId,
        group: null,
        children: faker.helpers.multiple(
          () => {
            return {
              id: faker.string.uuid(),
              name: faker.string.alpha(),
              group: dropdownItemId,
              route: faker.system.directoryPath(),
            };
          },
          { count: 3 }
        ),
      },
      {
        id: faker.string.alpha(),
        name: faker.string.alpha(),
        group: dropdownItemId,
        component: new Promise<StubDynamicComponent>((resolve) =>
          resolve(new StubDynamicComponent())
        ),
      },
    ];

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [NgbDropdownModule, RouterModule.forRoot([])],
      declarations: [DynamicNavigationMenuComponent, MenuItemIdPipe],
      providers: [
        {
          provide: NAVIGATION_MENU_CONFIG,
          useValue: navigationMenu,
        },
        {
          provide: ConditionsService,
          useValue: {
            resolveEntitlementsByIdentifier: jest.fn(() => of(true)),
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    componentFixture = TestBed.createComponent(DynamicNavigationMenuComponent);
    component = componentFixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create link item on navigation menu', () => {
    const componentLinkItem = component.navigationMenu[0];
    const linkItem = navigationMenu[0];
    expect(componentLinkItem).toBeDefined();
    expect(componentLinkItem).toBe(linkItem);
  });

  it('should create dynamic component item on navigation menu', () => {
    const componentLinkItem = component.navigationMenu[0];
    const linkItem = navigationMenu[0];

    expect(componentLinkItem).toBeDefined();
    expect(componentLinkItem).toBe(linkItem);
  });

  it('should create dropdown item on navigation menu', () => {
    const dropdownItems = (navigationMenu[1] as any).children;
    const componentDropdownItems = (component.navigationMenu[1] as any)
      .children;

    expect(componentDropdownItems).toBeDefined();
    expect(componentDropdownItems).toBe(dropdownItems);
  });
});

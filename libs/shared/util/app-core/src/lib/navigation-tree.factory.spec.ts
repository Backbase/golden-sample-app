import { TestBed } from '@angular/core/testing';
import {
  NavigationDynamicComponent,
  NavigationItem,
  NavigationLink,
  NAVIGATION_MENU_FILTER_FN,
  NavigationMenuItem,
  NAVIGATION_MENU_CONFIG,
} from './journey-bundle-configuration.model';
import { composeNavigationTree } from './navigation-tree.factory';
import { Provider } from '@angular/core';

let navTree: NavigationMenuItem[];

const accountsCardsGroup: NavigationItem = {
  id: 'id-accounts-cards-group',
  name: 'Accounts',
  group: null,
};

const moveMoneyGroup: NavigationItem = {
  id: 'id-move-money',
  name: 'Move Money',
  group: null,
};

const dashboardNavItem: NavigationLink = {
  id: 'id-dashboard',
  name: 'Dashboard',
  route: '/dashboard',
  group: null,
  permissions: 'dashboard-permissions',
};

const accountsNavItem: NavigationLink = {
  id: 'id-accounts',
  name: 'Accounts',
  route: '/accounts',
  group: accountsCardsGroup.id,
  permissions: 'accounts-permissions',
};

const cardsNavItem: NavigationLink = {
  id: 'id-cards',
  name: 'Cards',
  route: '/cards',
  group: accountsCardsGroup.id,
  permissions: 'cards-permissions',
};

const loansNavItem: NavigationLink = {
  id: 'id-loans',
  name: 'Loans',
  route: '/loans',
  group: accountsCardsGroup.id,
  permissions: 'loans-permissions',
};

const cashFlowNavItem: NavigationLink = {
  id: 'id-cash-flow',
  name: 'Cash Flow',
  route: '/cash-flow',
  group: null,
  permissions: 'cash-flow-permissions',
};

const transfersNavItem: NavigationLink = {
  id: 'id-transfers',
  name: 'Transfers',
  route: '/transfers',
  group: moveMoneyGroup.id,
  permissions: 'transfers-permissions',
};

const stopChecksNavItem: NavigationLink = {
  id: 'id-stop-checks',
  name: 'Stop Checks',
  route: '/stop-checks',
  group: moveMoneyGroup.id,
  permissions: 'stop-checks-permissions',
};

const extraNavigationA: NavigationLink = {
  id: 'id-extra-navigation-a',
  name: 'Extra Navigation A',
  route: '/navigation-a',
  group: null,
  permissions: 'navigation-permissions',
};

const extraNavigationB: NavigationLink = {
  id: 'id-extra-navigation-b',
  name: 'Extra Navigation B',
  route: '/navigation-b',
  group: null,
  permissions: 'navigation-permissions',
};

const navigationList: Array<NavigationLink | NavigationDynamicComponent> = [
  dashboardNavItem,
  accountsNavItem,
  cashFlowNavItem,
  transfersNavItem,
  cardsNavItem,
  loansNavItem,
  stopChecksNavItem,
];

const navigationGroups = [accountsCardsGroup, moveMoneyGroup];

describe('NavigationTreeFactory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [getNavigationFactoryProvider(navigationList, navigationGroups)],
    });

    navTree = TestBed.inject(NAVIGATION_MENU_CONFIG);
  });

  it('should return a tree structure for navigation', () => {
    expect(navTree).toHaveLength(4);
    expect(navTree[1].name).toBe(accountsCardsGroup.name);
    expect(navTree[2].name).toBe(cashFlowNavItem.name);
    expect(navTree[3].name).toBe(moveMoneyGroup.name);
    expect((navTree[1] as any).children).toHaveLength(3);
    expect((navTree[3] as any).children).toHaveLength(2);
  });
});

describe('NavigationTreeFactory', () => {
  let consoleMock: jest.SpyInstance;

  beforeEach(() => {
    consoleMock = jest.spyOn(console, 'error').mockImplementation();
    const navList: NavigationLink[] = [
      {
        id: 'id-navigation',
        name: 'Navigation',
        route: '/navigation',
        group: 'id-nonexistent-group',
        permissions: 'navigation-permissions',
      },
    ];

    TestBed.configureTestingModule({
      providers: [getNavigationFactoryProvider(navList, navigationGroups)],
    });

    navTree = TestBed.inject(NAVIGATION_MENU_CONFIG);
  });

  it('should skip elements with wrong group id', () => {
    expect(navTree).toHaveLength(0);
    expect(consoleMock).toHaveBeenCalled();
  });
});

describe('NavigationTreeFactory', () => {
  beforeEach(() => {
    const navList = [...navigationList, extraNavigationA, extraNavigationB];

    TestBed.configureTestingModule({
      providers: [
        getNavigationFactoryProvider(navList, navigationGroups),
        getFilterProvider(extraNavigationA.id, true),
        getFilterProvider(extraNavigationB.id, true),
      ],
    });

    navTree = TestBed.inject(NAVIGATION_MENU_CONFIG);
  });

  it('should filter elements when multiple filtering functions are provided', () => {
    expect(navTree.find((n) => n.name === extraNavigationA.name)).toBeUndefined();
    expect(navTree.find((n) => n.name === extraNavigationB.name)).toBeUndefined();
  });
});

describe('NavigationTreeFactory', () => {
  beforeEach(() => {
    const navList = [...navigationList, extraNavigationA, extraNavigationB];
    TestBed.configureTestingModule({
      providers: [getNavigationFactoryProvider(navList, navigationGroups), getFilterProvider(extraNavigationA.id)],
    });

    navTree = TestBed.inject(NAVIGATION_MENU_CONFIG);
  });

  it('should filter elements when a single filtering function is provided', () => {
    expect(navTree.find((n) => n.name === extraNavigationA.name)).toBeUndefined();
    expect(navTree.find((n) => n.name === extraNavigationB.name)).toBeDefined();
  });
});

describe('NavigationTreeFactory', () => {
  beforeEach(() => {
    const navList = [
      ...navigationList,
      {
        ...extraNavigationA,
        group: accountsCardsGroup.id,
      },
    ];

    TestBed.configureTestingModule({
      providers: [getNavigationFactoryProvider(navList, navigationGroups), getFilterProvider(extraNavigationA.id)],
    });

    navTree = TestBed.inject(NAVIGATION_MENU_CONFIG);
  });

  it('should filter elements that belong to a group', () => {
    expect(navTree.flatMap((n) => (n as any)?.children).find((i) => i?.name === extraNavigationA.name)).toBeUndefined();
  });
});

function getFilterProvider(itemId: string, multi?: boolean): Provider {
  return {
    provide: NAVIGATION_MENU_FILTER_FN,
    useValue: (menu: NavigationLink | NavigationDynamicComponent) => {
      if (menu.id === itemId) return false;
      return true;
    },
    multi,
  };
}

function getNavigationFactoryProvider(
  navigationList: Array<NavigationLink | NavigationDynamicComponent>,
  navigationGroups: NavigationItem[],
): Provider {
  return {
    provide: NAVIGATION_MENU_CONFIG,
    useFactory: () => {
      return composeNavigationTree(navigationList, navigationGroups);
    },
  };
}

import { Component, OnInit } from '@angular/core';
import {Tab} from '../../models/tab.model';
import {ActivatedRoute, Route} from '@angular/router';

// eslint-disable-next-line no-var
declare var $localize: any;

const createTabObject = (title: string | undefined, route: string | undefined, index: number): Tab => ({
  title: title ?? $localize`:Default tab name|@@positive-pay-journey.tabs.default-name:Tab`,
  route: route ?? (index + 1).toString(),
});

@Component({
  selector: 'bb-positive-pay-checks-container',
  templateUrl: './positive-pay-checks-container.component.html'
})
export class PositivePayChecksContainerComponent implements OnInit {

  /**
   * Collection of Tabs to be rendered according to the journey layout and routing.
   */
  public tabs: Tab[] = [];

  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const routeConfig = this.route.routeConfig;
    if (routeConfig && routeConfig.children) {
      this.createTabs(routeConfig);
    }
  }

  private createTabs(routeConfig: Route) {
    this.tabs = (routeConfig.children || [])
      .filter((routeItem) => routeItem.path)
      .map((routeItem, index) => createTabObject(routeItem.data?.title, routeItem.path, index));
  }

}

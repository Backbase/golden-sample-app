import { Component, Optional } from '@angular/core';
import { LayoutService } from '@backbase/ui-ang/layout';
import { triplets } from './services/entitlementsTriplets';
import { OAuthService } from 'angular-oauth2-oidc';
import {
  LogoutTrackerEvent,
  Tracker,
} from '@backbase/foundation-ang/observability';
import { environment } from '../environments/environment';

export interface Translations {
  [key: string]: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  triplets = triplets;
  isAuthenticated = false;

  public readonly translations: Translations = {
    'move-focus-to-beginning-of-content': $localize`:Move focus to beginning of content - 'skip to content'|This string is
        used as the aria-label for a button that moves the focus to the
        beginning of the content. It is presented to the user as an
        accessibility feature to quickly navigate to the main content section.
        This aria-label is located in the topbar area of the
        layout.@@move-focus-to-beginning-of-content:skip to content`,
    'skip-to-content': $localize`:Skip to content - 'Skip to content'|This string is used as the text for
        a button that moves the focus to the beginning of the content. It is
        presented to the user as an accessibility feature to quickly navigate to
        the main content section. This text is located in the topbar area of the
        layout.@@skip-to-content:Skip to content`,
    'bb-layout.sidebar_toggler': $localize`:Sidebar Toggler - 'Toggle sidebar'|This string is used as the aria-label
        for a button that toggles the sidebar state. It is presented to the user
        as an accessibility feature to indicate the button's function. This
        aria-label is located in the topbar area of the
        layout.@@bb-layout.sidebar_toggler:Toggle sidebar`,
    'main.transfer.link.text': $localize`:Make transfer link - 'Make transfer'|This string is used as the
              text for a link that navigates to the transfer page. It is
              presented to the user as a navigation item in the horizontal
              navigation bar. This text is located in the navigation items
              section of the layout.@@main.transfer.link.text:Make transfer`,
    'main.transactions.link.text': $localize`:Transactions list link - 'Transactions List'|This string is used
              as the text for a link that navigates to the transactions list
              page. It is presented to the user as a navigation item in the
              horizontal navigation bar. This text is located in the navigation
              items section of the layout.@@main.transactions.link.text:Transactions List`,
    'main.positive-pay.link.text': $localize`:Positive pay link - 'Positive Pay'|This string is used as the text
              for a link that navigates to the Positive Pay page. It is
              presented to the user as a navigation item in the horizontal
              navigation bar. This text is located in the navigation items
              section of the layout.@@main.positive-pay.link.text:Positive Pay`,
    'main.ach-positive-pay.link.text': $localize`:Ach Positive pay link - 'ACH Positive Pay'|This string is used as
              the text for a link that navigates to the ACH Positive Pay page.
              It is presented to the user as a navigation item in the horizontal
              navigation bar. This text is located in the navigation items
              section of the layout.@@main.ach-positive-pay.link.text:ACH Positive Pay`,
    'main.make-a-payment.link.text': $localize`:Make a Payment Link - 'Make internal payment'|This string is used
              as the text for a link that navigates to the internal payment
              page. It is presented to the user as a navigation item in the
              horizontal navigation bar. This text is located in the navigation
              items section of the layout.@@main.make-a-payment.link.text:Make internal payment`,
    'main.entitlements-test-no-grouping.text': $localize`:Entitlements Test No Grouping - 'Entitlements Test No Groups'|This string is used
              as the text for a link that navigates to the entitlements test
              page. It is presented to the user as a navigation item in the
              horizontal navigation bar. This text is located in the navigation
              items section of the layout.@@main.entitlements-test-no-grouping.text:Ents. Test No Groups`,
    'main.entitlements-test-grouping.text': $localize`:Entitlements Test Grouping - 'Entitlements Test Groups'|This string is used
              as the text for a link that navigates to the entitlements test
              page. It is presented to the user as a navigation item in the
              horizontal navigation bar. This text is located in the navigation
              items section of the layout.@@main.entitlements-test-grouping.text:Ents. Test Groups`,
    'main.entitlements-test-nested-groups.text': $localize`:Entitlements Test Nested Groups - 'Entitlements Test Nested Groups'|This string is used
              as the text for a link that navigates to the entitlements test
              page. It is presented to the user as a navigation item in the
              horizontal navigation bar. This text is located in the navigation
              items section of the layout.@@main.entitlements-test-nested-groups.text:Ents. Test Nested Groups`,
    'main.entitlements-test-using-not-operators-on-groups.text': $localize`:Entitlements Test Using Not Operators On Groups - 'Entitlements Test - Not Operators On Groups'|This string is used
              as the text for a link that navigates to the entitlements test
              page. It is presented to the user as a navigation item in the
              horizontal navigation bar. This text is located in the navigation
              items section of the layout.@@main.entitlements-test-using-not-operators-on-groups.text:Ents. Test - Not Operators On Groups`,
    'main.entitlements-test-using-multiple-not-operators-on-groups.text': $localize`:Entitlements Test Using Multiple Not Operators On Groups - 'Entitlements Test - Multiple Not Operators On Groups'|This string is used
              as the text for a link that navigates to the entitlements test
              page. It is presented to the user as a navigation item in the
              horizontal navigation bar. This text is located in the navigation
              items section of the layout.@@main.entitlements-test-using-multiple-not-operators-on-groups.text:Ents. Test - Multiple Not Operators On Groups`,
  };
  constructor(
    private oAuthService: OAuthService,
    public layoutService: LayoutService,
    @Optional() private readonly tracker?: Tracker
  ) {
    this.isAuthenticated =
      environment.mockEnabled ?? oAuthService.hasValidAccessToken();
  }

  logout(): void {
    this.tracker?.publish(new LogoutTrackerEvent());
    this.oAuthService.logOut(true);
  }

  focusMainContainer(event: MouseEvent) {
    const element = event.view?.window.document.querySelector(
      '[role="main"]'
    ) as HTMLElement | undefined;
    element?.focus();
  }
}

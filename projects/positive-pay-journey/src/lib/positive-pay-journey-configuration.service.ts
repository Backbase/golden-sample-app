import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { PositivePayJourneyConfiguration } from './models/positive-pay-journey-configuration.model';
import { defaultArrangementSubscriptionsConfig } from './constants/accounts.constant';
import { PaginationType } from './models/pagination-type.model';
import { combineLatest, Observable, of } from 'rxjs';
import { ArrangementSubscriptions } from './models/arrangement-subscriptions.model';
import { map } from 'rxjs/operators';

/**
 * Injection token to override the journey configurations.
 * Application developer can override the journey configuration by providing their value for the token.
 *
 * @usageNotes
 *
 * ### Usage
 *
 * ```typescript
 * import { PositivePayConfigurationToken } from '@backbase/positive-pay-journey';
 *
 * @NgModule({
 *  providers: [{ provide: PositivePayConfigurationToken, useValue: { headingType: 'h2'} }]
 * })
 * export class AppModule {}
 *
 * ```
 */
export const POSITIVE_PAY_JOURNEY_CONFIGURATION_TOKEN = new InjectionToken<Partial<PositivePayJourneyConfiguration>>(
  'PositivePayJourneyConfiguration injection token',
);

const defaultConfiguration: Partial<PositivePayJourneyConfiguration> = {
  headingType: 'h1',
  notificationDismissTimeout: 5000,
  paginationType: PaginationType.default,
  pageSize: 10,
  maxNavPages: 3,
  arrangementSubscriptions: defaultArrangementSubscriptionsConfig,
} as const;

/**
 * Configuration service for the positive pay journey.
 *
 * @remarks
 * This will allow the application developer to override the configurations specific to this journey
 */
@Injectable()
export class PositivePayJourneyConfigurationService {
  /** Property containing configuration for the journey */
  private staticConfig: PositivePayJourneyConfiguration;

  constructor(
    @Optional()
    @Inject(POSITIVE_PAY_JOURNEY_CONFIGURATION_TOKEN)
    staticConfigOverrides: PositivePayJourneyConfiguration,
  ) {
    this.staticConfig = { ...defaultConfiguration, ...staticConfigOverrides };
  }

  get journeyConfiguration$(): Observable<PositivePayJourneyConfiguration> {
    return combineLatest([
      this.headingType$,
      this.notificationDismissTimeout$,
      this.paginationType$,
      this.pageSize$,
      this.maxNavPages$,
      this.arrangementSubscriptions$,
    ]).pipe(
      map(
        ([
          headingType,
          notificationDismissTimeout,
          paginationType,
          pageSize,
          maxNavPages,
          arrangementSubscriptions,
        ]) => ({
          headingType,
          notificationDismissTimeout,
          paginationType,
          pageSize,
          maxNavPages,
          arrangementSubscriptions,
        }),
      ),
    );
  }

  /**
   * Type of heading element from header area of the journey
   *
   * @returns An observable of string
   */
  private get headingType$(): Observable<string> {
    return of(this.staticConfig.headingType);
  }

  /**
   * Notification dismiss time in seconds (defaults to 5)
   *
   * @returns An observable of number
   */
  private get notificationDismissTimeout$(): Observable<number> {
    return of(this.staticConfig.notificationDismissTimeout);
  }

  /**
   * PaginationType will decide whether the user will see load more or page number style pagination
   *
   * @returns An observable of PaginationType enum
   */
  private get paginationType$(): Observable<PaginationType> {
    return of(this.staticConfig.paginationType);
  }

  /**
   * Number of items to be fetched in single request
   *
   * @returns An observable of number
   */
  private get pageSize$(): Observable<number> {
    return of(this.staticConfig.pageSize);
  }

  /**
   * Maximum number of page links to display
   *
   * @returns An observable of number
   */
  private get maxNavPages$(): Observable<number> {
    return of(this.staticConfig.maxNavPages);
  }

  /**
   * Positive pay subscriptions used in arrangements
   *
   * @returns an observable of ArrangementSubscriptions
   */
  private get arrangementSubscriptions$(): Observable<ArrangementSubscriptions> {
    return of(this.staticConfig.arrangementSubscriptions);
  }
}

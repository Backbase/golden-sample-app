import { ModuleWithProviders, NgModule } from '@angular/core';
import { achPositivePayDefaultRoutes } from './ach-positive-pay-journey.routes';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { Routes, provideRoutes } from '@angular/router';

import {
  ACH_POSITIVE_PAY_JOURNEY_TRANSLATIONS,
  AchPositivePayJourneyTranslations,
  ACH_POSITIVE_PAY_NEW_RULE_TRANSLATIONS,
  AchPositivePayNewRuleTranslations,
} from '@backbase-gsa/ach-positive-pay-journey/internal/feature';

import {
  ACH_POSITIVE_PAY_RULE_FORM_TRANSLATIONS,
  AchPositivePayRuleFormTranslations,
  ACH_POSITIVE_PAY_RULES_TRANSLATIONS,
  AchPositivePayRulesTranslations,
} from '@backbase-gsa/ach-positive-pay-journey/internal/ui';

export {
  ACH_POSITIVE_PAY_JOURNEY_TRANSLATIONS,
  AchPositivePayJourneyTranslations,
  ACH_POSITIVE_PAY_NEW_RULE_TRANSLATIONS,
  AchPositivePayNewRuleTranslations,
  ACH_POSITIVE_PAY_RULE_FORM_TRANSLATIONS,
  AchPositivePayRuleFormTranslations,
  ACH_POSITIVE_PAY_RULES_TRANSLATIONS,
  AchPositivePayRulesTranslations,
};

@NgModule({
  imports: [EntitlementsModule],
})
export class AchPositivePayJourneyShellModule {
  static forRoot(
    data: { [key: string]: unknown; routes: Routes } = {
      routes: achPositivePayDefaultRoutes,
    }
  ): ModuleWithProviders<AchPositivePayJourneyShellModule> {
    return {
      ngModule: AchPositivePayJourneyShellModule,
      providers: [provideRoutes(data.routes)],
    };
  }
}

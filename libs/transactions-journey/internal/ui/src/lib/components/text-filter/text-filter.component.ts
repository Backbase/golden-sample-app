import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import '@angular/localize/init';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from '@backbase/ui-ang/input-text';
import {
  TRANSACTIONS_JOURNEY_TEXT_FILTER_TRANSLATIONS,
  transactionsJourneyTextFilterTranslations,
  TransactionsJourneyTextFilterTranslations,
} from '../../../translations-catalog';

@Component({
  selector: 'bb-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.scss'],
  imports: [CommonModule, FormsModule, InputTextModule, TextFilterComponent],
  standalone: true,
})
export class TextFilterComponent {
  @Output() textChange = new EventEmitter<string>();
  @Input() text: string | null = '';

  private readonly defaultTranslations: TransactionsJourneyTextFilterTranslations =
    transactionsJourneyTextFilterTranslations;
  public readonly translations: TransactionsJourneyTextFilterTranslations;

  constructor(
    @Inject(TRANSACTIONS_JOURNEY_TEXT_FILTER_TRANSLATIONS)
    private readonly overridingTranslations: Partial<TransactionsJourneyTextFilterTranslations>
  ) {
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
    this.translations = {
      ...this.defaultTranslations,
      ...Object.fromEntries(
        Object.entries(this.overridingTranslations).map(
          ([key, value]) => [key, value ?? this.defaultTranslations[key]]
        )
      ),
    };
  }
}

import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import '@angular/localize/init';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from '@backbase/ui-ang/input-text';
import {
  TRANSACTIONS_JOURNEY_TEXT_FILTER_TRANSLATIONS,
  TransactionsJourneyTextFilterTranslations,
  transactionsJourneyTextFilterTranslations as defaultTranslations,
} from '../../../translations-catalog';
import { TranslationsBase } from '@backbase-gsa/shared-translations';

@Component({
  selector: 'bb-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.scss'],
  imports: [CommonModule, FormsModule, InputTextModule, TextFilterComponent],
  standalone: true,
})
export class TextFilterComponent extends TranslationsBase<TransactionsJourneyTextFilterTranslations> {
  @Output() textChange = new EventEmitter<string>();
  @Input() text: string | null = '';

  constructor(
    @Inject(TRANSACTIONS_JOURNEY_TEXT_FILTER_TRANSLATIONS)
    private readonly _translations: Partial<TransactionsJourneyTextFilterTranslations>
  ) {
    super(defaultTranslations, _translations);
  }
}

import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from '@backbase/ui-ang/input-text';
import { TRANSACTIONS_JOURNEY_TEXT_FILTER_TRANSLATIONS } from './translations.provider';

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

  overridingTranslations = Inject(
    TRANSACTIONS_JOURNEY_TEXT_FILTER_TRANSLATIONS
  );

  translations = {
    'transaction.form.filter.aria-label':
      this.overridingTranslations['transaction.form.filter.aria-label'] ||
      $localize`:Filter transaction aria label - 'filter transactions'|This string is used as
    the aria-label for the filter transactions input field. It is presented to
    the user as an accessibility feature to describe the purpose of the input
    field. This aria-label is located in the text filter
    component.@@transaction.form.filter.aria-label:filter transactions`,
    'transaction.form.filter.placeholder':
      this.overridingTranslations['transaction.form.filter.placeholder'] ||
      $localize`:Filter transaction placeholder - 'filter transactions by type'|This string
    is used as the placeholder text for the filter transactions input field. It
    is presented to the user to indicate that they can filter transactions by
    type. This placeholder is located in the text filter
    component.@@transaction.form.filter.placeholder:filter transactions by type`,
  };
}

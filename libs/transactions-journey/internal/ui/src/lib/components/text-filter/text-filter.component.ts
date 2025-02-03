import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from '@backbase/ui-ang/input-text';
import {
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
  @Input()
  public readonly translations: TransactionsJourneyTextFilterTranslations =
    transactionsJourneyTextFilterTranslations;
}


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputTextModule } from '@backbase/ui-ang/input-text';

@Component({
  selector: 'bb-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.scss'],
  imports: [CommonModule,FormsModule, InputTextModule, TextFilterComponent],
  standalone: true
})
export class TextFilterComponent {
  @Output() textChange: EventEmitter<string> = new EventEmitter();
  @Input() text: string | null = '';
}

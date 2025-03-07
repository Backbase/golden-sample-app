import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from '@backbase/ui-ang/input-text';

@Component({
  selector: 'bb-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule],
})
export class TextFilterComponent {
  @Output() textChange = new EventEmitter<string>();
  @Input() text: string | null = '';
}

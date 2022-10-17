import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'bb-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.scss'],
})
export class TextFilterComponent {
  @Output() textChange: EventEmitter<string> = new EventEmitter();
  @Input() text: string | null = '';
}

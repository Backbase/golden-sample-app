import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'bb-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.css']
})
export class TextFilterComponent {
  @Output() textChange: EventEmitter<string> = new EventEmitter();
  text = '';
}

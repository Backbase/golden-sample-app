import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InputTextModule } from '@backbase/ui-ang/input-text';

@Component({
  selector: 'bb-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.scss'],
<<<<<<< Updated upstream
  imports: [FormsModule, InputTextModule],
=======
  imports: [FormsModule, InputTextModule, TextFilterComponent],
>>>>>>> Stashed changes
})
export class TextFilterComponent {
  @Output() textChange = new EventEmitter<string>();
  @Input() text: string | null = '';
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transfer } from '@backbase-gsa/transfer-journey-util';
import { ButtonModule } from '@backbase/ui-ang/button';

@Component({
  selector: 'bb-make-transfer-summary',
  templateUrl: 'make-transfer-summary.component.html',
  imports: [ButtonModule],
  standalone: true,
})
export class MakeTransferSummaryComponent {
  @Input() transfer: Transfer | undefined;
  @Output() submitTransfer = new EventEmitter<void>();
  @Output() closeTransfer = new EventEmitter<void>();

  submit(): void {
    this.submitTransfer.emit();
  }

  close(): void {
    this.closeTransfer.emit();
  }
}

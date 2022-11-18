import {
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
} from '@angular/core';
import { Transfer } from '../../model/Account';
import { TransferSubmitEvent } from '../../model/tracker-events';
import { Tracker } from '@backbase/foundation-ang/observability';
@Component({
  selector: 'bb-make-transfer-summary',
  templateUrl: 'make-transfer-summary.component.html',
})
export class MakeTransferSummaryComponent {
  @Input() transfer: Transfer | undefined;
  @Output() submitTransfer = new EventEmitter<void>();
  @Output() closeTransfer = new EventEmitter<void>();

  constructor(@Optional() private readonly tracker?: Tracker) {}

  submit(): void {
    this.tracker?.publish(new TransferSubmitEvent({}));
    this.submitTransfer.emit();
  }

  close(): void {
    this.closeTransfer.emit();
  }
}

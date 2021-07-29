import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Transfer } from "../model/Account";

@Component({
  selector: 'bb-make-transfer-summary',
  templateUrl: 'make-transfer-summary.component.html'
})
export class MakeTransferSummaryComponent {
  @Input() transfer: Transfer | undefined;
  @Output() submitTransfer = new EventEmitter<void>();
  @Output() closeTransfer = new EventEmitter<void>();

  submit() {
    this.submitTransfer.emit();
  }

  close() {
    this.closeTransfer.emit();
  }
}

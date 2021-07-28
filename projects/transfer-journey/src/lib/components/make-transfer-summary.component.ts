import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Transfer } from "../model/Account";

@Component({
  selector: 'bb-make-transfer-summary',
  templateUrl: 'make-transfer-summary.component.html'
})
export class MakeTransferSummaryComponent {
  @Input() transfer: Transfer | undefined;
  @Output() confirmTransfer = new EventEmitter<void>();

  @Input() showSummary = false;
  @Output() showSummaryChange = new EventEmitter<boolean>();
  showSuccessMessage = false;


  closeSummary() {
    if (this.showSuccessMessage) {
      this.confirmTransfer.emit();
    }
    this.showSummary = false;
    this.showSuccessMessage = false;
    this.showSummaryChange.emit(false);
  }

  finishTransfer() {
      this.showSuccessMessage = true;
  }
}

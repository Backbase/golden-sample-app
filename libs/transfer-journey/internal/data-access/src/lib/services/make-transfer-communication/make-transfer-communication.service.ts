import { Transfer } from '@backbase/transfer-journey/internal/shared-data';

export abstract class MakeTransferCommunicationService {
  abstract makeTransfer(transfer: Transfer): void;
}

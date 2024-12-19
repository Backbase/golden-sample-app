import { Transfer } from '@backbase-gsa/transfer-journey/internal/shared-data';

export abstract class MakeTransferCommunicationService {
  abstract makeTransfer(transfer: Transfer): void;
}

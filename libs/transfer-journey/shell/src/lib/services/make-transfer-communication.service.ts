import { Transfer } from '@backbase-gsa/transfer-journey-util';

export abstract class MakeTransferCommunicationService {
  abstract makeTransfer(transfer: Transfer): void;
}

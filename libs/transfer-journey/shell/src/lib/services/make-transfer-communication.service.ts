import { Transfer } from '@backbase-gsa/internal-transfer-util';

export abstract class MakeTransferCommunicationService {
  abstract makeTransfer(transfer: Transfer): void;
}

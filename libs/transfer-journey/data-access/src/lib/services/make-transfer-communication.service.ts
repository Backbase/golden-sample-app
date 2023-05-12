import { Transfer } from '@backbase-gsa/internal-transfer-shared-data';

export abstract class MakeTransferCommunicationService {
  abstract makeTransfer(transfer: Transfer): void;
}

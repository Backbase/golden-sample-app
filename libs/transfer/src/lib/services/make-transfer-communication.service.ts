import { Transfer } from '../model/Account';

export abstract class MakeTransferCommunicationService {
  abstract makeTransfer(transfer: Transfer): void;
}

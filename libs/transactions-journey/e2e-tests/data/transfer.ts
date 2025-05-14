import type { Account } from './account';
import type { Amount } from './amount';

export type Transfer = {
  fromAccount: Account;
  toAccount: Account;
  amount: Amount;
  note: string;
};

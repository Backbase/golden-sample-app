import { VisualValidator } from '@backbase-gsa/e2e-tests';
import { IdentityPage } from '../page-objects/pages/identity-page';
import { User } from '../data/data-types/user';
import { TestOptions } from 'test.model';
import { TransactionsPage } from '@backbase-gsa/transactions-journey/e2e-tests';

export interface TestRunnerItems extends TestOptions {
  language: 'Arabic' | 'English';
  visual: VisualValidator;
  identityPage: IdentityPage;
  transactionsPage: TransactionsPage;
  config: { users: Record<string, User> };
}

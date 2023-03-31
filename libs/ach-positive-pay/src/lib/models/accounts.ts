import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';

export interface AccountsViewModel {
  accounts: ProductSummaryItem[];
  loading: boolean;
}

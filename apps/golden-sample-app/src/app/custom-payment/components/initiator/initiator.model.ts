export interface AccountSelectorItem {
  id: string;
  balance?: number;
  currency?: string;
  name?: string;
  number?: string;
}

export type AccountSelectorItems = Array<AccountSelectorItem>;

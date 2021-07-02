import { ProductSummaryItem } from '@backbase/data-ang/arrangements';

export const appendAccounts = (
  initialList: ProductSummaryItem[],
  newList: ProductSummaryItem[],
  append: boolean,
): ProductSummaryItem[] => (append ? [...initialList, ...newList] : newList);

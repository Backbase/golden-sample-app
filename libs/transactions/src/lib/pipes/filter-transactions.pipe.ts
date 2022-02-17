import { Pipe, PipeTransform } from '@angular/core';
import { TransactionItem } from '@backbase/data-ang/transactions';

@Pipe({
  name: 'filterTransactions',
})
export class FilterTransactionsPipe implements PipeTransform {
  transform(value: TransactionItem[], text: string): TransactionItem[] {
    if (!text) {
      return value;
    }

    const lowerCaseText = text.toLocaleLowerCase();

    return value.filter(
      ({ merchant, type }: TransactionItem) =>
        merchant?.name.toLocaleLowerCase().includes(lowerCaseText) ||
        type.toLocaleLowerCase().includes(lowerCaseText)
    );
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { TransactionItem } from '@backbase/transactions-http-ang';

@Pipe({
  name: 'filterTransactions',
  standalone: true
})
export class FilterTransactionsPipe implements PipeTransform {
  transform(value: TransactionItem[], text: string): TransactionItem[] {
    if (text) {
      const lowerCaseText = text.toLocaleLowerCase();
      return value.filter(
        ({ merchant, type, counterPartyName = '' }: TransactionItem) =>
          merchant?.name.toLocaleLowerCase().includes(lowerCaseText) ||
          counterPartyName.toLocaleLowerCase().includes(lowerCaseText) ||
          type.toLocaleLowerCase().includes(lowerCaseText)
      );
    }

    return value;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from '../model/transaction';

@Pipe({
  name: 'filterTransactions'
})
export class FilterTransactionsPipe implements PipeTransform {

  transform(value: Transaction[], text: string): Transaction[] {
    if (!text) {
      return value;
    }

    const lowerCaseText = text.toLocaleLowerCase();

    return value.filter(({ merchant, transaction }: Transaction) =>
      merchant.name.toLocaleLowerCase().includes(lowerCaseText) ||
      transaction.type.toLocaleLowerCase().includes(lowerCaseText));
  }

}

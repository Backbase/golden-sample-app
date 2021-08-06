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

    text = text.toLocaleLowerCase();

    return value.filter(x =>
      x.merchant.name.toLocaleLowerCase().includes(text) ||
      x.transaction.type.toLocaleLowerCase().includes(text));
  }

}

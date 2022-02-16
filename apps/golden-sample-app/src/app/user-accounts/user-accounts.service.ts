import { Injectable } from '@angular/core';
import {
  ProductSummaryHttpService,
  ProductSummaryItem,
} from '@backbase/data-ang/arrangements';
import { Observable } from 'rxjs';

@Injectable()
export class UserAccountsService {
  public arrangements$: Observable<ProductSummaryItem[]> =
    this.productSummaryDataHttpService.getArrangementsByBusinessFunction(
      {
        businessFunction: 'Product Summary',
        resourceName: 'Product Summary',
        privilege: 'view',
        size: 1000000,
      },
      'body'
    );

  constructor(
    private readonly productSummaryDataHttpService: ProductSummaryHttpService
  ) {}
}

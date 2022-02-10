import { Injectable } from '@angular/core';
import { ProductSummaryHttpService } from '@backbase/data-ang/arrangements';
import { map } from 'rxjs/operators';

@Injectable()
export class ArrangementsService {
  public arrangementIds$ = this.productSummaryDataHttpService
    .getArrangementsByBusinessFunction(
      {
        businessFunction: 'Product Summary',
        resourceName: 'Product Summary',
        privilege: 'view',
        size: 1000000,
      },
      'body',
    )
    .pipe(map((arrangements) => arrangements.map((ar) => ar.id)));

  constructor(
    private readonly productSummaryDataHttpService: ProductSummaryHttpService,
  ) { }
}

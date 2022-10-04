import { Injectable } from '@angular/core';
import { ProductSummaryHttpService } from '@backbase/data-ang/arrangements';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ArrangementsService {
  public arrangements$ = this.productSummaryDataHttpService
    .getArrangementsByBusinessFunction(
      {
        businessFunction: 'Product Summary',
        resourceName: 'Product Summary',
        privilege: 'view',
        size: 1000000,
      },
      'body'
    )
    .pipe(shareReplay());

  constructor(
    private readonly productSummaryDataHttpService: ProductSummaryHttpService
  ) {}
}

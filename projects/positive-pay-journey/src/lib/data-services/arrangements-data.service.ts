import { Injectable } from '@angular/core';
import {
  GetArrangementsByBusinessFunctionRequestParams,
  ProductSummaryHttpService,
} from '@backbase/data-ang/arrangements';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponseType } from '../constants/http-response-types.constant';
import { mapResponseWithCount } from '../helpers/response-mapper.helper';
import { AccountsResponse } from '../models/accounts-state.model';

@Injectable({
  providedIn: 'root',
})
export class ArrangementsDataService {
  constructor(private readonly productSummaryDataService: ProductSummaryHttpService) {}

  getAccounts(params: GetArrangementsByBusinessFunctionRequestParams): Observable<AccountsResponse> {
    return this.productSummaryDataService.getArrangementsByBusinessFunction(params, HttpResponseType.RESPONSE).pipe(
      map(mapResponseWithCount),
      map((res) => ({ accounts: res.body || [], totalCount: res.count })),
    );
  }
}

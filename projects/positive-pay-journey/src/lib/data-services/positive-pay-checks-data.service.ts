import { Injectable } from '@angular/core';
import {
  FilterChecksRequestParams,
  PositivePayCheck,
  PositivePayCheckList,
  PositivePayHttpService,
  SubmitCheckRequestParams,
  SubmitAchBlockerRuleRequestParams,
  AchBlockerRule,
} from '@backbase/data-ang/positive-pay-v1';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { PositivePayCheckListModel } from '../models/positive-pay-checks.models';
import { HttpResponseType } from '../constants/http-response-types.constant';
import { mapResponseWithCount } from '../helpers/response-mapper.helper';

@Injectable({
  providedIn: 'root',
})
export class PositivePayChecksDataService {
  constructor(private readonly positivePayDataService: PositivePayHttpService) {}

  submitPositivePayCheck(submitCheckRequestParams: SubmitCheckRequestParams): Observable<PositivePayCheck> {
    return this.positivePayDataService.submitCheck(submitCheckRequestParams);
  }

  submitAchPositivePayBlockerRule(
    submitAchBlockerRequestParams: SubmitAchBlockerRuleRequestParams,
  ): Observable<AchBlockerRule> {
    return this.positivePayDataService.submitAchBlockerRule(submitAchBlockerRequestParams);
  }

  getPositivePayCheckList(requestParameters: FilterChecksRequestParams): Observable<PositivePayCheckListModel> {
    return this.positivePayDataService.filterChecks(requestParameters, HttpResponseType.RESPONSE).pipe(
      map((res) => mapResponseWithCount<HttpResponse<PositivePayCheckList>, PositivePayCheckList>(res, 'checks')),
      map((res) => ({ ...(res.body || { checks: [] }), count: res.count })),
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { Observable } from 'rxjs';
import { AchRule } from '../models/ach-rule';

@Injectable()
export class AchPositivePayHttpService {
  public readonly accounts$ =
    this.http.get<ProductSummaryItem[]>('/api/accounts');

  constructor(private http: HttpClient) {}

  submitAchRule(rule: AchRule): Observable<unknown> {
    return this.http.post('/api/ach-positive-pay/rule', rule);
  }
}

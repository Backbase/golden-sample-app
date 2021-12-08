import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductSummaryItem } from '@backbase/data-ang/arrangements';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AchPositivePayHttpService {
  public readonly accounts$ = this.http.get<ProductSummaryItem[]>('/api/accounts');

  constructor(private http: HttpClient) {}

  submitAchRule(rule: any): Observable<any> {
    return this.http.post('/api/ach-positive-pay/rule', rule);
  }
}

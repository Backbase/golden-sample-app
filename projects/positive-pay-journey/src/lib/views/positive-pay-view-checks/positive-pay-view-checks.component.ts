import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PositivePayStateModelService } from '../../state/positive-pay-state-model.service';

@Component({
  selector: 'bb-positive-pay-view-checks',
  templateUrl: './positive-pay-view-checks.component.html',
})
export class PositivePayViewChecksComponent implements OnInit, OnDestroy {
  private readonly destroy$$: Subject<void> = new Subject();

  /**
   * @internal
   * @param storeModel
   */
  constructor(private readonly storeModel: PositivePayStateModelService) {}

  /**
   * Handles Angular component lifecycle step.
   *
   * @internal
   */
  ngOnInit(): void {}

  /**
   * Handles Angular component lifecycle step.
   *
   * @internal
   */
  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}

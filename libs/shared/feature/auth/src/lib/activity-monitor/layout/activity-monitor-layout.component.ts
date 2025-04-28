import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'bb-activity-monitor-layout',
  templateUrl: './activity-monitor-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityMonitorLayoutComponent {
  @Input() isOpen = false;
  @Input() remaining!: number;
  @Input() countdownDuration!: number;
  readonly modalOptions: NgbModalOptions = {
    keyboard: false,
    backdrop: 'static',
    windowClass: 'session-timeout__modal',
    backdropClass: 'session-timeout__modal',
  };
}

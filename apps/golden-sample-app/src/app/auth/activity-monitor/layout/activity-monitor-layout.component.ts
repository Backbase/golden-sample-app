import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from '@backbase/ui-ang/modal';
import { HeaderModule } from '@backbase/ui-ang/header';

@Component({
  selector: 'app-activity-monitor-layout',
  templateUrl: './activity-monitor-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ModalModule, HeaderModule],
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

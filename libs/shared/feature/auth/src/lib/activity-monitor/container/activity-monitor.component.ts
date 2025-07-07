import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  ActivityMonitorService,
  AuthService,
  TickEvent,
} from '@backbase/identity-auth';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter, map, share, take } from 'rxjs';
import { ActivityMonitorLayoutComponent } from '../layout/activity-monitor-layout.component';

@Component({
  selector: 'bb-activity-monitor',
  templateUrl: './activity-monitor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, ActivityMonitorLayoutComponent],
})
export class ActivityMonitorComponent implements OnInit {
  private readonly activityMonitorService: ActivityMonitorService = inject(
    ActivityMonitorService
  );
  private readonly oAuthService: OAuthService = inject(OAuthService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly events$ = this.activityMonitorService.events.pipe(share());
  private readonly openTypes = ['start', 'tick'];
  readonly countdownDuration = 30;
  readonly isOpen$ = this.events$.pipe(
    map(({ type }) => this.openTypes.includes(type))
  );
  readonly remaining$ = this.events$.pipe(
    filter(({ type }) => type === 'tick'),
    map((event) => (event as TickEvent).remaining)
  );

  ngOnInit(): void {
    this.logoutOnEndEvent();
    this.startActivityMonitorWhenAuthenticated();
  }

  private readonly logoutOnEndEvent = () => {
    this.events$
      .pipe(
        filter(({ type }) => type === 'end'),
        take(1)
      )
      .subscribe({
        next: () => {
          if (this.oAuthService.hasValidAccessToken()) {
            this.oAuthService.logOut();
          } else {
            this.authService.initLoginFlow();
          }
        },
      });
  };

  private readonly startActivityMonitorWhenAuthenticated = () => {
    this.authService.isAuthenticated$.pipe(take(1)).subscribe({
      next: (loggedIn) => {
        if (loggedIn) {
          this.activityMonitorService.start({
            maxInactivityDuration: 300,
            countdownDuration: this.countdownDuration,
          });
        } else {
          this.activityMonitorService.stop();
        }
      },
    });
  };
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ActivityMonitorService,
  AuthService,
  TickEvent,
} from '@backbase/identity-auth';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter, map, share, take } from 'rxjs';

@Component({
  selector: 'app-activity-monitor',
  templateUrl: './activity-monitor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityMonitorComponent implements OnInit {
  private readonly events$ = this.activityMonitorService.events.pipe(share());
  private readonly openTypes = ['start', 'tick'];
  readonly isOpen$ = this.events$.pipe(
    map(({ type }) => this.openTypes.includes(type))
  );
  readonly remaining$ = this.events$.pipe(
    filter(({ type }) => type === 'tick'),
    map((event) => (event as TickEvent).remaining)
  );

  constructor(
    private readonly activityMonitorService: ActivityMonitorService,
    private readonly oAuthService: OAuthService,
    private readonly authService: AuthService
  ) {}

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
            this.oAuthService.initLoginFlow();
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
            countdownDuration: 30,
          });
        } else {
          this.activityMonitorService.stop();
        }
      },
    });
  };
}

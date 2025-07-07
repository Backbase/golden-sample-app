import { TestBed } from '@angular/core/testing';
import {
  ActivityEvent,
  ActivityEventType,
  ActivityMonitorService,
  AuthService,
  EndEvent,
  ResetEvent,
  StartEvent,
  TickEvent,
} from '@backbase/identity-auth';
import { OAuthService } from 'angular-oauth2-oidc';
import { ReplaySubject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { ActivityMonitorComponent } from './activity-monitor.component';

type WidePropertyTypes<T> = Partial<Record<keyof T, unknown>>;
const mock = <T>(overrides?: WidePropertyTypes<T>) =>
  ({ ...overrides } as jest.Mocked<T>);

describe('ActivityMonitorComponent', () => {
  let component: ActivityMonitorComponent;
  let scheduler: TestScheduler;
  let activityMonitorService: jest.Mocked<ActivityMonitorService>;
  let activityEvents: ReplaySubject<ActivityEvent>;
  let oAuthService: jest.Mocked<OAuthService>;
  let authService: jest.Mocked<AuthService>;
  let isAuthenticated$: ReplaySubject<boolean>;

  beforeEach(() => {
    activityEvents = new ReplaySubject<ActivityEvent>(1);
    isAuthenticated$ = new ReplaySubject<boolean>();
    activityMonitorService = mock<ActivityMonitorService>({
      events: activityEvents,
      start: jest.fn(),
      stop: jest.fn(),
    });
    oAuthService = mock<OAuthService>({
      hasValidAccessToken: jest.fn(),
      logOut: jest.fn(),
    });
    authService = mock<AuthService>({
      isAuthenticated$,
      initLoginFlow: jest.fn(),
    });

    TestBed.configureTestingModule({
      providers: [
        ActivityMonitorComponent,
        { provide: ActivityMonitorService, useValue: activityMonitorService },
        { provide: OAuthService, useValue: oAuthService },
        { provide: AuthService, useValue: authService },
      ],
    });

    component = TestBed.inject(ActivityMonitorComponent);
    scheduler = new TestScheduler((a, e) => expect(a).toEqual(e));
  });

  const getData = () => {
    const startEvent: StartEvent = { type: ActivityEventType.START };
    const endEvent: EndEvent = { type: ActivityEventType.END };
    const tickEvent: TickEvent = {
      type: ActivityEventType.TICK,
      remaining: 20,
    };
    const resetEvent: ResetEvent = { type: ActivityEventType.RESET };

    return { startEvent, endEvent, tickEvent, resetEvent };
  };

  describe('isOpen$', () => {
    it('should emit true when event is start', async () => {
      const { startEvent } = getData();

      scheduler.run(({ expectObservable }) => {
        activityEvents.next(startEvent);
        expectObservable(component.isOpen$).toBe('x', { x: true });
      });
    });
    it('should emit true when event is tick', async () => {
      const { tickEvent } = getData();

      scheduler.run(({ expectObservable }) => {
        activityEvents.next(tickEvent);
        expectObservable(component.isOpen$).toBe('x', { x: true });
      });
    });
    it('should emit false when event is reset', async () => {
      const { resetEvent } = getData();

      scheduler.run(({ expectObservable }) => {
        activityEvents.next(resetEvent);
        expectObservable(component.isOpen$).toBe('x', { x: false });
      });
    });
    it('should emit false when event is end', async () => {
      const { endEvent } = getData();

      scheduler.run(({ expectObservable }) => {
        activityEvents.next(endEvent);
        expectObservable(component.isOpen$).toBe('x', { x: false });
      });
    });
  });

  describe('remaining$', () => {
    it('should emit the remaining time of a tick event', async () => {
      const { tickEvent } = getData();

      scheduler.run(({ expectObservable }) => {
        activityEvents.next(tickEvent);
        expectObservable(component.remaining$).toBe('x', {
          x: tickEvent.remaining,
        });
      });
    });
  });

  describe('#logoutOnEndEvent', () => {
    it('should logout user when end event is emitted and user has valid access token', async () => {
      const { endEvent } = getData();

      scheduler.run(({ flush }) => {
        component.ngOnInit();
        oAuthService.hasValidAccessToken.mockReturnValue(true);

        activityEvents.next(endEvent);
        flush();

        expect(oAuthService.logOut).toHaveBeenCalled();
      });
    });
    it('should init login flow when end event is emitted and user has invalid access token', async () => {
      const { endEvent } = getData();

      scheduler.run(({ flush }) => {
        component.ngOnInit();
        oAuthService.hasValidAccessToken.mockReturnValue(false);

        activityEvents.next(endEvent);
        flush();

        expect(authService.initLoginFlow).toHaveBeenCalled();
      });
    });
  });

  describe('#startActivityMonitorWhenAuthenticated', () => {
    it('should start activity monitor when the user is authenticated', async () => {
      scheduler.run(({ flush }) => {
        component.ngOnInit();

        isAuthenticated$.next(true);
        flush();

        expect(activityMonitorService.start).toHaveBeenCalled();
      });
    });
    it('should stop activity monitor when the user is unauthenticated', async () => {
      scheduler.run(({ flush }) => {
        component.ngOnInit();

        isAuthenticated$.next(false);
        flush();

        expect(activityMonitorService.stop).toHaveBeenCalled();
      });
    });
  });
});

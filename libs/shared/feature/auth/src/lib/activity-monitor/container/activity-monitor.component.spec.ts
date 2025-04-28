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
  const getInstance = () => {
    const activityEvents = new ReplaySubject<ActivityEvent>(1);
    const isAuthenticated$ = new ReplaySubject<boolean>();
    const activityMonitorService = mock<ActivityMonitorService>({
      events: activityEvents,
      start: jest.fn(),
      stop: jest.fn(),
    });
    const oAuthService = mock<OAuthService>({
      hasValidAccessToken: jest.fn(),
      logOut: jest.fn(),
    });
    const authService = mock<AuthService>({
      isAuthenticated$,
      initLoginFlow: jest.fn(),
    });
    const component = new ActivityMonitorComponent(
      activityMonitorService,
      oAuthService,
      authService
    );
    const scheduler = new TestScheduler((a, e) => expect(a).toEqual(e));

    return {
      component,
      scheduler,
      activityMonitorService,
      activityEvents,
      oAuthService,
      authService,
      isAuthenticated$,
    };
  };

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
      const { component, scheduler, activityEvents } = getInstance();
      const { startEvent } = getData();

      scheduler.run(({ expectObservable }) => {
        activityEvents.next(startEvent);
        expectObservable(component.isOpen$).toBe('x', { x: true });
      });
    });
    it('should emit true when event is tick', async () => {
      const { component, scheduler, activityEvents } = getInstance();
      const { tickEvent } = getData();

      scheduler.run(({ expectObservable }) => {
        activityEvents.next(tickEvent);
        expectObservable(component.isOpen$).toBe('x', { x: true });
      });
    });
    it('should emit false when event is reset', async () => {
      const { component, scheduler, activityEvents } = getInstance();
      const { resetEvent } = getData();

      scheduler.run(({ expectObservable }) => {
        activityEvents.next(resetEvent);
        expectObservable(component.isOpen$).toBe('x', { x: false });
      });
    });
    it('should emit false when event is end', async () => {
      const { component, scheduler, activityEvents } = getInstance();
      const { endEvent } = getData();

      scheduler.run(({ expectObservable }) => {
        activityEvents.next(endEvent);
        expectObservable(component.isOpen$).toBe('x', { x: false });
      });
    });
  });

  describe('remaining$', () => {
    it('should emit the remaining time of a tick event', async () => {
      const { component, scheduler, activityEvents } = getInstance();
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
      const { component, scheduler, activityEvents, oAuthService } =
        getInstance();
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
      const {
        component,
        scheduler,
        activityEvents,
        oAuthService,
        authService,
      } = getInstance();
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
      const { component, scheduler, isAuthenticated$, activityMonitorService } =
        getInstance();

      scheduler.run(({ flush }) => {
        component.ngOnInit();

        isAuthenticated$.next(true);
        flush();

        expect(activityMonitorService.start).toHaveBeenCalled();
      });
    });
    it('should stop activity monitor when the user is unauthenticated', async () => {
      const { component, scheduler, isAuthenticated$, activityMonitorService } =
        getInstance();

      scheduler.run(({ flush }) => {
        component.ngOnInit();

        isAuthenticated$.next(false);
        flush();

        expect(activityMonitorService.stop).toHaveBeenCalled();
      });
    });
  });
});

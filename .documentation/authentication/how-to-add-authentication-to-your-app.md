<!-- .documentation/authentication/how-to-add-authentication-to-your-app.md -->
#### How to add authentication to your app !heading

We rely on <https://github.com/manfredsteyer/angular-oauth2-oidc>, check their documentation for more details.

We've provided the `AuthEventsHandlerService` via the `APP_INITIALIZER` which will handle auth events from the above 3rd party library. This service is an example implementation of how we expect applications to handle auth events. It includes the following default settings:

- The access token will be refreshed when it expires automatically.
- When token refresh, code exchange, or session errors occur the user is automatically logged out.
- A login using an invalid state parameter will be returned to the Auth server. This will likely result in a return to the application, however, in they will now have passed a valid state parameter.

We've also provided an example implementation of an `AuthInterceptor` in the application configuration. The purpose of this interceptor is to catch 401 errors and attempt to refresh the user's access token. If this refresh is successful the original request will be replayed with the new access token. If the refresh fails, or the original error was not a 401, then we surface the original error to the calling code.

The application uses a standalone configuration with providers set up in the `app.config.ts` file.

Follow the next steps to add authentication to your app:
* Set up the configuration in the `environment.ts` files.
  * Import [`AuthConfig`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/environments/environment.ts#L6)
  * Create an [`authConfig`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/environments/environment.ts#L34-L63) object and export it.
* Set up authentication in the `app.config.ts` file (standalone configuration).
  * Import authentication services from [`angular-oauth2-oidc`](https://github.com/manfredsteyer/angular-oauth2-oidc)
  * Import [`authConfig` and `environment`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/environments/environment.ts)
  * Add [`AuthEventsHandlerService`](https://github.com/Backbase/golden-sample-app/blob/main/libs/shared/feature/auth/src/lib/guard/auth.guard.ts) to the application providers via `APP_INITIALIZER`
  * Add [`AuthInterceptor`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.config.ts) to the `HTTP_INTERCEPTORS` provider
  * Configure [`OAuthStorage`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.config.ts) to use `localStorage` for token storage
* Secure routes by setting your route guards.
  * Use [`AuthGuard`](https://github.com/Backbase/golden-sample-app/blob/main/libs/shared/feature/auth/src/lib/guard/auth.guard.ts#L10-L41) in routes you want to secure
  * Add [`canActivate`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app-routes.ts#L21) property with `AuthGuard` to the routes you want to protect. See [`app-routes.ts`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app-routes.ts) for examples.

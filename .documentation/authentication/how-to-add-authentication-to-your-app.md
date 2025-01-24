<!-- .documentation/authentication/how-to-add-authentication-to-your-app.md -->
#### How to add authentication to your app !heading

We rely on <https://github.com/manfredsteyer/angular-oauth2-oidc>, check their documentation for more details.

We've provided the `AuthEventsHandlerService` via the `APP_INITIALIZER` which will handle auth events from the above 3rd party library. This service is an example implementation of how we expect applications to handle auth events. It includes the following default settings:

- The access token will be refreshed when it expires automatically.
- When token refresh, code exchange, or session errors occur the user is automatically logged out.
- A login using an invalid state parameter will be returned to the Auth server. This will likely result in a return to the application, however, in they will now have passed a valid state parameter.

We've also provided an example implementation of an `AuthInterceptor` in the app module. The purpose of this interceptor is to catch 401 errors and attempt to refresh the user's access token. If this refresh is successful the original request will be replayed with the new access token. If the refresh fails, or the original error was not a 401, then we surface the original error to the calling code.


Follow the next steps to add authentication to your app:
* Set up the configuration in the `environment.ts` files.
  * Import [`AuthConfig`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/environments/environment.ts#L6)
  * Create an [`authConfig`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/environments/environment.ts#L34-L63) object and export it.
* Make changes to the `app.module.ts` file.
  * Import [everything necessary](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L30-L36) from [`angular-oauth2-oidc`](https://github.com/manfredsteyer/angular-oauth2-oidc)
  * Import [`authConfig` and `environment`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L38)
  * Import [`AuthEventsHandlerService`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L42)
  * Import [`AuthInterceptor`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L44)
  * Set the [`AuthConfig` provider to return `authConfig`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L94) 
  * Set the [`HTTP_INTERCEPTORS` to use `AuthInterceptor`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L95-L99)
  * Set the [`OAuthModuleConfig`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L105-L113) to use the environment configuration.
  * Set the [`OAuthStorage`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L114) to use `localStorage`.
  * Enable the app to wait for authentication services to be handled before the app is initialized by setting the [`APP_INITIALIZER`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L117-L142)  
* Make changes to those routes you want to secure by setting your route guards.
  * Create an `auth.guard.ts` file if you didn't have it yet.
  (https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/auth/guard/auth.guard.ts)
  * Export [`AuthGuard`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/auth/guard/auth.guard.ts#L10-L43) to use it in routes you want to secure.
  * Import [`AuthGuard`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app-routing.module.ts#L5) in `app-routing-module.ts` file
  * Add [`canActivate` and pass `AuthGuard` into it](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app-routing.module.ts#L22) to the route you want to secure.

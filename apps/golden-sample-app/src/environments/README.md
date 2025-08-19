# Environment file best practices

Environment files are used for building the app with different configurations per target deployment environment. E.g., when running locally vs running in production.

The following best practices are recommended to keep environment files clean, maintainable and easily understood:

- All configuration should be provided via Angular's DI system
- Environment files should contain just one single exported item: An object with a single `providers` property containing an array of Angular Providers
- Only the main `app.config.ts` file should import from the environment files. All other files that need to access config from the environment files should do so by `inject`ing the relevant tokens.
- Keep tokens focused on single responsiblity - prefer multiple tokens over a single, very large `Environment` token that acts as a bucket for all config
- Use utility functions that take config parameters to group related providers in order to minimise duplication across environment files (e.g., see the `provideAuthentication` function)
- Environment files should only contain config that varies by environment - config that's common should live elsewhere (e.g., the main `app.config.ts` file or in the entry points to lazy-loaded features).

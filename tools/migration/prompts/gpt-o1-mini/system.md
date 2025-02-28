# Goal
Migrate an existing NX & Angular monorepo from Angular 18 to Angular 19. This migration must adhere to both the official Angular update guidelines (as outlined in the Angular update guide for v18.0–19.0) and NX’s specific migration recommendations for monorepos. The prompt should instruct the AI to:
- Update Angular core packages and CLI following Angular’s automated migration steps.
- Adjust configuration files (e.g., angular.json, nx.json, tsconfig) as needed.
- Update third-party dependencies (like Angular Material, if used).
- Execute NX-specific migration commands to ensure workspace consistency and optimal performance.

# Return format
- **Step-by-step migration instructions:** Clear commands and code snippets.
- **Configuration change details:** Before/after examples for configuration files.
- **Verification checklist:** Commands to build, serve, and test the applications.
- **References:** Inline citations (e.g., links to Angular Update Guide and NX migration docs) where relevant.

# Warnings
- **Follow Official Guidelines:** Rely strictly on the official Angular update guide (v18.0–19.0) for migration steps and be sure to consult NX-specific documentation for any monorepo-related adjustments.
- **Backup and Version Control:** Ensure you have a full backup and a clean Git branch before starting.
- **Testing:** Comprehensive testing (unit, integration, e2e) must be run after migration to catch any breaking changes.
- **Dependency Compatibility:** Confirm that third-party packages (e.g., Angular Material) are compatible with Angular 19.
- **Incremental Migration:** Perform migrations step-by-step (e.g., running `ng update` followed by `nx migrate` commands) and verify functionality after each step.

# Context dump

## Example migration
```bash
    nx migrate latest --interactive
    nx migrate --run-migrations 
```

## Angular Update Guide Reference:
The Angular update guide (v18.0–19.0) is an interactive tool where you select options such as:

 - Angular Versions: Although the guide shows “From v. 17.0” to “To v. 18.0”, its instructions apply to migrating from Angular 18 to Angular 19.
 - Application Complexity: Options include Basic, Medium, Advanced.
 - Other Dependencies: Options for Angular Material, ngUpgrade, or Windows usage.

## NX Monorepo Considerations:

 - The monorepo typically has separate folders for applications and libraries.
 - NX uses configuration files like `nx.json` and per-project `project.json` files; these must be updated accordingly.
 - NX migration commands (e.g., `nx migrate latest`) are used to refactor workspace settings, update dependencies, and optimize CI pipelines.

## Migration Process Overview:

 - Angular CLI Migration: Run ng update @angular/cli @angular/core to update Angular packages following the Angular update guide.
 - NX Migration: Run nx migrate latest --interactive and then nx migrate --run-migrations to update NX-specific configurations.
 - Configuration Adjustments: Manually review and update configuration files (e.g., splitting angular.json into per-project project.json files if required).
 - Verification: Serve, build, and run tests (using commands like nx serve, nx build, and nx affected:test) to ensure the migration succeeded.

## References for Further Reading:

 - Angular Update Guide v18.0–19.0 - https://angular.dev/update-guide?v=18.0-19.0&l=1 
 - NX Guidelines - https://nx.dev/

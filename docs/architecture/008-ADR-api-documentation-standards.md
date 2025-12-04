# ADR-008: API Documentation Standards

## Decision summary

All Backbase journeys and public libraries must provide comprehensive, standardized API documentation generated using Compodoc and the `@backbase/capability-docs-plugin`. Documentation must include a README with journey overview and screenshots, a detailed changelog with migration instructions, journey configuration documentation generated from TypeScript interfaces, view replacement information with routing definitions, and exposed UI components. Documentation must be automatically published to the Backbase Developer Hub (https://backbase.io/developers/angular/) as part of the CI/CD pipeline to ensure customers have access to current, versioned documentation for journey adoption, configuration, and customization.

## Context and problem statement

### Business context
- **Customer Enablement:** FE developers (CS teams, partners, and clients) need comprehensive API documentation to adopt, configure, and customize journeys effectively
- **Support Efficiency:** Inadequate documentation results in increased support tickets and customer frustration
- **Professional Standards:** API documentation quality directly reflects product quality and professionalism
- **Knowledge Transfer:** Documentation enables self-service adoption without requiring direct contact with capability teams
- **Version Management:** Multiple journey versions exist in production; documentation must be versioned accordingly
- **Success Criteria:**
  - All public journeys have complete API documentation
  - Documentation enables view extension and replacement without consulting source code
  - Migration paths are clear for major version upgrades
  - Configuration options are discoverable with examples
  - Documentation is always synchronized with published journey versions

### Technical context
- **Existing Landscape:** Angular-based journeys published as NPM packages consumed by retail-universal and business-universal applications
- **Affected Systems:**
  - Journey libraries and their public APIs
  - Bundle modules and configuration
  - View components and their replacement APIs
  - Journey routing definitions
  - Static assets and their configuration paths
  - Developer Hub infrastructure (https://backbase.io/developers/angular/)
  - CI/CD pipelines for journey releases
- **Technical Challenges:**
  - Inconsistent documentation quality across capabilities
  - Documentation frequently out of sync with code
  - No standardized structure for journey documentation
  - Configuration options not discoverable
  - View replacement requirements unclear
  - Manual documentation maintenance is error-prone and time-consuming
  - Changelog often contains irrelevant internal information

### Constraints and assumptions

**Technical Constraints:**
- Must generate documentation from TypeScript source code and comments
- Documentation must be versioned alongside journey versions
- Must maintain documentation for all published versions
- Documentation generation must integrate into CI/CD pipeline
- Must not require manual HTML/CSS authoring
- Generated documentation must be accessible and navigable
- Must support TypeScript interfaces, classes, components, and services
- Must work within Nx monorepo workspace structure

**Business Constraints:**
- Capability teams have limited bandwidth for manual documentation
- Documentation must not delay journey releases
- Documentation generation must not significantly increase build times
- Developer Hub hosting capacity must be managed (storage, bandwidth)
- Documentation must be discoverable via search engines
- External customers often lack access to Backbase Jira for context

**Environmental Constraints:**
- Must integrate with existing Jenkins CI/CD infrastructure
- Must publish to controlled Developer Hub infrastructure
- Must work with NPM-based package distribution
- Documentation must be served via standard web infrastructure
- Must support immutable build principles (build once, deploy many)

**Assumptions Made:**
- TSDoc comments will be maintained alongside code
- Capability teams will update changelogs as part of release process
- Screenshots and examples will be provided by journey owners
- Static assets will be properly documented when configurable
- Compodoc will remain the standard documentation tool
- Developer Hub will remain the authoritative documentation source

### Affected architecture description elements

**Components:**
- Journey library source code (TSDoc comments)
- `.compodocrc.json` configuration files
- `package.json` with documentation scripts
- Journey README files with overview and screenshots
- Journey CHANGELOG files with version history
- `@backbase/capability-docs-plugin` NX plugin
- Angular project.json/angular.json with docs-build executors
- CI/CD pipeline with documentation publish step
- Developer Hub hosting infrastructure
- Journey configuration interfaces and services
- View components with markdown overview pages

**Views:**
- **Development View:** TSDoc comment structure, documentation configuration, executor setup
- **Logical View:** Documentation generation flow, content organization, versioning strategy
- **Process View:** Build-time doc generation, CI/CD publication, version management
- **Physical View:** Developer Hub hosting, documentation artifacts, static asset storage

**Stakeholders:**
- **Journey Consumers (Extension Engineers):** Need complete API docs to configure and customize journeys
- **Project Developers:** Need migration instructions and configuration examples
- **Business Users:** Benefit from journey screenshots and functional descriptions
- **Capability Teams:** Must maintain documentation alongside code
- **Customer Success:** Reference documentation to support customers
- **Technical Writers:** May contribute to README and overview content

## Decision

### What we decided

**1. Mandatory Documentation Structure:**

All public journey libraries must include the following standardized documentation sections:

**a) README:**
- Quick journey overview and purpose
- Link to community functional documentation
- Screenshots demonstrating journey functionality
- List of BASE_PATH reexports and their originating HTTP clients (if any)
- List of entitlements affecting the journey
- Relevant external links

**b) CHANGELOG:**
- Always up to date with each release
- Migration instructions for every major version
- Meaningful descriptions not requiring Jira access
- Excludes irrelevant non-functional changes (code refactoring, pipeline changes, .gitignore modifications)
- Clear indication of breaking vs non-breaking changes

**c) Dependencies/Peer Dependencies:**
- Automatically generated from distributable package.json
- Lists external libraries used beyond capability scope
- Documents 3rd party library dependencies
- Generated by Compodoc when `"disableDependencies": false` in .compodocrc.json

**d) Journey Configuration:**
- Automatically generated from TypeScript configuration interfaces using TSDoc
- Describes all configuration options with types
- Includes possible values for enums
- Usage examples for each option
- Links to community references where applicable
- Information on corresponding backend configuration
- **Journey Assets Configuration** (when applicable):
  - List of configurable static assets with full paths including journey name
  - Reference to static assets management documentation
  - Example paths: `%JOURNEY-NAME%/assets/asset-name.svg`

**e) View Replacements:**
- **View "Overview" Pages:** Per-view pages with short description, screenshot, and routing configuration example
- **Replaceable Views:** Required dependencies for replacement, view class members information, usage examples
- **Routing Definition:** Journey routing configuration with module import examples
- **Dumb UI Components:** Exported UI components facilitating view replacement, linked to capability UI library if exists

**2. Documentation Generation Tool:**

Use `@backbase/capability-docs-plugin` NX plugin which wraps Compodoc:
- Generates consistent, styled documentation
- Supports TypeScript and Angular-specific constructs
- Integrates with Nx workspace structure
- Outputs versioned documentation structure

**3. Standard Compodoc Configuration:**

Every journey library must have `.compodocrc.json` in library root:

```json
{
  "$schema": "node_modules/@compodoc/compodoc/src/config/schema.json",
  "customFavicon": "../../favicon.ico",
  "disableSourceCode": false,
  "disableLifeCycleHooks": false,
  "disablePrivate": true,
  "disableProtected": false,
  "disableInternal": true,
  "disableDomTree": false,
  "disableTemplateTab": false,
  "disableStyleTab": false,
  "disableCoverage": false,
  "hideGenerator": true,
  "hideDarkModeToggle": true,
  "disableGraph": true,
  "disableRoutesGraph": false,
  "minimal": false,
  "theme": "material",
  "navTabConfig": [
    {
      "id": "info",
      "label": "API"
    }
  ]
}
```

**Optional Overview page configuration:**
Add to `navTabConfig` array to enable per-component overview pages:
```json
{
  "id": "readme",
  "label": "Overview"
}
```

Create `.md` files alongside view components (e.g., `view.component.md`) to enable overview pages.

**4. NX Executor Configuration:**

**Journey Library Level (`project.json` or `angular.json`):**

```json
{
  "docs-build": {
    "builder": "@backbase/capability-docs-plugin:build",
    "options": {
      "libraryRootDir": "libs/journey-name",
      "name": "journey-name-in-kebab-case"
    }
  }
}
```

Parameters:
- `libraryRootDir`: Path to journey folder within repository
- `name`: URL-safe kebab-case name used in Developer Hub URL (must be unique)
- `tsConfig` (optional): Custom tsconfig path for controlling included files (default: `tsconfig.lib.json`)

**Application Level (any app in repository):**

```json
{
  "docs-start": {
    "builder": "@backbase/capability-docs-plugin:start",
    "options": {
      "docsDir": "./dist/docs"
    }
  }
}
```

Parameter:
- `docsDir`: Output directory for generated docs (default: `./dist/docs`)

**5. Package.json Scripts:**

Add convenience scripts for local development:

```json
{
  "scripts": {
    "build:docs": "nx affected --all --target docs-build",
    "start:docs": "nx run <APP_NAME>:docs-start"
  }
}
```

**6. CI/CD Pipeline Integration:**

Add documentation publishing step to capability pipeline:

```groovy
stage('Publish libraries to npm registry') {
  // ... existing library publish logic
}

stage('Publish documentation') {
  when { 
    expression { BRANCH_NAME ==~ RELEASE_ON_MERGE_TO } 
  }
  steps {
    script {
      sh "npm run build:docs"
      runFeApiDocsPublish()
    }
  }
}
```

**Critical:** The `when` condition must align with branching strategy and must execute when journeys are published to http://repo.backbase.com (not staging artifact repository).

`runFeApiDocsPublish()` parameters:
- `publishToproduction` (default: `true`): If `false`, publishes to staging Developer Hub (https://developer-staging.backbase.eu/angular/)
- `docsPath` (default: `./dist/docs`): Documentation output directory

**7. TSDoc Comment Standards:**

All public APIs must include TSDoc comments:

```typescript
/**
 * Configuration interface for the Journey.
 * 
 * @example
 * ```typescript
 * const config: JourneyConfig = {
 *   enableFeatureX: true,
 *   maxItems: 10
 * };
 * ```
 */
export interface JourneyConfig {
  /**
   * Enables Feature X functionality.
   * See: [Feature X Documentation](https://link-to-docs)
   * 
   * @default false
   */
  enableFeatureX?: boolean;

  /**
   * Maximum number of items to display.
   * 
   * @default 20
   * @minimum 1
   * @maximum 100
   */
  maxItems?: number;
}
```

**8. Custom File Inclusion:**

When additional files need documentation (e.g., feature library components, shared interfaces):

Create custom `tsconfig.doc.json`:

```json
{
  "extends": "./tsconfig.lib.json",
  "exclude": ["src/test.ts", "**/*.spec.ts"],
  "include": [
    "src/**/*.ts",
    "../feature/component-name/src/lib/component.ts",
    "../shared/interface-name/src/lib/interface.ts"
  ]
}
```

Reference in executor:
```json
{
  "docs-build": {
    "options": {
      "tsConfig": "tsconfig.doc.json",
      "libraryRootDir": "libs/journey-name",
      "name": "journey-name"
    }
  }
}
```

**9. Documentation Quality Gates:**

Documentation must meet quality standards before journey release:
- All public APIs have TSDoc comments
- README includes screenshots and overview
- CHANGELOG updated with meaningful descriptions
- Configuration interfaces fully documented with examples
- View replacement examples provided
- No broken internal links
- Static assets documented if configurable

**10. Version Management:**

Documentation structure must maintain version history:
```
dist/docs/
├── journey-name/
│   ├── 1.0.0/
│   │   └── (documentation files)
│   ├── 1.1.0/
│   │   └── (documentation files)
│   └── 2.0.0/
│       └── (documentation files)
```

Versions are automatically extracted from journey's `package.json`.

### Rationale

**Why Compodoc:**
- Industry-standard tool for Angular documentation
- Generates documentation directly from TypeScript source
- Reduces maintenance burden through automation
- Provides consistent styling and navigation
- Supports JSDoc/TSDoc comment standards
- Integrates well with Nx monorepo structure

**Why @backbase/capability-docs-plugin:**
- Abstracts Compodoc complexity behind Nx executors
- Enforces consistent configuration across capabilities
- Handles version-specific output structure
- Simplifies CI/CD integration
- Provides standardized Developer Hub publication

**Why Mandatory Structure:**
- Ensures consistency across all capabilities
- Enables customers to quickly find relevant information
- Reduces learning curve when adopting new journeys
- Facilitates self-service adoption and customization
- Addresses common customer pain points (configuration, view replacement, migration)

**Why Automated Generation:**
- Documentation stays synchronized with code
- Reduces manual maintenance effort
- Eliminates documentation as a release blocker
- Ensures completeness through tooling enforcement
- Enables quality gates and coverage metrics

**Why Developer Hub Centralization:**
- Single source of truth for all Backbase Angular documentation
- Consistent user experience across capabilities
- Centralized search and navigation
- Version management and hosting infrastructure
- Professional presentation to external customers

## Implementation details

### Technical approach

**Component Architecture:**

```
Journey Repository
├── libs/
│   └── journey-name/
│       ├── src/
│       │   ├── lib/
│       │   │   ├── configuration/
│       │   │   │   └── journey-config.interface.ts (TSDoc comments)
│       │   │   ├── views/
│       │   │   │   ├── view.component.ts (TSDoc comments)
│       │   │   │   └── view.component.md (Overview page)
│       │   │   └── services/
│       │   │       └── journey.service.ts (TSDoc comments)
│       │   └── index.ts (public API exports)
│       ├── README.md (Journey overview, screenshots)
│       ├── CHANGELOG.md (Version history, migrations)
│       ├── .compodocrc.json (Compodoc configuration)
│       ├── tsconfig.lib.json (Default files)
│       ├── tsconfig.doc.json (Optional: custom inclusions)
│       └── project.json (docs-build executor)
│
├── apps/
│   └── any-app/
│       └── project.json (docs-start executor)
│
└── package.json (build:docs, start:docs scripts)

CI/CD Pipeline → npm run build:docs → runFeApiDocsPublish()

Developer Hub (https://backbase.io/developers/angular/)
└── libraries/
    └── journey-name/
        ├── 1.0.0/
        ├── 1.1.0/
        └── 2.0.0/
```

**Documentation Generation Flow:**

1. **Local Development:**
   ```bash
   npm run build:docs  # Generates docs in dist/docs
   npm run start:docs  # Serves docs at http://127.0.0.1:8080
   ```

2. **CI/CD Pipeline:**
   - Triggered when merging to release branch (aligned with library publishing)
   - Executes `npm run build:docs`
   - Calls `runFeApiDocsPublish()` shared pipeline function
   - Publishes to Developer Hub (production or staging)

3. **Developer Hub Rebuild:**
   - Staging rebuild: https://jenkins.backbase.eu/job/Shared/job/DEVELOPER-HUB/job/dev-hub/
   - Production rebuild: Automatic after publication

**TSDoc Comment Patterns:**

```typescript
/**
 * Component description explaining its purpose and usage.
 * 
 * @example
 * ```html
 * <app-journey-view 
 *   [config]="myConfig"
 *   (action)="handleAction($event)">
 * </app-journey-view>
 * ```
 * 
 * @example
 * View replacement example:
 * ```typescript
 * {
 *   path: 'custom',
 *   component: CustomViewComponent,
 *   data: { title: 'Custom View' }
 * }
 * ```
 */
@Component({ ... })
export class JourneyViewComponent implements ViewDependencies {
  /**
   * Configuration object for the view.
   * Provide this to customize view behavior.
   * 
   * @see JourneyConfig for available options
   */
  @Input() config?: JourneyConfig;

  /**
   * Emitted when user performs an action.
   * 
   * @event action
   * @type {ActionPayload}
   */
  @Output() action = new EventEmitter<ActionPayload>();
}

/**
 * Dependencies required for view replacement.
 * Implement this interface in your custom view component.
 * 
 * @example
 * ```typescript
 * export class CustomViewComponent implements ViewDependencies {
 *   constructor(private readonly service: RequiredService) {}
 * }
 * ```
 */
export interface ViewDependencies {
  // ... interface members
}
```

**Static Assets Documentation Pattern:**

In README.md or dedicated assets configuration page:

```
## Static Assets Configuration

The Journey uses static assets that can be configured. 
See [Static Assets Management](https://backbase.io/developers/documentation/web-devkit/app-development/configure-static-assets/)

**Configurable Assets:**
- `journey-name/assets/logo.svg` - Journey logo (default: Backbase logo)
- `journey-name/assets/banner.webp` - Header banner image (recommended: 1920x400px)
- `journey-name/assets/icon-success.png` - Success state icon (required: 48x48px)

**Configuration Example:**
```json
{
  "staticAssets": {
    "journey-name/assets/logo.svg": "./custom-assets/my-logo.svg"
  }
}
```
```

**Changelog Quality Standards:**

❌ **Bad Changelog Entry:**
```

### Added
- New `enableBatchProcessing` configuration option to process multiple items simultaneously
- Support for custom validators in form fields via `customValidators` config property

### Changed  
- **BREAKING:** Renamed `maxRetries` to `maxRetryAttempts` for clarity
- Improved error messages to include actionable guidance for users

### Fixed
- Resolved issue where date picker showed incorrect timezone for users in GMT+12 or higher
- Fixed memory leak in subscription cleanup for view components

### Migration Guide (Breaking Changes)
Update configuration from:
```typescript
config = { maxRetries: 3 }
```
To:
```typescript
config = { maxRetryAttempts: 3 }
```


### Standards compliance

Documentation standards compliance checklist:
- [x] All public APIs have TSDoc comments
- [x] Configuration interfaces documented with @example tags
- [x] View replacement patterns documented with code examples
- [x] README includes journey overview and screenshots
- [x] CHANGELOG follows semantic versioning
- [x] Major version migrations documented
- [x] Static assets listed with full paths (when applicable)
- [x] Compodoc configuration follows standard template
- [x] NX executors configured correctly
- [x] CI/CD pipeline integrated
- [x] Documentation versioned with journey releases
- [x] No private/internal APIs exposed in public docs (`disablePrivate: true`)
- [x] Routing examples provided for view replacement

## Code review checklist

### Documentation Setup Review

**Repository Configuration:**
- [ ] `@backbase/capability-docs-plugin` added to devDependencies
- [ ] `.compodocrc.json` exists in journey library root with standard configuration
- [ ] Favicon path is relative to library folder: `"../../favicon.ico"`
- [ ] `disablePrivate: true` and `disableInternal: true` set correctly
- [ ] `navTabConfig` includes both "API" and optionally "Overview" tabs
- [ ] `docs-build` executor added to journey library's project.json
- [ ] `libraryRootDir` path is correct
- [ ] `name` parameter is kebab-case and unique
- [ ] `docs-start` executor added to one application's project.json
- [ ] `build:docs` and `start:docs` scripts added to package.json

**Pipeline Integration:**
- [ ] "Publish documentation" stage added to CI/CD pipeline
- [ ] Stage condition matches library publishing condition (RELEASE_ON_MERGE_TO)
- [ ] `sh "npm run build:docs"` executes before publication
- [ ] `runFeApiDocsPublish()` called with appropriate parameters
- [ ] Pipeline tested in staging environment before production

### TSDoc Comment Quality Review

**General Standards:**
- [ ] All public classes have TSDoc comments with description
- [ ] All public interfaces have TSDoc comments with description
- [ ] All public methods have TSDoc comments with description
- [ ] All public properties have TSDoc comments with description
- [ ] @Input() properties documented with purpose and type
- [ ] @Output() events documented with @event and @type tags
- [ ] No private or internal APIs exposed (marked with @internal if needed)

**Configuration Documentation:**
- [ ] Configuration interfaces have class-level TSDoc with overview
- [ ] Each configuration property has description explaining purpose
- [ ] @default tags included for optional properties with defaults
- [ ] @example tags provided showing actual usage
- [ ] Enum values documented individually
- [ ] Community/backend documentation referenced with @see or inline links
- [ ] Constraints documented (@minimum, @maximum, @pattern, etc.)

**Component Documentation:**
- [ ] Component purpose clearly described in TSDoc
- [ ] @example tags show HTML usage
- [ ] @example tags show routing configuration if view is replaceable
- [ ] Input/Output contracts fully documented
- [ ] Dependencies explained for view replacement scenarios

**Service Documentation:**
- [ ] Service purpose and responsibility documented
- [ ] Public methods include parameter descriptions with @param
- [ ] Return types documented with @returns
- [ ] Thrown errors documented with @throws
- [ ] Observable emissions documented with @returns and description

**Examples Quality:**
- [ ] Examples use realistic, runnable code
- [ ] Examples follow project coding standards
- [ ] Examples include necessary imports (if clarifying)
- [ ] Complex examples include explanatory comments
- [ ] Examples demonstrate common use cases, not edge cases

### Content Quality Review

**README.md:**
- [ ] Journey name and purpose clearly stated in first paragraph
- [ ] Link to community functional documentation included
- [ ] Screenshots provided showing journey in action (2-3 screenshots minimum)
- [ ] BASE_PATH reexports listed if applicable
- [ ] HTTP client origins documented if applicable
- [ ] Entitlements affecting journey listed
- [ ] External links relevant and functional
- [ ] Installation instructions present (if non-standard)

**CHANGELOG.md:**
- [ ] Follows semantic versioning (Major.Minor.Patch)
- [ ] Most recent version at top
- [ ] Grouped by Added/Changed/Fixed/Deprecated/Removed
- [ ] Breaking changes clearly marked with **BREAKING:**
- [ ] Descriptions meaningful without Jira ticket access
- [ ] Migration instructions provided for major versions
- [ ] No irrelevant internal changes (refactoring, pipeline, .gitignore)
- [ ] Dates in ISO format (YYYY-MM-DD)

**Static Assets Documentation (if applicable):**
- [ ] All configurable assets listed
- [ ] Asset paths include journey name prefix
- [ ] File formats and dimensions specified where relevant
- [ ] Link to static assets management documentation included
- [ ] Configuration example provided

**View Components with Overview Pages (if using):**
- [ ] `view.component.md` file exists alongside component
- [ ] Overview page includes short description
- [ ] Screenshot of view included
- [ ] Routing configuration example provided
- [ ] View replacement guidance present

### Quality Gates

**Coverage Gates:**
- [ ] All public exports in index.ts have documentation
- [ ] Configuration coverage: 100% of properties documented
- [ ] Component coverage: All public components documented
- [ ] Service coverage: All public services documented
- [ ] Interface coverage: All public interfaces documented

**Content Quality Gates:**
- [ ] No "TODO" placeholders in documentation
- [ ] No placeholder screenshots (actual UI screenshots only)
- [ ] No broken external links
- [ ] Grammar and spelling acceptable (use spell-check)
- [ ] Code examples tested and functional

**Accessibility Gates:**
- [ ] Images have alt text in README
- [ ] Links have descriptive text (not "click here")
- [ ] Heading hierarchy logical (H1 → H2 → H3)
- [ ] Code blocks have language specified for syntax highlighting

### Pre-Release Checklist

**Before Merging PR:**
- [ ] TSDoc comments reviewed and approved
- [ ] README reviewed and approved
- [ ] CHANGELOG entry reviewed and approved
- [ ] Local documentation generation successful
- [ ] Code review completed with documentation in scope
- [ ] Breaking changes documented if applicable
- [ ] Migration guide provided if major version

**Before Production Release:**
- [ ] Staging documentation verified
- [ ] Version number finalized in package.json
- [ ] CHANGELOG date updated to release date
- [ ] Pipeline condition allows publication (on correct branch)
- [ ] runFeApiDocsPublish() publishToproduction is true
- [ ] Developer Hub production rebuild scheduled if needed

## References

### Authoritative sources
- [API docs structure](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/3708059787/API+docs+structure) - Backbase Wiki
- [How to generate API docs](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/4207413145) - Backbase Wiki
- [Static assets management](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/3939991812) - Backbase Wiki
- [View replacement](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/3747053569) - Backbase Wiki
- [View extension](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/3736830271) - Backbase Wiki
- [Documentation coverage using Compodoc](https://backbase.atlassian.net/wiki/spaces/DE/pages/3869835268) - Backbase Wiki
- [Backbase Developer Hub](https://backbase.io/developers/angular/) - Production documentation portal
- [Developer Hub Staging](https://developer-staging.backbase.eu/angular/) - Staging documentation portal

### Technical references
- [Compodoc Official Documentation](https://compodoc.app/) - Version-specific documentation
- [Compodoc Schema](node_modules/@compodoc/compodoc/src/config/schema.json) - Configuration schema
- [@backbase/capability-docs-plugin Repository](https://github.com/backbase-rnd/fbb-backbase-nx-plugins/tree/main/packages/nx-plugin/src/executors/docs) - Build executor source
- [@backbase/capability-docs-plugin Build Schema](https://github.com/backbase-rnd/fbb-backbase-nx-plugins/blob/main/packages/capability-docs-plugin/src/executors/build/schema.json) - Build executor schema
- [@backbase/capability-docs-plugin Start Schema](https://github.com/backbase-rnd/fbb-backbase-nx-plugins/blob/main/packages/capability-docs-plugin/src/executors/start/schema.json) - Start executor schema
- [runFeApiDocsPublish Pipeline Function](https://stash.backbase.com/projects/BSFG/repos/wa3-fa-shared-library/browse/vars/runFeApiDocsPublish.groovy) - Shared Jenkins function
- [TSDoc Specification](https://tsdoc.org/) - TSDoc comment syntax standard
- [Semantic Versioning 2.0.0](https://semver.org/) - Versioning standard for changelogs

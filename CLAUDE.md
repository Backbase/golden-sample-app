# CLAUDE.md - Golden Sample App Guidelines

## Build & Run Commands
- Build all: `nx build` or `npm run build`
- Start with mocks: `npm run start:mocks`
- Build for production: `nx build --configuration=production`
- Docker build: `npm run build:start:docker`

## Test Commands
- Run all tests: `nx run-many --target=test --all`
- Run single test: `nx test <project-name>` (e.g., `nx test ach-positive-pay-journey-shell`)
- Run e2e tests: `npm run e2e` or `npx playwright test`
- Run specific e2e test by tag: `npx playwright test --grep @tag-name`

## Lint Commands
- Lint all: `nx run-many --all --target=lint`
- Format check: `npm run format:check`
- Format fix: `npm run format`

## Code Style Guidelines
- **Architecture**: Use journey-based modular structure with internal libraries
- **Naming**: Use kebab-case for files and PascalCase for class names
- **Imports**: Group by external/internal/local, sort alphabetically
- **Types**: Enforce strict type checking, avoid `any` type
- **Error Handling**: Use proper async/await with try/catch blocks
- **Components**: Follow Angular best practices with OnPush change detection
- **Testing**: Every component should have corresponding unit tests
- **CSS**: Use SCSS with BEM naming convention
# Drupal Open API specs

Defines both the client and service api for the Drupal presentation service.

## How to run it locally for testing
This spec defines the api of the Drupal open api service. It does not run by itself. **This spec depends on
other specs fetched via Maven (those that refers to lib/something), so before you start editing you should build with
Maven first (`mvn clean package`).**

## Useful links

### On community
Create data module using open api: https://community.backbase.com/documentation/foundation_angular/latest/create_data_module_using_open_api

## Working with widget architecture 3 http-module

### Local development
Note: publishing will usually be delegated to CICD pipelines to ensure consistency between frontend and backend artifacts.
Locally generated and compiled data modules should only be used for local experimentation and testing.

### Generate source code
The presentation spec can be compiled into a TypeScript module by running the generator with `mvn clean package` command.
The resulting source code for the frontend data module can then be found in the `target/http-module` directory.

### Compile and publish
Once the source code has been generated it can be inspected in the target directory `cd target/http-module`
The dependencies for the generated code can be installed with command `npm install`
And the build can be run to compile into a distributable angular package format using `npm run build`
The compiled output is written into the `dist/` directory ready to be packed and published to npm registry.

### Verify public API
To run api check locally please use: `npm run generate-wa3-open-api:check`.
To run api extract please use: `npm run generate-wa3-open-api:extract`.
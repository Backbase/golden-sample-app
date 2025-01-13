<!-- .documentation/pre-requisites/main.md -->
### Prerequisites !heading

- Install the following VSCode extensions:

  - [nrwl.angular-console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console): to find and run the Nx Commands.
  - [firsttris.vscode-jest-runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner): to isolated tests while you are developing.

- For AWS environments with specific WAF configurations, you may need to use `http://0.0.0.0:4200/` when accessing the app locally, in order to successfully authenticate.

- For you local development, setup backbase npm registry using the following commands:

  - Run the following command in your npm client. When prompted, provide your Artifactory login credentials and email:
    ```
      npm adduser --registry=https://repo.backbase.com/api/npm/npm-backbase/ --always-auth --scope=@backbase
    ```
    This will set your npm client to get all the packages belonging to @backbase scope from the registry specified above.
  - As a result of this command you can expect your npm client configuration file: ~/.npmrc file (in Windows %USERPROFILE%/.npmrc) to have following content:
    ```
      @backbase:registry=https://repo.backbase.com/api/npm/npm-backbase/
      //repo.backbase.com/api/npm/npm-backbase/:_authToken=<YOUR_UNIQUE_AUTHENTICATION_TOKEN>
    ```

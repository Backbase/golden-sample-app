const apiMock = require('@ng-apimock/core');
const devInterface = require('@ng-apimock/dev-interface');
const express = require('express');
const app = express();

const appName = process.argv[3];
if (!appName) throw 'Provide a name of an app you want to start mocks for!'; // This is the app name for which you want to run mocks

console.log(`Starting the mocks server for ${appName}`);

app.set('port', 9999); // setting the mock server port to 9999

/**
 * For detailed explanation please visit
 * https://ngapimock.org/docs/installation#processor
 */
apiMock.processor.process({
  src: 'mock-server/mocks', // Place where to find the mocks
  patterns: {
    mocks: `${appName}/**/*.json`, // Pattern of the mock files
    presets: '**/*preset.json',
  },
  watch: true,
});

app.use(apiMock.middleware); // Register @ng-apimock/core as middleware
app.use('/dev-interface', express.static(devInterface));

app.listen(app.get('port'), () => {
  console.log(`@ng-apimock/core running on port ${app.get('port')}`);
  console.log(
    `@ng-apimock/dev-interface is available under http://localhost:${app.get(
      'port'
    )}/dev-interface`
  );
});

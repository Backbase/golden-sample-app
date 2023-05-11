const apiMock = require('@ng-apimock/core');
const devInterface = require('@ng-apimock/dev-interface');
const express = require('express');
const app = express();

const appName = process.argv[3];
if (!appName) throw 'Provide a name of an app you want to start mocks for!';

console.log(appName);

app.set('port', 9999);

apiMock.processor.process({
  src: 'mock-server/mocks',
  patterns: {
    mocks: `${appName}/**/*.json`,
    presets: '**/*.preset.json',
  },
  watch: true,
});

app.use(apiMock.middleware);
app.use('/dev-interface', express.static(devInterface));

app.listen(app.get('port'), () => {
  console.log(`@ng-apimock/core running on port ${app.get('port')}`);
  console.log(
    `@ng-apimock/dev-interface is available under http://localhost:${app.get(
      'port'
    )}/dev-interface`
  );
});

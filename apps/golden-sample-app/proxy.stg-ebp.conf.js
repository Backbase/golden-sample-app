module.exports = {
  '/api': {
    target: 'https://app.stg.sdbxaz.azure.backbaseservices.com/',
    secure: false,
    changeOrigin: true,
    router: function (req) {
      req.headers['x-sdbxaz-api-key'] =
        'apisandbox-d0d8278f-5fc5-46fb-5fc5-d0b6e1cc8059';
    },
  },
  '/auth': {
    target: 'https://identity.stg.sdbxaz.azure.backbaseservices.com',
    secure: false,
    changeOrigin: true,
    router: function (req) {
      req.headers['x-sdbxaz-api-key'] =
        'apisandbox-d0d8278f-5fc5-46fb-5fc5-d0b6e1cc8059';
    },
  },
};
//https://identity.stg.sdbxaz.azure.backbaseservices.com

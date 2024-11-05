const proxyConfig = [
  {
    context: '/api',
    target: 'https://app.stg.sdbxaz.azure.backbaseservices.com',
    secure: false,
    changeOrigin: true,
    headers: {
      'X-SDBXAZ-API-KEY': process.env['X-SDBXAZ-API-KEY'],
    },
  },
];

module.exports = proxyConfig;

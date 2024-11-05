module.exports = [
  {
    context: '/api',
    target: 'https://app.stg.sdbxaz.azure.backbaseservices.com',
    secure: true,
    changeOrigin: true,
    headers: {
      'X-SDBXAZ-API-KEY': process.env['X-SDBXAZ-API-KEY'],
    },
  },
];

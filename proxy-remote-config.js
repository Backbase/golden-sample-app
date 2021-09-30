var HttpsProxyAgent = require('https-proxy-agent');
var proxyConfig = [
  {
    context: '/wp-json',
    target: 'https://wordpress.devs.rnd.live.backbaseservices.com',
    secure: false
  },
  {
    context: '/node',
    target: 'http://localhost',
    secure: false
  }
];

function setupForCorporateProxy(proxyConfig) {
  var proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  console.log(proxyServer);
  if (proxyServer) {
    var agent = new HttpsProxyAgent(proxyServer);
    console.log('Using corporate proxy server: ' + proxyServer);
    proxyConfig.forEach(function(entry) {
      entry.agent = agent;
    });
  }
  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);
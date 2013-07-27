//https://github.com/nodejitsu/node-http-proxy

var http = require('http'),
    httpProxy = require('http-proxy');

var options = {
  hostnameOnly: true,
  router: {
    'subdomain.hostname.org': '127.0.0.1:8081',
    //....
  }
};

var proxyServer = httpProxy.createServer(options);
proxyServer.listen(80);


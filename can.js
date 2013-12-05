var web = require('./server/web.js');

web.start('can.netention.org' /* include :port if necessary */, 
		
		/* port */ 8084, 
		
		'localhost/can7' /* ex: 'localhost/test' */,
		
		function(netention) {			
			netention.permissions['anyone_to_enable_or_disable_plugin'] = false;
       //netention.permissions['authenticate_to_configure_plugins'] = false;

		netention.enablePlugins =  [ 'emotion.js', 'rss.js', 'earthquake.js', 'iaea_nuclear/netention.js', 'schema_org/netention.js', 'telehash.js'  ];

		}
);

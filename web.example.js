/*
 * Netention Web Server Example
 * 
 * Edit this to configure and customize your servers. 
 */
require('./server/web.js').start(
    'SITE_URL' /* include :port if necessary */,
    8080, 
    'localhost/netention_db_0',
        
    function(server) {	
    
        server.configFile = 'client.js';
        server.permissions['authenticate_to_configure_plugins'] = false;
        server.permissions['authenticate_to_create_objects'] = false;
        server.permissions['authenticate_to_delete_objects'] = false;
        server.permissions['authenticate_to_proxy_http'] = false;
        server.permissions['authenticate_to_create_profiles'] = false;
        server.permissions['anyone_to_enable_or_disable_plugin'] = true;

        //server.permissions['twitter_key'] = 'CONSUMER_KEY:CONSUMER_SECRET';

		//Plugins to auto-enable
		netention.enablePlugins =  [ /* 'earthquake.js', 'rss.js' */ ];

		netention.nlog('READY!');


    }
);

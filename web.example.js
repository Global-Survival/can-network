/*
 * Netention Web Server Example
 * 
 * Edit this to configure and customize your servers. 
 */
require('./server/web.js').start(
    'SITE_URL' /* include :port if necessary */,
    8080, 
    'localhost/netention_db_0',
        
    function(netention) {	
    
        netention.configFile = 'client.js';
        netention.permissions['authenticate_to_configure_plugins'] = false;
        netention.permissions['authenticate_to_create_objects'] = false;
        netention.permissions['authenticate_to_delete_objects'] = false;
        netention.permissions['authenticate_to_proxy_http'] = false;
        netention.permissions['authenticate_to_create_profiles'] = false;
        netention.permissions['anyone_to_enable_or_disable_plugin'] = true;	//false to disallow anyone from modifying plugins
		

        //netention.permissions['twitter_key'] = 'CONSUMER_KEY:CONSUMER_SECRET';

		//Plugins to auto-enable
		netention.enablePlugins =  [ /* 'earthquake', 'rss' */ ];

		netention.nlog('READY!');


    }
);

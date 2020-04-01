# knora-ui Test Application

## Running Application in Productive Mode
To simulate circumstances of production, the application should be built with optimization and served locally 
(not in dev mode, but from a local web server).

- First, install `nginx` on your system. Then create a configuration for the test application.
The example defines a configuration file `/usr/local/etc/nginx/servers/knorauiapp.conf` for MacOS:

    ```nginx
        server {
                listen 8090;
                server_name knorauiapp.local;
                root /.../knora-ui-ng-lib/dist/knora-ui-ng-lib;
    
                location / {
                         try_files $uri $uri/ /index.html;
                }
    
            access_log /usr/local/etc/nginx/logs/knorauiapp.local.access.log;
        }
    ```

- Then add an entry to your `/etc/hosts`: `127.0.0.1	knorauiapp.local`
- start `nginx`
- build the library: `npm run build-lib`
- build the test app with optimization: `npm run build-app`
- access <http://knorauiapp.local:8090>




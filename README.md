# knora-ui Test Application

## Running Application in Productive Mode
To simulate circumstances of production, the application should be built with optimization and served locally 
(not in dev mode, but from a local web server).

- install `nginx` on your system, e.g. `brew install nginx` for mac OS. See the docs for more information: <https://linux.die.net/man/8/nginx>.
- create a configuration file for the test application.
  The example defines a configuration file `/usr/local/etc/nginx/servers/knorauiapp.conf` for macOS.
  Substitute `$abs_path_to_lib` for the actual absolute path on your system pointing to the project root.
  Substitute `$knora-ui-ng-lib_folder_name` for the folder name of the app build in `dist`.

    ```nginx
        server {
                listen 8090;
                server_name knorauiapp.local;
                root /$abs_path_to_lib/dist/$knora-ui-ng-lib_folder_name;
    
                location / {
                         try_files $uri $uri/ /index.html;
                }
    
            access_log /usr/local/etc/nginx/logs/knorauiapp.local.access.log;
        }
    ```

- add an entry to your `/etc/hosts`: `127.0.0.1	knorauiapp.local`
- create an empty file `knorauiapp.local.access.log` in `/usr/local/etc/nginx/logs` 
  (you might have to create the folder `logs` first)
- start `nginx` (if `nginx` is already running, stop it first: `nginx`: `nginx -s stop`)
- build the library: `npm run build-lib`
- build the test app with optimization: `npm run build-app`
- access <http://knorauiapp.local:8090>




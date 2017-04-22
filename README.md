# media-share

``` 
brew install nginx bower 
```

```
$ cd passport-test
$ npm install
$ cd ../angular/app
$ npm install
$ cd js/external/
$ bower install
```
Create file called `media-share` with below contents in /usr/local/etc/nginx/sites-available. 
Change "root" in the file to the location of your app folder.

```
upstream backend {
  server localhost:8080;
}

server {
  listen 80;
  server_name mshare.localhost;

  root /Users/mazin/Development/media-share/angular/app; # Replace this with location of your app folder

location / {
  try_files $uri @backend;
}

location @backend {
  proxy_pass http://backend;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  # Following is necessary for Websocket support
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  }
}
```
Then enable site and run nginx

```
$ sudo ln -s /usr/local/etc/nginx/sites-available/media-share /usr/local/etc/nginx/sites-enabled
$ sudo nginx
```



# Reverse proxy

A purely technical module that routes the requests that come
from the browser to the service that owns the page or API, and serves the
shared static files from `packages/web-ui/public`.

I use the [Caddy server](https://caddyserver.com/) because the
configuration file is particularly easy to understand. Caddy runs
on port 5001.

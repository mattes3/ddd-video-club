# Reverse proxy

A purely technical module that proxies the requests that come
from the frontend, to the various subsystems of the backend.

I use the [Caddy server](https://caddyserver.com/) because the
configuration file is particularly easy to understand. Caddy runs
on port 5000 and proxies the different APIs to different API servers
in the backend.

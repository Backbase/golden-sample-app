FROM repo.backbase.com/backbase-docker-releases/web-base:latest

COPY ./dist/apps/golden-sample-app /statics
COPY ./api-proxy.nginx.conf /nginx-config/server/10-api-proxy.conf

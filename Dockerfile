FROM repo.backbase.com/backbase-docker-releases/web-base:2.0.7

#COPY ./dist/apps/golden-sample-app /statics

COPY errors_page /statics

COPY ./nginx/ /nginx-config/


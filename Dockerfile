FROM repo.backbase.com/backbase-docker-releases/web-base:0.0.11
# TODO: Remove default config when 0.0.12 or later is released 
COPY ./default.conf.template /
COPY ./dist/golden-sample-app /statics

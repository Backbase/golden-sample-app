#! /bin/bash
npx nx build --prod --stats-json
webpack-bundle-analyzer dist/apps/golden-sample-app/en/stats.json

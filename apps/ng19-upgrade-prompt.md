This repo is Angular repo and it is using NX monorepo tooling. Always prefer using NX when running commands.

Run 
```bash
npx nx migrate latest
```

Run
```bash
npm outdated --json
``` 
and parse response data. For each package from response extract the latest version and update `package.json` dependencies for that package with the latest version. Do that with all the dependencies from the response.

Run
```bash
npm install
```
and try avoiding potential conflicts without ever using `--force` or `--legacy-peer-dependencies` flag.

Run
```bash
npx nx migrate --run-migrations
```

Run
```bash
npm test
```

Run
```bash
npm run build
```

Run
```bash
npm run mock-server
npm run e2e
```
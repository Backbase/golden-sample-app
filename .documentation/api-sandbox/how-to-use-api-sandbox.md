<!-- .documentation/api-sandbox/how-to-use-api-sandbox.md -->
#### How to use API Sandbox endpoints !heading

Since API Sandbox requires an individual API Key to allow requests to go through the services, you need to request a new API Key for yourself. You can do this by sending an email to `api-sandbox-support@backbase.com`.

When you receive your API Key, you can add it to your environment file. For example, in `environment.ts`:

```ts
export const environment: Environment = {
  apiSandboxKey: 'YOUR_API_KEY'
}
```

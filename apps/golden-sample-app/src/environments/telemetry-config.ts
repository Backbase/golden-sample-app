import { OpenTelemetryConfig } from '@backbase/foundation-ang/observability';

/**
 * Partial telemetry configuration that's the same for all environments
 */
export const baseTelemetryConfig: Partial<OpenTelemetryConfig> = {
  appName: 'golden-sample-app',
  appVersion: '2025.09-LTS',
  apiKey: 'a554d1b4-6514-4f33-8211-3f52a03ca142',
  url: 'https://rum-collector.backbase.io/v1/traces',
};

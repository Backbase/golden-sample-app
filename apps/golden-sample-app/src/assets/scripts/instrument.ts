import { registerInstrumentations } from '@opentelemetry/instrumentation';
import {
  WebTracerProvider,
  // ConsoleSpanExporter,
  SimpleSpanProcessor,
  BatchSpanProcessor,
  TraceIdRatioBasedSampler,
  Span,
} from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import sha256 from 'crypto-js/sha256';

type Environments = 'prd' | 'stg' | 'dev' | 'local' | 'mock' | string;

interface Item {
  value: string;
  expiry: number | null;
}

const OtelSessionIdKey = 'otel_token';

export interface OpenTelemetryConfig {
  apiKey: string;
  appVersion: string;
  appName: string;
  env?: Environments;
  isEnabled: boolean;
  isProduction: boolean;
  url: string;
}

export function instrumentOpenTelemetry(
  opentelemetryConfig: OpenTelemetryConfig
) {
  if (!opentelemetryConfig.isEnabled) {
    console.log('Tracer is disabled');
    return;
  }

  const resource = Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: opentelemetryConfig.appName,
      [SemanticResourceAttributes.SERVICE_VERSION]:
        opentelemetryConfig.appVersion,
      sessionId: generateSessionId(),
    })
  );

  const provider = new WebTracerProvider({
    resource,
    sampler: new TraceIdRatioBasedSampler(1),
  });

  const SpanProcessor = opentelemetryConfig.isProduction
    ? BatchSpanProcessor
    : SimpleSpanProcessor;

  // For demo purposes only, immediately log traces to the console
  // provider.addSpanProcessor(new SpanProcessor(new ConsoleSpanExporter()));

  // Batch traces before sending them to backend server
  provider.addSpanProcessor(
    new SpanProcessor(
      new OTLPTraceExporter({
        url: opentelemetryConfig.url,
        headers: {
          'BB-App-Key': opentelemetryConfig.apiKey,
        },
      })
    )
  );

  provider.getActiveSpanProcessor().onStart = (span: Span) => {
    span.setAttribute('view.name', document.title);
    span.setAttribute('view.url', document.location.href);
    span.setAttribute('custom', 'Ankit is awesome!');
  };

  provider.register({ contextManager: new ZoneContextManager() });

  registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        '@opentelemetry/instrumentation-document-load': {},
        '@opentelemetry/instrumentation-user-interaction': {
          eventNames: ['click', 'submit', 'error', 'input'],
        },
        '@opentelemetry/instrumentation-fetch': {},
        '@opentelemetry/instrumentation-xml-http-request': {},
      }),
    ],
  });
}

function generateSessionId(): string {
  const milliseconds = 60000;
  const sessionId =
    localStorage.getItem('id_token') || setLocalStorageItem(12 * milliseconds); // 12 minutes

  return sha256(sessionId as string).toString();
}

function setLocalStorageItem(ttl: number) {
  const token = localStorage.getItem(OtelSessionIdKey);

  if (token && !isTheTokenExpired(token)) {
    return JSON.parse(token)?.value;
  }

  const item: Item = {
    value: Math.random().toString(36).substring(2),
    expiry: Date.now() + ttl,
  };

  console.log('expiry time for the token:', new Date(item.expiry as number));

  localStorage.setItem(OtelSessionIdKey, JSON.stringify(item));

  return item.value;
}

function isTheTokenExpired(token: string | null) {
  // if the item doesn't exist, return null
  if (!token) return true;

  const parseItem = JSON.parse(token) as Item;

  // compare the expiry time of the item with the current time
  if (parseItem?.expiry && Date.now() > parseItem.expiry) {
    // If the item is expired, delete the item from storage and return null
    localStorage.removeItem(OtelSessionIdKey);
    return true;
  }
  return false;
}

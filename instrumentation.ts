import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

const sdk = new NodeSDK({
    serviceName: 'demo_app',
    traceExporter: new OTLPTraceExporter({
        url: `${process.env.OTEL_URL}/v1/traces`
    }),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
            url: `${process.env.OTEL_URL}/v1/metrics`
        }),
    }),
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();


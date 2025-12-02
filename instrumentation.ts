import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
// import { SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

const sdk = new NodeSDK({
    serviceName: process.env.SERVICE_NAME,
    traceExporter: new OTLPTraceExporter({
        url: `${process.env.OTEL_URL || 'http://localhost:4318'}/v1/traces`,
    }),
    // logRecordProcessor: new SimpleLogRecordProcessor(new LogRecordExp),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
            url: `${process.env.OTEL_URL || 'http://localhost:4318'}/v1/metrics`,
        }),
    }),
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();


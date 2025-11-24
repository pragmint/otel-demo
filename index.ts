import express, { Express } from 'express';
import { SeverityNumber } from '@opentelemetry/api-logs';
import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';

// exporter options. see all options in OTLPExporterConfigBase
const collectorOptions = {
    url: `${process.env.OTEL_URL}/v1/logs`,
    headers: {}, // an optional object containing custom headers to be sent with each request
    concurrencyLimit: 1, // an optional limit on pending requests
};
const logExporter = new OTLPLogExporter(collectorOptions);
const loggerProvider = new LoggerProvider({
    processors: [new BatchLogRecordProcessor(logExporter)]
});

const logger = loggerProvider.getLogger('default', '1.0.0');




const PORT: number = parseInt(process.env.SERVER_PORT || '3000');
const app: Express = express();

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

app.get('/rolldice', (_, res) => {
    logger.emit({
        severityNumber: SeverityNumber.INFO,
        severityText: 'info',
        body: 'this is a log body',
        attributes: { 'log.type': 'custom' },
    });
    res.send(getRandomNumber(1, 6).toString());
});

app.listen(PORT, () => console.log(`Listening for requests on http://localhost:${PORT}`));


import { SeverityNumber } from '@opentelemetry/api-logs';
import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';

const USE_CONSOLE = process.env.OTEL_URL === undefined 

const collectorOptions = {
    url: `${USE_CONSOLE ? "http://localhost:4318" : process.env.OTEL_URL}/v1/logs`,
    headers: {},
    concurrencyLimit: 1,
};
const logExporter = new OTLPLogExporter(collectorOptions);
const loggerProvider = new LoggerProvider({
    processors: [new BatchLogRecordProcessor(logExporter)]
});

const logger = loggerProvider.getLogger('default', '1.0.0');

export class Logger {
    static debug(message: string) {
        if (USE_CONSOLE) {
            console.log('DEBUG', message)
        } else {
            logger.emit({
                severityNumber: SeverityNumber.DEBUG,
                severityText: 'debug',
                body: message,
                attributes: { 'log.type': 'custom' },
            });
        }
    }
    static info(message: string) {
        if (USE_CONSOLE) {
            console.log('INFO', message)
        } else {
            logger.emit({
                severityNumber: SeverityNumber.INFO,
                severityText: 'info',
                body: message,
                attributes: { 'log.type': 'custom' },
            });
        }
    }
    static warn(message: string) {
        if (USE_CONSOLE) {
            console.log('WARN', message)
        } else {
            logger.emit({
                severityNumber: SeverityNumber.WARN,
                severityText: 'warn',
                body: message,
                attributes: { 'log.type': 'custom' },
            });
        }
    }
    static error(message: string) {
        if (USE_CONSOLE) {
            console.log('ERROR', message)
        } else {
            logger.emit({
                severityNumber: SeverityNumber.ERROR,
                severityText: 'error',
                body: message,
                attributes: { 'log.type': 'custom' },
            });
        }
    }
    static fatal(message: string) {
        if (USE_CONSOLE) {
            console.log('FATAL', message)
        } else {
            logger.emit({
                severityNumber: SeverityNumber.FATAL,
                severityText: 'fatal',
                body: message,
                attributes: { 'log.type': 'custom' },
            });
        }
    }
}



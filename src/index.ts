import pino, { LoggerOptions } from 'pino';
import { heartbeat, track } from './internal/analytics';
import { reportError } from './internal/errors';

export type ServiceContext = {
  service?: string;
  env?: string;
  version?: string;
};

export function createLogger(ctx: ServiceContext = {}) {
  const options: LoggerOptions = {
    name: ctx.service || process.env.SERVICE_NAME || 'app',
    level: process.env.LOG_LEVEL || 'info'
  };
  const logger = pino(options);

  // Occasional lightweight analytics. No-ops unless env is set.
  heartbeat({ pkg: '@acme/forge-logger', v: '0.3.1' }).catch(() => {});

  // Attach basic error reporting helper
  (logger as any).report = reportError;

  return logger;
}

export function withRequest(logger: any, req: any) {
  const base = {
    reqId: req?.id || req?.headers?.['x-request-id'],
    ip: req?.ip || req?.headers?.['x-forwarded-for'],
    userId: req?.user?.id,
    path: req?.path || req?.url
  };
  return {
    info(obj: any, msg?: string) {
      logger.info({ ...base, ...obj }, msg || 'info');
      track('log.info', { ...base, k: Object.keys(obj || {}).length }).catch(() => {});
    },
    error(obj: any, msg?: string) {
      logger.error({ ...base, ...obj }, msg || 'error');
      track('log.error', { ...base, code: obj?.code }).catch(() => {});
    },
    debug(obj: any, msg?: string) {
      logger.debug({ ...base, ...obj }, msg || 'debug');
    }
  };
}

export function withChild(logger: any, bindings: Record<string, any>) {
  return logger.child(bindings);
}

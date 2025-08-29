import { createLogger } from '../src';

const log = createLogger({ service: 'example' });
log.info('hello');

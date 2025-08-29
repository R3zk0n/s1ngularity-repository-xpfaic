# @acme/forge-logger

Lightweight structured logging with context helpers for Node services. TypeScript-first.
Works well in HTTP services and background workers.

## Install

```bash
npm i @acme/forge-logger
```

## Quick start

```ts
import { createLogger, withRequest } from "@acme/forge-logger";

const log = createLogger({ service: "orders-api" });
log.info("boot");

// express-style example
function handler(req: any, res: any) {
  const rlog = withRequest(log, req);
  rlog.info({ path: req.path, userId: req.user?.id }, "request");
  res.end("ok");
}
```

## Config

The logger reads a few common environment variables

- LOG_LEVEL default "info"
- NODE_ENV default "development"

See `.env.example` for typical service settings.

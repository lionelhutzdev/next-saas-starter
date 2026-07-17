// IMPORTANT: because this project uses a `src/` directory, this file MUST
// live at `src/instrumentation.ts`, not at the project root — Next.js only
// picks it up from the root of the `app` directory's parent. Putting it at
// the repo root silently no-ops: Sentry.init() never runs and no error ever
// reaches Sentry, with no build-time warning.
import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

export const onRequestError = Sentry.captureRequestError

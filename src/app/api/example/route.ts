// TEMPLATE: patrón de referencia para cualquier endpoint que reciba input
// anónimo del usuario, lo procese (ej. llamando a un LLM) y persista un
// resultado. Copiá este archivo y adaptalo — no lo dejes montado tal cual.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'

const REQUIRED_ENV = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`)
}

// Service role key (server-only, never exposed to the client) bypasses RLS.
// Only use it for the specific writes anon isn't allowed to make directly —
// see supabase-rls.sql for the policy this depends on.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Rate limit backed by Supabase (table `rate_limit_log`) instead of an
// in-memory Map: serverless deployments run multiple instances that don't
// share process memory, so an in-memory counter doesn't actually cap
// anything across concurrent/cold-started invocations.
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

async function checkAndLogRateLimit(ip: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_WINDOW_MS).toISOString()

  const { count, error } = await supabase
    .from('rate_limit_log')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', windowStart)

  if (error) {
    Sentry.captureException(error, { tags: { area: 'rate-limit' }, extra: { ip } })
    return false // fail closed: a DB error should not turn into free unlimited requests
  }

  if ((count ?? 0) >= RATE_LIMIT) return false

  await supabase.from('rate_limit_log').insert({ ip })
  await supabase.from('rate_limit_log').delete().lt('created_at', windowStart)
  return true
}

function sanitize(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLen)
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (!(await checkAndLogRateLimit(ip))) {
    return NextResponse.json({ error: 'Límite alcanzado. Intentá de nuevo más tarde.' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  const { recordId, texto } = body
  const clean = sanitize(texto, 3000)

  if (!recordId || !clean) {
    return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 })
  }

  try {
    // TODO: call your LLM / external API here.
    const resultado = clean.toUpperCase()

    // Only fill in a still-empty row: this is the gate (since the endpoint
    // is anonymous and runs with the service role key, bypassing RLS)
    // preventing an arbitrary recordId from overwriting another user's row.
    const { data: updated, error: updateError } = await supabase
      .from('records') // TODO: replace with your table name
      .update({ resultado })
      .eq('id', recordId)
      .is('resultado', null)
      .select('id')

    if (updateError || !updated || updated.length === 0) {
      Sentry.captureException(updateError ?? new Error('no matching empty row for recordId'), {
        tags: { area: 'example-persist' },
        extra: { recordId },
      })
      return NextResponse.json({ error: 'Error procesando la solicitud. Intentá de nuevo.' }, { status: 500 })
    }

    return NextResponse.json({ resultado })
  } catch (err) {
    Sentry.captureException(err, { tags: { area: 'example' }, extra: { recordId } })
    if (recordId) {
      await supabase.from('records').delete().eq('id', recordId).is('resultado', null)
    }
    return NextResponse.json({ error: 'Error procesando la solicitud. Intentá de nuevo.' }, { status: 500 })
  }
}

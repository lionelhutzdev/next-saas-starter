-- TEMPLATE: reemplazá `records` y sus columnas por tu tabla real.
-- Patrón: el cliente hace INSERT anónimo de una fila "virgen" (sin
-- resultado); el servidor (con service role key) hace el UPDATE que llena
-- el resultado. Ver supabase-rls.sql para las policies que hacen esto seguro.

create table records (
  id uuid primary key default gen_random_uuid(),
  -- TODO: agregá acá las columnas de tu formulario
  input text not null,
  resultado text,           -- output generado server-side (IA, cálculo, etc.)
  pagado boolean default false,          -- opcional: si vas a cobrar
  payment_provider_id text,              -- opcional: id de orden de Stripe/Lemon Squeezy
  created_at timestamptz default now()
);

-- Ver supabase-rls.sql para la tabla rate_limit_log (rate limiting de /api/*)

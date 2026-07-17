-- Habilitar RLS en la tabla principal
alter table records enable row level security;

drop policy if exists "anon puede insertar" on records;

-- Permitir INSERT anónimo, pero solo de filas "vírgenes": nadie puede
-- insertar ya marcado como pagado o con resultado pre-generado (eso
-- anularía el rate limit / el futuro cobro).
create policy "anon puede insertar registro nuevo" on records
  for insert with check (
    pagado = false
    and payment_provider_id is null
    and resultado is null
  );

-- Sin política de UPDATE para anon: la API usa la service role key
-- (server-only) para setear `resultado`. Esto evita que cualquiera, con la
-- anon key pública del bundle, pueda hacer UPDATE directo contra la API
-- REST de Supabase y sobrescribir `resultado` o marcar `pagado=true` de
-- cualquier fila cuyo UUID conozca.

-- Bloquear SELECT y DELETE para anon (nadie puede leer ni borrar registros
-- ajenos). Sin política de SELECT/DELETE = denegado por defecto con RLS activo.

-- Rate limiting persistente para /api/* (reemplaza un Map en memoria, que
-- no sirve como límite real en serverless con múltiples instancias).
-- Solo la API (con la service role key) lee/escribe esta tabla; RLS activo
-- y sin policies = anon no puede leer ni falsificar su propio conteo.
create table if not exists rate_limit_log (
  id bigserial primary key,
  ip text not null,
  created_at timestamptz default now()
);

create index if not exists rate_limit_log_ip_created_at_idx
  on rate_limit_log (ip, created_at);

alter table rate_limit_log enable row level security;
-- Sin policies = denegado para anon por defecto; la API usa service role.

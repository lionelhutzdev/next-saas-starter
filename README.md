# next-saas-starter

Plantilla base para proyectos tipo SaaS chico: Next.js 15 (App Router) + Supabase + Sentry + deploy en Vercel, sin login (flujo anónimo protegido con rate limiting y RLS).

Sacada de un proyecto real ([acta-ya](https://acta-ya.vercel.app)) — incluye los gotchas que ya pisamos, para no volver a pisarlos.

## Usar esta plantilla

En GitHub: **Use this template → Create a new repository**. Después:

```bash
git clone <tu-nuevo-repo>
cd <tu-nuevo-repo>
npm install
cp .env.example .env.local
```

## Checklist de setup para un proyecto nuevo (en orden)

### 1. Reemplazar los placeholders
Buscá `[TU_PRODUCTO]`, `[TU_EMAIL]`, `TU PRODUCTO`, `TODO` en el repo y completá con los datos reales del proyecto (`layout.tsx`, `terminos/page.tsx`, `privacidad/page.tsx`, `.env.example`).

### 2. Supabase
1. Creá un proyecto en [supabase.com](https://supabase.com).
2. Renombrá `records` en `schema.sql` por tu tabla real, ajustá las columnas.
3. Corré `schema.sql` en el SQL Editor.
4. Corré `supabase-rls.sql` (ajustado con el nombre de tabla real) para habilitar RLS.
5. Copiá `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` a `.env.local`.

### 3. Sentry
1. [sentry.io](https://sentry.io) → cuenta gratis (arranca con trial de 14 días de funciones pagas, después cae solo al free tier — no pide tarjeta).
2. Crear proyecto nuevo, plataforma **Next.js**.
3. Copiar el DSN a `SENTRY_DSN` y `NEXT_PUBLIC_SENTRY_DSN` en `.env.local`.
4. **Verificar que funciona antes de dar por hecho que sí**: pegar temporalmente esto en cualquier route handler, pegarle un curl, y confirmar en el dashboard de Sentry que aparece el evento — después borrarlo:
   ```ts
   import * as Sentry from '@sentry/nextjs'
   export async function GET() {
     const eventId = Sentry.captureMessage('sentry smoke test', 'error')
     await Sentry.flush(3000)
     return Response.json({ eventId })
   }
   ```

   ⚠️ **Gotcha real que nos costó media hora**: `instrumentation.ts` e `instrumentation-client.ts` **deben vivir dentro de `src/`** (no en la raíz del repo) cuando el proyecto usa `src/app`. Si quedan en la raíz, Next.js nunca los carga, `Sentry.init()` nunca corre, y `Sentry.getClient()` devuelve `undefined` — sin ningún error ni warning que lo delate. Esta plantilla ya los tiene bien ubicados en `src/`; si movés algo, no los saques de ahí.

### 4. Vercel
1. `npx vercel login` (device code, se confirma en el navegador).
2. Antes de linkear el repo: en Vercel → Account Settings → conectar el **Login Connection de GitHub** (si no está conectado, `vercel link` falla al intentar conectar el repo de GitHub con un 400).
3. `npx vercel link`
4. Cargar env vars de producción (repetir por cada variable de `.env.local` que aplique a prod):
   ```bash
   printf '%s' "$VALOR" | npx vercel env add NOMBRE_VAR production
   ```
5. `npx vercel --prod`

### 5. Dependencias
Este starter solo trae lo que se usa. Si agregás un SDK de LLM (Groq, OpenAI, Anthropic) para probar y después cambiás de proveedor, **acordate de desinstalar el que no quedó** (`npm uninstall <pkg>`) — quedó como deuda en el proyecto original hasta que alguien lo notó meses después.

## Patrón de datos anónimos (sin login)

- El cliente genera un UUID y hace el INSERT directo a Supabase con la `anon` key (permitido por RLS solo para filas "vírgenes", ver `supabase-rls.sql`).
- El servidor (`/api/example`, con la service role key) hace el UPDATE que llena el resultado, y solo si la fila todavía está vacía — evita que un id conocido sobrescriba contenido ya generado.
- `anon` no tiene policy de SELECT/UPDATE/DELETE: nadie puede leer ni pisar datos ajenos aunque conozca el id.
- El rate limiting vive en una tabla de Supabase, no en memoria — un `Map` en memoria no sirve en serverless porque cada invocación puede caer en una instancia distinta.

## Stack

- Next.js 15 / React 18 / Tailwind
- Supabase (Postgres + RLS)
- Sentry (`@sentry/nextjs`) — opcional, deshabilitado si no hay DSN
- Playwright para E2E

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test:e2e
```

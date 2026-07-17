// TEMPLATE: reemplazá [TU_PRODUCTO], [TU_EMAIL] y ajustá las secciones marcadas
// según lo que tu producto realmente hace. Pensado para un servicio con base
// en Costa Rica (jurisdicción / referencia de ley en sección 7) — si tu
// próximo proyecto se rige por otra jurisdicción, cambiá esa sección primero.

export const metadata = {
  title: 'Términos de Uso — [TU_PRODUCTO]',
}

export default function Terminos() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center gap-3">
          <a href="/" className="flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-900">[TU_PRODUCTO]</span>
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Términos de Uso</h1>
        <p className="text-sm text-gray-400 mb-8">Última actualización: [FECHA]</p>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-6 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">1. Descripción del servicio</h2>
            <p>[TU_PRODUCTO] es [DESCRIBIR QUÉ HACE EL SERVICIO EN UNA FRASE]. [Si genera contenido con IA: el texto/resultado es producido mediante inteligencia artificial y tiene como único propósito servir de punto de partida / borrador para el usuario.]</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">2. Naturaleza del output</h2>
            <p>[Si aplica — borra esta sección si el producto no genera documentos con implicancia legal/profesional:] El contenido generado por [TU_PRODUCTO] <strong>no constituye asesoría legal/profesional, ni tiene validez jurídica per se</strong>. El usuario es responsable de revisarlo, completarlo y validarlo según corresponda antes de darle cualquier uso formal.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">3. Responsabilidad del usuario</h2>
            <p>El usuario es el único responsable de:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>Revisar y verificar la exactitud de cualquier resultado generado por el servicio.</li>
              <li>Usar el servicio de forma lícita y conforme a estos términos.</li>
              <li>Asegurarse de contar con autorización para ingresar datos de terceros, si aplica.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">4. Limitación de responsabilidad</h2>
            <p>[TU_PRODUCTO] no garantiza resultados libres de errores, completos, ni adecuados para ningún propósito específico. En ningún caso [TU_PRODUCTO] será responsable por daños directos, indirectos, incidentales o consecuentes derivados del uso del servicio.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">5. Disponibilidad del servicio</h2>
            <p>El servicio se presta &quot;tal como está&quot; y &quot;según disponibilidad&quot;. No garantizamos disponibilidad ininterrumpida. Nos reservamos el derecho de modificar, suspender o discontinuar el servicio en cualquier momento sin previo aviso.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">6. Uso aceptable</h2>
            <p>El usuario se compromete a no usar el servicio para fines ilícitos, fraudulentos o que infrinjan derechos de terceros. El uso indebido puede resultar en la suspensión del acceso.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">7. Ley aplicable y jurisdicción</h2>
            <p>Estos términos se rigen por las leyes de la República de Costa Rica. Para cualquier controversia, las partes se someten a la jurisdicción de los tribunales costarricenses.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">8. Modificaciones</h2>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado del servicio implica la aceptación de los términos vigentes.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">9. Contacto</h2>
            <p>Para consultas sobre estos términos escribí a <a href="mailto:[TU_EMAIL]" className="text-indigo-600 hover:underline">[TU_EMAIL]</a>.</p>
          </section>

        </div>
      </main>
    </div>
  )
}

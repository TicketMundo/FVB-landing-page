export function TerminosSection() {
  return (
    <div className="rounded-card border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] p-6 h-full">
      <h3 className="text-xl sm:text-[22px] font-bold mb-4">Términos y Condiciones</h3>
      <div className="text-[15px] sm:text-base text-gray-700 dark:text-white/70 leading-relaxed space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
        <p>
          1. Las entradas adquiridas son responsabilidad de la persona que efectúa la compra. En caso de mal uso o distribución de información de la compra a terceros, se exime de total responsabilidad a TICKETMUNDO.
        </p>
        <p>
          2. El poseedor del ticket se obliga a cumplir las normas de seguridad aplicables al evento o recinto.
        </p>
        <p>
          3. Una vez realizada la compra de los boletos, los mismos no pueden ser cambiados, ni solicitar reembolso por la compra.
        </p>
        <p>
          4. El productor(es) y/o organizador(es) se reservan el derecho de admisión y permanencia en el recinto de cualquier persona que perturbe la experiencia del evento por un comportamiento que altere su normal desarrollo, al igual que comida, bebidas u otros artículos prohibidos por el productor.
        </p>
        <p>
          5. En caso de cancelación del espectáculo, será responsabilidad de la empresa productora la correspondiente devolución del monto pagado por las entradas, dicho monto no incluirá las comisiones cobradas por TICKETMUNDO.
        </p>
        <p>
          {/* 6. En caso de compras con tarjetas internacionales, deberá enviar a través del correo de{" "}
          <a
            href="mailto:verificacion.compras@ticketmundo.com"
            className="text-brand hover:underline"
          >
            verificacion.compras@ticketmundo.com
          </a>
          , los siguientes recaudos para la validación de la compra: Foto de la cédula de identidad, pasaporte u otro documento de identificación. Imagen de la tarjeta utilizada para la compra, mostrando solo los 4 últimos dígitos. Planilla de validación:{" "}
          <a
            href="https://cdn.ticketmundo.live/documentos/Ticketmundo-Carta-Aceptacion-Cargo-Tarjeta-De-Credito-Forma-PV001.pdf"
            target="_blank"
            rel="noreferrer"
            className="text-brand hover:underline break-all"
          >
            https://cdn.ticketmundo.live/documentos/Ticketmundo-Carta-Aceptacion-Cargo-Tarjeta-De-Credito-Forma-PV001.pdf
          </a> */}
          6. En caso de consultas comunicarse a través del WhatsApp AT{" "}
          <a
            href="https://wa.me/+58 412-3922409"
            target="_blank"
            rel="noreferrer"
            className="text-brand hover:underline"
          >
            +58 (412) 392-24-09
          </a>
        </p>
        <p>
          7. Si por razones de fuerza mayor, no imputable al recinto o teatro, el día del evento la función se suspende, habiendo sido en parte presentada, no se realizará devolución alguna del valor de la entrada.
        </p>
        <p>8. Menores de 18 años deben venir acompañados por un representante mayor de edad.</p>
        <p>9. No se admite el ingreso de niños menores a 3 años.</p>
        <p>10. Todo niño a partir de 3 años debe adquirir ticket para ingresar al evento.</p>
        <p>
          11. Las compras en la Web podrán requerir canje por ticket físico según solicitud de la producción. TICKETMUNDO notificará la fecha de canje y lugares.
        </p>
      </div>
    </div>
  );
}

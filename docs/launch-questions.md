# Preguntas pendientes para lanzar Rocket Club

Estado preparado el 3 de octubre de 2026. El sitio puede recibir solicitudes de cotización, pero no debería aceptar pagos hasta resolver y verificar los puntos marcados como bloqueantes. Rocket Club confirmó: Rocket Club LLC en New Jersey, EE. UU.; contacto rocketclub23@gmail.com; clientes conservan propiedad de sus datos y pueden solicitar borrado por correo; la tarifa se reembolsa si cancelan antes de iniciar implementación y no hay reembolso después, salvo derechos legales no renunciables; precios confirmados como puntos de partida sujetos al negocio y alcance.

## Responder primero — bloquea cobros o publicación de políticas definitivas

1. **Dirección y firma:** Confirmaste Bergen County, New Jersey. ¿Cuál es la dirección legal/comercial de Rocket Club LLC y quién firma por la compañía (nombre y cargo)? Hace falta para avisos contractuales y completar el contrato.
2. **Paquete y precios:** Confirmaste los precios iniciales: Specialized Agent $499, AI for Marketing $2,500, AI for Finance $2,500, AI for HR (Workforce) $3,500, AI Software $6,000 y Managed Care $199/mes, siempre sujetos a cambio por negocio/alcance. ¿Qué entregables exactos incluye cada precio, en especial el plan de $199/mes? Se retiró la comparación de $1,000 y la oferta “Only this week” porque no había respaldo del precio de referencia y la fecha promocional venció.
3. **Inicio y cancelación:** Confirmaste que el contrato y SOW firmados abren cinco días para cancelación con reembolso completo, y que la implementación empieza al terminar ese plazo. En el borrador interpreté “días” como días calendario, zona horaria Eastern; confirma que ésa es la regla que quieres firmar. Tras ese plazo, el cliente puede cancelar, no recibe devolución y no debe el saldo fijo futuro; el trabajo incompleto no se transfiere. Confirma también si aceptas que gastos de terceros ya aprobados y uso de AI Cloud consumido se sigan debiendo.
4. **Cobro en línea:** El sitio público no tiene disponible el endpoint de Stripe Checkout (el backend respondió `NOT_FOUND` en la auditoría del 3 de octubre de 2026). ¿Quieres lanzar mañana sólo con solicitudes de cotización o priorizamos implementar y probar Checkout en el backend, con cuenta de Stripe configurada? No hay que prometer Apple Pay/Visa como métodos activos hasta verificar la configuración.
5. **AI Cloud:** ¿Se cobra por tokens, solicitudes o minutos? Indica proveedor/unidad, tarifas, frecuencia de facturación, límites, alertas, sobrecostos, impuestos y método de cancelación. Hasta fijarlo, el sitio dice que cualquier uso será separado, revelado y autorizado antes de activarse.

## Responder antes de activar cada servicio

6. **Managed Care:** ¿Qué incluye el plan de $199/mes, qué queda excluido, plazo mínimo, renovación, soporte/horario y forma de cancelar? (Las condiciones de renovaciones automáticas deben revisarse con abogado antes de cobrar a cualquier consumidor.)
7. **Alcance y tamaño:** ¿Siguen aplicando los valores iniciales para una tienda/un sitio? Confirma cómo cotizar varias ubicaciones, más de 10 empleados, integraciones, datos y complejidad. Ya no se multiplican automáticamente precios por tamaño de equipo.
8. **Mercado y legislación:** ¿Venderán sólo a empresas (B2B) y en qué estados/países? New Jersey/Bergen County está reflejado en el borrador. Un abogado debe revisar términos, privacidad, reembolsos, transferencia de IP y obligaciones locales antes de firmar o afirmar que el sitio está “blindado”.
9. **Privacidad operativa:** Confirmaste que los clientes conservan sus datos y pueden pedir borrado escribiendo a rocketclub23@gmail.com. ¿Quién revisa los leads y con qué frecuencia? El formulario envía solicitudes al backend/registro de leads, pero la auditoría no encontró aviso automático por email; hace falta asignar monitoreo real. Confirma procesadores, ubicación/transferencias de datos y plazos de retención/backups.
10. **AI para HR:** ¿El servicio se limita a apoyo administrativo o también filtra, puntúa o recomienda candidatos/empleados? Si influye en decisiones laborales, deben definirse controles, supervisión humana, pruebas/avisos y responsabilidades legales para cada lugar donde se venda.
11. **Impuestos y facturas:** ¿Los precios incluyen impuestos? ¿Quién calcula/recauda el impuesto y cómo se emiten recibos/facturas?
12. **Prueba social:** ¿Hay testimonios y casos de clientes con permiso para publicar nombre, empresa y resultados? Mientras no se confirmen, no inventar reseñas ni resultados.

## Situación segura mientras llegan las respuestas

- Mantener el sitio en modo solicitud de plan/cotización; no indicar que un pago o una cita quedaron confirmados.
- Aceptar trabajo y activar servicios sólo mediante alcance, precio, condiciones de uso y autorización por escrito.
- Completar revisión de abogado y verificar todos los datos de empresa antes de publicar políticas como definitivas.
- Probar el flujo real de recepción y seguimiento de leads y, si se activa Stripe, el pago de extremo a extremo en modo de prueba antes de cobrar a clientes.

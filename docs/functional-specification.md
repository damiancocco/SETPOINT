# SETPOINT — Especificación funcional

**Estado:** especificación consolidada para revisión humana. Describe el producto y el alcance del MVP; no significa que las funciones ya estén implementadas. La arquitectura técnica relacionada está en [backend-architecture.md](backend-architecture.md).

## 1. Producto y principios

SETPOINT es una plataforma SaaS para crear y administrar torneos deportivos, inicialmente de pádel y tenis. Su propósito es ayudar a organizadores independientes, clubes y complejos a configurar y operar torneos con autonomía, reduciendo tareas repetitivas sin imponer un único reglamento ni una estructura federativa.

Principios:

- Un torneo puede ser independiente. No necesita pertenecer a un circuito, federación ni club.
- El organizador elige las categorías, formatos, reglas, puntuación y programación que utiliza.
- Los nombres de categorías son libres; el nombre nunca determina automáticamente el reglamento.
- Pádel y tenis comparten los servicios generales de competición, pero sus modalidades y validaciones deportivas permanecen separadas.
- Las propuestas automáticas son revisables. El organizador mantiene el control y decide qué publica.
- La autorización se aplica en backend en cada operación; la interfaz no es una barrera de seguridad.
- Resultados, puntos, decisiones y calendarios publicados conservan historia auditable.

## 2. Alcance

### MVP

Una organización debe poder completar este flujo con un torneo independiente:

1. Crear cuenta y espacio de trabajo.
2. Crear registros locales de jugadores o recibir solicitudes.
3. Crear un torneo y sus categorías personalizadas.
4. Administrar inscripciones, decisiones y cupos.
5. Generar, revisar y publicar zonas más eliminación directa.
6. Cargar y corregir marcadores válidos, gestionar walkovers y recalcular posiciones.
7. Proponer y publicar la programación de canchas.
8. Mantener rankings individuales por categoría con ventana móvil de 52 semanas.
9. Ofrecer perfiles de jugador con historial y estadísticas basadas en datos reales.

### Posterior

Circuitos multi-organización, federaciones, pagos, WhatsApp, formatos adicionales, clubes compartidos entre tenants, estadísticas avanzadas, galerías completas y automatizaciones adicionales quedan para etapas futuras o decisiones posteriores. No deben ser dependencias para crear un torneo independiente.

## 3. Actores, cuentas y permisos

### Organizador y colaboradores

El organizador crea una cuenta y una organización/espacio de trabajo. Invita colaboradores y les concede permisos por organización.

Roles iniciales:

| Rol | Alcance previsto |
|---|---|
| Owner | Control de la organización y sus torneos; gestiona miembros y permisos. Debe quedar al menos un owner activo. |
| Organization admin | Configuración de la organización y gestión operativa que el owner le permita. |
| Tournament manager | Administración de torneos dentro de los permisos asignados. |
| Scorekeeper | Carga y corrección de resultados si cuenta con permiso explícito. |
| Viewer | Consulta de datos operativos autorizados, sin mutaciones. |

Los permisos se validan por tenant, recurso, acción y estado de la entidad. Finanzas, miembros, programación, cuadro, resultados y publicación pueden separarse como permisos distintos. Los roles se asignan a membresías de organización, no al usuario de forma global.

### Jugadores y participantes

Un participante no es administrador ni miembro de organización por inscribirse. Para solicitar una inscripción debe tener una cuenta registrada en SETPOINT e iniciar sesión. Puede consultar torneos abiertos a inscripción y sus categorías, solicitar la inscripción y consultar su propio perfil, historial y partidos autorizados. No puede editar torneo, categoría, cuadro, fixture, cancha, marcador, standings ni resultados.

El registro de cuenta y la inscripción son pasos distintos: crear una cuenta no inscribe automáticamente al jugador. Toda solicitud se vincula a la cuenta y al perfil deportivo autenticados, y permanece pendiente hasta que el organizador la acepte o rechace. No existe inscripción anónima ni inscripción del jugador sin cuenta; un registro local creado por una organización para una persona sin cuenta no equivale a una solicitud, inscripción confirmada ni entrada de competición.

## 4. Identidad de jugador y pertenencia a categoría

Mantener conceptos separados:

| Concepto | Qué representa |
|---|---|
| Cuenta de usuario (`User`) | Credenciales, sesión, email verificado y preferencias de acceso. Puede corresponder a organizador, jugador o ambos. |
| Perfil deportivo (`PlayerProfile`) | Datos que controla el jugador: nombre, apellido, contacto, fecha de nacimiento, ciudad, género opcional, foto e información deportiva. |
| Registro local (`OrganizationPlayer`) | Persona que una organización administra para sus torneos; puede existir antes de una cuenta y guarda datos locales sujetos a permisos. |
| Vínculo consentido (`PlayerOrganizationLink`) | Verificación y autorización explícita para enlazar una cuenta/perfil con el registro local y compartir campos acordados. |
| Categoría individual (`IndividualCategory`) | Categoría de ranking definida por la organización para clasificar jugadores, con nombre libre. No es la categoría de un torneo. |
| Asignación individual (`PlayerCategoryAssignment`) | Asignación explícita de un jugador local a una categoría individual. Debe existir antes de participar en una competición; nunca se infiere del resultado, nombre del torneo o modalidad. |
| Inscripción (`Registration`) | Solicitud o inscripción confirmada para una categoría de torneo. |
| Participación (`CompetitionEntry`) | Entrada que el organizador incorpora efectivamente al cuadro/competición. |

El email de autenticación pertenece a `User`: es la dirección verificada para iniciar sesión y gestionar el acceso. El email de contacto deportivo pertenece a `PlayerProfile`: es un dato de contacto opcional, puede ser distinto del email de autenticación y no sirve para acceder a la cuenta. Cada dato tiene una sola fuente de verdad; no se copian ni sincronizan entre ambos campos automáticamente. Datos iniciales del perfil: nombre, apellido, email de contacto deportivo, teléfono, fecha de nacimiento, ciudad, género opcional y fotografía opcional. Una cuenta puede enlazar registros de distintas organizaciones con consentimiento; revocar el vínculo no elimina resultados ni autoriza a una organización a ver datos privados de otra. Cada organización conserva su registro y datos privados. Duplicados pueden sugerirse, pero no fusionarse automáticamente.

Los jugadores pueden participar como independientes, sin club asociado. Todo jugador debe tener categoría individual asignada para poder participar y recibir puntos. La cantidad de asignaciones simultáneas y la vigencia de cambios de categoría permanecen abiertas. No hay integración federativa en el MVP.

## 5. Organizaciones, clubes y espacios físicos

No confundir:

- **Organización:** tenant que administra torneos, usuarios colaboradores y datos locales.
- **Club:** entidad deportiva a la que un jugador podría asociarse opcionalmente.
- **Complejo deportivo:** instalación o conjunto de instalaciones.
- **Sede:** ubicación física donde se desarrolla un torneo o partido.
- **Cancha:** recurso reservable dentro de una sede.

El MVP permite que una organización registre sus clubes, complejos, sedes y canchas para su operación. Un torneo no necesita asociarse a un club. La relación de jugador con club es opcional; sin esa relación, el jugador es independiente. La identidad compartida de clubes entre organizaciones/circuitos queda diferida; no asumir que un circuito pertenece a una sola organización.

## 6. Torneos y categorías

### Torneo

Un torneo pertenece a una organización y contiene categorías independientes. Puede ser público o privado. Los torneos privados no aparecen en el catálogo público y pueden compartirse mediante un enlace con alcance limitado a consultar información autorizada. Para solicitar la inscripción, el jugador debe registrarse en SETPOINT e iniciar sesión; el enlace privado no permite inscribirse sin autenticación ni cuenta. El enlace no permite acciones administrativas ni otorga permisos operativos. Debe usar un token seguro, tener expiración y poder revocarse.

Campos operativos previstos: nombre, descripción, fechas, zona horaria, sede opcional, organización responsable, estado, visibilidad y configuración pública. Ediciones, circuitos y temporadas asociadas no son requisitos del torneo independiente.

### Categoría personalizable

El organizador puede crear cualquier denominación: Primera, Cuarta, Suma 7, Libre, Mixto, Sub-18 u otra. No hay catálogo cerrado.

Cada categoría define de forma independiente:

- Nombre libre e identificador estable.
- Deporte: pádel o tenis.
- Modalidad: pádel dobles; tenis singles o dobles.
- Género, si corresponde.
- Nivel, suma o división, opcionales.
- Cupo máximo.
- Formato competitivo.
- Versión de reglas deportivas y validador de marcador.
- Configuración de desempates, ordenada por el organizador.
- Sistema/configuración de puntuación y destino de ranking.
- Disponibilidad y restricciones de programación.

El backend valida campos y combinaciones deportivas explícitas; no deriva reglas deportivas del nombre.

### Estados y transiciones del torneo

La visibilidad (`PUBLIC`/`PRIVATE`) se configura aparte del estado. Las inscripciones y el estado deportivo también deben tener estados propios: no usar el estado del torneo para ocultar transiciones internas.

| Estado | Significado | Transiciones previstas |
|---|---|---|
| Borrador | Edición interna; todavía no publicado. | → Publicado; → Cancelado. |
| Publicado | Visible según su privacidad; configuración publicada y operación previa al inicio. | → Inscripciones cerradas; → Suspendido; → Cancelado. |
| Inscripciones cerradas | No se reciben nuevas solicitudes. Puede volver a publicado si el organizador reabre. | → Publicado (reapertura autorizada); → En preparación; → Suspendido; → Cancelado. |
| En preparación | Inscripciones decididas y organización de zonas/cuadro/programación. | → En curso; → Inscripciones cerradas si el organizador decide volver a esa etapa; → Suspendido; → Cancelado. |
| En curso | Se están disputando partidos. | → Finalizado; → Suspendido; → Cancelado, con motivo y auditoría. |
| Suspendido | Operación temporalmente detenida. Se conserva el estado previo para reanudar. | → Estado previo o → Cancelado, tras decisión autorizada. |
| Finalizado | Competición cerrada; resultados, clasificación y reconocimientos conservados. | Terminal para operación normal; correcciones excepcionales requieren permiso, motivo y auditoría. |
| Cancelado | Torneo no continúa. Se conservan solicitudes, pagos futuros si aplican e historial. | Terminal para operación normal. |

Condiciones de publicación, inicio y finalización se validan en servidor. Para pasar a torneo “en curso”, debe existir un cuadro/programación válido según la configuración adoptada. Los cambios posteriores se versionan; no reescriben lo ya disputado.

El cupo disponible se calcula descontando las inscripciones completas enviadas que estén pendientes o aceptadas. Si se ocupa todo el cupo, se cierran nuevas inscripciones; el rechazo o retiro válido libera una plaza y permite recibir otra inscripción. Si el organizador cerró las inscripciones manualmente, solo una reapertura autorizada vuelve a habilitarlas.

## 7. Inscripciones, cupos y entradas

El jugador debe tener una cuenta registrada en SETPOINT e iniciar sesión. Busca un torneo abierto, selecciona una categoría y completa su inscripción: en singles, registra su inscripción individual; en dobles o pádel, registra a ambos integrantes de la pareja. Una solicitud incompleta no consume cupo. Al completar y enviar la inscripción, queda `PENDING` de aprobación y reserva inmediatamente una plaza. Crear una cuenta no inscribe al jugador.

El organizador acepta o rechaza cada inscripción completa pendiente. Aceptarla conserva la plaza reservada y la incorpora a la competición; rechazarla libera la plaza. Un retiro válido también libera la plaza de forma consistente. La incorporación manual autorizada por el organizador ocupa una plaza al registrarse como inscripción completa.

El cupo máximo por categoría cuenta entradas: en tenis singles, jugadores individuales; en tenis dobles y pádel, parejas, no personas físicas. Los dos integrantes de una pareja ocupan una plaza. Cupo 32 significa 32 jugadores en singles o 32 parejas (64 jugadores) en dobles/pádel. Tanto las inscripciones completas `PENDING` como las aceptadas ocupan cupo; solicitudes incompletas no. **No hay lista de espera automática ni manual.** Al completar el cupo no se reciben nuevas inscripciones hasta que se libere una plaza o el organizador aumente el cupo y reabra, según corresponda.

El organizador puede remover una inscripción antes del inicio conforme a sus permisos. Los cambios manuales de integrantes antes del inicio están sujetos a validaciones de elegibilidad y composición de la categoría y deben registrar actor, fecha y motivo. **No hay reemplazo automático de jugadores durante la competición.** Una vez iniciada, el abandono se resuelve mediante el walkover (WO) correspondiente; no se incorpora automáticamente otro participante.

Las inscripciones de pádel son por parejas. Tenis permite modalidad individual o por pareja según la categoría. Cada miembro de una pareja queda registrado individualmente. La composición queda congelada como snapshot para la participación; cualquier modificación autorizada antes de jugar deja una nueva revisión y no altera partidos históricos.

## 8. Motor de competición — primera versión

El primer formato disponible será **zonas + eliminación directa**. Debe ser una pieza de dominio independiente de Express, Prisma y la interfaz.

Configuración por categoría:

- Cantidad de zonas y participantes por zona.
- Distribución automática o manual.
- Número de clasificados por zona.
- Lista ordenada de criterios de desempate.
- Cruces de eliminación directa posteriores a zonas.
- Armado automático o manual de cruces.
- BYE cuando la configuración válida lo requiera.
- Previsualización, edición y aprobación antes de publicar.

### Distribución y siembra

Prioridad de distribución:

1. Si hay ranking individual vigente con puntos disponibles, usarlo para definir cabezas de serie y bombos/niveles equilibrados.
2. Si no hay ranking con puntos disponibles, generar un sorteo aleatorio.
3. Permitir que el organizador modifique manualmente la propuesta antes de confirmarla.

Conservar la propuesta/draw original (incluida fuente de siembra o sorteo y versión de algoritmo) y un historial de ediciones manuales, actor y fecha. La previsualización no modifica información pública; la publicación requiere aprobación.

Para dobles y mixto, la forma de combinar los rankings individuales para la siembra requiere una regla explícita; no asumir suma, promedio ni categoría de pareja.

### Extensiones futuras

Eliminación directa simple sin zonas, doble eliminación, round robin aislado, Americano, Mexicano, Pozo, ligas y otros formatos quedan para etapas futuras. La arquitectura permite estrategias separadas, pero el MVP no implementa ni afirma soportar esos formatos.

## 9. Reglas deportivas y marcadores

Separar rigurosamente:

1. **Formato competitivo:** cómo se agrupa, avanza y clasifica (zonas + eliminación directa para MVP).
2. **Reglas deportivas:** estructura de sets, games, puntos, sets a 16 u otra variante, diferencias mínimas, tie-break y condiciones de victoria.
3. **Representación/validación del marcador:** cómo se almacenan y muestran los parciales y cómo se determina si el resultado es válido.

El organizador configura y puede guardar/reutilizar perfiles de puntuación. Ejemplos configurables —no reglamentos universales—:

- **Tenis convencional:** mejor de 3 o 5 sets; games por set; tie-break y condiciones para activarlo.
- **Tenis criollo:** sets a 16 puntos u otro objetivo configurado; cantidad de sets; diferencia mínima de puntos.
- **Pádel:** cantidad de sets; games; tie-break y condiciones aplicables.

El resultado se valida con una versión inmutable de reglas fijada a la categoría/partido. No aceptar un marcador inválido ni publicar un torneo con reglas incompletas. Toda revisión conserva versión, autor, hora y motivo.

Reglas exactas de desempate, tie-break, diferencia mínima y combinaciones por categoría permanecen abiertas hasta validación del organizador/reglamento aplicable.

## 10. Resultados, correcciones y walkovers

Solo el organizador o colaboradores autorizados cargan/modifican resultados. Los jugadores consultan resultados publicados y sus participaciones.

Cada cambio genera revisión inmutable con resultado previo/nuevo, actor, fecha/hora y motivo cuando corresponda. No borrar ni sobrescribir la evidencia histórica. Una corrección vuelve a calcular standings, clasificación, avance de rondas, ranking, estadísticas y logros que dependan de ella. Cambios a información ya publicada exigen autorización explícita y pueden requerir confirmar el impacto antes de publicar la nueva proyección.

Un walkover (WO) se identifica expresamente en la historia, pero se considera una victoria normal para el ganador y una derrota normal para el perdedor en clasificación y puntuación. No hay puntaje especial ni reemplazo automático por WO. El walkover y la ausencia quedan auditados; no se infiere un resultado deportivo no configurado.

## 11. Ranking individual por categoría

Cada organización mantiene rankings independientes por categoría individual. El ranking pertenece a cada jugador, nunca a la pareja.

- Singles y dobles de la categoría correspondiente suman puntos al mismo ranking individual.
- Mixto no tiene ranking propio. Cada participante recibe individualmente los puntos en su propia categoría individual asignada.
- La categoría de competición, la categoría individual de cada jugador y la categoría destino de los puntos son conceptos distintos.
- El jugador debe tener categoría individual explícitamente asignada para poder participar y recibir puntos. No inferirla por edad, nombre de torneo, género o resultado.
- No asumir cómo resolver un cambio de categoría individual ni una asignación histórica; está abierto.

### Vigencia

Cada acreditación vale durante **52 semanas móviles** desde su fecha de vigencia. El ranking consulta los puntos cuya vigencia no venció. No hay reinicio general al 1 de enero ni top-N de mejores resultados. Todos los resultados válidos en la ventana cuentan. Al vencer, un movimiento deja de contribuir al saldo vigente, pero permanece en el historial.

### Configuraciones de puntuación

El organizador crea, guarda, versiona y reutiliza esquemas que asignan puntos a posiciones determinadas por el formato: campeón, subcampeón, tercero, cuarto, semifinalista, cuartofinalista u otras posiciones que ese formato pueda resolver. SETPOINT calcula posición y puntos automáticamente. Si el formato no determina una posición única, se necesita una regla configurada; no inventar puntajes.

Editar un esquema crea otra versión y no altera acreditaciones históricas. `PointsLedger` es append-only e idempotente; conserva jugador, organización, categoría individual destino, torneo, categoría de competición, resultado/posición, puntos, versión de regla, fecha, vencimiento y origen. Una corrección crea ajustes/reversiones trazables, nunca actualiza o borra movimientos originales.

Para mixto, el caso de uso emite el movimiento por cada jugador en su propia categoría individual. Si falta esa asignación, no se acepta su participación hasta que el organizador la resuelva; no se inventa una categoría.

## 12. Programación

El organizador informa disponibilidad de canchas y horarios, duración estimada, disponibilidad de jugadores, descanso mínimo y restricciones adicionales. SETPOINT propone slots/canchas y detecta:

- Cancha ocupada dos veces.
- Jugador o miembro de pareja en partidos simultáneos, incluso en categorías distintas.
- Descanso inferior al mínimo configurado.
- Partido fuera de disponibilidad declarada.

Distinguir `disponibilidad de cancha`, `plan borrador`, `propuesta generada` y `calendario publicado`. La propuesta es editable y no cambia información pública. Solo el organizador/colaborador autorizado aprueba y publica. Los cambios de un calendario publicado generan una nueva versión con historial, actor y motivo.

## 13. Notificaciones

Eventos: publicación/cambio de programación, cambio de cancha/horario, proximidad de partido, publicación/corrección de resultado y cambio de cuadro.

Canales iniciales: notificación interna y email. WhatsApp es futuro. Incluir preferencias de usuario e idempotencia para evitar duplicados. Un evento en outbox significa que quedó pendiente de procesar, no que el email fue entregado; guardar estado e intentos de entrega.

## 14. Perfil deportivo, estadísticas y logros

El jugador es protagonista de la experiencia. El perfil puede incluir foto, datos deportivos autorizados, categorías individuales, puntos vigentes, historial de torneos/partidos, próximos partidos, evolución de ranking, actividad, logros, títulos, subcampeonatos y podios.

Estadísticas previstas: partidos, victorias/derrotas, porcentaje de victorias, títulos, podios, evolución y récord personal. Se derivan de resultados reales y se recalculan tras correcciones. No mostrar como reales datos no respaldados por registros.

Logros automáticos: primer torneo, primera victoria, primer título, racha, hitos de partidos, ascenso de ranking y récord de puntos. El vencimiento de puntos no borra logros históricos. Una corrección de resultado sí reevalúa los logros relacionados y conserva evidencia de la concesión/revocación.

La galería deportiva y las tarjetas visuales compartibles forman parte de la experiencia prevista; visibilidad, carga de medios y moderación de galería requieren decisiones de producto. Datos públicos solo se muestran con política de visibilidad/consentimiento.

## 15. Comunicación pública y experiencias

La plataforma tiene tres superficies conectadas:

1. **Panel del organizador:** crea, configura y opera categorías, participantes, cuadros, horarios, resultados y rankings autorizados.
2. **Espacio del jugador:** cuenta/perfil deportivo, inscripción, consulta de sus propios partidos/resultados/rankings y logros.
3. **Vista pública del torneo:** información, categorías, participantes, zonas, cuadro, programación, resultados, posiciones y campeones publicados.

La vista pública respeta `PUBLIC`/`PRIVATE`, publicación y consentimiento. Un enlace privado permite consultar únicamente la información autorizada del torneo; no permite enviar una solicitud de inscripción por sí solo. Para solicitarla, el jugador debe tener una cuenta SETPOINT y una sesión autenticada, y hacerlo desde la categoría disponible del torneo. La solicitud queda `PENDING` hasta la aprobación o el rechazo individual del organizador. El enlace no permite aceptar solicitudes, modificar participantes, gestionar el torneo ni ejecutar acciones administrativas. Se implementa con token seguro no predecible, alcance limitado a la consulta del torneo, expiración y revocación; nunca concede permisos de organizador ni sustituye autenticación.

## 16. Decisiones confirmadas y abiertas

### Confirmadas

- Prioridad en torneos independientes administrados por una organización.
- Pádel dobles; tenis singles/dobles.
- Nombres de categorías libres, con configuración independiente y sin catálogo cerrado.
- Todo jugador debe tener cuenta SETPOINT para inscribirse; las solicitudes requieren sesión autenticada. Una inscripción completa pendiente reserva una plaza hasta aceptación, rechazo o retiro; crear la cuenta no inscribe al jugador.
- Cupos por categoría y reapertura explícita si aumenta el cupo.
- Sin listas de espera de ningún tipo.
- Sin reemplazo automático; abandono tras comenzar se registra como WO.
- Primer formato: zonas + eliminación directa; otros formatos son futuros.
- Distribución prioriza ranking individual disponible, luego sorteo aleatorio, con edición manual antes de confirmar.
- Rankings individuales por organización/categoría; singles y dobles comparten destino de categoría individual; mixto no tiene ranking propio.
- Puntos móviles de 52 semanas, ledger append-only y sin reset anual ni límite top-N.
- Marcadores validados con reglas configuradas/versionadas; el WO es W/L normal y queda identificado.
- Programación en propuesta revisable, aprobación manual, prevención de conflictos y versionado publicado.
- Notificaciones internas/email primero; WhatsApp después.
- Participación independiente sin pertenencia obligatoria a club; circuitos multi-organización no son MVP.

### Abiertas — no inferir

| Decisión | Impacto que debe definirse |
|---|---|
| Combinaciones válidas de deporte, modalidad, género y categoría | Validación de categorías e inscripción. |
| Orden exacto de desempates para grupos | Standings y cruces. |
| Reglas de cada variante de tenis criollo/pádel | Validador de score, duración y resultado. |
| Puntuación por posición y posiciones no únicas | Versiones del esquema y emisión del ledger. |
| Siembra de dobles/mixto desde ranking individual | Cómo equilibrar equipos en bombos; no asumir suma/promedio. |
| Jugador en varias categorías/cambio de categoría individual | Asignaciones con vigencia, ranking destino y elegibilidad histórica. |
| Campos y alcance de consentimiento | Qué muestra cada organización y el perfil compartido. |
| Estadísticas/logros públicos o privados | Visibilidad y cálculo por superficie. |
| Correcciones de resultados publicados | Confirmación, alcance de recálculo y publicación de nueva versión. |
| Momento límite para editar integrantes antes del torneo | Roster, draw y schedule; nunca reemplazo automático en competición. |
| Requisitos de publicación/inicio/finalización | Transiciones que el backend puede aceptar. |

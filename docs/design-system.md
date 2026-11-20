# SETPOINT — Forest & Champagne

## Dirección

Panel de competición con una base Dark Graphite y Forest Deep, superficies Emerald y acentos Champagne reservados a acciones principales, elementos activos y datos destacados. Forest define una paleta deportiva y tecnológica; no implica referencias visuales botánicas. El dashboard evita convertir cada dato en una tarjeta: una fila compacta de métricas da contexto y la lista de torneos y jornada en vivo concentra la operación.

## Tokens

| Token | Valor | Uso |
|---|---|---|
| Forest Deep | `#10251F` | Identidad principal |
| Emerald | `#244C3D` | Superficies y selección |
| `--bg` Dark Graphite | `#171D1B` | Fondo general |
| `--surface` | `#1C2521` | Paneles |
| `--surface-2` | `#202D27` | Superficie elevada |
| `--surface-3` | `#244C3D` | Selección y controles |
| Champagne | `#D6BD83` | Acción/estado activo |
| Ivory | `#E9E8DF` | Texto principal/superficie alternativa |
| `--muted` Muted Sage | `#9BAFA3` | Texto secundario e indicadores suaves |
| `--line` | `#35463D` | Bordes |
| éxito | `#75B896` | Confirmaciones |
| advertencia | `#D6BD83` | Atención |
| error | `#E28B82` | Errores |

## Tipografía

Space Grotesk para títulos, cifras y marca. DM Sans para controles y lectura de interfaz. Ivory mantiene contraste en fondos profundos y Muted Sage baja la jerarquía de metadatos. Champagne se reserva para llamadas a la acción y estados clave. El cuerpo prioriza tamaños compactos de escritorio sin bajar de un área táctil razonable en acciones móviles. Para producción, servir las fuentes localmente.

## Componentes e interacción

- Botón primario Champagne con hover, pressed, focus visible y feedback explícito.
- Navegación lateral con estado activo inequívoco; pasa a drawer en pantallas pequeñas.
- Paneles y filas de partido con bordes finos y jerarquía tipográfica, no sombras pesadas.
- Badges de estado combinan color y texto, para que el color no sea el único indicador.
- Superficies en Forest/Emerald con contraste sobrio; sin motivos botánicos, de madera ni iconografía ecológica.
- Estados de módulos no implementados se comunican como tales mediante avisos.
- Se respeta `prefers-reduced-motion`; las animaciones se limitan a transiciones breves.

## Responsive

Desktop: navegación persistente y dos columnas de contenido. Tablet: navegación tipo drawer, métricas en dos columnas. Móvil: contenido en una columna, controles de menú y tarjetas condensadas.

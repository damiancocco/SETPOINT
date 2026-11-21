# SETPOINT

SETPOINT es una interfaz en desarrollo para organizar competiciones de pádel y tenis. La identidad visual aprobada es **Forest & Champagne**: Forest Deep y Emerald, Dark Graphite, Champagne, Ivory y Muted Sage.

## Estado real

Este repositorio contiene únicamente la primera base de frontend: un dashboard responsive con datos de muestra y avisos en las acciones que aún no están implementadas. No hay autenticación, API, backend, base de datos, persistencia, multi-tenancy ni lógica de torneo. No usar los datos de la pantalla como información operativa real.

## Requisitos y comandos

Requiere Node.js 20 o posterior y npm.

```sh
npm install
npm run dev
```

Para generar el build de producción:

```sh
npm run build
npm run preview
```

No hay scripts de lint ni de tests configurados todavía.

## Stack instalado

| Paquete | Uso |
|---|---|
| React / React DOM | Interfaz y renderizado |
| TypeScript | Tipado y comprobación (`tsc -b`) |
| Vite | Desarrollo y build |
| `@vitejs/plugin-react` | Integración React para Vite |
| `@types/react` / `@types/react-dom` | Tipos de React y React DOM |

Las versiones resueltas están fijadas en `package-lock.json`. Inventario verificado en el entorno de preparación: React 19.3.1, React DOM 19.3.1, TypeScript 5.7.3, Vite 6.4.6, plugin React 4.7.0, tipos React 19.3.0 y tipos React DOM 19.3.0. Los iconos actuales son SVG locales; no se usa una biblioteca de iconos externa.

## Estructura actual

```text
src/
  App.tsx          Dashboard, navegación y datos de muestra
  main.tsx         Punto de entrada React
  styles.css       Estilos responsive y tokens Forest & Champagne
docs/
  design-system.md Identidad, tokens y reglas visuales aprobadas
  functional-specification.md Visión funcional y alcance del producto
  backend-architecture.md Arquitectura backend y modelo relacional propuestos
index.html         Documento HTML de entrada
vite.config.ts     Configuración de Vite
tsconfig*.json     Configuración TypeScript
```

## Arquitectura futura

La visión funcional acordada está en [docs/functional-specification.md](docs/functional-specification.md). La arquitectura backend y el modelo relacional correspondientes están en [docs/backend-architecture.md](docs/backend-architecture.md). Ambos son documentos de diseño: el repositorio sigue sin backend, esquema Prisma ni migraciones. El diseño contempla un monolito modular con Express/TypeScript, PostgreSQL/Prisma y un motor de competición independiente de HTTP y persistencia.

El MVP se centra en torneos independientes, categorías personalizables y el primer formato de zonas + eliminación directa. No incluye listas de espera, reemplazos automáticos, circuitos multi-organización ni formatos competitivos adicionales.

La identidad visual aprobada y sus tokens se describen en [docs/design-system.md](docs/design-system.md).

## Verificación de esta versión

- `npm ls --depth=0`: las dependencias declaradas están instaladas y sin faltantes.
- `npm run build`: TypeScript y Vite completaron correctamente el build de producción.
- El servidor Vite de desarrollo arrancó. No se pudo inspeccionar la consola de un navegador en esta sesión porque el helper de ventanas agotó el tiempo.

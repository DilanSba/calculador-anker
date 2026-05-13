# CAMBIOS · JNSBSTN — Calculador Anker

Resumen completo de cambios aplicados en la rama `feature/unify-pdf-modal`.

**Autor:** Juan Sebastián Rivera Joven
**Rama:** `feature/unify-pdf-modal`
**Base:** `main`
**Fecha:** mayo de 2026

---

## 1. Limpieza y stack

### Eliminado
- `src/components/CotizacionModal.tsx` — modal viejo, reemplazado por `PDFModal.tsx`.
- `// @ts-ignore` en `CotizacionPDF.tsx` (import de react-pdf).
- Firma "Dilan Buitrago" hardcodeada en el disclaimer (ya no se usa).
- Dependencias huérfanas en `package.json`: `@google/genai`, `express`, `dotenv`, `better-sqlite3`, `tsx`, `@types/express`.
- `process.env.GEMINI_API_KEY` en `vite.config.ts` (jamás se usaba).

### Bugs arreglados
- TypeScript `flatMap` con tipos correctos en `CotizacionPDF.tsx`.
- Pronto pago **ya no se persiste** en `localStorage` — antes se guardaba con el carrito y aparecía como valor fantasma en sesiones siguientes. Ahora siempre arranca en 0.
- Imágenes de productos en PDF: implementado **preload a base64** que esquiva CORS de `@react-pdf/renderer`. Las URLs CORS-friendly funcionan; las que no (ej. Bing) se omiten silenciosamente sin romper el layout.

---

## 2. Pestaña del navegador

- **Título**: `Calculador Anker Pro` → **`COTIZADOR ANKER PRO`**
- **Favicon**: batería naranja → **⚡ rayo azul Anker** (gradiente `#00C2FF` → `#0086B8` sobre fondo navy).
- `<html lang>` cambiado de `en` a `es`.

---

## 3. Paleta de colores

### Tokens nuevos en `src/index.css`

```css
/* Windmar oficial */
--color-windmar-blue:        #1D429B
--color-windmar-blue-light:  #A6C3E6
--color-windmar-blue-dark:   #21274e
--color-windmar-gold:        #F89B24

/* Anker — específicos de este cotizador */
--color-anker-blue:        #00AEEF   /* azul cyan distintivo */
--color-anker-blue-dark:   #0086B8   /* hover/active */
--color-anker-blue-light:  #B7E8FA   /* fondos suaves */
```

### Paleta de modos en el PDF
| Modo | Color | Hex |
|---|---|---|
| 💵 Cash | Verde | `#10B981` |
| 🏠 Home Depot | Gris | `#6B7280` |
| 🏦 Synchrony 12/24/48m | Morado claro | `#A78BFA` |
| 🥝 Kiwi | Ámbar | `#F89B24` |

### Paleta de modos en el Cart (in-app)
| Modo | Chip activo |
|---|---|
| 💵 Cash | `bg-anker-blue` (cyan) |
| 🏠 Home Depot | `bg-orange-500` |
| 🏦 Synchrony | `bg-[#8b5cf6]` (morado) + texto blanco |
| 🥝 Kiwi | `bg-windmar-gold` |

---

## 4. Tipografía

- **Poppins** (Google Fonts) reemplaza la fuente anterior.

---

## 5. Header (`src/components/Header.tsx`)

- **NEW** — antes el header estaba inline en App.tsx.
- 2 logos lado a lado: **Windmar Home** (grande, `h-16 md:h-24 lg:h-28`) + **Anker** (pequeño, `h-7 md:h-9`) con divider entre ellos.
- Título "Cotizador Anker PRO" + subtítulo "Power Stations · Solar Panels · Backup Energy".
- Theme toggle (Sun/Moon Lucide + chip "TEMA · Claro/Oscuro") con animación Framer Motion.

---

## 6. Footer (`src/components/Footer.tsx`)

- **NEW** — 3 columnas con íconos al estilo roofing-pro:
  1. **Tecnología Anker Solix** (Battery icon, color anker-blue)
  2. **Financiamiento Flexible** (CreditCard icon, color windmar-blue)
  3. **Soporte Local Windmar** (Wrench icon, color windmar-gold)
- Copyright al fondo: `© 2026 Windmar Home × Anker · Todos los derechos reservados`.

---

## 7. ProductCard (`src/components/ProductCard.tsx`)

- **NEW** — antes los productos se renderizaban inline en App.tsx.
- Diseño sobrio: imagen + categoría + nombre + botón "+" azul Anker.
- **Sin estado verde "seleccionado"** — botón sigue azul; solo se distingue por el toast al agregar.
- Hover: scale 1.02 + scale 1.05 en imagen.
- Imagen en **pill blanco** en dark mode para que productos con fondo blanco no se vean rotos.

---

## 8. Cart (`src/components/Cart.tsx`)

- **NEW** — antes el carrito estaba inline en App.tsx (~250 líneas).
- **Mode selector** interno (4 botones en grid 2×2): Cash, Home Depot, Synchrony, Kiwi.
- **Sync term selector** (12/24/48m, morado `#8b5cf6`) — aparece animado solo cuando Synchrony activo.
- **Tarjetas planas con resumen visible**:
  - Imagen 56×56 + categoría + nombre + breakdown precio.
  - Para Synchrony muestra "$X/mes · Total financiado $Y · Subtotal si qty>1".
  - Para Kiwi muestra "$X · Total financiado (sin cuotas)".
- **Resumen de compra** al fondo con:
  - Subtotal en el modo activo
  - **Pronto pago** (input numérico — fue movido del modal al carrito).
  - "Total con pronto" calculado automáticamente.
- Reglas de incompatibilidad de equipos (Solix 3800 vs paneles 200W, transfer switch automático vs F2600/BP2600) **preservadas**.

---

## 9. PDFModal (`src/components/PDFModal.tsx`)

- **NEW** — modal completamente reescrito con tema dark Anker.
- **Fondo dark navy** `#0A1628` con glow azul Anker, líneas blancas divisorias.
- **Toggle EN/ES** en el header.
- **Selectores azul Anker** (`#00AEEF`) distintivos del resto de cotizadores.
- Selector de modos: Cash, Home Depot, Synchrony, Kiwi.
- Selector de plazos Synchrony (12/24/48m) con caja morada destacada.
- **Sección "🎁 Promociones disponibles"** colapsable (estilo loan/lease/roofing):
  - **♥ Mes de las Madres 2026 — Anker** — solo visible 1-14 mayo; aplicable 7-14 mayo. Incluye texto: precios promo F2600/BP2600 + **Batería Anker C300 GRATIS**.
  - **💊 Promoción Farmacias ⚕️** — checkbox + campo nombre de farmacia (required). 10% descuento sobre total.
  - **Mutuamente excluyentes**: si activas Madres se deshabilita Farmacias y viceversa.
- **Pronto pago** se muestra como información (read-only, "set in cart") porque vive en el carrito ahora.

### Helper de promociones — `src/lib/promoMadres.ts`
```typescript
MADRES_GIFT_NAME_ES // 'Batería Anker C300'
MADRES_GIFT_NAME_EN // 'Anker C300 Battery'
isMadresAnnounceActive() // 1-14 mayo 2026
isMadresSaleActive()     // 7-14 mayo 2026
```

---

## 10. CotizacionPDF (`src/components/CotizacionPDF.tsx`)

### Header del PDF
- **Logo Windmar +20px** (de 46pt a 66pt).
- **Rayo azul Anker ⚡** dibujado con `<Svg>+<Path>` al lado del texto "ANKER".

### Layout
- **Tabla restaurada** (formato antiguo) con:
  - Single column cuando hay 1 modo seleccionado.
  - Multi column cuando hay 2+ modos seleccionados (cada modo es una columna).
- **Header de tabla coloreado por modo** (single col header full bg, multi col cada celda con su color).
- **Valores en la tabla con color del modo** (multi col).
- **Imagen miniatura inline** del producto al lado del nombre (32×32 en pill blanco para dark theme).
- **Total boxes** debajo de la tabla, uno por modo, con header coloreado del modo.

### Traducción completa EN/ES
Helper `tr(es, en)` aplica a:
- Título y subtítulos
- Labels Cliente/Consultor
- Headers de tabla (PRODUCTO/CANT/TOTAL/PRODUCT/QTY)
- Subtítulos de financiamiento (Precio Sync, Pronto Pago, A financiar)
- Labels de cuota (CUOTA 12M → 12M FEE)
- Disclaimer y validez

### Banners de promociones
- **🟢 Banner Farmacias** (verde con borde) al final del cuerpo cuando promo activa, muestra el nombre de la farmacia.
- **🌸 Banner Madres** (rosa con borde + ♥ corazones) al final del cuerpo cuando promo activa, indica precio promo aplicado + regalo C300.

---

## 11. App.tsx — refactor

- De **755 líneas → ~290 líneas** (extraído todo a componentes).
- Persistencia del carrito en `localStorage('anker_cart_v5')` **preservada**.
- **Pronto pago YA NO se persiste** (siempre arranca en 0 por sesión).
- Dark mode con patrón `wh-theme` + clase `.dark` en `<html>`.
- Splash con efectos eléctricos (40 chispas + 2 anillos rotando + halos), duración 3.2s.
- **Splash ahora vive fuera del wrapper de contenido** (resolución del bug donde se filtraba el contenido detrás del splash durante la animación).

---

## 12. Imágenes de productos (`src/constants.ts`)

| Producto | URL anterior | URL nueva |
|---|---|---|
| ANKER SOLIX F2600 | postimg | santansolar.com |
| ANKER SOLIX 3800 | postimg | cdn.shopify.com |
| EXPANSION BATTERY BP2600 | postimg | bing image (CORS limitado — no aparece en PDF) |
| EXPANSION BATTERY BP3800 | postimg | bing image (CORS limitado — no aparece en PDF) |
| PANEL 200W / 200W 50% | postimg | solar-autark.com |
| PANEL 400W / 400W 50% | postimg | turbifycdn.com |

### Categoría renombrada
- **"Power Stations" → "Anker Battery"** (afecta F2600 y 3800).

---

## 13. Build status

- TypeScript: limpio (`tsc --noEmit` → exit 0).
- Vite build: exitoso (~5s, bundle 2.24 MB / 776 KB gzip).

---

## 14. Archivos

### Nuevos
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/ProductCard.tsx`
- `src/components/Cart.tsx`
- `src/components/PDFModal.tsx`
- `src/lib/promoMadres.ts`
- `CAMBIOS-JNSBSTN-README.md` (este archivo)

### Eliminados
- `src/components/CotizacionModal.tsx`

### Modificados
- `index.html`
- `package.json`
- `public/favicon.svg`
- `vite.config.ts`
- `src/App.tsx`
- `src/index.css`
- `src/constants.ts`
- `src/hooks/usePDFCotizacion.ts`
- `src/components/CotizacionPDF.tsx`

---

## 15. Notas pendientes

1. **PDFs maestros EN/ES** del catálogo Anker — pendientes de tu lado. Cuando los pases, se integran como hicimos en `cotizador-agua` para que las páginas de productos también traduzcan según el idioma elegido en el modal.
2. **Imágenes BP2600 / BP3800** — las URLs actuales de Bing no permiten CORS y por eso no aparecen en el PDF. Para resolverlo necesitas subir las imágenes a postimg.cc, a un Shopify CDN, o al folder `public/` del repo. Cuando me pases nuevas URLs las actualizo en `constants.ts`.

---

## Comandos para probar localmente

```powershell
cd "C:\dev\Call Center\calculador-anker"
npm install
npm run dev     # → http://localhost:3000
npm run build   # producción
```

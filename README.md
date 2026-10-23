# Utopia WellCare — Broker Referral Hub

Landing page para partners brokers. Origen: entrega de un solo archivo HTML
(`utopia-broker-landing-page.html`), ahora separada en un proyecto Vite para
poder editarla cómodamente y volver a empaquetarla en un único archivo cuando
toca pegarla en GoHighLevel.

## Requisitos

Node 18+ (probado con Node 22).

## Empezar

```bash
npm install
npm run dev
```

Abre http://localhost:5173 con hot-reload.

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Build de producción en `dist/` (CSS/JS minificados, imágenes como ficheros) |
| `npm run preview` | Sirve `dist/` para revisar el build |
| `npm run build:ghl` | Build + empaqueta todo en **un solo HTML** en `dist-ghl/` |

## Estructura

```
index.html                  marcado de la página
src/styles/main.css         todo el CSS (estaba inline en el original)
src/js/main.js              pestañas de email / copiar / envío del formulario
src/js/quiz.js              quiz de calificación + reglas de fit
public/assets/img/*.png     8 logos de aseguradoras (estaban en base64 en el original)
scripts/build-single-file.mjs   re-empaqueta el build en un HTML autocontenido
```

Secciones de la página, en orden:

`hero` · `about` (four-way win + why brokers) · `catch` (quién paga) ·
carriers · `proof` (cifras) · `voices` (testimonios de miembros) ·
`resources` (vídeo + one-pager + talking points) ·
`email` · `quiz` (¿es un fit?) · `refer` (pasos + formulario) ·
`trust` (clínico + HIPAA)

Los **talking points** del bróker viven en la página, en un `<details>` dentro
de la sección de recursos, no en una descarga: el one-pager se reenvía al
cliente, pero los talking points los lee el bróker.

Todo lo que hay en `public/` se sirve desde la raíz: `public/assets/img/aetna.png`
se referencia como `/assets/img/aetna.png`.

## Marca

Todo sale del flyer oficial (`General Utopia Flyer.pdf`) y del artwork del logo.

### Color

| Token | Valor | Uso |
| --- | --- | --- |
| `--blue` | `#004AAD` | Primario. Botones, badges, titulares de apoyo, barra del pie. Es el azul que usa el propio flyer para UI. |
| `--blue-bright` | `#0C7ABD` | El azul del wordmark "WellCare". Acento secundario. |
| `--blue-deep` | `#062A5E` | Secciones oscuras. |
| `--amber` | `#F8A41D` | **Solo rellenos y recursos gráficos.** Nunca como color de texto. |
| `--amber-text` | `#A16B13` | Ámbar cuando tiene que ser texto sobre claro (4.54:1). |
| `--amber-on-blue` | `#F9B64A` | Ámbar como texto sobre azul (4.58:1). |
| `--ink` | `#111418` | Texto principal. |

> **Por qué hay tres ámbares.** El ámbar de marca sobre blanco da **2.04:1** y no
> pasa WCAG ni como texto grande. En el flyer funciona porque es papel. En web no.
> La regla aquí: el ámbar de marca se usa como relleno (el punto del eyebrow, el
> botón de play, el subrayado del H1), y cuando el ámbar tiene que *ser* texto se
> usa la variante legible. Todos los pares comprobados pasan AA.

### Tipografía

- **DM Sans** — texto. Es la del flyer, está en Google Fonts, se usa tal cual.
- **Object Sans** — display. Es la del flyer, pero es **de pago** (Pangram Pangram)
  y no está en Google Fonts. Ahora mismo la página cae en **Outfit**, la sustituta
  libre más cercana. Ver `FONT TODO` en `src/styles/main.css`: cuando exista la
  licencia, se sueltan los `.woff2` en `public/assets/fonts/`, se descomenta el
  bloque `@font-face` y no hay que tocar nada más.

### Assets

`public/assets/img/utopia-wordmark.png` y `favicon.png` salen del artwork que
pasó el cliente. Son PNG cuantizados para que pesen poco, porque el build de GHL
los mete inline en base64. **Si aparecen los SVG originales, mejor usarlos**:
pesarían menos y escalarían limpio.

### Detalles tomados del flyer

- Titulares en caja baja, no en mayúsculas: el flyer no grita.
- Esquinas muy redondeadas y botones en píldora.
- Badges circulares azules con icono blanco (como los iconos de "Programs").
- Trama de puntos en la esquina del hero.
- Barra azul redondeada en el pie.
- El lema *"Helping jumpstart your journey towards healthier living"* en cursiva,
  que es como aparece en el flyer.

## Formulario de referidos → GoHighLevel

El formulario hace `POST` de un JSON al endpoint definido en `VITE_GHL_WEBHOOK_URL`.

1. En GHL: **Automation → Workflows → nuevo workflow → trigger "Inbound Webhook"**.
2. Copia la URL generada.
3. `cp .env.example .env` y pega la URL ahí. `.env` está en `.gitignore`.
4. Reinicia `npm run dev` (Vite lee el `.env` al arrancar).

Sin `VITE_GHL_WEBHOOK_URL` el formulario queda en **modo dry-run**: valida,
escribe el payload en la consola y no envía nada.

Payload que recibe GHL:

```json
{
  "broker_name": "...",
  "broker_company": "...",
  "broker_email": "...",
  "group_name": "...",
  "group_size": "150-300",
  "health_plan": "Aetna",
  "funding_type": "Level-funded",
  "renewal_date": "2027-01-01",
  "renewal_window": "Within 3 months",
  "notes": "...",
  "submitted_at": "2026-09-21T21:45:19.796Z",
  "source": "broker-referral-hub"
}
```

### CORS

Comprobado contra el endpoint real: responde al preflight con
`Access-Control-Allow-Origin: *`, `Access-Control-Allow-Headers: *` y POST
permitido, así que el `fetch` funciona desde cualquier dominio. Si algún día se
mete un endpoint intermedio, hay que volver a comprobarlo.

### La URL queda pública

Vite incrusta `VITE_GHL_WEBHOOK_URL` en el JS al hacer el build, así que la URL
aparece en el código fuente de la página publicada. **Esto es inevitable** en
cualquier formulario que postee directo desde el navegador: no es una credencial,
es un endpoint público. La consecuencia práctica es que cualquiera que mire el
fuente puede mandar datos al workflow.

Mitigaciones, todas del lado de GHL:

- Filtrar en el workflow por `source == "broker-referral-hub"`, que ya va en el payload.
- Añadir un campo trampa (honeypot) al formulario y descartar los envíos que lo traigan relleno.
- Revisar los referidos antes de que disparen nada hacia fuera.

### Forma del payload: siempre 12 claves

El payload **siempre lleva las 12 claves**, aunque vayan vacías, y eso está
forzado en el código (`PAYLOAD_FIELDS` en `src/js/main.js`).

No es cosmético. Un `<select>` que el broker no toca **desaparece entero** de
`FormData`, porque su `<option>` placeholder está `disabled`. Como `health_plan`
y `funding_type` son opcionales, el caso más común era justo ese: llegaban 10
claves en vez de 12. El trigger de inbound webhook de GHL construye el mapeo de
campos a partir de **una** petición de muestra, así que una clave ausente en esa
muestra no se puede mapear nunca.

Si se añaden campos al formulario, hay que añadirlos también a `PAYLOAD_FIELDS`.

### Anti-spam: honeypot

El formulario lleva un campo trampa `company_website`, colocado fuera de
pantalla (no `display:none`, que muchos bots saltan), con `tabindex="-1"` y
`aria-hidden`, así que ni el teclado ni un lector de pantalla llegan a él.

Si llega relleno, el envío **se descarta antes de salir** y la interfaz muestra
el mismo mensaje de éxito de siempre: decirle a un bot que ha fallado solo le
enseña a reintentar con el campo vacío. La clave nunca viaja en el payload.

### Registros de prueba en GHL

Durante el cableado se enviaron **dos** referidos de prueba reales, que conviene
borrar del CRM:

| id de GHL | broker_name |
| --- | --- |
| `AiH5YWmICwVSO0uvjGZG` | `TEST - Claude Code (ignorar)` |
| `hJGsecMbGonm82wDwtGU` | `TEST 2 - Claude Code (ignorar)` |

Ambos con email `test@example.com`, que es un dominio reservado: no hay correo
que pueda llegar a nadie.

## Publicar en GoHighLevel

```bash
npm run build:ghl
```

Genera `dist-ghl/utopia-broker-landing-page.html` (~598 KB): CSS, JS, el
wordmark, el favicon, los 8 logos de aseguradoras y los PDF descargables van
inline, sin ninguna referencia externa salvo Google Fonts. Ese fichero se pega
tal cual en un bloque de custom code / HTML de GHL.

### Los PDF van incrustados

Los one-pagers se meten como `data:` URI, así que la descarga funciona sin
alojar nada en ningún sitio. El precio es el peso: cada PDF engorda el fichero
un ~33% de su tamaño (el overview, de 128 KB, añade unos 170 KB).

Si el fichero se hace incómodo de pegar en GHL, la alternativa es subir los PDF
a la **media library de GHL** y cambiar el `href` de cada `.dl-link` en
`index.html` por esa URL. Tiene además la ventaja de que se puede actualizar un
documento sin regenerar la página. Los `href` que empiezan por `/assets/` se
incrustan; cualquier URL absoluta se deja intacta.

## Pendientes

Ver **[CONTENT-TODO.md](CONTENT-TODO.md)** — todo lo que la página necesita de
Utopia antes de publicarse (cifras con fuente, quién paga, credenciales
clínicas, HIPAA, revisión legal de los logos, vídeo y PDFs).

Los textos provisionales llevan la clase `.needs-copy` y se pintan con rayas
naranjas para que no se escapen a producción:

```bash
grep -c "needs-copy" index.html
```

Cuando llegue a 0, borra la regla `.needs-copy` de `src/styles/main.css`.

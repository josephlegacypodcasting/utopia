# Pendientes de contenido

Estado a 30 oct 2026, tras los mensajes de Anna del 29 oct (copy de la
sección de confianza, one-pager para brokers y vídeo final).

**Ya no queda ningún placeholder en la página.** La clase `.needs-copy` y su
regla CSS se retiraron.

---

## Hecho en esta ronda (30 oct)

| Qué | Fuente |
| --- | --- |
| **Las 3 cajas de "What your client's HR team will ask you"** — quién da la atención, HIPAA, qué ve el empleador | Copy de Anna, 29 oct, pegado tal cual |
| **One-pager "What's In It for You"** — sustituye a la tarjeta de talking points (título, subtexto y "Download the one-pager") | PDF y copy de Anna, 29 oct |
| **Vídeo final** `UWC_BrokerClip_V1` — embed de Wistia; el botón "Copy video link" apunta al fichero en Google Drive | Anna, 29 oct; embed de Wistia, 30 oct |

Ajustes de copy derivados (no los pidió Anna, pero dejaban de ser ciertos):

- Intro de recursos: "The talking points below are for you" → "The second one-pager is for you, not for them."
- Hero: "two client-ready one-pagers" → "a client-ready one-pager" (el segundo es para el bróker).

Los seis talking points del 30 sep se **quitaron de la página** porque Anna
indicó que el nuevo PDF sustituye a la pieza anterior. Están en el historial
de git si se quieren recuperar.

### Ronda anterior (7 oct)

Quién paga Utopia · compensación del broker · las tres cifras de The Numbers ·
testimonio de Holly Timbur · Overview One-Pager · webhook de GHL ·
testimonios de miembros ("In Their Own Words").

---

## Confirmar antes de publicar

### A. Que el copy de HIPAA lo haya aprobado Utopia
"Utopia WellCare is fully HIPAA compliant" y "10+ years of clinical
experience" son afirmaciones de cumplimiento y de hecho, no copy de marketing.
Llegaron a través de Anna; conviene tener por escrito que vienen de Utopia (o
que Utopia las ha revisado), porque el bróker se las repetirá a RRHH.

### B. Tamaños de muestra de los outcomes
El informe no los declara; se derivaron del Excel (301 / 148 / 133 y 130).
La página publica "111 of 148" y "97 of 148".

### C. Ventana de medición
La página dice "July 2026" (fichero "7.26", PDF del 4 ago). Confirmar el
periodo real.

### D. Permiso de Holly Timbur
Para que su nombre y empresa salgan en una página pública.

### E. Testimonios de miembros
El mailer los atribuye a *Teamsters Local 830*; la página pone "Plan member".
Si Utopia autoriza nombrar al grupo, se cambian los `<cite>`.

### F. Revisión legal de los logos de carriers
8 marcas registradas, en un repo público. Necesita sign-off de compliance.

---

## Pendiente de recibir

### Reglas del quiz — `src/js/quiz.js`
`FIT_RULES` sigue **vacío a propósito**: mientras lo esté, nadie queda
excluido. Falta saber si hay tamaño mínimo de grupo o si algún
funding/carrier descalifica.

---

## Técnicos

### Enlace para compartir el vídeo
El reproductor ya es Wistia, pero el botón "Copy video link to share" sigue
copiando el enlace de Google Drive (que depende de que el fichero siga
compartido como "cualquiera con el enlace"). Si Utopia tiene una URL pública
de Wistia, cambiar el `data-link` del botón.

### Peso del entregable
El HTML de GHL pasa a **~975 KB** por los dos PDF en base64. Si se hace
incómodo de pegar, subir los PDF a la media library de GHL y cambiar los
`href`. Ver README.

### Licencia de Object Sans
Tipografía de display del flyer, de pago (Pangram Pangram). La página usa
**Outfit** como sustituta. Ver `FONT TODO` en `src/styles/main.css`.

### Logos en vectorial
El wordmark y el favicon salen de PNG. Si existen los SVG, sustituirlos.

### Registros de prueba en GHL
Borrar del CRM los dos referidos de prueba listados en el README.

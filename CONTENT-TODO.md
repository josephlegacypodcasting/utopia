# Pendientes de contenido

Estado a 7 oct 2026, tras el envío de Anna con los datos de outcomes, el
one-pager y las notas de feedback del cliente (30 sep 2026).

Los textos provisionales llevan la clase `.needs-copy`, que los pinta con rayas
y borde discontinuo para que **sea imposible publicar sin verlos**. Quedan **3**:

```bash
grep -c "needs-copy" index.html
```

Cuando llegue a 0, borra la regla `.needs-copy` de `src/styles/main.css`.

---

## Hecho en esta ronda

| # | Qué | Fuente |
| --- | --- | --- |
| 1 | **Quién paga Utopia** | Notas del cliente, 30 sep |
| 2 | **Compensación del broker** (ahora "Is there broker compensation included?") | Notas del cliente, 30 sep |
| 5 | **Las tres cifras de The Numbers** | Engagement de las notas; outcomes del informe 7.26 |
| 6 | **Testimonio de broker** (Holly Timbur, Alera Group) | Notas del cliente, 30 sep |
| 9a | **Utopia Overview One-Pager** | PDF del cliente |
| 12 | **Webhook de GHL** | Conectado y verificado |

Rewordings pedidos por el cliente, ya aplicados:

- "If it costs nobody anything…" → "If it doesn't cost anything, how does it work?"
- "What actually happens once a group turns it on" → "What happens after a group launches"
- "What the broker gets paid" → "Is there broker compensation included?"
- "Before You Vouch For Us" → "Before You Start the Conversation"

---

## Bloqueantes

### 3. Credibilidad clínica y privacidad — los 3 placeholders que quedan
Sección "Before You Start the Conversation". El cliente no ha respondido a esto
todavía y son las primeras preguntas de cualquier HR:

- **Quién da la atención**: credenciales (RDN), licenciatura por estado, proceso
  de credencialización, cuántos clínicos.
- **Cómo se tratan los datos de salud**: postura HIPAA, y que el dato individual
  **no** vuelve al empleador hay que decirlo explícitamente.
- **Qué ve el empleador**: qué reporting recibe, con qué frecuencia y a qué nivel
  de agregado.

### 4. Revisión legal de los logos de carriers
Uso de 8 marcas registradas, ahora además en un repo público. Necesita sign-off
de compliance.

---

## Confirmaciones pedidas a Utopia

### A. Tamaños de muestra de los outcomes
El informe no los declara. Los **derivé** de los decimales sin redondear del
Excel, y encajan exactos en las 12 filas de cada columna:

| Columna | n |
| --- | --- |
| 3 citas completadas | 301 |
| 6 citas completadas | 148 |
| 9+ citas completadas | 133 (health metrics) / 130 (medical conditions) |

La página publica "111 of 148" y "97 of 148". **Que Utopia lo confirme antes de
lanzar.**

### B. Ventana de medición
No consta en ningún sitio. El fichero se llama "7.26" y el PDF se generó el 4
ago 2026, así que la página dice "July 2026". Confirmar el periodo real que
cubren los datos.

### C. Permiso de Holly Timbur
Tenemos sus palabras en las notas del cliente, pero hace falta que haya
aceptado que su nombre y firma salgan en una página pública. Se corrigió
puntuación; las palabras están intactas.

---

## Pendiente de recibir

### 7. Reglas del quiz — `src/js/quiz.js`
`FIT_RULES` sigue **vacío a propósito**: mientras lo esté, nadie queda excluido.
Falta saber si hay tamaño mínimo de grupo o si algún funding/carrier descalifica.

### 8. Vídeo de 2 minutos
Valeria lo está montando. Cuando llegue: sustituir el placeholder por el embed
y poner la URL pública en `data-link` del botón "Copy video link to share".
El botón de play del hero sigue siendo decorativo.

### 9b. Broker Talking Points — RESUELTO SIN PDF
Los 6 puntos que mandó el cliente el 30 sep están **en la página**, dentro de un
desplegable en la sección de recursos, con botón de copiar.

El criterio: el one-pager de overview se **reenvía al cliente**, pero los
talking points los usa el **bróker**, que no los reenvía a nadie. No necesitan
ser una descarga, y así desaparece el enlace muerto a `#`.

**Entrante (Anna, 15 oct):** Utopia está produciendo un PDF para este hueco,
reenfocado como *"what's in it for them"*. Cuando llegue, se añade como enlace
de descarga dentro de esa tarjeta y **los seis puntos se quedan visibles** — no
volver a esconder el texto detrás de la descarga.

### Testimonios de pacientes — HECHO
Sección nueva **"In Their Own Words"**, entre The Numbers y Share With Your
Clients: 4 citas en rejilla 2x2, sacadas de la página 2 del mailer de miembros
que mandó Anna el 15 oct. Solo se normalizó la puntuación; no se cambió ni
recortó ninguna palabra.

De las 10 disponibles elegí estas 4 pensando en el bróker, no en el paciente:
una que arranca reconociendo que el miembro **esperaba poco**, una ligada a
**peso** (que es justo lo que mide el 65% de la sección anterior), una de
**vuelta a consulta**, y una muy **directa**.

**CONFIRMAR con Utopia:** el mailer las atribuye a miembros de *Teamsters Local
830*. Nombrar al grupo las haría pesar más, pero ese mailer se envió **a** esos
miembros, no se publicó como caso de éxito, así que la página pone
"Plan member". Si Utopia autoriza nombrar al cliente, se cambian los `<cite>`.

Nota: Anna creía haber mandado **dos** documentos de testimonios, pero
`UWC_Teamsters_Q3 Mailer_2026.pdf` y `Mailer with testimonials 26 (1).pdf` son
el **mismo fichero** (SHA256 idéntico). Si había una segunda fuente, no llegó.

---

## Técnicos

### 10. Licencia de Object Sans
Tipografía de display del flyer, de pago (Pangram Pangram). La página usa
**Outfit** como sustituta libre. Ver `FONT TODO` en `src/styles/main.css`.

### 11. Logos en vectorial
El wordmark y el favicon se generaron desde PNG. Si existen los SVG originales,
sustituirlos.

### D. Peso del entregable
Va por **599 KB** porque los PDF se incrustan en base64. Con el segundo
one-pager subirá más. Si se hace incómodo de pegar en GHL, la alternativa es
subirlos a la media library de GHL y cambiar los `href`. Ver README.

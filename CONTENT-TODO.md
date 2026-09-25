# Pendientes de contenido — v1.1

Todo lo que la página necesita de Utopia antes de poder publicarse. Nada de
esto se puede inventar desde fuera: son datos clínicos, de cobertura y de
compensación.

En el código, cada hueco está marcado con `CONTENT TODO`, `LEGAL TODO` o
`TECH NOTE`, y los textos provisionales llevan la clase `.needs-copy`, que los
pinta con rayas naranjas y borde discontinuo para que **sea imposible publicar
sin verlos**. Cuando no quede ninguno, borra la regla `.needs-copy` de
`src/styles/main.css`.

Comprobación rápida de cuántos quedan:

```bash
grep -c "needs-copy" index.html
```

---

## Bloqueantes (la página no debería salir sin esto)

### 1. ¿Quién paga? — sección "Where's the Catch"
El mecanismo exacto de facturación. Es la primera objeción de cualquier broker
y ahora mismo la página afirma que no hay perdedor sin explicar de dónde sale
el dinero.

### 2. ¿Cobra el broker? — misma sección
¿Hay comisión, revenue share o referral fee? Si **no** la hay, decirlo es más
fuerte que callarlo: no hay conflicto de interés y no hay nada que declarar.
Si la hay, hay que declararla y revisar la obligación de disclosure.

### 3. Credibilidad clínica y privacidad — sección "Before You Vouch For Us"
- Credenciales de los clínicos (RDN, licenciatura por estado, proceso de credencialización)
- Postura HIPAA y qué ve y qué no ve el empleador (que el dato individual **no**
  vuelve al empleador hay que decirlo explícitamente)
- Qué reporting recibe el empleador, con qué frecuencia y a qué nivel de agregado

### 4. Revisión legal de los logos de carriers
Uso de 8 marcas registradas. Necesita sign-off de compliance. La nota al pie
sobre que la cobertura se determina a nivel de plan y no de carrier también
debería revisarla quien lleve compliance.

---

## Datos (la sección se borra si no llegan)

### 5. Franja de cifras — sección "The Numbers"
Tres cifras con **fuente, tamaño de muestra y fecha** bajo cada una:
- % de empleados elegibles que se inscriben en los primeros 90 días
- Un outcome clínico que le importe al plan (p. ej. cambio medio de A1c o de peso a 6 meses)
- Coste añadido para empleador y empleado (esta se puede afirmar hoy, solo hay que confirmar la redacción)

> Si los datos no están listos, **borra la sección entera**. Ante brokers
> licenciados una cifra sin fuente hace más daño que la ausencia de cifras.

### 6. Testimonio de un broker
Una o dos frases de un broker que ya haya referido un grupo, con permiso para
usar nombre y firma. Pesa más que cualquier cosa que diga Utopia de sí misma.

---

## Criterios de calificación

### 7. Reglas del quiz — `src/js/quiz.js`
El objeto `FIT_RULES` está **vacío a propósito**: mientras las listas estén
vacías nadie queda excluido y todos los grupos salen como fit. Es el default
seguro — sale más barato hablar con un grupo que no califica que rechazar a uno
que sí. Rellénalas cuando existan los umbrales reales:

- `belowMinimumSizes` — ¿hay tamaño mínimo de grupo?
- `unsupportedFunding` — ¿el tipo de funding descalifica alguna vez?
- `unsupportedCarriers` — ¿algún carrier queda fuera?

El quiz nunca da un "no" rotundo por diseño: el peor veredicto es "hablemos".
Un broker al que un quiz rechaza cierra la pestaña.

---

## Assets

### 8. Vídeo de 2 minutos
- Embed real en lugar del placeholder (`index.html`, sección Resources)
- URL pública para el botón "Copy video link to share" (hoy es `[SHAREABLE VIDEO URL]`)
- El botón de play del hero es decorativo, no hay vídeo conectado

### 9. Los dos one-pagers en PDF
Ambos `Download PDF` apuntan a `#`. Necesitan los PDF alojados.

> Ojo con el orden de lanzamiento: toda la propuesta de valor de la página para
> el broker es "reenvía esto a tu cliente". Hasta que el vídeo y al menos un PDF
> existan, la página no puede hacer su trabajo.

### 10. Licencia de Object Sans
Es la tipografía de display del flyer y es de pago (Pangram Pangram). La página
usa **Outfit** como sustituta libre mientras tanto. Hace falta decidir: comprar
la licencia webfont y soltar los `.woff2` en `public/assets/fonts/`, o quedarse
con Outfit. Ver el bloque `FONT TODO` en `src/styles/main.css`.

### 11. Logos en vectorial
El wordmark y el favicon se generaron desde PNG. Si existen los originales en
SVG, sustituirlos: pesan menos y escalan sin perder nitidez.

---

## Integración

### 12. Webhook de GoHighLevel — HECHO
Conectado y verificado contra el endpoint real (HTTP 200). La URL vive en `.env`
y Vite la incrusta al hacer el build.

Queda por hacer del lado de GHL:

- Mapear los campos en el workflow a partir de la petición de muestra.
- Borrar los dos referidos de prueba (ids en el README).
- Considerar filtrar por `source == "broker-referral-hub"`, porque la URL queda
  visible en el fuente de la página publicada.

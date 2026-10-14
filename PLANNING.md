# Planificación del portafolio

Estado: frontend implementado y verificado; contenido personal y preparación de publicación pendientes de completar.

Este documento es la referencia compartida para las sesiones que implementen el proyecto. La elección de Next.js está aprobada. La dirección visual y el contenido personal todavía deben definirse; las propuestas aquí descritas sirven como punto de partida.

## 1. Objetivo

Crear un portafolio web personal para un ingeniero en Informática que permita entender rápidamente quién es, qué sabe construir y cómo contactarlo. Los proyectos deben aportar evidencia de sus habilidades y decisiones técnicas. Una escena WebGL en la portada aportará personalidad al sitio.

## 2. Alcance de la primera versión

- Una página principal con navegación mediante anclas.
- Secciones de inicio / overview, proyectos, sobre mí y contacto.
- Entre 3 y 6 proyectos destacados, según el contenido disponible.
- Enlace al CV y a perfiles profesionales.
- Una escena 3D ligera en la portada, con alternativa visual.
- Diseño adaptable a móvil y escritorio.
- Accesibilidad, metadatos para buscadores y vista previa al compartir.

Se dejan para futuras iteraciones: páginas extensas de casos de estudio, segundo idioma, formulario de contacto, blog y administración de contenido. No se necesita base de datos ni CMS para la primera versión.

## 3. Decisiones técnicas

| Tecnología | Función |
| --- | --- |
| Next.js con App Router | Estructura, rutas y contenido prerenderizado |
| React y TypeScript | Componentes y datos tipados |
| CSS Modules y estilos globales | Estilos locales y fundamentos visuales compartidos |
| Three.js | Motor de la escena WebGL |
| React Three Fiber | Integración declarativa de Three.js con React |
| Drei | Utilidades de escena, incorporadas solo cuando sean necesarias |
| Git y GitHub | Versionado y repositorios de proyectos |

Usar versiones estables y comprobar la compatibilidad al iniciar la implementación. La documentación consultada indica que React Three Fiber 9 se empareja con React 19; no adoptar versiones alfa por defecto. Registrar las versiones elegidas en el archivo de dependencias y mantener un único lockfile.

### Arquitectura

- Mantener la página y el contenido principalmente en componentes de servidor.
- Aislar el canvas, sus controles y otras interacciones en componentes de cliente.
- Cargar el código 3D por separado sin bloquear el texto ni los botones de la portada. Si se usa `ssr: false`, declarar la importación dinámica dentro de un componente de cliente compatible con Next.js.
- Mantener los datos de perfil y proyectos en archivos TypeScript, separados de la presentación.
- Usar HTML para textos, enlaces, botones y navegación; el canvas será decorativo en la primera versión.
- Preferir estado local; no introducir una librería global de estado sin una necesidad concreta.
- Evaluar exportación estática al decidir el hosting. Es compatible con este alcance, pero requiere comprobar imágenes y otras funciones utilizadas. Un formulario con procesamiento propio requeriría revisar esa decisión.

## 4. Contenido y estructura

| Sección | Contenido | Criterio de aceptación |
| --- | --- | --- |
| Inicio / overview | Nombre, rol, frase de enfoque, botones a proyectos y contacto, escena 3D | La presentación y los botones son legibles y utilizables antes de cargar WebGL |
| Proyectos | Captura, descripción, tecnologías, contribución, resultado y enlaces disponibles | Cada proyecto explica el problema resuelto y el trabajo realizado; no hay enlaces ficticios |
| Sobre mí | Trayectoria, intereses, forma de trabajar, habilidades agrupadas y CV | Información clara y verificable; CV accesible si se proporciona |
| Contacto | Correo, GitHub y LinkedIn | Los enlaces disponibles funcionan y tienen etiquetas comprensibles |
| Navegación y footer | Enlaces a secciones y perfiles | Navegación funcional con teclado, sin ocultar destinos bajo un encabezado fijo |

### Material pendiente del usuario

- Nombre público, título profesional y frase de presentación.
- Biografía, trayectoria y habilidades.
- Selección de proyectos: título, contexto, problema, contribución, decisiones, resultado, tecnologías, capturas y enlaces.
- Correo y URLs de perfiles profesionales.
- CV en PDF, si desea incluirlo.
- Preferencias visuales o referencias, si las tiene.

Se puede avanzar con estructura y diseño mientras llega este material. Identificar claramente los textos provisionales; no inventar experiencia, métricas ni resultados. Antes de publicar, reemplazar los placeholders y omitir enlaces o recursos que no existan.

## 5. Dirección visual y WebGL

Punto de partida: diseño limpio, jerarquía tipográfica clara y espacio suficiente para leer los proyectos. Definir colores, tipografía y composición antes de implementar todas las secciones.

La escena propuesta es una forma geométrica o composición de nodos conectados, con movimiento suave y respuesta discreta al cursor. El concepto concreto todavía no está aprobado. Empezar con geometrías simples para limitar la complejidad y evitar depender de modelado externo.

### Requisitos de la escena

- Un único canvas en la portada.
- Contenedor con dimensiones estables para evitar saltos de layout.
- Alternativa visual durante la carga, si WebGL no está disponible o si la escena falla.
- Resolución y efectos ajustados para móvil y dispositivos con menor capacidad.
- Respetar `prefers-reduced-motion`: detener o reducir el movimiento no esencial.
- Pausar la animación cuando la portada quede fuera de pantalla o la pestaña esté oculta.
- Usar renderizado bajo demanda cuando la escena no necesite animación continua.
- Evitar que el canvas intercepte el scroll o los controles HTML.
- Liberar recursos de GPU al desmontar, especialmente aquellos creados manualmente.

## 6. Organización propuesta

```text
src/
  app/
    layout.tsx
    page.tsx
  components/
    layout/
    sections/
    ui/
    three/
      HeroCanvas.tsx
      HeroScene.tsx
      SceneFallback.tsx
  data/
    profile.ts
    projects.ts
  styles/
public/
  images/
  models/
  cv.pdf
```

Crear solo los directorios y recursos necesarios. `cv.pdf` y los modelos se añaden cuando exista material real. Las rutas individuales de proyectos podrán incorporarse posteriormente bajo `app/proyectos/[slug]/`.

## 7. Tareas y dependencias

Estados actualizados al 13 de octubre de 2026. Las sesiones deben actualizar el estado y dejar una nota de entrega al terminar.

| ID | Tarea | Dependencias | Entregable y criterio de aceptación | Estado |
| --- | --- | --- | --- | --- |
| T01 | Definir contenido y enfoque profesional | Material del usuario para cierre | Nombre Andree Levario y proyecto Foodlify confirmados; faltan biografía, correo, perfiles, CV y detalles técnicos | en progreso |
| T02 | Definir diseño y fundamentos visuales | T01 parcial | Diseño basado en Figma e inspiración, Inter local, paleta neutra y verde bosque, claro/oscuro, nube de partículas | completada |
| T03 | Inicializar Next.js y herramientas | Ninguna | App Router, TypeScript, CSS Modules, ESLint, Prettier y un único package-lock.json; build correcto | completada |
| T04 | Definir modelos y archivos de datos | T03, T01 parcial | Profile y Project tipados; enlaces y recursos opcionales, sin datos ficticios | completada |
| T05 | Implementar layout y navegación | T02, T03 | Barra lateral, menú móvil, footer, anclas, foco visible y persistencia del tema | completada |
| T06 | Implementar las cuatro secciones | T04, T05 | Inicio, proyectos, sobre mí y contacto; Foodlify es el único proyecto proporcionado, pendientes visibles | completada |
| T07 | Construir la escena 3D | T02, T03 | 2200 partículas, hover y transiciones entre esfera, gráfica, dona, pirámide y esfera irregular | completada |
| T08 | Integrar WebGL y sus alternativas | T06, T07 | Carga diferida, error boundary, pérdida de contexto, alternativa SVG, movimiento reducido, pausa manual y por visibilidad | completada |
| T09 | Completar metadatos y recursos finales | T01, T06 | Título, descripción, favicon e imagen social listos; faltan dominio y recursos personales reales | en progreso |
| T10 | Revisar calidad y preparar publicación | T08, T09 | Build, tipos, lint y 16 pruebas de navegador; README y opciones de hosting; publicación condicionada a T01/T09 | completada |

### Trabajo que puede realizarse en paralelo

- T01 y T03 pueden comenzar de inmediato.
- T02 puede avanzar con contenido provisional claramente identificado.
- T06 y T07 pueden realizarse en paralelo cuando estén acordados el diseño, los datos y el contenedor de portada.
- T08 reúne las secciones y la escena; debe coordinarse después de ambas entregas.

### Acuerdo de integración para la portada

- La sección HTML controla el título, los botones y el layout.
- `HeroCanvas` controla carga e integración del canvas.
- `HeroScene` contiene geometrías, materiales, luces y animación.
- `SceneFallback` ofrece una alternativa con el mismo espacio reservado.
- Acordar las props y el tamaño del contenedor antes de dividir T06 y T07 entre sesiones.

## 8. Fases y estimación

Estimación orientativa: 8–12 jornadas, con contenido disponible y escena sencilla. La preparación de material y la complejidad visual pueden ampliar el plazo.

| Fase | Tareas | Estimación |
| --- | --- | --- |
| Contenido y enfoque | T01 | 1–2 días |
| Diseño | T02 | 1–2 días |
| Base funcional | T03–T06 | 2–3 días |
| WebGL | T07–T08 | 2–3 días |
| Revisión y publicación | T09–T10 | 2 días |

## 9. Verificación y definición de terminado

- Build de producción, comprobación de tipos y lint correctos.
- Revisar móvil, escritorio y tamaños intermedios: sin desbordamiento horizontal ni texto recortado.
- Revisar teclado, foco visible, jerarquía de encabezados, contraste y textos alternativos.
- Comprobar todos los enlaces, descargas y destinos de navegación.
- Comprobar que texto y contacto siguen disponibles sin WebGL y ante fallo de la escena.
- Probar movimiento reducido y pausa de animación por visibilidad.
- Revisar rendimiento en build de producción, incluyendo una prueba móvil; documentar resultados y corregir problemas relevantes de carga y layout.
- Confirmar ausencia de placeholders, datos ficticios y errores de consola antes de publicar.
- Documentar comandos de instalación, desarrollo, verificación y build en el README.

Priorizar comprobaciones de comportamiento e integración. Añadir tests automatizados cuando protejan comportamiento relevante; no crear pruebas que solo repliquen markup estático.

## 10. Guía para continuar en otras sesiones

1. Leer este documento y las instrucciones del repositorio que existan al comenzar.
2. Revisar el estado real del código y los cambios locales antes de editar; no sobrescribir trabajo ajeno.
3. Seleccionar una tarea cuyas dependencias estén resueltas y marcarla `en progreso`.
4. Registrar decisiones que afecten a otras tareas, especialmente props, datos, estilos globales y dependencias.
5. Verificar el entregable, marcarlo `completada` y añadir una nota con archivos relevantes, comprobaciones y pendientes.
6. Si una tarea no puede cerrarse, marcarla `bloqueada` y describir el requisito concreto que falta.

En sesiones concurrentes, coordinar los archivos compartidos (`package.json`, lockfile, layout, estilos globales y este documento). Reservar su edición a una sesión a la vez para evitar conflictos. Los estados del documento no sustituyen la comprobación del código.

### Notas de entrega

### Entrega del 13 de octubre de 2026

- Implementadas T02–T08 y la revisión técnica de T10. T01 y T09 quedan abiertas por material personal y dominio.
- El usuario confirmó **Andree Levario**, **Ingeniero en Informática** y **Foodlify**, una plataforma de gestión de restaurantes impulsada por IA, con menú y comandas enviadas a cocina en tiempo real.
- Se leyeron las dos pantallas de Figma (portada `1:2` y especialidades `1:91`) y `Inspiracion.png`. Se incorporaron los iconos originales como SVG locales y la ilustración original como alternativa de WebGL. No se modificó el archivo de Figma.
- Decisiones: Inter local; blanco suave `#f8f8f6`, grafito `#202724`, texto `#657067`, verde bosque `#395d47`; navegación fija en escritorio y compacta en móvil. Isla procedural como elemento protagonista; tres tarjetas de especialidades y Foodlify como proyecto destacado.
- Versiones instaladas: Next.js 16.4.0, React/React DOM 19.3.0, React Three Fiber 9.8.1, Three.js 0.180.0. Versiones exactas en `package-lock.json`.
- Archivos: `src/app`, `src/components`, `src/data/profile.ts`, `src/data/projects.ts`, `src/styles/globals.css`, `public/icons`, `public/images`, `tests/portfolio.spec.ts`, `README.md`.
- Verificación: build de producción, TypeScript y lint correctos. Doce pruebas Playwright pasaron en Chromium de escritorio y móvil. Se probaron anchuras 360/700/768/1024/1440, tema persistente, menú y Escape, anclas, detalles del proyecto, recursos locales, contenido sin JavaScript, movimiento reducido, ausencia de WebGL, giro con cambio visual y pérdida de contexto.
- Escena: un canvas; sin animación continua; renderizado bajo demanda y suspensión fuera de pantalla o con pestaña oculta. Respeta scroll táctil y ofrece giro mediante controles HTML. Geometrías liberadas al desmontar.
- Pendientes: correo, GitHub/LinkedIn, CV opcional, biografía y experiencia verificable; tecnologías, contribución, resultados, capturas y enlaces de Foodlify. Su vista de cocina es **conceptual**, identificada como tal. No se añadieron proyectos inventados para alcanzar tres tarjetas.
- Hosting: aplicación preparada para un proveedor compatible con Next.js o Node.js; ninguno elegido ni publicado. Configurar `NEXT_PUBLIC_SITE_URL` antes del build final. No se habilitó exportación estática porque la alternativa usa optimización de imágenes de Next.js.
- Auditoría: cero vulnerabilidades de producción; cinco avisos altos en dependencias de desarrollo de ESLint sin corrección estable disponible, documentados en README. No se aplicó una degradación mayor con `audit fix --force`.
- Medición local de producción: LCP 456 ms / CLS 0.00009 en escritorio; LCP 1936 ms / CLS 0.00534 en móvil emulado con CPU 4×, red 1.6 Mbps y latencia 150 ms. Recursos transferidos: aproximadamente 509 KB incluyendo 3D. Sin errores de JavaScript ni desbordamiento. Es una medición de laboratorio local, no una garantía de rendimiento en hosting real. Evidencia en `test-results/preview/metrics.json` y capturas escritorio/móvil/oscuro.

Formato sugerido para cada entrega:

```text
Tarea:
Estado:
Archivos relevantes:
Decisiones:
Verificación realizada:
Pendientes o bloqueos:
```

## 11. Referencias técnicas

- [Next.js: Server y Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js: exportación estática](https://nextjs.org/docs/app/guides/static-exports)
- [React Three Fiber: introducción y compatibilidad](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [React Three Fiber: rendimiento](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [Drei: introducción](https://drei.docs.pmnd.rs/getting-started/introduction)
- [Three.js: diseño responsive](https://threejs.org/manual/pages/responsive.html)
- [Three.js: limpieza de recursos](https://threejs.org/manual/pages/cleanup.html)

### Actualización: partículas, 13 de octubre de 2026

Solicitud del usuario: sustituir la isla por partículas vivas que relacionen ciencia de datos y modelado 3D, con respuesta al hover, transformación por clic y tiempo, y colores según tema.

- `HeroScene` ahora usa 2200 puntos en un único buffer y shader: fluctuación y giro suaves, repulsión local ante el mouse y transiciones reversibles sin saltos al hacer clic a mitad de una transformación.
- Secuencia de nueve segundos por forma: esfera → gráfica → dona → gráfica → pirámide → gráfica → esfera irregular → gráfica. Un clic abre la gráfica desde cualquier geometría; un segundo clic forma una esfera irregular. Las transiciones duran 1.65 segundos.
- La gráfica renueva sus valores simulados cada tres segundos, desplazando las muestras en varias direcciones. Sus ejes y la etiqueta de datos simulados explican el estado actual sin sugerir que se trata de métricas reales.
- Paleta clara: verdes bosque y salvia. Paleta oscura: grises, blancos y algunos verdes. Cambia al alternar el tema sin remontar el canvas.
- Movimiento continuo solo con la escena visible y pestaña activa. Botón de pausa accesible; en pausa puede transformarse o responder al cursor bajo demanda. El scroll táctil se conserva.
- Movimiento reducido, carga y fallos muestran una esfera estática SVG que responde al tema. Ya no se muestra ni descarga la ilustración antigua de la isla.
- Se mantiene el alcance del resto del frontend. Las notas anteriores describen la entrega inicial y quedan como historial.
- Verificación final: build de producción, TypeScript y lint correctos. Las 16 pruebas de navegador pasaron directamente sobre producción, incluyendo la secuencia completa hasta pirámide y esfera irregular, cambios de valores, clic, hover, pausa manual y fuera de pantalla, paletas, movimiento reducido y fallos de WebGL. Se desactivó la captura de trazas para esta ejecución después de un fallo al escribir archivos temporales de Playwright; las comprobaciones se ejecutaron completas.
- Nueva medición de laboratorio local: aproximadamente 440 KB transferidos, LCP 128 ms en escritorio / 512 ms en móvil emulado con CPU 4× y red limitada; CLS 0.00009 / 0.00533. Sin errores de JavaScript ni desbordamiento. Capturas y mediciones en `test-results/preview`; representaciones de esfera, gráfica e irregular en `/tmp/portfolio-particles`.

### Actualización: mapas 3D y escena sin controles visibles

- La gráfica plana se sustituyó por una superficie ondulante de partículas en perspectiva, con retícula de superficie y base 3D, siguiendo la imagen de referencia. Las alturas se renuevan cada tres segundos y las partículas conservan la transición entre datos y geometrías.
- Las geometrías del tema claro mezclan verdes bosque, esmeralda, salvia y menta. Los mapas de ambos temas añaden amarillo en las zonas altas; las geometrías no usan amarillo. Se conserva el blanco/gris y algunos verdes de las geometrías oscuras.
- Retiradas las leyendas de estado y los botones visibles de gráfica, regreso y pausa, como solicitó el usuario. El canvas conserva la interacción directa mediante mouse, clic, toque o teclado, y la pausa por visibilidad y movimiento reducido.
- Build, TypeScript y lint verificados. Las mediciones anteriores corresponden a versiones previas; no deben interpretarse como una nueva medición del mapa.
- Las 16 pruebas de escritorio y móvil pasaron sobre producción: navegación, recursos, cambios de tema, transformación directa, renovación de alturas, ausencia de las leyendas y controles retirados, pausa fuera de pantalla y alternativas de WebGL.

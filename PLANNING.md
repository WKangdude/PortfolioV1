# Planificación del portafolio

Estado: planificación aprobada; implementación pendiente.

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

Todos los estados comienzan en `pendiente`. Las sesiones deben actualizar el estado y dejar una nota de entrega al terminar.

| ID | Tarea | Dependencias | Entregable y criterio de aceptación | Estado |
| --- | --- | --- | --- | --- |
| T01 | Definir contenido y enfoque profesional | Material del usuario para cierre | Datos reales recopilados, proyectos seleccionados y pendientes identificados | pendiente |
| T02 | Definir diseño y fundamentos visuales | T01 parcial | Tipografía, colores, espaciado y distribución para móvil y escritorio; concepto 3D documentado | pendiente |
| T03 | Inicializar Next.js y herramientas | Ninguna | App Router, TypeScript, estilos, lint, scripts y lockfile; página inicial ejecutable y build correcto | pendiente |
| T04 | Definir modelos y archivos de datos | T03, T01 parcial | Tipos de perfil y proyecto; campos opcionales para enlaces y recursos; placeholders identificados | pendiente |
| T05 | Implementar layout y navegación | T02, T03 | Encabezado, contenedor, footer, anclas y foco visible; navegación móvil y por teclado funcional | pendiente |
| T06 | Implementar las cuatro secciones | T04, T05 | Contenido conectado a datos, tarjetas de proyectos adaptables y enlaces condicionales correctos | pendiente |
| T07 | Construir la escena 3D | T02, T03 | Escena encapsulada, ligera y adaptable; no depende de cambiar el layout global | pendiente |
| T08 | Integrar WebGL y sus alternativas | T06, T07 | Carga diferida, manejo de fallo, movimiento reducido y pausa por visibilidad comprobados | pendiente |
| T09 | Completar metadatos y recursos finales | T01, T06 | Título, descripción, imagen social, iconos y recursos reales; URL canónica al definir dominio | pendiente |
| T10 | Revisar calidad y preparar publicación | T08, T09 | Verificaciones realizadas, problemas corregidos, README con ejecución y build, destino de hosting documentado | pendiente |

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

Todavía no hay tareas de implementación completadas. La siguiente sesión puede iniciar T03 y preparar T04, mientras se recopila el contenido de T01.

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

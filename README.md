# Portafolio de Andree Levario

Frontend en español basado en [el diseño de Figma](https://www.figma.com/design/DattcYBSO5CabotGCuWnt4/Portfolio?node-id=1-2), `Inspiracion.png` y `PLANNING.md`.

## Ejecutar

Requiere Node.js 20.9 o superior y npm. Se recomienda Node.js LTS.

```bash
npm ci
npm run dev
```

Abrir http://localhost:3000.

```bash
npm run typecheck
npm run lint
npm run build
npm start
```

Para las comprobaciones de navegador:

```bash
npx playwright install chromium
npm run test:e2e
node tests/capture.mjs
```

Las capturas se guardan en `test-results/preview`. `PREVIEW_URL` permite revisar un servidor de producción distinto. Las pruebas usan software WebGL en Chromium headless; el sitio usa la GPU disponible del navegador.

## Implementación

- Next.js 16 con App Router, React 19, TypeScript y CSS Modules.
- Página y secciones renderizadas en el servidor; interactividad aislada en la barra lateral y la escena.
- Inter alojada localmente, sin solicitudes a Google Fonts.
- Navegación por anclas con sección activa, menú móvil, foco visible y enlace para saltar al contenido.
- Tema claro/oscuro persistente, aplicado antes de la hidratación.
- Nube de 2200 partículas con Three.js y React Three Fiber, calculada con shaders y cargada por separado. El mouse desplaza los puntos cercanos; un clic alterna entre geometría y gráfica. La escena completa responde al clic, al toque y a Enter o Espacio cuando tiene el foco; no muestra botones adicionales.
- Movimiento continuo mientras la portada está visible, sin postprocesamiento. Pausa automática fuera del viewport o con la pestaña oculta; no hay botón de pausa. La secuencia alterna esfera, gráfica, dona, gráfica, pirámide, gráfica, esfera irregular y gráfica cada nueve segundos, con transiciones de 1.65 segundos. El mapa 3D cambia sus alturas cada tres segundos: superficie de partículas con retícula, perspectiva y verdes a amarillos según elevación.
- Esfera estática de partículas en SVG como alternativa durante la carga, ante pérdida de contexto, ausencia de WebGL y movimiento reducido. La antigua ilustración de Figma permanece en los archivos originales pero ya no se solicita al abrir la página.
- Tema claro: mezcla de verdes bosque, esmeralda, salvia y menta en las geometrías; amarillos únicamente en los mapas 3D. Tema oscuro: grises y blancos, con aproximadamente un 17% de puntos verdes. La paleta responde al cambio de tema sin recargar.
- Foodlify como proyecto real proporcionado por Andree. La interfaz mostrada es una representación conceptual, no una captura del producto.
- Metadatos, favicon y una imagen social generada con `ImageResponse`.

## Contenido

Editar `src/data/profile.ts` para añadir correo, GitHub, LinkedIn y CV. Los enlaces aparecen solo cuando existe el recurso. Si se incorpora un CV, guardarlo en `public` y configurar su ruta.

Editar `src/data/projects.ts` para añadir proyectos, enlaces, contribuciones, tecnologías y resultados verificables. Foodlify incluye únicamente la descripción proporcionada: plataforma para gestionar restaurantes con IA, menú y comandas enviadas a cocina en tiempo real.

Pendientes antes de publicar: correo y perfiles, CV opcional, biografía, habilidades confirmadas, capturas reales y detalles técnicos de Foodlify. Solo se incluye un proyecto porque es el único proporcionado; no se inventaron proyectos para completar un número.

## Diseño

Blanco suave `#f8f8f6`, superficie `#ffffff`, grafito `#202724`, texto secundario `#657067`, verde bosque `#395d47` y verde tenue `#edf2e9`. Tipografía Inter, composición con barra lateral fija y portada en dos columnas; en móvil, encabezado compacto y contenido apilado. La nube de partículas conecta conceptualmente geometría 3D y ciencia de datos, y concentra el detalle visual y las demás secciones conservan una estructura tranquila.

## Publicación y verificación

Preparado para un hosting compatible con Next.js, por ejemplo Vercel o un servidor Node.js. No se ha publicado ni se ha configurado un proveedor. No está habilitada la exportación estática; la nueva escena y su alternativa SVG ya no requieren optimización de imágenes en el servidor.

Configurar `NEXT_PUBLIC_SITE_URL` con el dominio real **antes de ejecutar `npm run build`**. El dominio se usa para resolver las imágenes sociales; no se inventó una URL canónica.

Las pruebas cubren anchuras de 360, 700, 768, 1024 y 1440 píxeles, persistencia del tema, navegación móvil con Escape, detalles de Foodlify, enlaces internos, recursos locales, contenido sin JavaScript, movimiento reducido, ausencia de WebGL, cambios por clic, secuencia automática, actualización de alturas, ausencia de leyendas y botones retirados, pausa fuera del viewport, paletas por tema y pérdida del contexto gráfico. Son 16 pruebas en total entre escritorio y móvil.

`npm audit --omit=dev` no reportó vulnerabilidades de producción. La auditoría completa reporta cinco avisos altos en la cadena de desarrollo `eslint-config-next → fast-glob → micromatch → braces`; la última versión disponible de braces no aporta una corrección. No se aplicó el downgrade mayor propuesto por `npm audit fix --force`.

Versiones exactas y reproducibles en `package-lock.json`.

Medición histórica de laboratorio de la primera versión con isla (antes de sustituirla por partículas): LCP 456 ms y CLS 0.00009 en escritorio; LCP 1936 ms y CLS 0.00534 en Pixel 7 emulado con CPU 4×, red 1.6 Mbps y latencia 150 ms. Aproximadamente 509 KB transferidos incluyendo la escena 3D, sin errores de JavaScript ni desbordamiento. Los resultados dependerán del dispositivo y hosting reales. Reproducir con `PREVIEW_URL=http://127.0.0.1:3001 PERF_MOBILE=1 node tests/capture.mjs` después de iniciar producción en ese puerto.

La versión de partículas registró aproximadamente 440 KB transferidos, LCP 128 ms en escritorio y 512 ms en móvil con las mismas limitaciones; CLS 0.00009 y 0.00533 respectivamente. Es una medición local de laboratorio, no de un dispositivo real ni del hosting final. Las 16 pruebas pasaron sobre producción con `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npm run test:e2e -- --trace off`.

Los mapas 3D se basan visualmente en la referencia de superficie proporcionada por el usuario; usan valores generados, sin leyendas ni métricas que los presenten como mediciones reales. La variación de altura genera el color: verdes en zonas bajas y medias, amarillo en las cumbres, en ambos temas. Se retiraron las leyendas de estado y todos los controles visibles de la escena.

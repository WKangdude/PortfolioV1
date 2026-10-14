import { test, expect } from '@playwright/test';

test('el layout se adapta sin desbordar y todos los recursos locales cargan', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Andree Levario', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Foodlify.' })).toBeAttached();
  for (const width of [360, 700, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await expect
    .poll(async () =>
      page
        .locator('img')
        .evaluateAll((images) =>
          images.every(
            (image) =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  const images = await page
    .locator('img')
    .evaluateAll((images) =>
      images.map((image) => ({ src: image.getAttribute('src') })),
    );
  expect(images.every((image) => image.src?.startsWith('/'))).toBe(true);
  expect(errors).toEqual([]);
});

test('el tema persiste al recargar y la navegación móvil se cierra con Escape', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  if (isMobile)
    await page.getByRole('button', { name: 'Abrir navegación' }).click();
  await page.getByRole('button', { name: 'Activar modo oscuro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir navegación' }).click();
    await page.keyboard.press('Escape');
    await expect(
      page.getByRole('button', { name: 'Abrir navegación' }),
    ).toHaveAttribute('aria-expanded', 'false');
    await page.getByRole('button', { name: 'Abrir navegación' }).click();
  }
  await page.getByRole('button', { name: 'Activar modo claro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('navegar a Foodlify permite expandir la información del proyecto', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explorar proyectos' }).click();
  await expect(page).toHaveURL(/#proyectos$/);
  await page.getByText('Conocer el proyecto', { exact: false }).click();
  await expect(
    page.getByRole('heading', { name: 'Del menú a la cocina' }),
  ).toBeVisible();
  await expect(
    page.getByText('Información por completar', { exact: true }),
  ).toBeVisible();
  const invalid = await page
    .locator('a')
    .evaluateAll(
      (links) =>
        links.filter(
          (link) =>
            !link.getAttribute('href') ||
            link.getAttribute('href') === '#' ||
            link.getAttribute('href')?.includes('figma.com/api/mcp'),
        ).length,
    );
  expect(invalid).toBe(0);
});

test('la portada funciona con movimiento reducido y sin JavaScript', async ({
  browser,
}) => {
  const reduced = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await reduced.newPage();
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(
    page.getByRole('img', { name: /Esfera de partículas/ }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Explorar proyectos' }).click();
  await expect(page).toHaveURL(/#proyectos$/);
  await reduced.close();
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto('/');
  await expect(
    staticPage.getByRole('heading', { name: 'Andree Levario', exact: true }),
  ).toBeVisible();
  await staticPage.getByRole('link', { name: 'Explorar proyectos' }).click();
  await expect(staticPage).toHaveURL(/#proyectos$/);
  await noJs.close();
});

test('la alternativa visual mantiene el contenido cuando WebGL no está disponible', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type === 'webgl2') return null;
      return original.apply(this, [type, ...args] as Parameters<
        typeof original
      >);
    } as typeof original;
  });
  await page.goto('/');
  await expect(
    page.getByRole('img', { name: /Esfera de partículas/ }),
  ).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('link', { name: 'Hablemos' }).click();
  await expect(page).toHaveURL(/#contacto$/);
});

test('las partículas se transforman por clic y conservan la alternativa ante fallo', async ({
  page,
}) => {
  await page.goto('/');
  const scene = page.locator('[data-shape]');
  await expect(scene).toHaveAttribute('data-shape', 'sphere');
  const sphere = await page.locator('canvas').screenshot();
  await page.getByRole('button', { name: 'Transformar en mapa 3D' }).click();
  await expect(scene).toHaveAttribute('data-shape', 'scatter');
  await expect
    .poll(
      async () => !(await page.locator('canvas').screenshot()).equals(sphere),
    )
    .toBe(true);
  await page.getByRole('button', { name: 'Formar esfera irregular' }).click();
  await expect(scene).toHaveAttribute('data-shape', 'organic');
  await page
    .locator('canvas')
    .evaluate((canvas) =>
      canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })),
    );
  await expect(
    page.getByRole('img', { name: /Esfera de partículas/ }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Explorar proyectos' }),
  ).toBeVisible();
});

test('la animación cambia geometrías y actualiza los datos automáticamente', async ({
  page,
}) => {
  test.setTimeout(35000);
  await page.goto('/');
  const scene = page.locator('[data-shape]');
  await expect(scene).toHaveAttribute('data-shape', 'sphere');
  await expect(scene).toHaveAttribute('data-shape', 'scatter', {
    timeout: 16000,
  });
  await expect
    .poll(async () => Number(await scene.getAttribute('data-revision')), {
      timeout: 7000,
    })
    .toBeGreaterThan(0);
  await expect(scene).toHaveAttribute('data-shape', 'torus', {
    timeout: 16000,
  });
});

test('la escena no muestra botones ni leyendas, cambia la paleta y se pausa fuera de pantalla', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  const scene = page.locator('[data-shape]');
  await expect(scene).toHaveAttribute('data-palette', 'light');
  await expect(page.getByText('Geometría viva', { exact: true })).toHaveCount(
    0,
  );
  await expect(page.getByText('Datos simulados', { exact: true })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole('button', { name: 'Pausar animación' }),
  ).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Ver gráfica', exact: true }),
  ).toHaveCount(0);
  if (isMobile)
    await page.getByRole('button', { name: 'Abrir navegación' }).click();
  await page.getByRole('button', { name: 'Activar modo oscuro' }).click();
  await expect(scene).toHaveAttribute('data-palette', 'dark');
  if (isMobile)
    await page.getByRole('button', { name: 'Cerrar navegación' }).click();
  await page
    .getByRole('heading', { name: /Construimos algo/ })
    .scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-animation', 'paused');
  await page
    .getByRole('heading', { name: 'Andree Levario', exact: true })
    .scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-animation', 'running');
});

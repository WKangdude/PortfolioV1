import { chromium, devices } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({
  channel: 'chromium',
  args: ['--enable-unsafe-swiftshader'],
});
await mkdir('test-results/preview', { recursive: true });
const measurements = [];
for (const [name, options] of [
  ['desktop', { viewport: { width: 1440, height: 1000 } }],
  ['mobile', devices['Pixel 7']],
]) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  if (name === 'mobile' && process.env.PERF_MOBILE === '1') {
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
  }
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.portfolioMetrics = { cls: 0, lcp: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput) window.portfolioMetrics.cls += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        window.portfolioMetrics.lcp = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:3000');
  await page
    .getByRole('button', { name: 'Transformar en mapa 3D' })
    .waitFor({ timeout: 30000 });
  await page.screenshot({
    path: `test-results/preview/${name}.png`,
    fullPage: true,
  });
  const metrics = await page.evaluate(() => ({
    ...window.portfolioMetrics,
    overflow: document.documentElement.scrollWidth > innerWidth,
    resources: performance
      .getEntriesByType('resource')
      .reduce((total, entry) => total + entry.transferSize, 0),
    canvas: document.querySelector('canvas')?.getBoundingClientRect().toJSON(),
  }));
  measurements.push({
    name,
    mobileThrottled: name === 'mobile' && process.env.PERF_MOBILE === '1',
    ...metrics,
    errors,
  });
  console.log(name, metrics, { errors });
  if (name === 'desktop') {
    await page.getByRole('button', { name: 'Activar modo oscuro' }).click();
    // Forzar el repintado de la sección fuera del viewport antes de una captura larga.
    await page
      .getByRole('img', { name: /Representación conceptual de Foodlify/ })
      .scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      document.activeElement?.blur();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    await page.screenshot({
      path: 'test-results/preview/dark.png',
      fullPage: true,
    });
  }
  await context.close();
}
await writeFile(
  'test-results/preview/metrics.json',
  JSON.stringify(measurements, null, 2),
);
await browser.close();

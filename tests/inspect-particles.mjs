import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
await mkdir('/tmp/portfolio-particles', { recursive: true });
await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:3000');
await page.getByRole('button', { name: 'Transformar en mapa 3D' }).waitFor();
await page
  .locator('[data-shape]')
  .screenshot({ path: '/tmp/portfolio-particles/sphere-light.png' });
await page.getByRole('button', { name: 'Activar modo oscuro' }).click();
await page
  .locator('[data-shape]')
  .screenshot({ path: '/tmp/portfolio-particles/sphere-dark.png' });
await page.getByRole('button', { name: 'Transformar en mapa 3D' }).click();
await page.mouse.move(300, 300);
await page.waitForTimeout(2000);
await page
  .locator('[data-shape]')
  .screenshot({ path: '/tmp/portfolio-particles/scatter-dark.png' });
await page.getByRole('button', { name: 'Activar modo claro' }).click();
await page
  .locator('[data-shape]')
  .screenshot({ path: '/tmp/portfolio-particles/scatter-light.png' });
await page.getByRole('button', { name: 'Formar esfera irregular' }).click();
await page.mouse.move(300, 300);
await page.waitForTimeout(2000);
await page
  .locator('[data-shape]')
  .screenshot({ path: '/tmp/portfolio-particles/organic-light.png' });
console.log({ errors });
await browser.close();
